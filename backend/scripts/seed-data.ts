import axios from 'axios';
import { PrismaClient, OrganizationType, QuestionType } from '@prisma/client';

const API_URL = 'http://localhost:4000';
const prisma = new PrismaClient();

// Axios instance with error handling
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Color codes for console output
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

// Store created IDs
const createdIds = {
  regions: [] as string[],
  users: [] as string[],
  categories: [] as string[],
  professions: [] as string[],
  archetypeTypes: [] as string[],
  archetypes: [] as string[],
  quizzes: [] as string[],
  organizations: [] as string[],
  licenseClasses: [] as string[],
  licenses: [] as string[],
  specs: [] as string[],
  universities: [] as string[],
  questions: [] as string[],
  testScoreTypes: [] as string[],
};

async function createRegions() {
  log('\n📍 Creating Regions (via Prisma)...', colors.cyan);

  const regions = [
    {
      name: {
        en: 'Almaty Region',
        ru: 'Алматинская область',
        kk: 'Алматы облысы',
      },
    },
    {
      name: {
        en: 'Astana City',
        ru: 'Город Астана',
        kk: 'Астана қаласы',
      },
    },
    {
      name: {
        en: 'Almaty City',
        ru: 'Город Алматы',
        kk: 'Алматы қаласы',
      },
    },
  ];

  for (const region of regions) {
    try {
      const created = await prisma.region.create({ data: region });
      createdIds.regions.push(created.id);
      log(`✓ Created region: ${region.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create region: ${error.message}`, colors.red);
    }
  }
}

async function createUsers() {
  log('\n👥 Creating Users...', colors.cyan);

  const users = [
    {
      name: 'Айдар',
      surname: 'Нұрсултанов',
      email: 'aidar.nursultanov@example.kz',
      grade: '11',
      age: 17,
    },
    {
      name: 'Мария',
      surname: 'Петрова',
      email: 'maria.petrova@example.ru',
      grade: '10',
      age: 16,
    },
    {
      name: 'Данияр',
      surname: 'Қасымов',
      email: 'daniyar.kassymov@example.kz',
      grade: '11',
      age: 17,
    },
    {
      name: 'Sarah',
      surname: 'Johnson',
      email: 'sarah.johnson@example.com',
      grade: '12',
      age: 18,
    },
    {
      name: 'Анна',
      surname: 'Иванова',
      email: 'anna.ivanova@example.ru',
      grade: '9',
      age: 15,
    },
  ];

  for (const user of users) {
    try {
      const response = await api.post('/users', user);
      createdIds.users.push(response.data.id);
      log(`✓ Created user: ${user.name} ${user.surname}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create user: ${error.message}`, colors.red);
    }
  }
}

async function createCategories() {
  log('\n📁 Creating Categories (via Prisma)...', colors.cyan);

  const categories = [
    {
      name: {
        en: 'Technology & IT',
        ru: 'Технологии и ИТ',
        kk: 'Технология және IT',
      },
      description: {
        en: 'Careers in technology, software, and information systems',
        ru: 'Карьера в технологиях, программном обеспечении и информационных системах',
        kk: 'Технология, бағдарламалық қамтамасыз ету және ақпараттық жүйелердегі мансап',
      },
    },
    {
      name: {
        en: 'Healthcare & Medicine',
        ru: 'Здравоохранение и Медицина',
        kk: 'Денсаулық сақтау және Медицина',
      },
      description: {
        en: 'Medical professions and healthcare services',
        ru: 'Медицинские профессии и услуги здравоохранения',
        kk: 'Медициналық мамандықтар және денсаулық сақтау қызметтері',
      },
    },
    {
      name: {
        en: 'Business & Finance',
        ru: 'Бизнес и Финансы',
        kk: 'Бизнес және Қаржы',
      },
      description: {
        en: 'Business management, finance, and economics',
        ru: 'Управление бизнесом, финансы и экономика',
        kk: 'Бизнесті басқару, қаржы және экономика',
      },
    },
    {
      name: {
        en: 'Arts & Design',
        ru: 'Искусство и Дизайн',
        kk: 'Өнер және Дизайн',
      },
      description: {
        en: 'Creative professions in arts, design, and media',
        ru: 'Творческие профессии в искусстве, дизайне и медиа',
        kk: 'Өнер, дизайн және медиадағы шығармашылық мамандықтар',
      },
    },
    {
      name: {
        en: 'Education & Teaching',
        ru: 'Образование и Преподавание',
        kk: 'Білім және Оқыту',
      },
      description: {
        en: 'Teaching and educational services',
        ru: 'Преподавание и образовательные услуги',
        kk: 'Оқыту және білім беру қызметтері',
      },
    },
  ];

  for (const category of categories) {
    try {
      const created = await prisma.category.create({ data: category });
      createdIds.categories.push(created.id);
      log(`✓ Created category: ${category.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create category: ${error.message}`, colors.red);
    }
  }
}

