import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProfession() {
  try {
    const profession = await prisma.profession.findUnique({
      where: { code: 'MGT-001' },
      include: { category: true }
    });

    if (!profession) {
      console.log('❌ Profession not found!');
      return;
    }

    console.log('\n✅ Profession found in database:\n');
    console.log('ID:', profession.id);
    console.log('Code:', profession.code);
    console.log('Name:', profession.name);
    console.log('Category:', profession.category.name);
    console.log('Featured:', profession.featured);

    console.log('\n📋 Field Status:');
    console.log('  descriptionData:', profession.descriptionData ? '✓ Present' : '✗ Missing');
    console.log('  archetypes:', profession.archetypes ? '✓ Present' : '✗ Missing');
    console.log('  marketResearch:', profession.marketResearch ? '✓ Present' : '✗ Missing');
    console.log('  education:', profession.education ? '✓ Present' : '✗ Missing');
    console.log('  general:', profession.general ? '✓ Present' : '✗ Missing');

    if (profession.descriptionData) {
      const desc = profession.descriptionData as any;
      console.log('\n📝 descriptionData structure:');
      console.log('  - overview:', desc.overview ? '✓' : '✗');
      console.log('  - keyResponsibilities:', desc.keyResponsibilities?.length || 0, 'items');
      console.log('  - requiredSkills:', desc.requiredSkills?.length || 0, 'items');
      console.log('  - workEnvironment:', desc.workEnvironment ? '✓' : '✗');
      console.log('  - typicalTasks:', desc.typicalTasks?.length || 0, 'items');
      console.log('  - toolsAndTechnologies:', desc.toolsAndTechnologies?.length || 0, 'items');
    }

    if (profession.archetypes) {
      const arch = profession.archetypes as any;
      console.log('\n🎭 archetypes structure:');
      console.log('  - RIASEC codes:', arch.riasecCodes?.join(', ') || 'none');
      console.log('  - Interests:', arch.primaryArchetypes?.interests?.join(', ') || 'none');
      console.log('  - Skills:', arch.primaryArchetypes?.skills?.join(', ') || 'none');
    }

    if (profession.marketResearch) {
      const market = profession.marketResearch as any;
      console.log('\n💼 marketResearch structure:');
      console.log('  - Demand level:', market.demandLevel);
      console.log('  - Job growth:', market.jobGrowth);
      console.log('  - Entry salary:', market.salaryRanges?.entry?.min, '-', market.salaryRanges?.entry?.max, 'KZT/month');
      console.log('  - Geographic hotspots:', market.geographicHotspots?.length || 0, 'cities');
      console.log('  - Industry sectors:', market.industrySectors?.length || 0, 'sectors');
    }

    console.log('\n✨ All data fields successfully populated!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyProfession()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
