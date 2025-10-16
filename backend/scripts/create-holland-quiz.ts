import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const quiz = await prisma.quiz.create({
    data: {
      id: 'holand-1',
      quizType: 'HOLAND',
      isFree: true,
      quizName: {
        en: 'Holland Career Interest Test (RIASEC)',
        kz: 'Голланд кәсіби қызығушылық тесті (RIASEC)',
        ru: 'Тест профессиональных интересов Голланда (RIASEC)',
      },
      description: {
        en: 'Discover your career personality type based on Holland\'s RIASEC model: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional',
        kz: 'Голланд RIASEC моделі негізінде кәсіби тұлғалық түріңізді анықтаңыз: Шынайы, Зерттеушілік, Шығармашылық, Әлеуметтік, Кәсіпкерлік және Дәстүрлі',
        ru: 'Определите свой профессиональный тип личности на основе модели RIASEC Голланда: Реалистичный, Исследовательский, Артистичный, Социальный, Предпринимательский и Конвенциональный',
      },
    },
  });

  console.log('Quiz created successfully:', quiz);
}

main()
  .catch((e) => {
    console.error('Error creating quiz:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