async function createProfessions() {
  log('\n💼 Creating Professions...', colors.cyan);

  const professions = [
    {
      name: {
        en: 'Software Engineer',
        ru: 'Инженер-программист',
        kk: 'Бағдарламалық инженер',
      },
      description: {
        en: 'Designs, develops, and maintains software applications and systems',
        ru: 'Проектирует, разрабатывает и поддерживает программные приложения и системы',
        kk: 'Бағдарламалық қосымшалар мен жүйелерді жобалайды, әзірлейді және қолдайды',
      },
      code: 'SE001',
      categoryId: createdIds.categories[0],
      featured: true,
    },
    {
      name: {
        en: 'Data Scientist',
        ru: 'Специалист по данным',
        kk: 'Деректер маманы',
      },
      description: {
        en: 'Analyzes complex data to help organizations make better decisions',
        ru: 'Анализирует сложные данные для помощи организациям в принятии решений',
        kk: 'Ұйымдарға жақсы шешімдер қабылдауға көмектесу үшін күрделі деректерді талдайды',
      },
      code: 'DS001',
      categoryId: createdIds.categories[0],
      featured: true,
    },
    {
      name: {
        en: 'Medical Doctor',
        ru: 'Врач',
        kk: 'Дәрігер',
      },
      description: {
        en: 'Diagnoses and treats illnesses and injuries',
        ru: 'Диагностирует и лечит заболевания и травмы',
        kk: 'Аурулар мен жарақаттарды диагностикалайды және емдейді',
      },
      code: 'MD001',
      categoryId: createdIds.categories[1],
      featured: true,
    },
    {
      name: {
        en: 'Financial Analyst',
        ru: 'Финансовый аналитик',
        kk: 'Қаржылық талдаушы',
      },
      description: {
        en: 'Analyzes financial data and provides investment recommendations',
        ru: 'Анализирует финансовые данные и предоставляет инвестиционные рекомендации',
        kk: 'Қаржылық деректерді талдайды және инвестициялық ұсыныстар береді',
      },
      code: 'FA001',
      categoryId: createdIds.categories[2],
      featured: false,
    },
    {
      name: {
        en: 'Graphic Designer',
        ru: 'Графический дизайнер',
        kk: 'Графикалық дизайнер',
      },
      description: {
        en: 'Creates visual concepts to communicate ideas that inspire and inform',
        ru: 'Создает визуальные концепции для передачи идей, которые вдохновляют и информируют',
        kk: 'Шабыттандыратын және хабарлайтын идеяларды жеткізу үшін визуалды тұжырымдамалар жасайды',
      },
      code: 'GD001',
      categoryId: createdIds.categories[3],
      featured: false,
    },
    {
      name: {
        en: 'High School Teacher',
        ru: 'Учитель средней школы',
        kk: 'Орта мектеп мұғалімі',
      },
      description: {
        en: 'Educates students in various subjects at the secondary level',
        ru: 'Обучает студентов различным предметам на среднем уровне',
        kk: 'Орта деңгейде әртүрлі пәндер бойынша оқушыларды оқытады',
      },
      code: 'TE001',
      categoryId: createdIds.categories[4],
      featured: false,
    },
  ];

  for (const profession of professions) {
    try {
      const response = await api.post('/professions', profession);
      createdIds.professions.push(response.data.id);
      log(`✓ Created profession: ${profession.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create profession: ${error.message}`, colors.red);
    }
  }
}

async function createArchetypeTypes() {
  log('\n🎭 Creating Archetype Types (via Prisma)...', colors.cyan);

  const archetypeTypes = [
    {
      name: {
        en: 'Holland RIASEC',
        ru: 'RIASEC Холланда',
        kk: 'Холланд RIASEC',
      },
      description: {
        en: 'Holland Occupational Themes: Realistic, Investigative, Artistic, Social, Enterprising, Conventional',
        ru: 'Профессиональные темы Холланда: Реалистичный, Исследовательский, Артистичный, Социальный, Предприимчивый, Конвенциональный',
        kk: 'Холланд кәсіптік тақырыптары: Шынайы, Зерттеушілік, Көркемдік, Әлеуметтік, Кәсіпкерлік, Дәстүрлі',
      },
    },
    {
      name: {
        en: 'Big Five Personality',
        ru: 'Большая пятерка личности',
        kk: 'Тұлғаның Үлкен Бесі',
      },
      description: {
        en: 'Five major personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism',
        ru: 'Пять основных черт личности: Открытость, Добросовестность, Экстраверсия, Доброжелательность, Нейротизм',
        kk: 'Бес негізгі тұлғалық қасиеттер: Ашықтық, Ұқыптылық, Экстраверсия, Ұйымшылдық, Невротизм',
      },
    },
  ];

  for (const type of archetypeTypes) {
    try {
      const created = await prisma.archetypeType.create({ data: type });
      createdIds.archetypeTypes.push(created.id);
      log(`✓ Created archetype type: ${type.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create archetype type: ${error.message}`, colors.red);
    }
  }
}

