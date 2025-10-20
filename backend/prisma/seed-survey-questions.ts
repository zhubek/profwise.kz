import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

const surveyQuestions = [
  // Question 1: Subjects (Multiple Choice)
  {
    id: 'survey-q1-subjects',
    questionText: {
      en: 'Which subjects are easiest for you? (you can select multiple)',
      ru: 'Какие предметы тебе даются легче всего? (можно выбрать несколько)',
      kz: 'Қай пәндер саған оңай беріледі? (бірнешеуін таңдауға болады)',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'Mathematics', ru: 'Математика', kz: 'Математика' },
      "2": { en: 'Physics', ru: 'Физика', kz: 'Физика' },
      "3": { en: 'Chemistry', ru: 'Химия', kz: 'Химия' },
      "4": { en: 'Biology', ru: 'Биология', kz: 'Биология' },
      "5": { en: 'History', ru: 'История', kz: 'Тарих' },
      "6": { en: 'Geography', ru: 'География', kz: 'География' },
      "7": { en: 'Computer Science', ru: 'Информатика', kz: 'Информатика' },
      "8": { en: 'Kazakh Language', ru: 'Казахский язык', kz: 'Қазақ тілі' },
      "9": { en: 'English Language', ru: 'Английский язык', kz: 'Ағылшын тілі' },
      "10": { en: 'Russian Language', ru: 'Русский язык', kz: 'Орыс тілі' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 2: Career decision (Single Choice)
  {
    id: 'survey-q2-career-decision',
    questionText: {
      en: 'Have you already decided what you want to become?',
      ru: 'Уже решил(а), кем хочешь стать?',
      kz: 'Кім болғың келетінін шештің бе?',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'Yes, I know for sure', ru: 'Да, точно знаю', kz: 'Иә, нақты білемін' },
      "2": { en: 'I have several options', ru: 'Есть несколько вариантов', kz: 'Бірнеше нұсқа бар' },
      "3": { en: 'I don\'t know yet', ru: 'Пока не знаю', kz: 'Әзірге білмеймін' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 4: Confidence level (Likert 1-5)
  {
    id: 'survey-q4-confidence',
    questionText: {
      en: 'How confident are you in your choice on a scale from 1 to 5?',
      ru: 'Насколько ты уверен(а) в своём выборе по шкале от 1 до 5?',
      kz: '1-ден 5-ке дейінгі шкала бойынша таңдауыңа қаншалықты сенімдісің?',
    },
    questionType: QuestionType.LIKERT,
    answers: {
      "1": { en: '1 - Not confident at all', ru: '1 - Совсем не уверен(а)', kz: '1 - Мүлдем сенімді емеспін' },
      "2": { en: '2 - Slightly confident', ru: '2 - Немного уверен(а)', kz: '2 - Сәл сенімдімін' },
      "3": { en: '3 - Moderately confident', ru: '3 - Средне уверен(а)', kz: '3 - Орташа сенімдімін' },
      "4": { en: '4 - Quite confident', ru: '4 - Довольно уверен(а)', kz: '4 - Айтарлықтай сенімдімін' },
      "5": { en: '5 - Very confident', ru: '5 - Очень уверен(а)', kz: '5 - Өте сенімдімін' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 5: Career guidance sources (Multiple Choice)
  {
    id: 'survey-q5-guidance-sources',
    questionText: {
      en: 'What helps you determine your profession?',
      ru: 'Что помогает тебе определяться с профессией?',
      kz: 'Мамандықты таңдауға не көмектеседі?',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'Parents', ru: 'Родители', kz: 'Ата-аналар' },
      "2": { en: 'Teachers', ru: 'Учителя', kz: 'Мұғалімдер' },
      "3": { en: 'Internet / social media', ru: 'Интернет / соцсети', kz: 'Интернет / әлеуметтік желілер' },
      "4": { en: 'Tests / career guidance', ru: 'Тесты / профориентация', kz: 'Тесттер / мамандық бағдары' },
      "5": { en: 'Examples from acquaintances', ru: 'Примеры знакомых', kz: 'Таныстардың үлгілері' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 6: Career decision barriers (Multiple Choice)
  {
    id: 'survey-q6-barriers',
    questionText: {
      en: 'What prevents you from making a decision?',
      ru: 'Что мешает тебе определиться?',
      kz: 'Шешім қабылдауға не кедергі келтіреді?',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'Not enough information', ru: 'Мало информации', kz: 'Ақпарат жеткіліксіз' },
      "2": { en: 'Afraid of making a mistake', ru: 'Боюсь ошибиться', kz: 'Қателесуден қорқамын' },
      "3": { en: 'Parents suggest something else', ru: 'Родители предлагают другое', kz: 'Ата-аналар басқасын ұсынады' },
      "4": { en: 'Haven\'t thought about it yet', ru: 'Ещё не думал(а) об этом', kz: 'Бұл туралы әлі ойланған жоқпын' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 7: Plans after 9th grade (Single Choice)
  {
    id: 'survey-q7-after-9th-grade',
    questionText: {
      en: 'After 9th grade I plan to:',
      ru: 'После 9 класса я планирую:',
      kz: '9-сыныптан кейін жоспарым:',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'Stay in school (grades 10-11)', ru: 'Остаться в школе (10–11 класс)', kz: 'Мектепте қалу (10-11 сынып)' },
      "2": { en: 'Enroll in college', ru: 'Поступать в колледж', kz: 'Колледжге түсу' },
      "3": { en: 'Haven\'t decided yet', ru: 'Ещё не решил(а)', kz: 'Әлі шешкен жоқпын' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 8: College directions (Multiple Choice)
  {
    id: 'survey-q8-college-directions',
    questionText: {
      en: 'If you plan to enroll in college — which directions interest you?',
      ru: 'Если планируешь поступать в колледж — какие направления тебе интересны?',
      kz: 'Егер колледжге түсуді жоспарласаң — қай бағыттар қызықтырады?',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'Technical (IT, engineering, electronics)', ru: 'Технические (ИТ, инженерия, электроника)', kz: 'Техникалық (ИТ, инженерия, электроника)' },
      "2": { en: 'Medical / biology', ru: 'Медицинские / биология', kz: 'Медициналық / биология' },
      "3": { en: 'Humanities (psychology, journalism, pedagogy)', ru: 'Гуманитарные (психология, журналистика, педагогика)', kz: 'Гуманитарлық (психология, журналистика, педагогика)' },
      "4": { en: 'Economics / business', ru: 'Экономика / бизнес', kz: 'Экономика / бизнес' },
      "5": { en: 'Art / design / fashion', ru: 'Искусство / дизайн / мода', kz: 'Өнер / дизайн / сән' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 9: Study location (Single Choice)
  {
    id: 'survey-q9-study-location',
    questionText: {
      en: 'Where would you like to continue your education?',
      ru: 'Где ты хотел(а) бы продолжить обучение?',
      kz: 'Білімді қай жерде жалғастырғың келеді?',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'In my city / district', ru: 'В своём городе / районе', kz: 'Өз қаламда / ауданымда' },
      "2": { en: 'In the regional center', ru: 'В областном центре', kz: 'Облыс орталығында' },
      "3": { en: 'In another region of Kazakhstan', ru: 'В другом регионе Казахстана', kz: 'Қазақстанның басқа өңірінде' },
      "4": { en: 'Abroad', ru: 'За границей', kz: 'Шет елде' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 10: Relocation for studies (Single Choice)
  {
    id: 'survey-q10-relocation',
    questionText: {
      en: 'Are you considering relocating for your studies?',
      ru: 'Рассматриваешь ли переезд ради учёбы?',
      kz: 'Оқу үшін көшуді қарастырасың ба?',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'Yes', ru: 'Да', kz: 'Иә' },
      "2": { en: 'Maybe', ru: 'Возможно', kz: 'Мүмкін' },
      "3": { en: 'No', ru: 'Нет', kz: 'Жоқ' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 11: Successful career meaning (Multiple Choice)
  {
    id: 'survey-q11-success-meaning',
    questionText: {
      en: 'What does "successful career" mean to you?',
      ru: 'Что для тебя значит «успешная карьера»?',
      kz: 'Сенің үшін «сәтті мансап» дегеніміз не?',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'High income', ru: 'Высокий доход', kz: 'Жоғары табыс' },
      "2": { en: 'Favorite job', ru: 'Любимая работа', kz: 'Сүйікті жұмыс' },
      "3": { en: 'Recognition and respect', ru: 'Признание и уважение', kz: 'Тану және құрмет' },
      "4": { en: 'Ability to help others', ru: 'Возможность помогать другим', kz: 'Басқаларға көмектесу мүмкіндігі' },
      "5": { en: 'Balance and happiness', ru: 'Баланс и счастье', kz: 'Баланс және бақыт' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 12: How you learn about professions (Multiple Choice)
  {
    id: 'survey-q12-learn-professions',
    questionText: {
      en: 'How do you learn about professions?',
      ru: 'Как ты узнаёшь о профессиях?',
      kz: 'Мамандықтар туралы қалай білесің?',
    },
    questionType: QuestionType.MULTIPLE_CHOICE,
    answers: {
      "1": { en: 'Internet / YouTube', ru: 'Интернет / YouTube', kz: 'Интернет / YouTube' },
      "2": { en: 'Parents', ru: 'Родители', kz: 'Ата-аналар' },
      "3": { en: 'Teachers', ru: 'Учителя', kz: 'Мұғалімдер' },
      "4": { en: 'Social media', ru: 'Соцсети', kz: 'Әлеуметтік желілер' },
      "5": { en: 'Career guidance programs', ru: 'Профориентационные программы', kz: 'Мамандық бағдары бағдарламалары' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 13: Previous career testing (Single Choice)
  {
    id: 'survey-q13-previous-testing',
    questionText: {
      en: 'Have you taken career guidance testing before?',
      ru: 'Проходил(а) ли ты профориентационное тестирование раньше?',
      kz: 'Мамандық бағдары тестілеуінен бұрын өткен бе едің?',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'Yes', ru: 'Да', kz: 'Иә' },
      "2": { en: 'No', ru: 'Нет', kz: 'Жоқ' },
    },
    parameters: {
      type: 'survey',
    },
  },

  // Question 14: Competition participation (Single Choice)
  {
    id: 'survey-q14-competitions',
    questionText: {
      en: 'Have you participated in olympiads, competitions, or projects?',
      ru: 'Приходилось ли тебе участвовать в олимпиадах, конкурсах, проектах?',
      kz: 'Олимпиадаларға, конкурстарға, жобаларға қатысқан боласың ба?',
    },
    questionType: QuestionType.SINGLE_CHOICE,
    answers: {
      "1": { en: 'Yes, regularly', ru: 'Да, регулярно', kz: 'Иә, үнемі' },
      "2": { en: 'Sometimes', ru: 'Иногда', kz: 'Кейде' },
      "3": { en: 'No', ru: 'Нет', kz: 'Жоқ' },
    },
    parameters: {
      type: 'survey',
    },
  },
];

async function main() {
  console.log('Finding Holland quiz...');
  const quiz = await prisma.quiz.findFirst({
    where: { quizType: 'HOLAND' },
  });

  if (!quiz) {
    throw new Error('Holland quiz not found');
  }

  console.log(`Found quiz: ${quiz.id}`);
  console.log('Creating survey questions...\n');

  for (const question of surveyQuestions) {
    console.log(`Creating: ${question.id}`);
    await prisma.question.upsert({
      where: { id: question.id },
      update: {
        questionText: question.questionText,
        questionType: question.questionType,
        answers: question.answers,
        parameters: question.parameters,
      },
      create: {
        id: question.id,
        quizId: quiz.id,
        questionText: question.questionText,
        questionType: question.questionType,
        answers: question.answers,
        parameters: question.parameters,
      },
    });
  }

  console.log('\n✅ Successfully created all survey questions!');
  console.log(`Total questions created: ${surveyQuestions.length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
