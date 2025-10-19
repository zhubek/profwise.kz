import { PrismaClient, GrantType } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

interface UniversityData {
  name: string;
  isEnglishAvailable: boolean;
  minPointsForGrant: number;
  minPointsGeneralGrant: number;
  generalGrantCount: number;
  maxPointsGeneralGrant: number;
  minPointsAUL: number;
  maxPointsAUL: number;
  aulGrantCount: number;
}

interface SpecData {
  spec_name: string;
  universities: string;
}

async function parseExcelData() {
  log('\n📊 Reading Excel file...', colors.cyan);

  const workbook = XLSX.readFile('mock-data/job_general_data.xlsx');
  const worksheet = workbook.Sheets['gendata'];
  const data = XLSX.utils.sheet_to_json(worksheet);

  log(`✓ Found ${data.length} professions in Excel`, colors.green);

  return data;
}

async function getOrCreateTestScoreType() {
  log('\n🔍 Finding or creating UNT test score type...', colors.cyan);

  let testScoreType = await prisma.testScoreType.findFirst({
    where: { name: 'UNT (Unified National Testing)' },
  });

  if (!testScoreType) {
    testScoreType = await prisma.testScoreType.create({
      data: {
        name: 'UNT (Unified National Testing)',
        parameters: {
          subjects: ['Mathematics', 'Reading Literacy', 'History of Kazakhstan'],
          maxScore: 140,
        },
      },
    });
    log(`✓ Created UNT test score type`, colors.green);
  } else {
    log(`✓ UNT test score type already exists`, colors.green);
  }

  return testScoreType;
}

async function processUniversityData(
  universityData: UniversityData,
  specName: { ru: string; en: string; kz: string },
  testScoreTypeId: string,
  year: number = 2025
) {
  try {
    // specName is already parsed
    const parsedSpecName = specName;

    // Find or create university
    let university = await prisma.university.findFirst({
      where: {
        OR: [
          { name: { path: ['en'], equals: universityData.name } },
          { name: { path: ['ru'], equals: universityData.name } },
          { name: { path: ['kk'], equals: universityData.name } },
        ],
      },
    });

    if (!university) {
      university = await prisma.university.create({
        data: {
          name: {
            en: universityData.name,
            ru: universityData.name,
            kk: universityData.name,
          },
          code: `UNI-${universityData.name.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now()}`,
          description: {
            en: `University: ${universityData.name}`,
            ru: `Университет: ${universityData.name}`,
            kk: `Университет: ${universityData.name}`,
          },
        },
      });
      log(`  ✓ Created university: ${universityData.name}`, colors.green);
    }

    // Find or create spec
    let spec = await prisma.spec.findFirst({
      where: {
        OR: [
          { name: { path: ['en'], equals: parsedSpecName.en } },
          { name: { path: ['ru'], equals: parsedSpecName.ru } },
          { name: { path: ['kz'], equals: parsedSpecName.kz } },
        ],
      },
    });

    if (!spec) {
      spec = await prisma.spec.create({
        data: {
          name: parsedSpecName,
          code: `SPEC-${parsedSpecName.en.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now()}`,
          description: parsedSpecName,
          subjects: {
            en: [],
            ru: [],
            kk: [],
          },
          groupName: parsedSpecName,
        },
      });
      log(`  ✓ Created spec: ${parsedSpecName.en}`, colors.green);
    }

    // Find or create SpecUniversity
    let specUniversity = await prisma.specUniversity.findFirst({
      where: {
        specId: spec.id,
        universityId: university.id,
        isEnglish: universityData.isEnglishAvailable,
      },
    });

    if (!specUniversity) {
      specUniversity = await prisma.specUniversity.create({
        data: {
          specId: spec.id,
          universityId: university.id,
          isEnglish: universityData.isEnglishAvailable,
        },
      });
      log(`  ✓ Linked ${(spec.name as any)['en']} to ${(university.name as any)['en']}`, colors.green);
    }

    // Create TestScore for GENERAL grant if data exists
    if (
      universityData.minPointsGeneralGrant > 0 &&
      universityData.maxPointsGeneralGrant > 0
    ) {
      // Check if already exists
      const existing = await prisma.testScore.findFirst({
        where: {
          specUniversityId: specUniversity.id,
          year,
          grantType: GrantType.GENERAL,
          typeId: testScoreTypeId,
        },
      });

      if (!existing) {
        await prisma.testScore.create({
          data: {
            year,
            specUniversityId: specUniversity.id,
            minPoints: universityData.minPointsGeneralGrant,
            maxPoints: universityData.maxPointsGeneralGrant,
            grantCounts: universityData.generalGrantCount,
            grantType: GrantType.GENERAL,
            typeId: testScoreTypeId,
          },
        });
        log(`    ✓ Created GENERAL grant points: ${universityData.minPointsGeneralGrant}-${universityData.maxPointsGeneralGrant}`, colors.blue);
      }
    }

    // Create TestScore for AUL grant if data exists
    if (
      universityData.minPointsAUL > 0 &&
      universityData.maxPointsAUL > 0
    ) {
      // Check if already exists
      const existing = await prisma.testScore.findFirst({
        where: {
          specUniversityId: specUniversity.id,
          year,
          grantType: GrantType.AUL,
          typeId: testScoreTypeId,
        },
      });

      if (!existing) {
        await prisma.testScore.create({
          data: {
            year,
            specUniversityId: specUniversity.id,
            minPoints: universityData.minPointsAUL,
            maxPoints: universityData.maxPointsAUL,
            grantCounts: universityData.aulGrantCount,
            grantType: GrantType.AUL,
            typeId: testScoreTypeId,
          },
        });
        log(`    ✓ Created AUL grant points: ${universityData.minPointsAUL}-${universityData.maxPointsAUL}`, colors.blue);
      }
    }
  } catch (error: any) {
    log(`  ✗ Error processing university data: ${error.message}`, colors.red);
  }
}