async function createArchetypes() {
  log('\n🎪 Creating Archetypes...', colors.cyan);

  const archetypes = [
    {
      name: {
        en: 'The Investigator',
        ru: 'Исследователь',
        kk: 'Зерттеуші',
      },
      archetypeTypeId: createdIds.archetypeTypes[0],
      description: {
        en: 'Analytical, intellectual, and methodical. Enjoys solving complex problems.',
        ru: 'Аналитичный, интеллектуальный и методичный. Любит решать сложные задачи.',
        kk: 'Талдамалы, интеллектуалды және әдіснамалық. Күрделі міндеттерді шешуді ұнатады.',
      },
    },
    {
      name: {
        en: 'The Creator',
        ru: 'Творец',
        kk: 'Жаратушы',
      },
      archetypeTypeId: createdIds.archetypeTypes[0],
      description: {
        en: 'Imaginative, expressive, and original. Values creativity and innovation.',
        ru: 'Творческий, выразительный и оригинальный. Ценит креативность и инновации.',
        kk: 'Қиялшыл, көрнекті және түпнұсқалық. Шығармашылық пен инновацияны бағалайды.',
      },
    },
    {
      name: {
        en: 'The Helper',
        ru: 'Помощник',
        kk: 'Көмекші',
      },
      archetypeTypeId: createdIds.archetypeTypes[0],
      description: {
        en: 'Empathetic, supportive, and cooperative. Enjoys helping others.',
        ru: 'Эмпатичный, поддерживающий и кооперативный. Любит помогать другим.',
        kk: 'Эмпатиялық, қолдаушы және ынтымақтастық. Басқаларға көмектесуді ұнатады.',
      },
    },
    {
      name: {
        en: 'The Achiever',
        ru: 'Достигатор',
        kk: 'Жетістікке жетуші',
      },
      archetypeTypeId: createdIds.archetypeTypes[1],
      description: {
        en: 'Ambitious, organized, and goal-oriented. Strives for success.',
        ru: 'Амбициозный, организованный и целеустремленный. Стремится к успеху.',
        kk: 'Биік мақсатты, ұйымдасқан және мақсатқа бағытталған. Табысқа ұмтылады.',
      },
    },
    {
      name: {
        en: 'The Adventurer',
        ru: 'Искатель приключений',
        kk: 'Шытырман іздеуші',
      },
      archetypeTypeId: createdIds.archetypeTypes[1],
      description: {
        en: 'Spontaneous, flexible, and experiences-seeking. Loves new challenges.',
        ru: 'Спонтанный, гибкий и ищущий опыта. Любит новые вызовы.',
        kk: 'Кенеттен, икемді және тәжірибе іздейтін. Жаңа сын-тегеуріндерді жақсы көреді.',
      },
    },
  ];

  for (const archetype of archetypes) {
    try {
      const response = await api.post('/archetypes', archetype);
      createdIds.archetypes.push(response.data.id);
      log(`✓ Created archetype: ${archetype.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create archetype: ${error.message}`, colors.red);
    }
  }
}

async function createQuizzes() {
  log('\n📝 Creating Quizzes...', colors.cyan);

  const quizzes = [
    {
      quizName: {
        en: 'Career Personality Assessment',
        ru: 'Оценка карьерной личности',
        kk: 'Мансап тұлғасын бағалау',
      },
      quizType: 'PERSONALITY',
      isFree: true,
      description: {
        en: 'Discover your career personality type based on Holland RIASEC model',
        ru: 'Откройте свой тип карьерной личности на основе модели RIASEC Холланда',
        kk: 'Холланд RIASEC үлгісі негізінде мансап тұлғасының түрін табыңыз',
      },
    },
    {
      quizName: {
        en: 'Aptitude Test for IT Careers',
        ru: 'Тест способностей для IT карьеры',
        kk: 'IT мансаптарға қабілеттілік тесті',
      },
      quizType: 'APTITUDE',
      isFree: false,
      description: {
        en: 'Assess your aptitude for various IT and technology careers',
        ru: 'Оцените свои способности к различным IT и технологическим карьерам',
        kk: 'Әртүрлі IT және технологиялық мансаптарға қабілеттіліктеріңізді бағалаңыз',
      },
    },
    {
      quizName: {
        en: 'Medical Career Knowledge Quiz',
        ru: 'Квиз знаний медицинской карьеры',
        kk: 'Медициналық мансап білімі сұрақтары',
      },
      quizType: 'KNOWLEDGE',
      isFree: true,
      description: {
        en: 'Test your knowledge about medical professions and healthcare',
        ru: 'Проверьте свои знания о медицинских профессиях и здравоохранении',
        kk: 'Медициналық мамандықтар мен денсаулық сақтау туралы білімдеріңізді тексеріңіз',
      },
    },
    {
      quizName: {
        en: 'Business Career Navigator',
        ru: 'Навигатор бизнес-карьеры',
        kk: 'Бизнес мансап навигаторы',
      },
      quizType: 'CAREER',
      isFree: false,
      description: {
        en: 'Find the best business career path based on your skills and interests',
        ru: 'Найдите лучший путь бизнес-карьеры на основе ваших навыков и интересов',
        kk: 'Дағдылар мен қызығушылықтар негізінде ең жақсы бизнес мансап жолын табыңыз',
      },
    },
  ];

  for (const quiz of quizzes) {
    try {
      const response = await api.post('/quizzes', quiz);
      createdIds.quizzes.push(response.data.id);
      log(`✓ Created quiz: ${quiz.quizName.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create quiz: ${error.message}`, colors.red);
    }
  }
}

async function createOrganizations() {
  log('\n🏢 Creating Organizations (via Prisma)...', colors.cyan);

  const organizations = [
    {
      name: 'Nazarbayev Intellectual School of Almaty',
      regionId: createdIds.regions[2], // Almaty City
      type: OrganizationType.SCHOOL,
    },
    {
      name: 'BIL School Astana',
      regionId: createdIds.regions[1], // Astana City
      type: OrganizationType.SCHOOL,
    },
    {
      name: 'Al-Farabi Kazakh National University',
      regionId: createdIds.regions[2], // Almaty City
      type: OrganizationType.UNIVERSITY,
    },
    {
      name: 'KIMEP University',
      regionId: createdIds.regions[2], // Almaty City
      type: OrganizationType.UNIVERSITY,
    },
    {
      name: 'Astana IT College',
      regionId: createdIds.regions[1], // Astana City
      type: OrganizationType.COLLEGE,
    },
  ];

  for (const org of organizations) {
    try {
      const created = await prisma.organization.create({ data: org });
      createdIds.organizations.push(created.id);
      log(`✓ Created organization: ${org.name}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create organization: ${error.message}`, colors.red);
    }
  }
}

async function createLicenseClasses() {
  log('\n🎫 Creating License Classes (via Prisma)...', colors.cyan);

  const licenseClasses = [
    { name: 'Premium School License' },
    { name: 'Standard School License' },
    { name: 'University Research License' },
    { name: 'College Basic License' },
  ];

  for (const licenseClass of licenseClasses) {
    try {
      const created = await prisma.licenseClass.create({ data: licenseClass });
      createdIds.licenseClasses.push(created.id);
      log(`✓ Created license class: ${licenseClass.name}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create license class: ${error.message}`, colors.red);
    }
  }
}

