import type { QuizInstructionsContent } from '@/types/quiz-content';

/**
 * Generic quiz instructions that can be used as fallback
 * for quizzes that don't have custom instructions
 */
export const GENERIC_QUIZ_INSTRUCTIONS: QuizInstructionsContent = {
  blocks: [
    {
      id: 'about-this-test',
      type: 'rich_text',
      title: {
        en: 'About This Test',
        ru: 'Об этом тесте',
        kz: 'Бұл тест туралы',
      },
      content: {
        en: 'This career guidance assessment is designed to help you understand your professional interests, strengths, and potential career paths. The test will analyze your responses to provide personalized insights about careers that match your profile.',
        ru: 'Эта оценка профессиональной ориентации разработана, чтобы помочь вам понять ваши профессиональные интересы, сильные стороны и потенциальные карьерные пути. Тест проанализирует ваши ответы, чтобы предоставить персонализированные рекомендации о карьерах, соответствующих вашему профилю.',
        kz: 'Бұл мамандықты таңдау бағалауы сіздің кәсіби қызығушылықтарыңызды, күшті жақтарыңызды және мүмкін мансап жолдарыңызды түсінуге көмектесу үшін жасалған. Тест сіздің профиліңізге сәйкес келетін мансаптар туралы жекелендірілген ұсыныстар беру үшін жауаптарыңызды талдайды.',
      },
    },
    {
      id: 'how-it-works',
      type: 'numbered_steps',
      title: {
        en: 'How It Works',
        ru: 'Как это работает',
        kz: 'Бұл қалай жұмыс істейді',
      },
      steps: [
        {
          number: 1,
          title: { en: '', ru: '', kz: '' },
          description: {
            en: 'Read each question or statement carefully',
            ru: 'Внимательно прочитайте каждый вопрос или утверждение',
            kz: 'Әрбір сұрақ немесе мәлімдемені мұқият оқыңыз',
          },
        },
        {
          number: 2,
          title: { en: '', ru: '', kz: '' },
          description: {
            en: 'Provide honest answers based on your genuine preferences and feelings',
            ru: 'Давайте честные ответы, основанные на ваших истинных предпочтениях и чувствах',
            kz: 'Шынайы қалауларыңыз бен сезімдеріңізге негізделген шынайы жауаптар беріңіз',
          },
        },
        {
          number: 3,
          title: { en: '', ru: '', kz: '' },
          description: {
            en: 'Complete all questions to receive accurate results',
            ru: 'Ответьте на все вопросы, чтобы получить точные результаты',
            kz: 'Дәл нәтижелер алу үшін барлық сұрақтарға жауап беріңіз',
          },
        },
        {
          number: 4,
          title: { en: '', ru: '', kz: '' },
          description: {
            en: 'Review your personalized career recommendations',
            ru: 'Изучите свои персонализированные карьерные рекомендации',
            kz: 'Жекелендірілген мансап ұсыныстарыңызды қарап шығыңыз',
          },
        },
      ],
    },
    {
      id: 'important-instructions',
      type: 'bullet_list',
      title: {
        en: 'Important Instructions',
        ru: 'Важные инструкции',
        kz: 'Маңызды нұсқаулар',
      },
      items: [
        {
          en: 'Answer honestly - there are no right or wrong answers',
          ru: 'Отвечайте честно - нет правильных или неправильных ответов',
          kz: 'Шынайы жауап беріңіз - дұрыс немесе бұрыс жауаптар жоқ',
        },
        {
          en: 'Take your time - this assessment is not timed',
          ru: 'Не торопитесь - оценка не ограничена по времени',
          kz: 'Асықпаңыз - бұл бағалау уақытпен шектелмеген',
        },
        {
          en: 'Complete the test in one sitting for best results',
          ru: 'Пройдите тест за один раз для лучших результатов',
          kz: 'Ең жақсы нәтижелер үшін тестті бір отырыста аяқтаңыз',
        },
        {
          en: 'Your progress is automatically saved',
          ru: 'Ваш прогресс автоматически сохраняется',
          kz: 'Сіздің прогресіңіз автоматты түрде сақталады',
        },
        {
          en: 'You can return to the test later if needed',
          ru: 'При необходимости вы можете вернуться к тесту позже',
          kz: 'Қажет болса, кейінірек тестке қайта оралуға болады',
        },
      ],
    },
    {
      id: 'what-you-will-learn',
      type: 'bullet_list',
      title: {
        en: 'What You Will Learn',
        ru: 'Что вы узнаете',
        kz: 'Не білесіз',
      },
      items: [
        {
          en: 'Your professional interests and aptitudes',
          ru: 'Ваши профессиональные интересы и способности',
          kz: 'Сіздің кәсіби қызығушылықтарыңыз бен қабілеттеріңіз',
        },
        {
          en: 'Career paths that align with your profile',
          ru: 'Карьерные пути, соответствующие вашему профилю',
          kz: 'Сіздің профиліңізге сәйкес келетін мансап жолдары',
        },
        {
          en: 'Recommended educational programs and specializations',
          ru: 'Рекомендуемые образовательные программы и специализации',
          kz: 'Ұсынылатын білім беру бағдарламалары мен мамандықтар',
        },
        {
          en: 'Insights to help guide your career decisions',
          ru: 'Информация, которая поможет вам принимать карьерные решения',
          kz: 'Мансаптық шешімдер қабылдауға көмектесетін түсініктемелер',
        },
      ],
    },
    {
      id: 'remember',
      type: 'rich_text',
      title: {
        en: 'Remember',
        ru: 'Помните',
        kz: 'Есте сақтаңыз',
      },
      content: {
        en: 'This assessment is a tool to help guide your career exploration. Your results are personalized based on your responses and should be used as one of many resources in your career planning journey.',
        ru: 'Эта оценка является инструментом, помогающим направлять ваше исследование карьеры. Ваши результаты персонализированы на основе ваших ответов и должны использоваться как один из многих ресурсов в вашем карьерном планировании.',
        kz: 'Бұл бағалау сіздің мансап зерттеуіңізге көмектесетін құрал болып табылады. Сіздің нәтижелеріңіз жауаптарыңызға негізделген жекеленген және мансап жоспарлау сапарыңыздағы көптеген ресурстардың бірі ретінде қолданылуы керек.',
      },
    },
  ],
};
