import { PrismaClient } from '@prisma/client';
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

interface ExcelRow {
  jobid: string;
  education_data: string;
  market_data: string;
  riaseccodes: string;
  archetype_data: string;
}

async function parseExcelData(): Promise<Map<string, ExcelRow>> {
  log('\n📊 Reading Excel file...', colors.cyan);

  const workbook = XLSX.readFile('mock-data/job_general_data.xlsx');
  const worksheet = workbook.Sheets['gendata'];
  const data = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

  log(`✓ Found ${data.length} professions in Excel`, colors.green);

  // Create a map of jobid -> row data for quick lookup
  const dataMap = new Map<string, ExcelRow>();
  data.forEach(row => {
    if (row.jobid) {
      dataMap.set(row.jobid.trim(), row);
    }
  });

  return dataMap;
}

function parseJSONField(fieldData: string): any {
  if (!fieldData || fieldData.trim() === '') {
    return null;
  }

  try {
    return JSON.parse(fieldData);
  } catch (error) {
    // Try to clean up common JSON issues
    try {
      // Remove BOM, trim, fix common escape issues
      const cleaned = fieldData.trim().replace(/^\uFEFF/, '');
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

async function main() {
  log('🚀 Starting Profession JSON Population...', colors.yellow);

  try {
    const excelData = await parseExcelData();

    // Get professions that don't have complete data yet
    log('\n🔍 Finding professions without complete data...', colors.cyan);

    const professions = await prisma.profession.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        education: true,
        marketResearch: true,
        archetypes: true,
        descriptionData: true,
      },
      take: 100, // Get more than needed in case some don't match
    });

    log(`✓ Found ${professions.length} professions without complete data`, colors.green);

    let updated = 0;
    let skipped = 0;
    const limit = 50;

    for (const profession of professions) {
      if (updated >= limit) {
        break;
      }

      const excelRow = excelData.get(profession.id);

      if (!excelRow) {
        log(`  ⊘ Skipping ${profession.code} (${profession.id}) - not found in Excel`, colors.yellow);
        skipped++;
        continue;
      }

      // Parse JSON fields
      const education = parseJSONField(excelRow.education_data);
      const marketResearch = parseJSONField(excelRow.market_data);
      const archetypeData = parseJSONField(excelRow.archetype_data);

      // Build update data - only update fields that are currently null
      const updateData: any = {};

      if (!profession.education && education) {
        updateData.education = education;
      }

      if (!profession.marketResearch && marketResearch) {
        updateData.marketResearch = marketResearch;
      }

      if (!profession.archetypes && archetypeData) {
        updateData.archetypes = archetypeData;
      }

      // Generate descriptionData if not exists
      if (!profession.descriptionData && archetypeData) {
        updateData.descriptionData = {
          overview: profession.name,
          keyResponsibilities: archetypeData.primaryArchetypes?.skills?.slice(0, 5) || [],
          requiredSkills: archetypeData.primaryArchetypes?.skills || [],
          workEnvironment: education?.minimumEducation
            ? `Requires ${education.minimumEducation} degree or equivalent`
            : 'Professional work environment',
          typicalTasks: [],
          toolsAndTechnologies: [],
        };
      }

      // Generate general field if not exists
      if (!updateData.general) {
        updateData.general = {
          overview: profession.name,
          careerPath: {
            en: 'Entry-level → Junior specialist → Specialist → Senior specialist → Expert',
            ru: 'Начальный уровень → Младший специалист → Специалист → Старший специалист → Эксперт',
            kk: 'Бастапқы деңгей → Кіші маман → Маман → Аға маман → Сарапшы',
          },
          alternativeTitles: [profession.name],
        };
      }

      if (Object.keys(updateData).length === 0) {
        log(`  ⊘ Skipping ${profession.code} - all fields already populated`, colors.yellow);
        skipped++;
        continue;
      }

      try {
        await prisma.profession.update({
          where: { id: profession.id },
          data: updateData,
        });

        const updatedFields = Object.keys(updateData).join(', ');
        log(`  ✓ Updated ${profession.code}: ${updatedFields}`, colors.green);
        updated++;
      } catch (error: any) {
        log(`  ✗ Error updating ${profession.code}: ${error.message}`, colors.red);
        skipped++;
      }
    }

    log(`\n✅ Population completed!`, colors.green);
    log(`  Updated: ${updated} professions`, colors.blue);
    log(`  Skipped: ${skipped} professions`, colors.yellow);

    // Show summary stats
    const allProfessions = await prisma.profession.findMany({
      select: {
        education: true,
        marketResearch: true,
        archetypes: true,
        descriptionData: true,
      },
    });

    const stats = {
      withEducation: allProfessions.filter(p => p.education !== null).length,
      withMarketResearch: allProfessions.filter(p => p.marketResearch !== null).length,
      withArchetypes: allProfessions.filter(p => p.archetypes !== null).length,
      withDescriptionData: allProfessions.filter(p => p.descriptionData !== null).length,
      total: allProfessions.length,
    };

    log(`\n📊 Database Summary:`, colors.cyan);
    log(`  Total professions: ${stats.total}`, colors.blue);
    log(`  With education: ${stats.withEducation}`, colors.blue);
    log(`  With marketResearch: ${stats.withMarketResearch}`, colors.blue);
    log(`  With archetypes: ${stats.withArchetypes}`, colors.blue);
    log(`  With descriptionData: ${stats.withDescriptionData}`, colors.blue);

  } catch (error: any) {
    log(`\n❌ Population failed: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