async function createLicenses() {
  log('\n📜 Creating Licenses (via Prisma)...', colors.cyan);

  const licenses = [
    {
      name: 'NIS Almaty Premium License',
      licenseCode: 'LIC-NIS-ALM-001',
      startDate: new Date('2025-01-01'),
      expireDate: new Date('2025-12-31'),
      licenseClassId: createdIds.licenseClasses[0],
      organizationId: createdIds.organizations[0],
    },
    {
      name: 'BIL Astana Standard License',
      licenseCode: 'LIC-BIL-AST-001',
      startDate: new Date('2025-01-01'),
      expireDate: new Date('2025-06-30'),
      licenseClassId: createdIds.licenseClasses[1],
      organizationId: createdIds.organizations[1],
    },
    {
      name: 'KazNU Research License',
      licenseCode: 'LIC-KAZNU-ALM-001',
      startDate: new Date('2025-01-01'),
      expireDate: new Date('2026-12-31'),
      licenseClassId: createdIds.licenseClasses[2],
      organizationId: createdIds.organizations[2],
    },
  ];

  for (const license of licenses) {
    try {
      const created = await prisma.license.create({ data: license });
      createdIds.licenses.push(created.id);
      log(`✓ Created license: ${license.name}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create license: ${error.message}`, colors.red);
    }
  }
}

