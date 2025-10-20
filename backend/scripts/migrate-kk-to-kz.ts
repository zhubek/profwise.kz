import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateKkToKz() {
  console.log('Starting migration from kk to kz...');

  try {
    // Update ArchetypeTypes
    const archetypeTypes = await prisma.archetypeType.findMany();
    console.log(`Found ${archetypeTypes.length} archetype types to update`);

    for (const type of archetypeTypes) {
      const name = type.name as any;
      const description = type.description as any;

      if (name && name.kk) {
        const updatedName = {
          en: name.en,
          ru: name.ru,
          kz: name.kk
        };

        const updatedDescription = description ? {
          en: description.en,
          ru: description.ru,
          kz: description.kk || description.kz
        } : description;

        await prisma.archetypeType.update({
          where: { id: type.id },
          data: {
            name: updatedName as any,
            description: updatedDescription as any
          }
        });

        console.log(`Updated archetype type: ${type.id}`);
      }
    }

    // Update Archetypes
    const archetypes = await prisma.archetype.findMany();
    console.log(`Found ${archetypes.length} archetypes to update`);

    for (const archetype of archetypes) {
      const name = archetype.name as any;
      const description = archetype.description as any;

      if (name && name.kk) {
        const updatedName = {
          en: name.en,
          ru: name.ru,
          kz: name.kk
        };

        const updatedDescription = description ? {
          en: description.en,
          ru: description.ru,
          kz: description.kk || description.kz
        } : description;

        await prisma.archetype.update({
          where: { id: archetype.id },
          data: {
            name: updatedName as any,
            description: updatedDescription as any
          }
        });

        console.log(`Updated archetype: ${archetype.id}`);
      }
    }

    // Update Professions
    const professions = await prisma.profession.findMany();
    console.log(`Found ${professions.length} professions to update`);

    for (const profession of professions) {
      const name = profession.name as any;
      const description = profession.description as any;

      if (name && name.kk) {
        const updatedName = {
          en: name.en,
          ru: name.ru,
          kz: name.kk
        };

        const updatedDescription = description ? {
          en: description.en,
          ru: description.ru,
          kz: description.kk || description.kz
        } : description;

        await prisma.profession.update({
          where: { id: profession.id },
          data: {
            name: updatedName as any,
            description: updatedDescription as any
          }
        });

        console.log(`Updated profession: ${profession.code}`);
      }
    }

    // Update Categories
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories to update`);

    for (const category of categories) {
      const name = category.name as any;
      const description = category.description as any;

      if (name && name.kk) {
        const updatedName = {
          en: name.en,
          ru: name.ru,
          kz: name.kk
        };

        const updatedDescription = description ? {
          en: description.en,
          ru: description.ru,
          kz: description.kk || description.kz
        } : description;

        await prisma.category.update({
          where: { id: category.id },
          data: {
            name: updatedName as any,
            description: updatedDescription as any
          }
        });

        console.log(`Updated category: ${category.id}`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateKkToKz()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
