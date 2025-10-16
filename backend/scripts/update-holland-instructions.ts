import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Holland quiz ID in database
const HOLLAND_QUIZ_ID = 'holand-1';

// Load translation files from frontend
const loadTranslations = () => {
  const frontendPath = path.join(__dirname, '../../frontend/messages');

  const en = JSON.parse(fs.readFileSync(path.join(frontendPath, 'en.json'), 'utf8'));
  const ru = JSON.parse(fs.readFileSync(path.join(frontendPath, 'ru.json'), 'utf8'));
  const kz = JSON.parse(fs.readFileSync(path.join(frontendPath, 'kk.json'), 'utf8'));

  return { en, ru, kz };
};

// Build instructionsContent structure
const buildInstructionsContent = () => {
  const translations = loadTranslations();

  return {
    blocks: [
      // Block 1: Overview
      {
        type: 'overview',
        id: 'overview',
        title: {
          en: translations.en.tests.aboutThisTest,
          ru: translations.ru.tests.aboutThisTest,
          kz: translations.kz.tests.aboutThisTest,
        },
        description: {
          en: translations.en.tests.holland.overview,
          ru: translations.ru.tests.holland.overview,
          kz: translations.kz.tests.holland.overview,
        },
      },

      // Block 2: RIASEC Grid
      {
        type: 'riasec_grid',
        id: 'riasec_grid',
        title: {
          en: translations.en.tests.holland.whatItMeasures.title,
          ru: translations.ru.tests.holland.whatItMeasures.title,
          kz: translations.kz.tests.holland.whatItMeasures.title,
        },
        description: {
          en: translations.en.tests.holland.whatItMeasures.description,
          ru: translations.ru.tests.holland.whatItMeasures.description,
          kz: translations.kz.tests.holland.whatItMeasures.description,
        },
        items: [
          {
            code: 'R',
            title: {
              en: translations.en.tests.holland.whatItMeasures.realistic.split(':')[0].replace('Realistic (R)', 'Realistic'),
              ru: translations.ru.tests.holland.whatItMeasures.realistic.split(':')[0].replace(/.*\(R\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.realistic.split(':')[0].replace(/.*\(R\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.realistic.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.realistic.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.realistic.split(': ')[1],
            },
            color: 'blue',
          },
          {
            code: 'I',
            title: {
              en: translations.en.tests.holland.whatItMeasures.investigative.split(':')[0].replace('Investigative (I)', 'Investigative'),
              ru: translations.ru.tests.holland.whatItMeasures.investigative.split(':')[0].replace(/.*\(I\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.investigative.split(':')[0].replace(/.*\(I\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.investigative.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.investigative.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.investigative.split(': ')[1],
            },
            color: 'purple',
          },
          {
            code: 'A',
            title: {
              en: translations.en.tests.holland.whatItMeasures.artistic.split(':')[0].replace('Artistic (A)', 'Artistic'),
              ru: translations.ru.tests.holland.whatItMeasures.artistic.split(':')[0].replace(/.*\(A\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.artistic.split(':')[0].replace(/.*\(A\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.artistic.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.artistic.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.artistic.split(': ')[1],
            },
            color: 'pink',
          },
          {
            code: 'S',
            title: {
              en: translations.en.tests.holland.whatItMeasures.social.split(':')[0].replace('Social (S)', 'Social'),
              ru: translations.ru.tests.holland.whatItMeasures.social.split(':')[0].replace(/.*\(S\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.social.split(':')[0].replace(/.*\(S\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.social.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.social.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.social.split(': ')[1],
            },
            color: 'green',
          },
          {
            code: 'E',
            title: {
              en: translations.en.tests.holland.whatItMeasures.enterprising.split(':')[0].replace('Enterprising (E)', 'Enterprising'),
              ru: translations.ru.tests.holland.whatItMeasures.enterprising.split(':')[0].replace(/.*\(E\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.enterprising.split(':')[0].replace(/.*\(E\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.enterprising.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.enterprising.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.enterprising.split(': ')[1],
            },
            color: 'orange',
          },
          {
            code: 'C',
            title: {
              en: translations.en.tests.holland.whatItMeasures.conventional.split(':')[0].replace('Conventional (C)', 'Conventional'),
              ru: translations.ru.tests.holland.whatItMeasures.conventional.split(':')[0].replace(/.*\(C\)\s*-?\s*/, ''),
              kz: translations.kz.tests.holland.whatItMeasures.conventional.split(':')[0].replace(/.*\(C\)\s*-?\s*/, ''),
            },
            description: {
              en: translations.en.tests.holland.whatItMeasures.conventional.split(': ')[1],
              ru: translations.ru.tests.holland.whatItMeasures.conventional.split(': ')[1],
              kz: translations.kz.tests.holland.whatItMeasures.conventional.split(': ')[1],
            },
            color: 'gray',
          },
        ],
      },

      // Block 3: Numbered Steps
      {
        type: 'numbered_steps',
        id: 'how_it_works',
        title: {
          en: translations.en.tests.holland.howItWorks.title,
          ru: translations.ru.tests.holland.howItWorks.title,
          kz: translations.kz.tests.holland.howItWorks.title,
        },
        steps: [
          {
            number: 1,
            title: { en: '', ru: '', kz: '' },
            description: {
              en: translations.en.tests.holland.howItWorks.step1,
              ru: translations.ru.tests.holland.howItWorks.step1,
              kz: translations.kz.tests.holland.howItWorks.step1,
            },
          },
          {
            number: 2,
            title: { en: '', ru: '', kz: '' },
            description: {
              en: translations.en.tests.holland.howItWorks.step2,
              ru: translations.ru.tests.holland.howItWorks.step2,
              kz: translations.kz.tests.holland.howItWorks.step2,
            },
          },
          {
            number: 3,
            title: { en: '', ru: '', kz: '' },
            description: {
              en: translations.en.tests.holland.howItWorks.step3,
              ru: translations.ru.tests.holland.howItWorks.step3,
              kz: translations.kz.tests.holland.howItWorks.step3,
            },
          },
          {
            number: 4,
            title: { en: '', ru: '', kz: '' },
            description: {
              en: translations.en.tests.holland.howItWorks.step4,
              ru: translations.ru.tests.holland.howItWorks.step4,
              kz: translations.kz.tests.holland.howItWorks.step4,
            },
          },
        ],
      },

      // Block 4: Instructions (Bullet List)
      {
        type: 'bullet_list',
        id: 'instructions',
        title: {
          en: translations.en.tests.holland.instructions.title,
          ru: translations.ru.tests.holland.instructions.title,
          kz: translations.kz.tests.holland.instructions.title,
        },
        description: {
          en: translations.en.tests.holland.instructions.intro,
          ru: translations.ru.tests.holland.instructions.intro,
          kz: translations.kz.tests.holland.instructions.intro,
        },
        items: [
          {
            en: translations.en.tests.holland.instructions.point1,
            ru: translations.ru.tests.holland.instructions.point1,
            kz: translations.kz.tests.holland.instructions.point1,
          },
          {
            en: translations.en.tests.holland.instructions.point2,
            ru: translations.ru.tests.holland.instructions.point2,
            kz: translations.kz.tests.holland.instructions.point2,
          },
          {
            en: translations.en.tests.holland.instructions.point3,
            ru: translations.ru.tests.holland.instructions.point3,
            kz: translations.kz.tests.holland.instructions.point3,
          },
          {
            en: translations.en.tests.holland.instructions.point4,
            ru: translations.ru.tests.holland.instructions.point4,
            kz: translations.kz.tests.holland.instructions.point4,
          },
          {
            en: translations.en.tests.holland.instructions.point5,
            ru: translations.ru.tests.holland.instructions.point5,
            kz: translations.kz.tests.holland.instructions.point5,
          },
        ],
      },

      // Block 5: What You'll Learn (Bullet List)
      {
        type: 'bullet_list',
        id: 'results_info',
        title: {
          en: translations.en.tests.holland.resultsInfo.title,
          ru: translations.ru.tests.holland.resultsInfo.title,
          kz: translations.kz.tests.holland.resultsInfo.title,
        },
        items: [
          {
            en: translations.en.tests.holland.resultsInfo.point1,
            ru: translations.ru.tests.holland.resultsInfo.point1,
            kz: translations.kz.tests.holland.resultsInfo.point1,
          },
          {
            en: translations.en.tests.holland.resultsInfo.point2,
            ru: translations.ru.tests.holland.resultsInfo.point2,
            kz: translations.kz.tests.holland.resultsInfo.point2,
          },
          {
            en: translations.en.tests.holland.resultsInfo.point3,
            ru: translations.ru.tests.holland.resultsInfo.point3,
            kz: translations.kz.tests.holland.resultsInfo.point3,
          },
          {
            en: translations.en.tests.holland.resultsInfo.point4,
            ru: translations.ru.tests.holland.resultsInfo.point4,
            kz: translations.kz.tests.holland.resultsInfo.point4,
          },
          {
            en: translations.en.tests.holland.resultsInfo.point5,
            ru: translations.ru.tests.holland.resultsInfo.point5,
            kz: translations.kz.tests.holland.resultsInfo.point5,
          },
        ],
      },
    ],
  };
};

async function main() {
  console.log('Loading translations...');
  const instructionsContent = buildInstructionsContent();

  console.log('Updating Holland quiz with instructionsContent...');

  const updatedQuiz = await prisma.quiz.update({
    where: { id: HOLLAND_QUIZ_ID },
    data: {
      instructionsContent: instructionsContent as any,
    },
  });

  console.log('Holland quiz updated successfully!');
  console.log('Quiz ID:', updatedQuiz.id);
  console.log('Quiz Name:', updatedQuiz.quizName);
  console.log('Instructions blocks:', instructionsContent.blocks.length);
}

main()
  .catch((e) => {
    console.error('Error updating Holland quiz:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
