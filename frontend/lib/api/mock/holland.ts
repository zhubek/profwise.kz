import type { TestSection, Question, RIASECCategory, TestResults } from '@/types/test';

export const HOLLAND_TEST_ID = 'test-1'; // Holland Test (RIASEC)

const likertOptions = [
  { id: '1', text: { en: 'Not interesting', ru: 'Неинтересно', kz: 'Қызықты емес' }, value: 1, order: 1 },
  { id: '2', text: { en: 'Slightly interesting', ru: 'Немного интересно', kz: 'Біршама қызықты' }, value: 2, order: 2 },
  { id: '3', text: { en: 'Moderately interesting', ru: 'Умеренно интересно', kz: 'Орташа қызықты' }, value: 3, order: 3 },
  { id: '4', text: { en: 'Very interesting', ru: 'Очень интересно', kz: 'Өте қызықты' }, value: 4, order: 4 },
  { id: '5', text: { en: 'Extremely interesting', ru: 'Чрезвычайно интересно', kz: 'Аса қызықты' }, value: 5, order: 5 },
];

// Mock Holland Test Sections with questions
export const hollandTestSections: TestSection[] = [
  {
    id: 'section-1',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Realistic Activities', ru: 'Реалистические виды деятельности', kz: 'Реалистік қызмет түрлері' },
    description: { en: 'Rate how much you enjoy working with tools, machines, and outdoor activities', ru: 'Оцените, насколько вам нравится работать с инструментами, техникой и на открытом воздухе', kz: 'Құралдармен, машиналармен және ашық ауада жұмыс істеу қаншалықты ұнайтынын бағалаңыз' },
    order: 1,
    questions: [
      {
        id: 'r1',
        sectionId: 'section-1',
        text: { en: 'Fix broken smartphones, computers, or gaming consoles', kz: 'Бұзылған смартфондарды, компьютерлерді немесе ойын консольдарын жөндеу', ru: 'Ремонтировать сломанные смартфоны, компьютеры или игровые приставки' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r1-${opt.id}` })),
      },
      {
        id: 'r2',
        sectionId: 'section-1',
        text: { en: 'Build robots or mechanical projects for a science competition', kz: 'Ғылыми жарысқа арналған роботтар немесе механикалық жобалар жасау', ru: 'Создавать роботов или механические проекты для научных соревнований' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r2-${opt.id}` })),
      },
      {
        id: 'r3',
        sectionId: 'section-1',
        text: { en: 'Work outdoors exploring mountains, lakes, or steppes as a nature guide', kz: 'Табиғат гиді ретінде таулар, көлдер немесе далаларды зерттеп ашық ауада жұмыс істеу', ru: 'Работать на открытом воздухе, исследуя горы, озёра или степи в качестве гида' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r3-${opt.id}` })),
      },
      {
        id: 'r4',
        sectionId: 'section-1',
        text: { en: 'Repair bicycles, motorcycles, or help maintain vehicles', kz: 'Велосипедтерді, мотоциклдерді жөндеу немесе көліктерді қызмет көрсетуге көмектесу', ru: 'Ремонтировать велосипеды, мотоциклы или помогать в обслуживании транспортных средств' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r4-${opt.id}` })),
      },
      {
        id: 'r5',
        sectionId: 'section-1',
        text: { en: 'Take care of animals at a farm or veterinary clinic', kz: 'Фермада немесе ветеринариялық клиникада жануарларға қамқорлық жасау', ru: 'Ухаживать за животными на ферме или в ветеринарной клинике' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r5-${opt.id}` })),
      },
      {
        id: 'r6',
        sectionId: 'section-1',
        text: { en: 'Use 3D printers or woodworking tools to create physical objects', kz: 'Физикалық заттар жасау үшін 3D принтерлерді немесе ағаш өңдеу құралдарын пайдалану', ru: 'Использовать 3D-принтеры или столярные инструменты для создания физических объектов' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'R',
        options: likertOptions.map(opt => ({ ...opt, id: `r6-${opt.id}` })),
      },
    ],
  },
  {
    id: 'section-2',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Investigative Activities', ru: 'Исследовательские виды деятельности', kz: 'Зерттеу қызмет түрлері' },
    description: { en: 'Rate how much you enjoy research, analysis, and problem-solving', ru: 'Оцените, насколько вам нравится исследования, анализ и решение проблем', kz: 'Зерттеулер, талдау және мәселелерді шешу қаншалықты ұнайтынын бағалаңыз' },
    order: 2,
    questions: [
      {
        id: 'i1',
        sectionId: 'section-2',
        text: { en: 'Conduct science experiments to discover how things work', kz: 'Заттардың қалай жұмыс істейтінін білу үшін ғылыми тәжірибелер жүргізу', ru: 'Проводить научные эксперименты, чтобы узнать, как всё работает' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i1-${opt.id}` })),
      },
      {
        id: 'i2',
        sectionId: 'section-2',
        text: { en: 'Analyze statistics from sports games or social media trends', kz: 'Спорттық ойындар немесе әлеуметтік желілердегі трендтердің статистикасын талдау', ru: 'Анализировать статистику спортивных игр или трендов в социальных сетях' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i2-${opt.id}` })),
      },
      {
        id: 'i3',
        sectionId: 'section-2',
        text: { en: 'Study historical events and their impact on modern society', kz: 'Тарихи оқиғаларды және олардың қазіргі қоғамға әсерін зерттеу', ru: 'Изучать исторические события и их влияние на современное общество' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i3-${opt.id}` })),
      },
      {
        id: 'i4',
        sectionId: 'section-2',
        text: { en: 'Solve challenging math puzzles or compete in olympiads', kz: 'Күрделі математикалық жұмбақтарды шешу немесе олимпиадаларға қатысу', ru: 'Решать сложные математические задачи или участвовать в олимпиадах' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i4-${opt.id}` })),
      },
      {
        id: 'i5',
        sectionId: 'section-2',
        text: { en: 'Research environmental issues affecting local seas and lakes', kz: 'Жергілікті теңіздер мен көлдерге әсер ететін экологиялық мәселелерді зерттеу', ru: 'Исследовать экологические проблемы, влияющие на местные моря и озёра' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i5-${opt.id}` })),
      },
      {
        id: 'i6',
        sectionId: 'section-2',
        text: { en: 'Write code to create programs that solve real-world problems', kz: 'Нақты мәселелерді шешетін бағдарламалар жасау үшін код жазу', ru: 'Писать код для создания программ, решающих реальные проблемы' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'I',
        options: likertOptions.map(opt => ({ ...opt, id: `i6-${opt.id}` })),
      },
    ],
  },
  {
    id: 'section-3',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Artistic Activities', ru: 'Художественные виды деятельности', kz: 'Көркем қызмет түрлері' },
    description: { en: 'Rate how much you enjoy creative expression and artistic activities', ru: 'Оцените, насколько вам нравится творческое самовыражение и художественная деятельность', kz: 'Шығармашылық өзін-өзі көрсету және көркем қызмет қаншалықты ұнайтынын бағалаңыз' },
    order: 3,
    questions: [
      {
        id: 'a1',
        sectionId: 'section-3',
        text: { en: 'Create content for TikTok, YouTube, or Instagram (videos, photos, graphics)', kz: 'TikTok, YouTube немесе Instagram үшін контент жасау (бейнелер, фотолар, графика)', ru: 'Создавать контент для TikTok, YouTube или Instagram (видео, фото, графика)' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a1-${opt.id}` })),
      },
      {
        id: 'a2',
        sectionId: 'section-3',
        text: { en: 'Design characters, environments, or animations for video games', kz: 'Бейне ойындарға арналған кейіпкерлерді, ортаны немесе анимацияларды жобалау', ru: 'Разрабатывать персонажей, окружение или анимацию для видеоигр' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a2-${opt.id}` })),
      },
      {
        id: 'a3',
        sectionId: 'section-3',
        text: { en: 'Write stories, poems, or scripts for school plays', kz: 'Мектеп қойылымдарына арналған әңгімелер, өлеңдер немесе сценарийлер жазу', ru: 'Писать рассказы, стихи или сценарии для школьных спектаклей' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a3-${opt.id}` })),
      },
      {
        id: 'a4',
        sectionId: 'section-3',
        text: { en: 'Perform traditional music on the dombra or other instruments', kz: 'Домбырада немесе басқа аспаптарда дәстүрлі музыка орындау', ru: 'Исполнять традиционную музыку на домбре или других инструментах' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a4-${opt.id}` })),
      },
      {
        id: 'a5',
        sectionId: 'section-3',
        text: { en: 'Draw, paint, or create digital art and illustrations', kz: 'Сурет салу, бояу немесе цифрлық өнер мен иллюстрациялар жасау', ru: 'Рисовать, писать картины или создавать цифровое искусство и иллюстрации' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a5-${opt.id}` })),
      },
      {
        id: 'a6',
        sectionId: 'section-3',
        text: { en: 'Design fashion, create makeup looks, or style photo shoots', kz: 'Сән дизайнын жасау, макияж түрлерін жасау немесе фотосессияларды стильдеу', ru: 'Создавать модные образы, делать макияж или стилизовать фотосессии' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'A',
        options: likertOptions.map(opt => ({ ...opt, id: `a6-${opt.id}` })),
      },
    ],
  },
  {
    id: 'section-4',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Social Activities', ru: 'Социальные виды деятельности', kz: 'Әлеуметтік қызмет түрлері' },
    description: { en: 'Rate how much you enjoy helping and working with other people', ru: 'Оцените, насколько вам нравится помогать людям и работать с ними', kz: 'Адамдарға көмектесу және олармен жұмыс істеу қаншалықты ұнайтынын бағалаңыз' },
    order: 4,
    questions: [
      {
        id: 's1',
        sectionId: 'section-4',
        text: { en: 'Tutor younger students in subjects you\'re good at', kz: 'Өзіңіз жақсы білетін пәндер бойынша кіші оқушыларға сабақ беру', ru: 'Репетировать младших учеников по предметам, в которых вы сильны' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s1-${opt.id}` })),
      },
      {
        id: 's2',
        sectionId: 'section-4',
        text: { en: 'Volunteer at community centers or help organize charity events', kz: 'Қоғамдық орталықтарда волонтерлік жасау немесе қайырымдылық іс-шараларын ұйымдастыруға көмектесу', ru: 'Волонтёрить в общественных центрах или помогать организовывать благотворительные мероприятия' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s2-${opt.id}` })),
      },
      {
        id: 's3',
        sectionId: 'section-4',
        text: { en: 'Work as a camp counselor or coach for children\'s sports teams', kz: 'Лагерь кеңесшісі немесе балалар спорт командаларының жаттықтырушысы ретінде жұмыс істеу', ru: 'Работать вожатым в лагере или тренером детских спортивных команд' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s3-${opt.id}` })),
      },
      {
        id: 's4',
        sectionId: 'section-4',
        text: { en: 'Help new students feel welcome and adapt to school life', kz: 'Жаңа оқушылардың өздерін жайлы сезінуіне және мектеп өміріне бейімделуіне көмектесу', ru: 'Помогать новым ученикам чувствовать себя комфортно и адаптироваться к школьной жизни' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s4-${opt.id}` })),
      },
      {
        id: 's5',
        sectionId: 'section-4',
        text: { en: 'Listen to friends\' problems and give them advice and support', kz: 'Достардың мәселелерін тыңдау және оларға кеңес пен қолдау көрсету', ru: 'Слушать проблемы друзей и давать им советы и поддержку' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s5-${opt.id}` })),
      },
      {
        id: 's6',
        sectionId: 'section-4',
        text: { en: 'Teach your native language or culture to international students', kz: 'Шетелдік студенттерге ана тіліңізді немесе мәдениетіңізді үйрету', ru: 'Обучать родному языку или культуре иностранных студентов' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'S',
        options: likertOptions.map(opt => ({ ...opt, id: `s6-${opt.id}` })),
      },
    ],
  },
  {
    id: 'section-5',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Enterprising Activities', ru: 'Предпринимательские виды деятельности', kz: 'Кәсіпкерлік қызмет түрлері' },
    description: { en: 'Rate how much you enjoy leadership and business activities', ru: 'Оцените, насколько вам нравится лидерство и бизнес', kz: 'Көшбасшылық және бизнес қаншалықты ұнайтынын бағалаңыз' },
    order: 5,
    questions: [
      {
        id: 'e1',
        sectionId: 'section-5',
        text: { en: 'Start your own small business (selling products online, freelancing, etc.)', kz: 'Өзіңіздің шағын бизнесіңізді бастау (онлайн өнімдер сату, фриланс және т.б.)', ru: 'Открыть собственный малый бизнес (продажа товаров онлайн, фриланс и т.д.)' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e1-${opt.id}` })),
      },
      {
        id: 'e2',
        sectionId: 'section-5',
        text: { en: 'Run for student council president or lead school clubs', kz: 'Оқушылар кеңесінің президенті болуға кандидат болу немесе мектеп клубтарын басқару', ru: 'Баллотироваться в президенты студенческого совета или возглавлять школьные клубы' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e2-${opt.id}` })),
      },
      {
        id: 'e3',
        sectionId: 'section-5',
        text: { en: 'Organize school events like dances, festivals, or fundraisers', kz: 'Билер, фестивальдер немесе қаражат жинау сияқты мектеп іс-шараларын ұйымдастыру', ru: 'Организовывать школьные мероприятия, такие как танцы, фестивали или сборы средств' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e3-${opt.id}` })),
      },
      {
        id: 'e4',
        sectionId: 'section-5',
        text: { en: 'Convince people to support causes you believe in or join your team', kz: 'Адамдарды сіз сенетін мақсаттарды қолдауға немесе командаңызға қосылуға сендіру', ru: 'Убеждать людей поддерживать дела, в которые вы верите, или присоединяться к вашей команде' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e4-${opt.id}` })),
      },
      {
        id: 'e5',
        sectionId: 'section-5',
        text: { en: 'Promote local tourism or businesses through social media marketing', kz: 'Әлеуметтік желілер маркетингі арқылы жергілікті туризмді немесе бизнесті насихаттау', ru: 'Продвигать местный туризм или бизнес через маркетинг в социальных сетях' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e5-${opt.id}` })),
      },
      {
        id: 'e6',
        sectionId: 'section-5',
        text: { en: 'Negotiate deals, manage budgets, or compete in business competitions', kz: 'Келісімдер жүргізу, бюджеттерді басқару немесе бизнес жарыстарына қатысу', ru: 'Вести переговоры, управлять бюджетами или участвовать в бизнес-соревнованиях' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'E',
        options: likertOptions.map(opt => ({ ...opt, id: `e6-${opt.id}` })),
      },
    ],
  },
  {
    id: 'section-6',
    testId: HOLLAND_TEST_ID,
    title: { en: 'Conventional Activities', ru: 'Организационные виды деятельности', kz: 'Ұйымдастыру қызмет түрлері' },
    description: { en: 'Rate how much you enjoy organized, detail-oriented work', ru: 'Оцените, насколько вам нравится организованная работа с вниманием к деталям', kz: 'Ұйымдастырылған, егжей-тегжейге назар аударатын жұмыс қаншалықты ұнайтынын бағалаңыз' },
    order: 6,
    questions: [
      {
        id: 'c1',
        sectionId: 'section-6',
        text: { en: 'Keep your school notes, files, and assignments perfectly organized', kz: 'Мектеп жазбаларыңызды, файлдарыңызды және тапсырмаларыңызды мінсіз ұйымдастырып ұстау', ru: 'Держать школьные записи, файлы и задания в идеальном порядке' },
        type: 'likert',
        order: 1,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c1-${opt.id}` })),
      },
      {
        id: 'c2',
        sectionId: 'section-6',
        text: { en: 'Manage a club\'s budget, schedule, or membership records', kz: 'Клубтың бюджетін, кестесін немесе мүшелік жазбаларын басқару', ru: 'Управлять бюджетом клуба, расписанием или записями о членстве' },
        type: 'likert',
        order: 2,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c2-${opt.id}` })),
      },
      {
        id: 'c3',
        sectionId: 'section-6',
        text: { en: 'Create spreadsheets to track grades, expenses, or project data', kz: 'Бағаларды, шығындарды немесе жоба деректерін бақылау үшін электрондық кестелер жасау', ru: 'Создавать электронные таблицы для отслеживания оценок, расходов или данных проектов' },
        type: 'likert',
        order: 3,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c3-${opt.id}` })),
      },
      {
        id: 'c4',
        sectionId: 'section-6',
        text: { en: 'Help organize school documents, attendance records, or library systems', kz: 'Мектеп құжаттарын, қатысу жазбаларын немесе кітапхана жүйелерін ұйымдастыруға көмектесу', ru: 'Помогать организовывать школьные документы, записи посещаемости или библиотечные системы' },
        type: 'likert',
        order: 4,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c4-${opt.id}` })),
      },
      {
        id: 'c5',
        sectionId: 'section-6',
        text: { en: 'Process registrations and maintain databases for school events', kz: 'Мектеп іс-шараларына арналған тіркеулерді өңдеу және деректер базасын қолдау', ru: 'Обрабатывать регистрации и поддерживать базы данных для школьных мероприятий' },
        type: 'likert',
        order: 5,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c5-${opt.id}` })),
      },
      {
        id: 'c6',
        sectionId: 'section-6',
        text: { en: 'Follow detailed procedures when entering data or completing paperwork', kz: 'Деректерді енгізу немесе құжаттарды толтыру кезінде егжей-тегжейлі рәсімдерді орындау', ru: 'Следовать подробным процедурам при вводе данных или заполнении документов' },
        type: 'likert',
        order: 6,
        required: true,
        archetypeCategory: 'interests',
        archetypeCode: 'C',
        options: likertOptions.map(opt => ({ ...opt, id: `c6-${opt.id}` })),
      },
    ],
  },
];