async function main() {
  log('🚀 Starting UNT Points Seeding Process...', colors.yellow);

  try {
    const data = await parseExcelData();
    const testScoreType = await getOrCreateTestScoreType();

    log('\n📝 Processing profession data...', colors.cyan);

    let processedCount = 0;
    let skippedCount = 0;

    for (const row of data) {
      const educationData = (row as any)['education_data'];

      if (!educationData) {
        skippedCount++;
        continue;
      }

      try {
        // The education_data contains multiple JSON objects with improperly escaped nested JSON
        // We need to manually extract the values using regex since JSON.parse will fail
        const specObjects = educationData.split(/\n(?=\{\"spec_name\":)/).filter((obj: string) => obj.trim());

        for (const specObj of specObjects) {
          try {
            // Extract spec_name and universities using regex
            const specNameMatch = specObj.match(/"spec_name":\s*"(.+?)"\s*,\s*"universities"/s);
            const universitiesMatch = specObj.match(/"universities":\s*"(.+)"\s*\}\s*$/s);

            if (!specNameMatch || !universitiesMatch) {
              continue;
            }

            const specNameStr = specNameMatch[1];
            const universitiesStr = universitiesMatch[1];

            // Parse spec_name
            let specName: { ru: string; en: string; kz: string };
            try {
              specName = JSON.parse(specNameStr);
            } catch {
              continue;
            }

            // Parse universities string - it contains multiple university objects separated by newlines
            // Split by newline followed by opening brace (start of new JSON object)
            const universityLines = universitiesStr.split(/\n(?=\{)/);

            for (const uniLine of universityLines) {
              if (!uniLine.trim()) continue;

              try {
                const universityData: UniversityData = JSON.parse(uniLine);

                await processUniversityData(
                  universityData,
                  specName,
                  testScoreType.id
                );

                processedCount++;
              } catch (error: any) {
                log(`  ✗ Error parsing university: ${error.message}`, colors.red);
                skippedCount++;
              }
            }
          } catch (error: any) {
            // Skip malformed spec lines
            skippedCount++;
          }
        }
      } catch (error: any) {
        log(`✗ Error processing row: ${error.message}`, colors.red);
        skippedCount++;
      }
    }

    log(`\n✅ Seeding completed!`, colors.green);
    log(`  Processed: ${processedCount} university-spec combinations`, colors.blue);
    log(`  Skipped: ${skippedCount} entries`, colors.yellow);

    // Get summary counts
    const counts = {
      universities: await prisma.university.count(),
      specs: await prisma.spec.count(),
      specUniversities: await prisma.specUniversity.count(),
      testScores: await prisma.testScore.count(),
      generalGrants: await prisma.testScore.count({ where: { grantType: GrantType.GENERAL } }),
      aulGrants: await prisma.testScore.count({ where: { grantType: GrantType.AUL } }),
    };

    log(`\n📊 Database Summary:`, colors.cyan);
    log(`  Universities: ${counts.universities}`, colors.blue);
    log(`  Specializations: ${counts.specs}`, colors.blue);
    log(`  Spec-University links: ${counts.specUniversities}`, colors.blue);
    log(`  Test Scores: ${counts.testScores}`, colors.blue);
    log(`    ├─ General Grants: ${counts.generalGrants}`, colors.green);
    log(`    └─ AUL Grants: ${counts.aulGrants}`, colors.green);

  } catch (error: any) {
    log(`\n❌ Seeding failed: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