async function createQuestions() {
  log('\n❓ Creating Questions (via Prisma)...', colors.cyan);

  const questions = [
    // Questions for Career Personality Assessment
    {
      quizId: createdIds.quizzes[0],
      questionType: QuestionType.SCALE,
      questionText: {
        en: 'I enjoy working with tools and machinery',
        ru: 'Мне нравится работать с инструментами и механизмами',
        kk: 'Маған құралдар мен механизмдермен жұмыс істеу ұнайды',
      },
      answers: {
        scale: { min: 1, max: 5, labels: { en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], ru: ['Категорически не согласен', 'Не согласен', 'Нейтрально', 'Согласен', 'Полностью согласен'], kk: ['Қатаң келіспеймін', 'Келіспеймін', 'Бейтарап', 'Келісемін', 'Толық келісемін'] } },
      },
      parameters: { archetype: 'realistic', weight: 1 },
    },
    {
      quizId: createdIds.quizzes[0],
      questionType: QuestionType.SCALE,
      questionText: {
        en: 'I prefer working with data and solving complex problems',
        ru: 'Я предпочитаю работать с данными и решать сложные задачи',
        kk: 'Мен деректермен жұмыс істеуді және күрделі міндеттерді шешуді ұнатамын',
      },
      answers: {
        scale: { min: 1, max: 5, labels: { en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], ru: ['Категорически не согласен', 'Не согласен', 'Нейтрально', 'Согласен', 'Полностью согласен'], kk: ['Қатаң келіспеймін', 'Келіспеймін', 'Бейтарап', 'Келісемін', 'Толық келісемін'] } },
      },
      parameters: { archetype: 'investigative', weight: 1 },
    },
    {
      quizId: createdIds.quizzes[0],
      questionType: QuestionType.SCALE,
      questionText: {
        en: 'I express myself through creative activities',
        ru: 'Я выражаю себя через творческую деятельность',
        kk: 'Мен өзімді шығармашылық іс-әрекет арқылы көрсетемін',
      },
      answers: {
        scale: { min: 1, max: 5, labels: { en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], ru: ['Категорически не согласен', 'Не согласен', 'Нейтрально', 'Согласен', 'Полностью согласен'], kk: ['Қатаң келіспеймін', 'Келіспеймін', 'Бейтарап', 'Келісемін', 'Толық келісемін'] } },
      },
      parameters: { archetype: 'artistic', weight: 1 },
    },
    // Questions for IT Aptitude Test
    {
      quizId: createdIds.quizzes[1],
      questionType: QuestionType.MULTIPLE_CHOICE,
      questionText: {
        en: 'What is the time complexity of binary search?',
        ru: 'Какова временная сложность бинарного поиска?',
        kk: 'Екілік іздеудің уақыттық күрделілігі қандай?',
      },
      answers: {
        options: [
          { id: 'a', text: { en: 'O(n)', ru: 'O(n)', kk: 'O(n)' }, isCorrect: false },
          { id: 'b', text: { en: 'O(log n)', ru: 'O(log n)', kk: 'O(log n)' }, isCorrect: true },
          { id: 'c', text: { en: 'O(n²)', ru: 'O(n²)', kk: 'O(n²)' }, isCorrect: false },
          { id: 'd', text: { en: 'O(1)', ru: 'O(1)', kk: 'O(1)' }, isCorrect: false },
        ],
      },
      parameters: { topic: 'algorithms', difficulty: 'medium' },
    },
    {
      quizId: createdIds.quizzes[1],
      questionType: QuestionType.MULTIPLE_CHOICE,
      questionText: {
        en: 'Which programming paradigm focuses on immutability?',
        ru: 'Какая парадигма программирования фокусируется на неизменности?',
        kk: 'Қай бағдарламалау парадигмасы өзгермейтіндікке назар аударады?',
      },
      answers: {
        options: [
          { id: 'a', text: { en: 'Object-Oriented', ru: 'Объектно-ориентированное', kk: 'Объектіге бағытталған' }, isCorrect: false },
          { id: 'b', text: { en: 'Functional', ru: 'Функциональное', kk: 'Функционалдық' }, isCorrect: true },
          { id: 'c', text: { en: 'Procedural', ru: 'Процедурное', kk: 'Процедуралық' }, isCorrect: false },
          { id: 'd', text: { en: 'Logic', ru: 'Логическое', kk: 'Логикалық' }, isCorrect: false },
        ],
      },
      parameters: { topic: 'programming_paradigms', difficulty: 'easy' },
    },
    // Questions for Medical Knowledge Quiz
    {
      quizId: createdIds.quizzes[2],
      questionType: QuestionType.TRUE_FALSE,
      questionText: {
        en: 'The human heart has four chambers',
        ru: 'Человеческое сердце имеет четыре камеры',
        kk: 'Адам жүрегінде төрт камера бар',
      },
      answers: {
        correctAnswer: true,
      },
      parameters: { topic: 'anatomy', difficulty: 'easy' },
    },
  ];

  for (const question of questions) {
    try {
      const created = await prisma.question.create({ data: question });
      createdIds.questions.push(created.id);
      log(`✓ Created question for quiz`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create question: ${error.message}`, colors.red);
    }
  }
}

async function createSpecs() {
  log('\n📚 Creating Specs (via Prisma)...', colors.cyan);

  const specs = [
    {
      name: {
        en: 'Computer Science',
        ru: 'Компьютерные науки',
        kk: 'Компьютерлік ғылымдар',
      },
      code: 'SPEC-CS-001',
      description: {
        en: 'Study of computation, algorithms, and information processing',
        ru: 'Изучение вычислений, алгоритмов и обработки информации',
        kk: 'Есептеулерді, алгоритмдерді және ақпаратты өңдеуді зерттеу',
      },
      subjects: {
        en: ['Mathematics', 'Physics', 'Informatics'],
        ru: ['Математика', 'Физика', 'Информатика'],
        kk: ['Математика', 'Физика', 'Информатика'],
      },
      groupName: {
        en: 'Engineering and Technology',
        ru: 'Инженерия и технологии',
        kk: 'Инженерия және технологиялар',
      },
    },
    {
      name: {
        en: 'General Medicine',
        ru: 'Общая медицина',
        kk: 'Жалпы медицина',
      },
      code: 'SPEC-MED-001',
      description: {
        en: 'Comprehensive medical education for future doctors',
        ru: 'Комплексное медицинское образование для будущих врачей',
        kk: 'Болашақ дәрігерлерге арналған кешенді медициналық білім',
      },
      subjects: {
        en: ['Biology', 'Chemistry', 'Physics'],
        ru: ['Биология', 'Химия', 'Физика'],
        kk: ['Биология', 'Химия', 'Физика'],
      },
      groupName: {
        en: 'Healthcare',
        ru: 'Здравоохранение',
        kk: 'Денсаулық сақтау',
      },
    },
    {
      name: {
        en: 'Finance',
        ru: 'Финансы',
        kk: 'Қаржы',
      },
      code: 'SPEC-FIN-001',
      description: {
        en: 'Study of financial systems, markets, and investment',
        ru: 'Изучение финансовых систем, рынков и инвестиций',
        kk: 'Қаржы жүйелерін, нарықтарды және инвестицияларды зерттеу',
      },
      subjects: {
        en: ['Mathematics', 'Economics', 'History'],
        ru: ['Математика', 'Экономика', 'История'],
        kk: ['Математика', 'Экономика', 'Тарих'],
      },
      groupName: {
        en: 'Business and Economics',
        ru: 'Бизнес и экономика',
        kk: 'Бизнес және экономика',
      },
    },
    {
      name: {
        en: 'Graphic Design',
        ru: 'Графический дизайн',
        kk: 'Графикалық дизайн',
      },
      code: 'SPEC-GD-001',
      description: {
        en: 'Visual communication through graphic design principles',
        ru: 'Визуальная коммуникация через принципы графического дизайна',
        kk: 'Графикалық дизайн қағидалары арқылы визуалды қарым-қатынас',
      },
      subjects: {
        en: ['Creative Exam', 'Drawing', 'History'],
        ru: ['Творческий экзамен', 'Рисунок', 'История'],
        kk: ['Шығармашылық емтихан', 'Сурет салу', 'Тарих'],
      },
      groupName: {
        en: 'Arts and Design',
        ru: 'Искусство и дизайн',
        kk: 'Өнер және дизайн',
      },
    },
  ];

  for (const spec of specs) {
    try {
      const created = await prisma.spec.create({ data: spec });
      createdIds.specs.push(created.id);
      log(`✓ Created spec: ${spec.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create spec: ${error.message}`, colors.red);
    }
  }
}

async function createUniversities() {
  log('\n🎓 Creating Universities (via Prisma)...', colors.cyan);

  const universities = [
    {
      name: {
        en: 'Al-Farabi Kazakh National University',
        ru: 'Казахский национальный университет имени аль-Фараби',
        kk: 'Әл-Фараби атындағы Қазақ ұлттық университеті',
      },
      code: 'UNI-KAZNU-001',
      description: {
        en: 'Leading national university in Kazakhstan',
        ru: 'Ведущий национальный университет Казахстана',
        kk: 'Қазақстандағы жетекші ұлттық университет',
      },
    },
    {
      name: {
        en: 'KIMEP University',
        ru: 'Университет КИМЭП',
        kk: 'КИМЭП университеті',
      },
      code: 'UNI-KIMEP-001',
      description: {
        en: 'Kazakhstan Institute of Management, Economics and Strategic Research',
        ru: 'Казахстанский институт менеджмента, экономики и стратегических исследований',
        kk: 'Қазақстан менеджмент, экономика және стратегиялық зерттеулер институты',
      },
    },
    {
      name: {
        en: 'Nazarbayev University',
        ru: 'Назарбаев Университет',
        kk: 'Назарбаев Университеті',
      },
      code: 'UNI-NU-001',
      description: {
        en: 'Autonomous research university in Astana',
        ru: 'Автономный исследовательский университет в Астане',
        kk: 'Астанадағы автономды зерттеу университеті',
      },
    },
  ];

  for (const university of universities) {
    try {
      const created = await prisma.university.create({ data: university });
      createdIds.universities.push(created.id);
      log(`✓ Created university: ${university.name.en}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create university: ${error.message}`, colors.red);
    }
  }
}

async function createTestScoreTypes() {
  log('\n📊 Creating Test Score Types (via Prisma)...', colors.cyan);

  const testScoreTypes = [
    {
      name: 'UNT (Unified National Testing)',
      parameters: {
        subjects: ['Mathematics', 'Reading Literacy', 'History of Kazakhstan'],
        maxScore: 140,
      },
    },
    {
      name: 'Creative Exam',
      parameters: {
        subjects: ['Drawing', 'Composition', 'Portfolio Review'],
        maxScore: 100,
      },
    },
  ];

  for (const type of testScoreTypes) {
    try {
      const created = await prisma.testScoreType.create({ data: type });
      createdIds.testScoreTypes.push(created.id);
      log(`✓ Created test score type: ${type.name}`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create test score type: ${error.message}`, colors.red);
    }
  }
}

