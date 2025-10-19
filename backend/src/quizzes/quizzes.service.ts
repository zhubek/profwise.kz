import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const data: any = { ...createQuizDto };
    if (createQuizDto.startDate) {
      data.startDate = new Date(createQuizDto.startDate);
    }
    return this.prisma.quiz.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: true,
        _count: {
          select: { questions: true, results: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        results: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      const data: any = { ...updateQuizDto };
      if (updateQuizDto.startDate) {
        data.startDate = new Date(updateQuizDto.startDate);
      }
      return await this.prisma.quiz.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }

  async getUserQuizzes(userId: string) {
    // Get all public quizzes (active and inactive)
    const publicQuizzes = await this.prisma.quiz.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: { questions: true, results: true },
        },
      },
    });

    // Get all active licenses for the user
    const userLicenses = await this.prisma.license.findMany({
      where: {
        userId,
        activated: true,
      },
      include: {
        organization: true,
        licenseClass: {
          include: {
            licenseClassQuizzes: {
              include: {
                quiz: {
                  include: {
                    _count: {
                      select: { questions: true, results: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract quizzes from licenses with license information
    const licenseQuizzes: any[] = [];
    userLicenses.forEach((license) => {
      license.licenseClass.licenseClassQuizzes.forEach((lcq) => {
        if (lcq.quiz.isActive) {
          licenseQuizzes.push({
            ...lcq.quiz,
            licenseInfo: {
              licenseCode: license.licenseCode,
              expireDate: license.expireDate,
              organizationName: license.organization.name,
              activationDate: license.activatedAt,
            },
          });
        }
      });
    });

    // Create a map to track quizzes by quizType
    // License quizzes will override public ones if they have the same quizType
    const quizMap = new Map();

    // First add public quizzes
    publicQuizzes.forEach((quiz) => {
      quizMap.set(`${quiz.quizType}`, { ...quiz, source: 'public' });
    });

    // Then override with license quizzes if they have the same quizType
    licenseQuizzes.forEach((quiz) => {
      quizMap.set(`${quiz.quizType}`, { ...quiz, source: 'license' });
    });

    // Convert to array for sorting
    const allQuizzes = Array.from(quizMap.values());

    // Sort quizzes:
    // 1. License-based first (sorted by activationDate DESC - latest first)
    // 2. Then public active quizzes
    // 3. Then inactive quizzes (sorted by startDate ASC)
    allQuizzes.sort((a, b) => {
      // License quizzes come first
      if (a.source === 'license' && b.source !== 'license') return -1;
      if (a.source !== 'license' && b.source === 'license') return 1;

      // Both are license quizzes - sort by activationDate DESC (latest first)
      if (a.source === 'license' && b.source === 'license') {
        const dateA = new Date(a.licenseInfo.activationDate).getTime();
        const dateB = new Date(b.licenseInfo.activationDate).getTime();
        return dateB - dateA; // DESC order
      }

      // Both are public quizzes - active ones first
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      // Both are inactive - sort by startDate ASC
      if (!a.isActive && !b.isActive) {
        // Handle null startDates - put them last
        if (!a.startDate && b.startDate) return 1;
        if (a.startDate && !b.startDate) return -1;
        if (!a.startDate && !b.startDate) return 0;

        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB; // ASC order
      }

      return 0;
    });

    return allQuizzes;
  }

  async getInstructions(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        instructionsContent: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return {
      quizId: quiz.id,
      instructionsContent: quiz.instructionsContent,
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.quiz.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }

  async calculateHolandResult(data: {
    answers: Record<string, {
      answer: Record<string, number>;
      parameters: {
        type: string;
        scale: string;
      };
    }>;
    userId: string;
    quizId: string;
  }) {
    // Step 1: Parse answers and calculate sums for each RIASEC scale
    const scaleSums: Record<string, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };

    const scaleCounts: Record<string, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };

    // Aggregate scores by scale
    Object.values(data.answers).forEach((questionAnswer) => {
      const scale = questionAnswer.parameters.scale;
      const answerValue = Object.values(questionAnswer.answer)[0]; // Get the numeric value

      if (scale && scaleSums.hasOwnProperty(scale)) {
        scaleSums[scale] += answerValue;
        scaleCounts[scale] += 1;
      }
    });

    // Step 2: Calculate percentages for each scale
    const scalePercentages: Record<string, number> = {};
    Object.keys(scaleSums).forEach((scale) => {
      const sum = scaleSums[scale];
      const count = scaleCounts[scale];
      // percentage = (sum / (count * 5)) * 100
      scalePercentages[scale] = count > 0 ? (sum / (count * 5)) * 100 : 0;
    });

    // Step 3: Map RIASEC scales to archetype IDs
    const archetypeMap = {
      R: 'interest-realistic',
      I: 'interest-investigative',
      A: 'interest-artistic',
      S: 'interest-social',
      E: 'interest-enterprising',
      C: 'interest-conventional',
    };

    // Step 4: Calculate sum of squared differences using database query
    // We'll use raw SQL for efficient calculation
    const professionMatches = await this.prisma.$queryRaw<Array<{
      professionId: string;
      professionName: string;
      professionCode: string;
      ssd: number;
    }>>`
      WITH user_scores AS (
        SELECT
          ${archetypeMap.R}::text as archetype_id, ${scalePercentages.R}::numeric as user_score
        UNION ALL SELECT ${archetypeMap.I}::text, ${scalePercentages.I}::numeric
        UNION ALL SELECT ${archetypeMap.A}::text, ${scalePercentages.A}::numeric
        UNION ALL SELECT ${archetypeMap.S}::text, ${scalePercentages.S}::numeric
        UNION ALL SELECT ${archetypeMap.E}::text, ${scalePercentages.E}::numeric
        UNION ALL SELECT ${archetypeMap.C}::text, ${scalePercentages.C}::numeric
      ),
      profession_scores AS (
        SELECT
          pa."professionId",
          pa."archetypeId",
          pa.score
        FROM profession_archetypes pa
        WHERE pa."archetypeId" IN (
          ${archetypeMap.R}::text,
          ${archetypeMap.I}::text,
          ${archetypeMap.A}::text,
          ${archetypeMap.S}::text,
          ${archetypeMap.E}::text,
          ${archetypeMap.C}::text
        )
      ),
      squared_differences AS (
        SELECT
          ps."professionId",
          SUM(POWER(us.user_score - ps.score, 2)) as ssd
        FROM profession_scores ps
        JOIN user_scores us ON ps."archetypeId" = us.archetype_id
        GROUP BY ps."professionId"
      )
      SELECT
        sd."professionId" as "professionId",
        p.name->>'en' as "professionName",
        p.code as "professionCode",
        sd.ssd as ssd
      FROM squared_differences sd
      JOIN professions p ON sd."professionId" = p.id
      ORDER BY sd.ssd ASC
      LIMIT 20
    `;

    // Step 5: Calculate Holland Code (top 3 scales) and determine primary/secondary interests
    const sortedScales = Object.entries(scalePercentages)
      .sort(([, a], [, b]) => b - a)
      .map(([scale]) => scale);

    const hollandCode = sortedScales.slice(0, 3).join('');
    const scaleNameMap = {
      R: 'Realistic',
      I: 'Investigative',
      A: 'Artistic',
      S: 'Social',
      E: 'Enterprising',
      C: 'Conventional',
    };
    const primaryInterest = scaleNameMap[sortedScales[0]];
    const secondaryInterest = scaleNameMap[sortedScales[1]];

    // Step 6: Persist results to database using transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 6.1: Upsert UserArchetype records for all 6 RIASEC scales
      const archetypeTypeId = 'interest';
      for (const [scale, archetypeId] of Object.entries(archetypeMap)) {
        await tx.userArchetype.upsert({
          where: {
            userId_archetypeId: {
              userId: data.userId,
              archetypeId: archetypeId,
            },
          },
          create: {
            userId: data.userId,
            archetypeId: archetypeId,
            score: Math.round(scalePercentages[scale]),
          },
          update: {
            score: Math.round(scalePercentages[scale]),
          },
        });
      }

      // 6.2: Upsert UserProfession records and UserProfessionArchetypeType for top 20 professions
      for (const match of professionMatches) {
        // Create or get UserProfession
        const userProfession = await tx.userProfession.upsert({
          where: {
            userId_professionId: {
              userId: data.userId,
              professionId: match.professionId,
            },
          },
          create: {
            userId: data.userId,
            professionId: match.professionId,
          },
          update: {},
        });

        // Calculate score: (20000 - matchScore) / 200
        const matchScoreValue = Math.round((20000 - match.ssd) / 200);

        // Upsert UserProfessionArchetypeType
        await tx.userProfessionArchetypeType.upsert({
          where: {
            userProfessionId_archetypeTypeId: {
              userProfessionId: userProfession.id,
              archetypeTypeId: archetypeTypeId,
            },
          },
          create: {
            userProfessionId: userProfession.id,
            archetypeTypeId: archetypeTypeId,
            score: matchScoreValue,
          },
          update: {
            score: matchScoreValue,
          },
        });
      }

      // 6.3: Create Result record with structured JSON
      const topProfessionsForResult = professionMatches.map((match, index) => ({
        rank: index + 1,
        professionId: match.professionId,
        professionName: match.professionName,
        professionCode: match.professionCode,
        matchScore: Math.round((20000 - match.ssd) / 200),
      }));

      const resultRecord = await tx.result.create({
        data: {
          userId: data.userId,
          quizId: data.quizId,
          answers: data.answers,
          results: {
            scores: {
              R: Math.round(scalePercentages.R),
              I: Math.round(scalePercentages.I),
              A: Math.round(scalePercentages.A),
              S: Math.round(scalePercentages.S),
              E: Math.round(scalePercentages.E),
              C: Math.round(scalePercentages.C),
            },
            hollandCode: hollandCode,
            primaryInterest: primaryInterest,
            secondaryInterest: secondaryInterest,
            topProfessions: topProfessionsForResult,
            description: `Based on your responses, your primary interest is ${primaryInterest}, followed by ${secondaryInterest}. Your Holland Code is ${hollandCode}.`,
          },
        },
      });

      return resultRecord;
    });

    // Return the results with resultId
    return {
      resultId: result.id,
      userId: data.userId,
      quizId: data.quizId,
      scalePercentages,
      hollandCode,
      primaryInterest,
      secondaryInterest,
      topProfessions: professionMatches.map((match, index) => ({
        rank: index + 1,
        professionId: match.professionId,
        professionName: match.professionName,
        professionCode: match.professionCode,
        matchScore: match.ssd,
      })),
    };
  }
}
