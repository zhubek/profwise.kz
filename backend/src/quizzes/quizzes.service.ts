import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CacheInvalidationService } from '../redis/cache-invalidation.service';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const data: any = { ...createQuizDto };
    if (createQuizDto.startDate) {
      data.startDate = new Date(createQuizDto.startDate);
    }
    const quiz = await this.prisma.quiz.create({
      data,
    });
    // Invalidate all quiz caches
    await this.cacheInvalidation.invalidateQuizzes();
    return quiz;
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
        _count: {
          select: {
            questions: true,
          },
        },
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
      const quiz = await this.prisma.quiz.update({
        where: { id },
        data,
      });
      // Invalidate this quiz and all quiz lists
      await this.cacheInvalidation.invalidateQuizzes(id);
      return quiz;
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }

  async getUserQuizzes(userId: string) {
    // Optimized approach: Use raw SQL with UNION to get both public and license quizzes efficiently
    const quizzes = await this.prisma.$queryRawUnsafe<Array<{
      id: string;
      quizName: any;
      quizType: string;
      isFree: boolean;
      description: any;
      parameters: any;
      instructionsContent: any;
      isActive: boolean;
      startDate: Date | null;
      isPublic: boolean;
      createdAt: Date;
      updatedAt: Date;
      questionCount: number;
      resultCount: number;
      source: string;
      licenseCode: string | null;
      expireDate: Date | null;
      organizationName: string | null;
      activationDate: Date | null;
      sortPriority: number;
      sortDate: Date | null;
    }>>(`
      WITH user_license_quizzes AS (
        SELECT DISTINCT ON (q."quizType")
          q.*,
          'license' as source,
          l."licenseCode",
          l."expireDate",
          org.name as "organizationName",
          l."activatedAt" as "activationDate",
          1 as "sortPriority",
          l."activatedAt" as "sortDate"
        FROM quizzes q
        INNER JOIN license_class_quizzes lcq ON q.id = lcq."quizId"
        INNER JOIN license_classes lc ON lcq."licenseClassId" = lc.id
        INNER JOIN licenses l ON lc.id = l."licenseClassId"
        INNER JOIN organizations org ON l."organizationId" = org.id
        WHERE l."userId"::uuid = $1::uuid
          AND l.activated = true
          AND q."isActive" = true
        ORDER BY q."quizType", l."activatedAt" DESC
      ),
      public_quizzes AS (
        SELECT
          q.*,
          'public' as source,
          NULL::text as "licenseCode",
          NULL::timestamp as "expireDate",
          NULL::text as "organizationName",
          NULL::timestamp as "activationDate",
          CASE
            WHEN q."isActive" = true THEN 2
            ELSE 3
          END as "sortPriority",
          q."startDate" as "sortDate"
        FROM quizzes q
        WHERE q."isPublic" = true
          AND q."quizType" NOT IN (
            SELECT "quizType" FROM user_license_quizzes
          )
      ),
      combined_quizzes AS (
        SELECT * FROM user_license_quizzes
        UNION ALL
        SELECT * FROM public_quizzes
      )
      SELECT
        cq.*,
        (SELECT COUNT(*) FROM questions WHERE "quizId" = cq.id)::int as "questionCount",
        (SELECT COUNT(*) FROM results WHERE "quizId" = cq.id)::int as "resultCount"
      FROM combined_quizzes cq
      ORDER BY
        cq."sortPriority" ASC,
        cq."sortDate" DESC NULLS LAST,
        cq."createdAt" DESC
    `, userId);

    // Transform the results to match the expected format
    return quizzes.map((quiz) => ({
      id: quiz.id,
      quizName: quiz.quizName,
      quizType: quiz.quizType,
      isFree: quiz.isFree,
      description: quiz.description,
      parameters: quiz.parameters,
      instructionsContent: quiz.instructionsContent,
      isActive: quiz.isActive,
      startDate: quiz.startDate,
      isPublic: quiz.isPublic,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      source: quiz.source,
      _count: {
        questions: quiz.questionCount,
        results: quiz.resultCount,
      },
      ...(quiz.source === 'license' && {
        licenseInfo: {
          licenseCode: quiz.licenseCode,
          expireDate: quiz.expireDate,
          organizationName: quiz.organizationName,
          activationDate: quiz.activationDate,
        },
      }),
    }));
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
      // Invalidate this quiz and all quiz lists
      await this.cacheInvalidation.invalidateQuizzes(id);
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
      professionDescription: string;
      professionCode: string;
      professionIcon: string | null;
      professionCategory: string;
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
        p.name::text as "professionName",
        p.description::text as "professionDescription",
        p.code as "professionCode",
        null as "professionIcon",
        COALESCE(c.name->>'en', 'General') as "professionCategory",
        sd.ssd as ssd
      FROM squared_differences sd
      JOIN professions p ON sd."professionId" = p.id
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY sd.ssd ASC
      LIMIT 20
    `;

    // Parse JSON strings into objects
    const parsedProfessionMatches = professionMatches.map(match => ({
      ...match,
      professionName: JSON.parse(match.professionName),
      professionDescription: JSON.parse(match.professionDescription),
    }));

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

    // Step 6: Persist results to database using transaction with batch operations
    const result = await this.prisma.$transaction(async (tx) => {
      const archetypeTypeId = 'interest';

      // 6.1: Batch upsert UserArchetype records using raw SQL for better performance
      const archetypeValues = Object.entries(archetypeMap).map(([scale, archetypeId]) => ({
        userId: data.userId,
        archetypeId,
        score: Math.round(scalePercentages[scale]),
      }));

      await tx.$executeRaw`
        INSERT INTO user_archetypes ("id", "userId", "archetypeId", "score", "createdAt")
        SELECT gen_random_uuid(), "userId"::uuid, "archetypeId"::text, "score"::int, NOW()
        FROM json_to_recordset(${JSON.stringify(archetypeValues)}::json)
        AS t("userId" text, "archetypeId" text, "score" int)
        ON CONFLICT ("userId", "archetypeId")
        DO UPDATE SET "score" = EXCLUDED."score"
      `;

      // 6.2: Batch upsert UserProfession and UserProfessionArchetypeType
      const professionValues = parsedProfessionMatches.map((match) => ({
        userId: data.userId,
        professionId: match.professionId,
        score: Math.round((20000 - match.ssd) / 200),
      }));

      // First, upsert user professions and get their IDs
      await tx.$executeRaw`
        INSERT INTO user_professions ("id", "userId", "professionId", "createdAt")
        SELECT gen_random_uuid(), "userId"::uuid, "professionId"::uuid, NOW()
        FROM json_to_recordset(${JSON.stringify(professionValues)}::json)
        AS t("userId" text, "professionId" text, "score" int)
        ON CONFLICT ("userId", "professionId") DO NOTHING
      `;

      // Then, upsert archetype types with scores
      await tx.$executeRaw`
        INSERT INTO user_profession_archetype_types ("id", "userProfessionId", "archetypeTypeId", "score", "createdAt")
        SELECT
          gen_random_uuid(),
          up.id,
          ${archetypeTypeId}::text,
          t."score"::int,
          NOW()
        FROM json_to_recordset(${JSON.stringify(professionValues)}::json)
        AS t("userId" text, "professionId" text, "score" int)
        INNER JOIN user_professions up
          ON up."userId"::text = t."userId"
          AND up."professionId"::text = t."professionId"
        ON CONFLICT ("userProfessionId", "archetypeTypeId")
        DO UPDATE SET "score" = EXCLUDED."score"
      `;

      // 6.3: Batch upsert user questions
      const questionValues = Object.entries(data.answers).map(([questionId, answerData]) => ({
        userId: data.userId,
        questionId,
        answers: JSON.stringify(answerData.answer),
      }));

      await tx.$executeRaw`
        INSERT INTO user_questions ("id", "userId", "questionId", "answers", "createdAt")
        SELECT gen_random_uuid(), "userId"::uuid, "questionId"::text, "answers"::jsonb, NOW()
        FROM json_to_recordset(${JSON.stringify(questionValues)}::json)
        AS t("userId" text, "questionId" text, "answers" text)
        ON CONFLICT ("userId", "questionId")
        DO UPDATE SET "answers" = EXCLUDED."answers"
      `;

      // 6.4: Create Result record with structured JSON
      const topProfessionsForResult = parsedProfessionMatches.map((match, index) => ({
        rank: index + 1,
        professionId: match.professionId,
        professionName: match.professionName,
        professionDescription: match.professionDescription,
        professionCode: match.professionCode,
        icon: match.professionIcon,
        category: match.professionCategory,
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

    // TEMPORARILY DISABLED: Cache invalidation after quiz completion
    // TODO: Re-enable after testing is complete
    // await this.cacheInvalidation.invalidateUserCaches(data.userId);

    // Return the results with resultId
    return {
      resultId: result.id,
      userId: data.userId,
      quizId: data.quizId,
      scalePercentages,
      hollandCode,
      primaryInterest,
      secondaryInterest,
      topProfessions: parsedProfessionMatches.map((match, index) => ({
        rank: index + 1,
        professionId: match.professionId,
        professionName: match.professionName, // Full JSON object with en, ru, kz
        professionDescription: match.professionDescription, // Full JSON object with en, ru, kz
        professionCode: match.professionCode,
        icon: match.professionIcon,
        category: match.professionCategory,
        matchScore: match.ssd,
      })),
    };
  }
}