async function createRelationships() {
  log('\n🔗 Creating Relationship Data (via Prisma)...', colors.cyan);

  // SpecUniversities
  const specUniversities = [
    { specId: createdIds.specs[0], universityId: createdIds.universities[0], isEnglish: false },
    { specId: createdIds.specs[0], universityId: createdIds.universities[2], isEnglish: true },
    { specId: createdIds.specs[1], universityId: createdIds.universities[0], isEnglish: false },
    { specId: createdIds.specs[2], universityId: createdIds.universities[1], isEnglish: true },
    { specId: createdIds.specs[3], universityId: createdIds.universities[0], isEnglish: false },
  ];

  const specUniversityIds: string[] = [];
  for (const su of specUniversities) {
    try {
      const created = await prisma.specUniversity.create({ data: su });
      specUniversityIds.push(created.id);
      log(`✓ Linked spec to university`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to link spec to university: ${error.message}`, colors.red);
    }
  }

  // ProfessionSpecs
  const professionSpecs = [
    { professionId: createdIds.professions[0], specId: createdIds.specs[0] }, // Software Engineer -> CS
    { professionId: createdIds.professions[1], specId: createdIds.specs[0] }, // Data Scientist -> CS
    { professionId: createdIds.professions[2], specId: createdIds.specs[1] }, // Medical Doctor -> General Medicine
    { professionId: createdIds.professions[3], specId: createdIds.specs[2] }, // Financial Analyst -> Finance
    { professionId: createdIds.professions[4], specId: createdIds.specs[3] }, // Graphic Designer -> Graphic Design
  ];

  for (const ps of professionSpecs) {
    try {
      await prisma.professionSpec.create({ data: ps });
      log(`✓ Linked profession to spec`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to link profession to spec: ${error.message}`, colors.red);
    }
  }

  // ProfessionArchetypes
  const professionArchetypes = [
    { professionId: createdIds.professions[0], archetypeId: createdIds.archetypes[0], score: 85 }, // Software Engineer -> Investigator
    { professionId: createdIds.professions[0], archetypeId: createdIds.archetypes[1], score: 60 }, // Software Engineer -> Creator
    { professionId: createdIds.professions[1], archetypeId: createdIds.archetypes[0], score: 90 }, // Data Scientist -> Investigator
    { professionId: createdIds.professions[2], archetypeId: createdIds.archetypes[2], score: 80 }, // Medical Doctor -> Helper
    { professionId: createdIds.professions[3], archetypeId: createdIds.archetypes[3], score: 75 }, // Financial Analyst -> Achiever
    { professionId: createdIds.professions[4], archetypeId: createdIds.archetypes[1], score: 95 }, // Graphic Designer -> Creator
  ];

  for (const pa of professionArchetypes) {
    try {
      await prisma.professionArchetype.create({ data: pa });
      log(`✓ Linked profession to archetype with score`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to link profession to archetype: ${error.message}`, colors.red);
    }
  }

  // TestScores
  const testScores = [
    {
      year: 2025,
      specUniversityId: specUniversityIds[0],
      minPoints: 110,
      maxPoints: 140,
      grantCounts: 50,
      typeId: createdIds.testScoreTypes[0],
    },
    {
      year: 2025,
      specUniversityId: specUniversityIds[1],
      minPoints: 120,
      maxPoints: 140,
      grantCounts: 30,
      typeId: createdIds.testScoreTypes[0],
    },
    {
      year: 2025,
      specUniversityId: specUniversityIds[2],
      minPoints: 115,
      maxPoints: 140,
      grantCounts: 40,
      typeId: createdIds.testScoreTypes[0],
    },
  ];

  for (const ts of testScores) {
    try {
      await prisma.testScore.create({ data: ts });
      log(`✓ Created test score entry`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create test score: ${error.message}`, colors.red);
    }
  }

  // LicenseClassQuiz
  const licenseClassQuizzes = [
    { licenseClassId: createdIds.licenseClasses[0], quizId: createdIds.quizzes[0] },
    { licenseClassId: createdIds.licenseClasses[0], quizId: createdIds.quizzes[1] },
    { licenseClassId: createdIds.licenseClasses[1], quizId: createdIds.quizzes[0] },
  ];

  for (const lcq of licenseClassQuizzes) {
    try {
      await prisma.licenseClassQuiz.create({ data: lcq });
      log(`✓ Linked license class to quiz`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to link license class to quiz: ${error.message}`, colors.red);
    }
  }
}

async function createUserInteractions() {
  log('\n👤 Creating User Interaction Data (via Prisma)...', colors.cyan);

  // UserLicenses
  const userLicenses = [
    { userId: createdIds.users[0], licenseId: createdIds.licenses[0] },
    { userId: createdIds.users[1], licenseId: createdIds.licenses[1] },
    { userId: createdIds.users[2], licenseId: createdIds.licenses[0] },
  ];

  for (const ul of userLicenses) {
    try {
      await prisma.userLicense.create({ data: ul });
      log(`✓ Assigned license to user`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to assign license: ${error.message}`, colors.red);
    }
  }

  // Results
  const results = [
    {
      userId: createdIds.users[0],
      quizId: createdIds.quizzes[0],
      answers: { q1: 4, q2: 5, q3: 3 },
      results: {
        archetypes: {
          investigative: 85,
          artistic: 60,
          realistic: 45,
        },
        topArchetype: 'investigative',
      },
    },
    {
      userId: createdIds.users[1],
      quizId: createdIds.quizzes[0],
      answers: { q1: 3, q2: 2, q3: 5 },
      results: {
        archetypes: {
          artistic: 90,
          social: 75,
          investigative: 50,
        },
        topArchetype: 'artistic',
      },
    },
  ];

  for (const result of results) {
    try {
      await prisma.result.create({ data: result });
      log(`✓ Created quiz result for user`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to create result: ${error.message}`, colors.red);
    }
  }

  // UserQuestions
  const userQuestions = [
    { userId: createdIds.users[0], questionId: createdIds.questions[0], answers: { value: 4 } },
    { userId: createdIds.users[0], questionId: createdIds.questions[1], answers: { value: 5 } },
    { userId: createdIds.users[1], questionId: createdIds.questions[0], answers: { value: 3 } },
  ];

  for (const uq of userQuestions) {
    try {
      await prisma.userQuestion.create({ data: uq });
      log(`✓ Recorded user answer to question`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to record user answer: ${error.message}`, colors.red);
    }
  }

  // UserArchetypes
  const userArchetypes = [
    { userId: createdIds.users[0], archetypeId: createdIds.archetypes[0], score: 85 },
    { userId: createdIds.users[0], archetypeId: createdIds.archetypes[1], score: 60 },
    { userId: createdIds.users[1], archetypeId: createdIds.archetypes[1], score: 90 },
    { userId: createdIds.users[1], archetypeId: createdIds.archetypes[2], score: 75 },
  ];

  for (const ua of userArchetypes) {
    try {
      await prisma.userArchetype.create({ data: ua });
      log(`✓ Assigned archetype score to user`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to assign archetype: ${error.message}`, colors.red);
    }
  }

  // UserProfessions
  const userProfessions = [
    { userId: createdIds.users[0], professionId: createdIds.professions[0] },
    { userId: createdIds.users[0], professionId: createdIds.professions[1] },
    { userId: createdIds.users[1], professionId: createdIds.professions[4] },
  ];

  const userProfessionIds: string[] = [];
  for (const up of userProfessions) {
    try {
      const created = await prisma.userProfession.create({ data: up });
      userProfessionIds.push(created.id);
      log(`✓ User saved profession to favorites`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to save profession: ${error.message}`, colors.red);
    }
  }

  // UserProfessionArchetypeTypes
  const userProfessionArchetypeTypes = [
    { userProfessionId: userProfessionIds[0], archetypeTypeId: createdIds.archetypeTypes[0], score: 82 },
    { userProfessionId: userProfessionIds[1], archetypeTypeId: createdIds.archetypeTypes[0], score: 88 },
    { userProfessionId: userProfessionIds[2], archetypeTypeId: createdIds.archetypeTypes[0], score: 75 },
  ];

  for (const upat of userProfessionArchetypeTypes) {
    try {
      await prisma.userProfessionArchetypeType.create({ data: upat });
      log(`✓ Assigned archetype type score to user profession`, colors.green);
    } catch (error: any) {
      log(`✗ Failed to assign archetype type: ${error.message}`, colors.red);
    }
  }
}

