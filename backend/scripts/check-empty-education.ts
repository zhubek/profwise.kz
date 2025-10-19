import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allProfessions = await prisma.profession.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      education: true,
    },
    orderBy: {
      code: 'asc'
    }
  });

  const professionsWithoutEducation = allProfessions.filter(p => p.education === null);

  console.log(`Total professions without education: ${professionsWithoutEducation.length}`);
  console.log('\nProfession codes:');
  professionsWithoutEducation.forEach((p: any, i: number) => {
    console.log(`${i + 1}. ${p.code} - ${JSON.stringify(p.name)}`);
  });

  await prisma.$disconnect();
}

main();
