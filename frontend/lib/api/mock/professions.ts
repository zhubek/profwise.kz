import type {
  Profession,
  ProfessionMatch,
  ProfessionDetails,
  ProfessionLaborMarket,
  ProfessionSalary,
  ProfessionEducation,
  ProfessionArchetypes,
  MultilingualText,
} from '@/types/profession';

export const mockProfessions: Profession[] = [
  {
    id: 'prof-1',
    title: {
      en: 'Software Developer',
      ru: 'Разработчик программного обеспечения',
      kz: 'Бағдарламалық қамтамасыз ету әзірлеушісі',
    },
    description: {
      en: 'Design, develop, and maintain software applications and systems',
      ru: 'Проектирование, разработка и поддержка программных приложений и систем',
      kz: 'Бағдарламалық қосымшалар мен жүйелерді жобалау, әзірлеу және қолдау',
    },
    category: 'technology',
    icon: '💻',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-2',
    title: {
      en: 'Data Scientist',
      ru: 'Специалист по данным',
      kz: 'Деректер бойынша маман',
    },
    description: {
      en: 'Analyze complex data to help organizations make better decisions',
      ru: 'Анализ сложных данных для помощи организациям в принятии лучших решений',
      kz: 'Ұйымдарға жақсы шешімдер қабылдауға көмектесу үшін күрделі деректерді талдау',
    },
    category: 'technology',
    icon: '📊',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-3',
    title: {
      en: 'UX/UI Designer',
      ru: 'UX/UI дизайнер',
      kz: 'UX/UI дизайнер',
    },
    description: {
      en: 'Create intuitive and visually appealing user interfaces',
      ru: 'Создание интуитивно понятных и визуально привлекательных пользовательских интерфейсов',
      kz: 'Интуитивті және визуалды тартымды пайдаланушы интерфейстерін жасау',
    },
    category: 'design',
    icon: '🎨',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-4',
    title: {
      en: 'Psychologist',
      ru: 'Психолог',
      kz: 'Психолог',
    },
    description: {
      en: 'Help people overcome mental health challenges and improve well-being',
      ru: 'Помощь людям в преодолении проблем психического здоровья и улучшении благополучия',
      kz: 'Адамдарға психикалық денсаулық мәселелерін жеңуге және әл-ауқатын жақсартуға көмектесу',
    },
    category: 'healthcare',
    icon: '🧠',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-5',
    title: {
      en: 'Business Analyst',
      ru: 'Бизнес-аналитик',
      kz: 'Бизнес-аналитик',
    },
    description: {
      en: 'Bridge the gap between IT and business using data analytics',
      ru: 'Связующее звено между IT и бизнесом с использованием аналитики данных',
      kz: 'IT мен бизнес арасындағы алшақтықты деректерді талдау арқылы жою',
    },
    category: 'business',
    icon: '💼',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-6',
    title: {
      en: 'Graphic Designer',
      ru: 'Графический дизайнер',
      kz: 'Графикалық дизайнер',
    },
    description: {
      en: 'Create visual concepts to communicate ideas that inspire and inform',
      ru: 'Создание визуальных концепций для передачи идей, которые вдохновляют и информируют',
      kz: 'Шабыттандыратын және хабарлайтын идеяларды жеткізу үшін визуалды концепцияларды жасау',
    },
    category: 'design',
    icon: '🖌️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-7',
    title: {
      en: 'Marketing Manager',
      ru: 'Менеджер по маркетингу',
      kz: 'Маркетинг менеджері',
    },
    description: {
      en: 'Develop and execute marketing strategies to promote products and services',
      ru: 'Разработка и реализация маркетинговых стратегий для продвижения продуктов и услуг',
      kz: 'Өнімдер мен қызметтерді ілгерілету үшін маркетингтік стратегияларды әзірлеу және орындау',
    },
    category: 'business',
    icon: '📱',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-8',
    title: {
      en: 'Registered Nurse',
      ru: 'Дипломированная медсестра',
      kz: 'Дипломды медбике',
    },
    description: {
      en: 'Provide patient care and support in hospitals and healthcare facilities',
      ru: 'Оказание помощи и поддержки пациентам в больницах и медицинских учреждениях',
      kz: 'Аурухана мен медициналық мекемелерде науқастарға күтім және қолдау көрсету',
    },
    category: 'healthcare',
    icon: '👩‍⚕️',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-9',
    title: {
      en: 'Research Scientist',
      ru: 'Научный сотрудник',
      kz: 'Ғылыми қызметкер',
    },
    description: {
      en: 'Conduct experiments and research to advance scientific knowledge',
      ru: 'Проведение экспериментов и исследований для развития научных знаний',
      kz: 'Ғылыми білімді дамыту үшін эксперименттер мен зерттеулер жүргізу',
    },
    category: 'science',
    icon: '🔬',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-10',
    title: {
      en: 'Content Writer',
      ru: 'Контент-райтер',
      kz: 'Контент-жазушы',
    },
    description: {
      en: 'Create engaging written content for websites, blogs, and marketing materials',
      ru: 'Создание увлекательного письменного контента для веб-сайтов, блогов и маркетинговых материалов',
      kz: 'Веб-сайттар, блогтар және маркетингтік материалдар үшін тартымды жазбаша мазмұн жасау',
    },
    category: 'communication',
    icon: '✍️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-11',
    title: {
      en: 'Elementary School Teacher',
      ru: 'Учитель начальной школы',
      kz: 'Бастауыш сынып мұғалімі',
    },
    description: {
      en: 'Educate and inspire young students in foundational academic subjects',
      ru: 'Обучение и вдохновение юных учеников по основным академическим предметам',
      kz: 'Жас оқушыларды негізгі академиялық пәндер бойынша оқыту және шабыттандыру',
    },
    category: 'education',
    icon: '👨‍🏫',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-12',
    title: {
      en: 'Musician',
      ru: 'Музыкант',
      kz: 'Музыкант',
    },
    description: {
      en: 'Create, perform, and record music for entertainment and artistic expression',
      ru: 'Создание, исполнение и запись музыки для развлечения и художественного самовыражения',
      kz: 'Ойын-сауық және көркемдік өзін-өзі көрсету үшін музыка жасау, орындау және жазу',
    },
    category: 'arts',
    icon: '🎵',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-13',
    title: {
      en: 'Cybersecurity Analyst',
      ru: 'Специалист по кибербезопасности',
      kz: 'Киберқауіпсіздік маманы',
    },
    description: {
      en: 'Protect computer systems and networks from cyber threats and attacks',
      ru: 'Защита компьютерных систем и сетей от киберугроз и атак',
      kz: 'Компьютерлік жүйелер мен желілерді киберқауіптер мен шабуылдардан қорғау',
    },
    category: 'technology',
    icon: '🔒',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-14',
    title: {
      en: 'Financial Advisor',
      ru: 'Финансовый консультант',
      kz: 'Қаржылық кеңесші',
    },
    description: {
      en: 'Help clients make informed decisions about investments and financial planning',
      ru: 'Помощь клиентам в принятии обоснованных решений по инвестициям и финансовому планированию',
      kz: 'Клиенттерге инвестициялар және қаржылық жоспарлау туралы негізделген шешімдер қабылдауға көмектесу',
    },
    category: 'business',
    icon: '💰',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-15',
    title: {
      en: 'Physical Therapist',
      ru: 'Физиотерапевт',
      kz: 'Физиотерапевт',
    },
    description: {
      en: 'Help patients recover from injuries and improve their physical mobility',
      ru: 'Помощь пациентам в восстановлении после травм и улучшении физической подвижности',
      kz: 'Науқастарға жарақаттардан қалпына келуге және физикалық қозғалғыштықты жақсартуға көмектесу',
    },
    category: 'healthcare',
    icon: '🏃',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-16',
    title: {
      en: 'Environmental Scientist',
      ru: 'Эколог',
      kz: 'Эколог',
    },
    description: {
      en: 'Study the environment and develop solutions to environmental problems',
      ru: 'Изучение окружающей среды и разработка решений экологических проблем',
      kz: 'Қоршаған ортаны зерттеу және экологиялық мәселелерге шешімдер әзірлеу',
    },
    category: 'science',
    icon: '🌍',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-17',
    title: {
      en: 'Public Relations Specialist',
      ru: 'Специалист по связям с общественностью',
      kz: 'Қоғаммен байланыс маманы',
    },
    description: {
      en: 'Manage public image and communications for organizations and individuals',
      ru: 'Управление имиджем и коммуникациями для организаций и частных лиц',
      kz: 'Ұйымдар мен жеке адамдар үшін имиджді және коммуникацияларды басқару',
    },
    category: 'communication',
    icon: '📢',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-18',
    title: {
      en: 'Architect',
      ru: 'Архитектор',
      kz: 'Сәулетші',
    },
    description: {
      en: 'Design buildings and structures that are functional, safe, and aesthetically pleasing',
      ru: 'Проектирование зданий и сооружений, которые функциональны, безопасны и эстетически привлекательны',
      kz: 'Функционалды, қауіпсіз және эстетикалық тартымды ғимараттар мен құрылымдарды жобалау',
    },
    category: 'design',
    icon: '🏛️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-19',
    title: {
      en: 'Social Worker',
      ru: 'Социальный работник',
      kz: 'Әлеуметтік қызметкер',
    },
    description: {
      en: 'Support individuals and communities facing social challenges and hardships',
      ru: 'Поддержка людей и сообществ, сталкивающихся с социальными проблемами и трудностями',
      kz: 'Әлеуметтік мәселелер мен қиындықтарға тап болған адамдар мен қауымдастықтарға қолдау көрсету',
    },
    category: 'education',
    icon: '🤝',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-20',
    title: {
      en: 'Film Director',
      ru: 'Режиссер фильма',
      kz: 'Фильм режиссері',
    },
    description: {
      en: 'Oversee the creative aspects of film production and bring stories to life',
      ru: 'Надзор за творческими аспектами производства фильмов и воплощение историй в жизнь',
      kz: 'Фильм өндірісінің шығармашылық аспектілерін басқару және әңгімелерді өмірге келтіру',
    },
    category: 'arts',
    icon: '🎬',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockProfessionMatches: ProfessionMatch[] = mockProfessions.map((prof, index) => ({
  ...prof,
  matchScore: Math.max(92 - index * 3, 55), // Range from 92% to 55%
  matchBreakdown: {
    interests: Math.max(90 - index * 2, 55),
    skills: Math.max(88 - index * 2, 50),
    personality: Math.max(95 - index * 3, 60),
    values: Math.max(90 - index * 2, 55),
  },
  isLiked: index < 3, // First 3 are liked
}));

export const mockProfessionDetails: Record<string, ProfessionDetails> = {
  'prof-1': {
    ...mockProfessions[0],
    overview: {
      en: 'Software developers create the applications and systems that run on computers, mobile devices, and other platforms. They work closely with clients and stakeholders to understand requirements and translate them into functional code.',
      ru: 'Разработчики программного обеспечения создают приложения и системы, которые работают на компьютерах, мобильных устройствах и других платформах. Они тесно сотрудничают с клиентами и заинтересованными сторонами для понимания требований и перевода их в функциональный код.',
      kz: 'Бағдарламалық қамтамасыз ету әзірлеушілері компьютерлерде, мобильді құрылғыларда және басқа платформаларда жұмыс істейтін қосымшалар мен жүйелер жасайды. Олар талаптарды түсіну және оларды функционалды кодқа аудару үшін клиенттермен және мүдделі тараптармен тығыз жұмыс істейді.',
    },
    keyResponsibilities: [
      {
        en: 'Write clean, maintainable code following best practices',
        ru: 'Написание чистого, поддерживаемого кода в соответствии с лучшими практиками',
        kz: 'Үздік тәжірибелерді ұстана отырып, таза, қолдауға болатын код жазу',
      },
      {
        en: 'Debug and troubleshoot software issues',
        ru: 'Отладка и устранение проблем программного обеспечения',
        kz: 'Бағдарламалық қамтамасыз ету мәселелерін жөндеу және шешу',
      },
      {
        en: 'Collaborate with team members on project development',
        ru: 'Сотрудничество с членами команды по разработке проекта',
        kz: 'Жоба әзірлеу бойынша топ мүшелерімен ынтымақтасу',
      },
      {
        en: 'Participate in code reviews and provide constructive feedback',
        ru: 'Участие в обзорах кода и предоставление конструктивной обратной связи',
        kz: 'Код қарауға қатысу және конструктивті кері байланыс беру',
      },
      {
        en: 'Stay updated with emerging technologies and frameworks',
        ru: 'Быть в курсе новых технологий и фреймворков',
        kz: 'Жаңа технологиялар мен фреймворктармен жаңартылып отыру',
      },
    ],
    requiredSkills: [
      {
        en: 'Programming Languages (Java, Python, JavaScript)',
        ru: 'Языки программирования (Java, Python, JavaScript)',
        kz: 'Бағдарламалау тілдері (Java, Python, JavaScript)',
      },
      {
        en: 'Problem-solving',
        ru: 'Решение проблем',
        kz: 'Мәселелерді шешу',
      },
      {
        en: 'Version Control (Git)',
        ru: 'Контроль версий (Git)',
        kz: 'Нұсқаларды басқару (Git)',
      },
      {
        en: 'Database Management',
        ru: 'Управление базами данных',
        kz: 'Деректер базасын басқару',
      },
      {
        en: 'Agile Methodology',
        ru: 'Agile методология',
        kz: 'Agile әдіснамасы',
      },
      {
        en: 'Communication',
        ru: 'Коммуникация',
        kz: 'Коммуникация',
      },
    ],
    workEnvironment: {
      en: 'Office or remote, often in collaborative team settings',
      ru: 'Офис или удаленная работа, часто в совместных командных условиях',
      kz: 'Кеңсе немесе қашықтан, көбінесе бірлескен топтық жағдайларда',
    },
    typicalTasks: [
      {
        en: 'Writing and testing code',
        ru: 'Написание и тестирование кода',
        kz: 'Код жазу және тестілеу',
      },
      {
        en: 'Attending team meetings and stand-ups',
        ru: 'Участие в командных встречах и стендапах',
        kz: 'Топтық кездесулерге және стендаптарға қатысу',
      },
      {
        en: 'Reviewing and refactoring existing code',
        ru: 'Обзор и рефакторинг существующего кода',
        kz: 'Бар кодты қарау және рефакторинг жасау',
      },
      {
        en: 'Documenting code and processes',
        ru: 'Документирование кода и процессов',
        kz: 'Код пен процестерді құжаттау',
      },
    ],
    toolsAndTechnologies: [
      {
        en: 'VS Code',
        ru: 'VS Code',
        kz: 'VS Code',
      },
      {
        en: 'Git/GitHub',
        ru: 'Git/GitHub',
        kz: 'Git/GitHub',
      },
      {
        en: 'Docker',
        ru: 'Docker',
        kz: 'Docker',
      },
      {
        en: 'AWS/Azure',
        ru: 'AWS/Azure',
        kz: 'AWS/Azure',
      },
      {
        en: 'Jenkins',
        ru: 'Jenkins',
        kz: 'Jenkins',
      },
    ],
  },
};

export async function getProfessions(): Promise<Profession[]> {
  return mockProfessions;
}

export async function getProfession(id: string): Promise<Profession> {
  const profession = mockProfessions.find(p => p.id === id);
  if (!profession) throw new Error('Profession not found');
  return profession;
}

export async function getProfessionDetails(id: string): Promise<ProfessionDetails> {
  const details = mockProfessionDetails[id];
  if (!details) {
    // Return basic details if extended info not available
    const profession = mockProfessions.find(p => p.id === id);
    if (!profession) throw new Error('Profession not found');
    return {
      ...profession,
      overview: profession.description,
      keyResponsibilities: [],
      requiredSkills: [],
      workEnvironment: {
        en: '',
        ru: '',
        kz: '',
      },
      typicalTasks: [],
    };
  }
  return details;
}

export async function getMatchedProfessions(userId: string): Promise<ProfessionMatch[]> {
  return mockProfessionMatches;
}

export async function getProfessionLaborMarket(professionId: string): Promise<ProfessionLaborMarket> {
  return {
    professionId,
    demandLevel: 'high',
    jobGrowth: '+15%',
    annualOpenings: 50000,
    industrySectors: [
      {
        en: 'Technology',
        ru: 'Технологии',
        kz: 'Технология',
      },
      {
        en: 'Finance',
        ru: 'Финансы',
        kz: 'Қаржы',
      },
      {
        en: 'Healthcare',
        ru: 'Здравоохранение',
        kz: 'Денсаулық сақтау',
      },
      {
        en: 'E-commerce',
        ru: 'Электронная коммерция',
        kz: 'Электрондық сауда',
      },
    ],
    geographicHotspots: [
      {
        en: 'Almaty',
        ru: 'Алматы',
        kz: 'Алматы',
      },
      {
        en: 'Astana',
        ru: 'Астана',
        kz: 'Астана',
      },
      {
        en: 'Shymkent',
        ru: 'Шымкент',
        kz: 'Шымкент',
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export async function getProfessionSalary(professionId: string): Promise<ProfessionSalary> {
  return {
    professionId,
    currency: 'KZT',
    entryLevel: { min: 200000, max: 400000 },
    midCareer: { min: 400000, max: 800000 },
    seniorLevel: { min: 800000, max: 1500000 },
    updatedAt: new Date().toISOString(),
  };
}

export async function getProfessionEducation(professionId: string): Promise<ProfessionEducation> {
  return {
    professionId,
    minimumEducation: 'bachelor',
    preferredFields: [
      {
        en: 'Computer Science',
        ru: 'Информатика',
        kz: 'Информатика',
      },
      {
        en: 'Software Engineering',
        ru: 'Программная инженерия',
        kz: 'Бағдарламалық инженерия',
      },
      {
        en: 'Information Technology',
        ru: 'Информационные технологии',
        kz: 'Ақпараттық технологиялар',
      },
    ],
    recommendedCourses: {
      core: [
        {
          en: 'Introduction to Programming',
          ru: 'Введение в программирование',
          kz: 'Бағдарламалауға кіріспе',
        },
        {
          en: 'Data Structures and Algorithms',
          ru: 'Структуры данных и алгоритмы',
          kz: 'Деректер құрылымдары мен алгоритмдер',
        },
        {
          en: 'Database Systems',
          ru: 'Системы баз данных',
          kz: 'Деректер базасы жүйелері',
        },
        {
          en: 'Software Engineering',
          ru: 'Программная инженерия',
          kz: 'Бағдарламалық инженерия',
        },
      ],
      elective: [
        {
          en: 'Web Development',
          ru: 'Веб-разработка',
          kz: 'Веб-әзірлеу',
        },
        {
          en: 'Mobile Development',
          ru: 'Мобильная разработка',
          kz: 'Мобильді әзірлеу',
        },
        {
          en: 'Cloud Computing',
          ru: 'Облачные вычисления',
          kz: 'Бұлтты есептеулер',
        },
        {
          en: 'Machine Learning',
          ru: 'Машинное обучение',
          kz: 'Машиналық оқыту',
        },
      ],
    },
    certifications: [
      {
        en: 'AWS Certified Developer',
        ru: 'Сертифицированный разработчик AWS',
        kz: 'AWS сертификатталған әзірлеуші',
      },
      {
        en: 'Oracle Certified Professional',
        ru: 'Сертифицированный специалист Oracle',
        kz: 'Oracle сертификатталған маман',
      },
      {
        en: 'Google Cloud Certified',
        ru: 'Сертифицированный Google Cloud',
        kz: 'Google Cloud сертификатталған',
      },
    ],
    learningPaths: [
      {
        id: 'lp-1',
        title: {
          en: 'Entry Level Path',
          ru: 'Путь начального уровня',
          kz: 'Бастапқы деңгей жолы',
        },
        description: {
          en: 'For beginners starting their career',
          ru: 'Для новичков, начинающих свою карьеру',
          kz: 'Мансабын бастаушы жаңадан бастаушылар үшін',
        },
        duration: '2-4 years',
        steps: [
          {
            en: 'Complete relevant degree or bootcamp',
            ru: 'Завершите соответствующую степень или буткемп',
            kz: 'Тиісті дәрежені немесе буткемпті аяқтаңыз',
          },
          {
            en: 'Build portfolio projects',
            ru: 'Создайте портфолио проектов',
            kz: 'Портфолио жобаларын жасаңыз',
          },
          {
            en: 'Gain internship experience',
            ru: 'Получите опыт стажировки',
            kz: 'Тәжірибе алыңыз',
          },
          {
            en: 'Apply for junior positions',
            ru: 'Подайте заявку на младшие должности',
            kz: 'Кіші лауазымдарға өтініш беріңіз',
          },
        ],
      },
    ],
    colleges: [
      {
        name: 'Almaty College of Communication and Information Technologies',
        type: 'Technical College',
        duration: '2-3 years',
        specializations: [
          'Software Development',
          'Web Technologies',
          'Mobile Development',
          'Database Administration',
        ],
      },
      {
        name: 'Astana IT College',
        type: 'Vocational School',
        duration: '2 years',
        specializations: [
          'Frontend Development',
          'Backend Development',
          'Full Stack Development',
        ],
      },
      {
        name: 'Shymkent College of Digital Technologies',
        type: 'Technical College',
        duration: '3 years',
        specializations: [
          'Software Engineering',
          'Computer Networks',
          'Cybersecurity',
        ],
      },
    ],
    universities: [
      {
        name: 'Al-Farabi Kazakh National University',
        type: 'National University',
        entPoints: '110-125',
        scholarships: true,
        specializations: [
          'Computer Science',
          'Software Engineering',
          'Information Systems',
          'Data Science',
        ],
        subjects: ['Mathematics', 'Physics', 'English'],
      },
      {
        name: 'Nazarbayev University',
        type: 'Research University',
        entPoints: '120-140',
        scholarships: true,
        specializations: [
          'Computer Science',
          'Robotics',
          'Artificial Intelligence',
          'Data Science',
        ],
        subjects: ['Mathematics', 'Physics', 'English', 'Computer Science'],
      },
      {
        name: 'KBTU (Kazakh-British Technical University)',
        type: 'Technical University',
        entPoints: '105-120',
        scholarships: true,
        specializations: [
          'Software Engineering',
          'Information Systems',
          'Computer Engineering',
        ],
        subjects: ['Mathematics', 'Physics', 'English'],
      },
      {
        name: 'Satbayev University',
        type: 'Technical University',
        entPoints: '100-115',
        scholarships: true,
        specializations: [
          'Computer Science',
          'Software Engineering',
          'Information Security',
        ],
        subjects: ['Mathematics', 'Physics', 'English'],
      },
    ],
    specializations: [
      {
        name: {
          en: 'Computer Science',
          ru: 'Информатика',
          kz: 'Информатика',
        },
        code: 'B059',
        description: {
          en: 'Study of computation, algorithms, data structures, and software systems',
          ru: 'Изучение вычислений, алгоритмов, структур данных и программных систем',
          kz: 'Есептеулер, алгоритмдер, деректер құрылымдары және бағдарламалық жүйелерді зерттеу',
        },
        subjects: {
          en: 'Mathematics – Physics – Informatics',
          ru: 'Математика – Физика – Информатика',
          kz: 'Математика – Физика – Информатика',
        },
        groupName: {
          en: 'Information Technology',
          ru: 'Информационные технологии',
          kz: 'Ақпараттық технологиялар',
        },
        universities: [
          {
            name: 'Al-Farabi Kazakh National University',
            type: 'National University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 110, maxPoints: 125, grantCount: 50 },
              { year: 2024, grantType: 'general', minPoints: 115, maxPoints: 128, grantCount: 45 },
              { year: 2025, grantType: 'general', minPoints: 118, maxPoints: 130, grantCount: 40 },
              { year: 2023, grantType: 'aul', minPoints: 100, maxPoints: 115, grantCount: 20 },
              { year: 2024, grantType: 'aul', minPoints: 105, maxPoints: 118, grantCount: 18 },
              { year: 2025, grantType: 'aul', minPoints: 108, maxPoints: 120, grantCount: 15 },
            ],
          },
          {
            name: 'Nazarbayev University',
            type: 'Research University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 120, maxPoints: 140, grantCount: 30 },
              { year: 2024, grantType: 'general', minPoints: 125, maxPoints: 142, grantCount: 28 },
              { year: 2025, grantType: 'general', minPoints: 128, maxPoints: 145, grantCount: 25 },
            ],
          },
          {
            name: 'KBTU (Kazakh-British Technical University)',
            type: 'Technical University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 105, maxPoints: 120, grantCount: 40 },
              { year: 2024, grantType: 'general', minPoints: 110, maxPoints: 123, grantCount: 38 },
              { year: 2025, grantType: 'general', minPoints: 112, maxPoints: 125, grantCount: 35 },
              { year: 2023, grantType: 'aul', minPoints: 95, maxPoints: 110, grantCount: 15 },
              { year: 2024, grantType: 'aul', minPoints: 100, maxPoints: 113, grantCount: 12 },
              { year: 2025, grantType: 'aul', minPoints: 102, maxPoints: 115, grantCount: 10 },
            ],
          },
        ],
      },
      {
        name: {
          en: 'Software Engineering',
          ru: 'Программная инженерия',
          kz: 'Бағдарламалық инженерия',
        },
        code: 'B060',
        description: {
          en: 'Design, development, testing, and maintenance of software systems',
          ru: 'Проектирование, разработка, тестирование и обслуживание программных систем',
          kz: 'Бағдарламалық жүйелерді жобалау, әзірлеу, тестілеу және қолдау',
        },
        subjects: {
          en: 'Mathematics – Physics – Informatics',
          ru: 'Математика – Физика – Информатика',
          kz: 'Математика – Физика – Информатика',
        },
        groupName: {
          en: 'Information Technology',
          ru: 'Информационные технологии',
          kz: 'Ақпараттық технологиялар',
        },
        universities: [
          {
            name: 'Satbayev University',
            type: 'Technical University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 100, maxPoints: 115, grantCount: 35 },
              { year: 2024, grantType: 'general', minPoints: 105, maxPoints: 118, grantCount: 32 },
              { year: 2025, grantType: 'general', minPoints: 108, maxPoints: 120, grantCount: 30 },
              { year: 2023, grantType: 'aul', minPoints: 90, maxPoints: 105, grantCount: 12 },
              { year: 2024, grantType: 'aul', minPoints: 95, maxPoints: 108, grantCount: 10 },
              { year: 2025, grantType: 'aul', minPoints: 98, maxPoints: 110, grantCount: 8 },
            ],
          },
          {
            name: 'KBTU (Kazakh-British Technical University)',
            type: 'Technical University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 108, maxPoints: 122, grantCount: 38 },
              { year: 2024, grantType: 'general', minPoints: 112, maxPoints: 125, grantCount: 35 },
              { year: 2025, grantType: 'general', minPoints: 115, maxPoints: 128, grantCount: 32 },
            ],
          },
        ],
      },
      {
        name: {
          en: 'Information Systems',
          ru: 'Информационные системы',
          kz: 'Ақпараттық жүйелер',
        },
        code: 'B061',
        description: {
          en: 'Development and management of information systems for business and organizations',
          ru: 'Разработка и управление информационными системами для бизнеса и организаций',
          kz: 'Бизнес пен ұйымдар үшін ақпараттық жүйелерді әзірлеу және басқару',
        },
        subjects: {
          en: 'Mathematics – Informatics',
          ru: 'Математика – Информатика',
          kz: 'Математика – Информатика',
        },
        groupName: {
          en: 'Information Technology',
          ru: 'Информационные технологии',
          kz: 'Ақпараттық технологиялар',
        },
        universities: [
          {
            name: 'Al-Farabi Kazakh National University',
            type: 'National University',
            scholarships: true,
            untPoints: [
              { year: 2023, grantType: 'general', minPoints: 105, maxPoints: 120, grantCount: 42 },
              { year: 2024, grantType: 'general', minPoints: 110, maxPoints: 123, grantCount: 40 },
              { year: 2025, grantType: 'general', minPoints: 113, maxPoints: 125, grantCount: 38 },
            ],
          },
        ],
      },
    ],
    courses: [
      {
        name: 'The Complete Web Developer Bootcamp',
        platform: 'Udemy',
        duration: '65 hours',
        cost: '$14.99',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      },
      {
        name: 'CS50: Introduction to Computer Science',
        platform: 'Harvard / edX',
        duration: '12 weeks',
        cost: 'Free (Certificate $90)',
        skills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures'],
      },
      {
        name: 'Full Stack Open',
        platform: 'University of Helsinki',
        duration: '200 hours',
        cost: 'Free',
        skills: ['React', 'Redux', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'],
      },
      {
        name: 'Python for Everybody',
        platform: 'Coursera / University of Michigan',
        duration: '8 months',
        cost: 'Free (Certificate $49/month)',
        skills: ['Python', 'SQL', 'Web Scraping', 'Data Analysis'],
      },
      {
        name: 'Meta Front-End Developer',
        platform: 'Coursera / Meta',
        duration: '7 months',
        cost: '$49/month',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX', 'Git'],
      },
    ],
  };
}

export async function getProfessionArchetypes(professionId: string): Promise<ProfessionArchetypes> {
  return {
    professionId,
    riasecCodes: ['I', 'R', 'C'],
    primaryArchetypes: {
      interests: ['investigative', 'realistic'],
      skills: ['technical', 'analytical'],
      personality: ['introverted', 'thinking'],
      values: ['achievement', 'independence'],
    },
    archetypeScores: {
      interests: {
        realistic: 75,
        investigative: 95,
        artistic: 45,
        social: 35,
        enterprising: 50,
        conventional: 65,
      },
      skills: {
        technical: 95,
        analytical: 90,
        creative: 60,
        interpersonal: 40,
      },
      personality: {
        openness: 85,
        conscientiousness: 80,
        extraversion: 35,
        agreeableness: 50,
        neuroticism: 40,
      },
      values: {
        achievement: 90,
        independence: 85,
        recognition: 70,
        relationships: 40,
        support: 50,
        workingConditions: 75,
      },
    },
  };
}

export async function likeProfession(professionId: string, isLiked: boolean): Promise<void> {
  const match = mockProfessionMatches.find(p => p.id === professionId);
  if (match) {
    match.isLiked = isLiked;
  }
}