async function verifyData() {
  log('\n🔍 Verifying Created Data...', colors.yellow);

  try {
    // Verify users
    const usersResponse = await api.get('/users');
    log(`✓ Users in database: ${usersResponse.data.length}`, colors.green);

    // Verify professions
    const professionsResponse = await api.get('/professions');
    log(`✓ Professions in database: ${professionsResponse.data.length}`, colors.green);

    // Check if professions have categories
    const professionWithCategory = professionsResponse.data.find((p: any) => p.category);
    if (professionWithCategory) {
      log(`✓ Professions properly linked to categories`, colors.green);
    }

    // Verify archetypes
    const archetypesResponse = await api.get('/archetypes');
    log(`✓ Archetypes in database: ${archetypesResponse.data.length}`, colors.green);

    // Check if archetypes have types
    const archetypeWithType = archetypesResponse.data.find((a: any) => a.archetypeType);
    if (archetypeWithType) {
      log(`✓ Archetypes properly linked to types`, colors.green);
    }

    // Verify quizzes
    const quizzesResponse = await api.get('/quizzes');
    log(`✓ Quizzes in database: ${quizzesResponse.data.length}`, colors.green);

    // Test GET by ID for one of each
    if (createdIds.users.length > 0) {
      const userResponse = await api.get(`/users/${createdIds.users[0]}`);
      log(`✓ GET by ID works for users: ${userResponse.data.email}`, colors.green);
    }

    if (createdIds.professions.length > 0) {
      const professionResponse = await api.get(`/professions/${createdIds.professions[0]}`);
      log(`✓ GET by ID works for professions: ${professionResponse.data.name.en}`, colors.green);
    }

    log('\n✅ All data successfully created and verified!', colors.green);

    // Get counts from database
    const counts = {
      users: await prisma.user.count(),
      regions: await prisma.region.count(),
      categories: await prisma.category.count(),
      professions: await prisma.profession.count(),
      archetypeTypes: await prisma.archetypeType.count(),
      archetypes: await prisma.archetype.count(),
      quizzes: await prisma.quiz.count(),
      organizations: await prisma.organization.count(),
      licenseClasses: await prisma.licenseClass.count(),
      licenses: await prisma.license.count(),
      specs: await prisma.spec.count(),
      universities: await prisma.university.count(),
      questions: await prisma.question.count(),
      testScoreTypes: await prisma.testScoreType.count(),
      specUniversities: await prisma.specUniversity.count(),
      professionSpecs: await prisma.professionSpec.count(),
      professionArchetypes: await prisma.professionArchetype.count(),
      testScores: await prisma.testScore.count(),
      licenseClassQuizzes: await prisma.licenseClassQuiz.count(),
      userLicenses: await prisma.userLicense.count(),
      results: await prisma.result.count(),
      userQuestions: await prisma.userQuestion.count(),
      userArchetypes: await prisma.userArchetype.count(),
      userProfessions: await prisma.userProfession.count(),
      userProfessionArchetypeTypes: await prisma.userProfessionArchetypeType.count(),
    };

    log(`\n📊 Database Summary:`, colors.cyan);
    log(`\n   Core Entities:`, colors.yellow);
    log(`   ├─ Users: ${counts.users}`, colors.blue);
    log(`   ├─ Regions: ${counts.regions}`, colors.blue);
    log(`   ├─ Categories: ${counts.categories}`, colors.blue);
    log(`   ├─ Professions: ${counts.professions}`, colors.blue);
    log(`   ├─ Archetype Types: ${counts.archetypeTypes}`, colors.blue);
    log(`   ├─ Archetypes: ${counts.archetypes}`, colors.blue);
    log(`   └─ Quizzes: ${counts.quizzes}`, colors.blue);

    log(`\n   Organizations & Licenses:`, colors.yellow);
    log(`   ├─ Organizations: ${counts.organizations}`, colors.blue);
    log(`   ├─ License Classes: ${counts.licenseClasses}`, colors.blue);
    log(`   ├─ Licenses: ${counts.licenses}`, colors.blue);
    log(`   └─ User Licenses: ${counts.userLicenses}`, colors.blue);

    log(`\n   Education:`, colors.yellow);
    log(`   ├─ Specs: ${counts.specs}`, colors.blue);
    log(`   ├─ Universities: ${counts.universities}`, colors.blue);
    log(`   ├─ Spec Universities: ${counts.specUniversities}`, colors.blue);
    log(`   ├─ Test Score Types: ${counts.testScoreTypes}`, colors.blue);
    log(`   └─ Test Scores: ${counts.testScores}`, colors.blue);

    log(`\n   Quizzes & Questions:`, colors.yellow);
    log(`   ├─ Questions: ${counts.questions}`, colors.blue);
    log(`   ├─ Results: ${counts.results}`, colors.blue);
    log(`   ├─ User Questions: ${counts.userQuestions}`, colors.blue);
    log(`   └─ License Class Quizzes: ${counts.licenseClassQuizzes}`, colors.blue);

    log(`\n   Relationships:`, colors.yellow);
    log(`   ├─ Profession Specs: ${counts.professionSpecs}`, colors.blue);
    log(`   ├─ Profession Archetypes: ${counts.professionArchetypes}`, colors.blue);
    log(`   ├─ User Archetypes: ${counts.userArchetypes}`, colors.blue);
    log(`   ├─ User Professions: ${counts.userProfessions}`, colors.blue);
    log(`   └─ User Profession Archetype Types: ${counts.userProfessionArchetypeTypes}`, colors.blue);

  } catch (error: any) {
    log(`✗ Verification failed: ${error.message}`, colors.red);
  }
}