// API functions
export async function getHollandTestSections(): Promise<TestSection[]> {
  return hollandTestSections;
}

export async function submitHollandTest(
  userId: string,
  testId: string,
  answers: Record<string, number | string | string[]>
): Promise<TestResults> {

  // Get all questions
  const allQuestions = hollandTestSections.flatMap(section => section.questions);

  // Separate survey questions from RIASEC scoring questions
  const surveyQuestions: Array<{ questionId: string; answers: any }> = [];

  // Calculate RIASEC scores (only for non-survey questions)
  const riasecScores = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  // Process each answer
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = allQuestions.find(q => q.id === questionId);

    if (question) {
      // Check if this is a survey question
      const parameters = question.parameters as any;
      const isSurveyQuestion = parameters?.type === 'survey';

      if (isSurveyQuestion) {
        // Store survey question answer separately
        surveyQuestions.push({
          questionId,
          answers: answer,
        });
      } else if (question.archetypeCode && typeof answer === 'number') {
        // Calculate RIASEC score for regular questions
        const code = question.archetypeCode.toLowerCase();
        if (code === 'r') riasecScores.realistic += answer;
        else if (code === 'i') riasecScores.investigative += answer;
        else if (code === 'a') riasecScores.artistic += answer;
        else if (code === 's') riasecScores.social += answer;
        else if (code === 'e') riasecScores.enterprising += answer;
        else if (code === 'c') riasecScores.conventional += answer;
      }
    }
  });

  // TODO: Call backend API to save survey questions
  // if (surveyQuestions.length > 0) {
  //   await fetch(`${API_BASE_URL}/results/survey-questions`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ userId, questions: surveyQuestions }),
  //   });
  // }

  return {
    id: `result-${Date.now()}`,
    userTestId: `usertest-${Date.now()}`,
    testId,
    userId,
    archetypeScores: {
      interests: {
        realistic: riasecScores.realistic,
        investigative: riasecScores.investigative,
        artistic: riasecScores.artistic,
        social: riasecScores.social,
        enterprising: riasecScores.enterprising,
        conventional: riasecScores.conventional,
      },
    },
    riasecScores,
    matchedProfessions: ['prof-1', 'prof-2', 'prof-3'], // Mock matched professions
    generatedAt: new Date().toISOString(),
  };
}