async function main() {
  log('🚀 Starting Database Seeding Process...', colors.yellow);
  log(`📡 API URL: ${API_URL}`, colors.blue);

  try {
    // Check if server is running
    await api.get('/');
    log('✓ Server is running', colors.green);
  } catch (error) {
    log('✗ Server is not running! Please start the server with: npm run start:dev', colors.red);
    process.exit(1);
  }

  try {
    // Create prerequisite data via Prisma
    await createRegions();
    await createCategories();
    await createArchetypeTypes();

    // Create main entities via API (testing POST endpoints)
    await createUsers();
    await createProfessions();
    await createArchetypes();
    await createQuizzes();

    // Create organizations and licenses
    await createOrganizations();
    await createLicenseClasses();
    await createLicenses();

    // Create education-related data
    await createSpecs();
    await createUniversities();
    await createTestScoreTypes();

    // Create questions for quizzes
    await createQuestions();

    // Create all relationship data
    await createRelationships();

    // Create user interaction data
    await createUserInteractions();

    // Verify everything (testing GET endpoints)
    await verifyData();

    log('\n🎉 Seeding completed successfully!', colors.green);
  } catch (error: any) {
    log(`\n❌ Seeding failed: ${error.message}`, colors.red);
    if (error.response) {
      log(`Response: ${JSON.stringify(error.response.data)}`, colors.red);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
