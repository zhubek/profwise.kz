import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();
const USER_ID = 'c3ed58fd-8d73-40ca-9ac6-468949b56af0';

// Helper to generate profession data
function generateProfessionData(record: any, professionName: any, categoryName: any) {
  const archetypeRaw = JSON.parse(record.archetype_data);
  const marketRaw = JSON.parse(
    record.market_data
      .replace(/"rate":\s*([^,}]+),/, '"rate": "$1",')
      .replace(/"popular":\s*([^,}]+)}/, '"popular": "$1"}')
  );

  const riasecCodes = record.riaseccodes.split('').map((c: string) => c.toUpperCase());
  const primaryCode = riasecCodes[0];

  // Generate descriptions based on profession name and RIASEC
  const descriptionData = {
    overview: professionName,
    keyResponsibilities: generateKeyResponsibilities(primaryCode),
    requiredSkills: generateRequiredSkills(primaryCode),
    workEnvironment: generateWorkEnvironment(primaryCode),
    typicalTasks: generateTypicalTasks(primaryCode),
    toolsAndTechnologies: generateToolsAndTechnologies(primaryCode)
  };

  // Map RIASEC codes to archetype scores
  const interestScores = {
    realistic: riasecCodes.includes('R') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    investigative: riasecCodes.includes('I') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    artistic: riasecCodes.includes('A') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    social: riasecCodes.includes('S') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    enterprising: riasecCodes.includes('E') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    conventional: riasecCodes.includes('C') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30)
  };

  const archetypesData = {
    riasecCodes: riasecCodes,
    primaryArchetypes: {
      interests: getPrimaryInterests(riasecCodes),
      skills: getPrimarySkills(riasecCodes),
      personality: getPrimaryPersonality(riasecCodes),
      values: getPrimaryValues(riasecCodes)
    },
    archetypeScores: {
      interests: interestScores,
      skills: generateSkillScores(riasecCodes),
      personality: {
        openness: archetypeRaw.openness,
        conscientiousness: archetypeRaw.conscientiousness,
        extraversion: riasecCodes.includes('S') || riasecCodes.includes('E') ? 70 : 40,
        agreeableness: archetypeRaw.agreeableness,
        neuroticism: archetypeRaw.neuroticism
      },
      values: {
        achievement: archetypeRaw.achievement,
        independence: archetypeRaw.independence,
        recognition: archetypeRaw.recognition,
        relationships: archetypeRaw.relationships,
        support: archetypeRaw.support,
        workingConditions: archetypeRaw.working_conditions
      }
    }
  };

  const marketResearch = {
    demandLevel: marketRaw.popular === 'Y' ? "high" : "moderate",
    jobGrowth: marketRaw.rate,
    annualOpenings: Math.floor(Math.random() * 5000) + 1000,
    salaryRanges: generateSalaryRanges(categoryName, riasecCodes),
    industrySectors: generateIndustrySectors(categoryName, riasecCodes),
    geographicHotspots: [
      { en: "Almaty", ru: "Алматы", kk: "Алматы" },
      { en: "Nur-Sultan", ru: "Нур-Султан", kk: "Нұр-Сұлтан" },
      { en: "Shymkent", ru: "Шымкент", kk: "Шымкент" }
    ],
    trends: generateTrends(categoryName, riasecCodes)
  };

  const educationData = {
    minimumEducation: getMinimumEducation(marketRaw.training_level),
    preferredFields: generatePreferredFields(professionName, categoryName),
    certifications: generateCertifications(riasecCodes),
    learningPaths: generateLearningPaths(marketRaw.training_level)
  };

  const generalData = {
    overview: professionName,
    alternativeTitles: generateAlternativeTitles(professionName),
    careerPath: generateCareerPath(riasecCodes)
  };

  return {
    descriptionData,
    archetypes: archetypesData,
    marketResearch,
    education: educationData,
    general: generalData,
    primaryInterestScore: Math.max(...Object.values(interestScores))
  };
}

function getPrimaryInterests(riasecCodes: string[]) {
  const mapping: any = {
    R: ["realistic", "hands-on"],
    I: ["investigative", "analytical"],
    A: ["artistic", "creative"],
    S: ["social", "helping"],
    E: ["enterprising", "leadership"],
    C: ["conventional", "organized"]
  };
  return riasecCodes.slice(0, 2).flatMap(code => mapping[code] || []);
}

function getPrimarySkills(riasecCodes: string[]) {
  const mapping: any = {
    R: ["technical", "mechanical", "practical"],
    I: ["analytical", "research", "problem-solving"],
    A: ["creative", "design", "innovative"],
    S: ["communication", "empathy", "collaboration"],
    E: ["leadership", "persuasion", "strategic-thinking"],
    C: ["organization", "attention-to-detail", "data-management"]
  };
  return riasecCodes.flatMap(code => mapping[code] || []).slice(0, 4);
}

function getPrimaryPersonality(riasecCodes: string[]) {
  const mapping: any = {
    R: ["practical", "reliable"],
    I: ["analytical", "curious"],
    A: ["creative", "expressive"],
    S: ["empathetic", "cooperative"],
    E: ["confident", "persuasive"],
    C: ["methodical", "conscientious"]
  };
  return riasecCodes.flatMap(code => mapping[code] || []).slice(0, 3);
}

function getPrimaryValues(riasecCodes: string[]) {
  const mapping: any = {
    R: ["stability", "tangible-results"],
    I: ["knowledge", "intellectual-challenge"],
    A: ["creativity", "self-expression"],
    S: ["helping-others", "relationships"],
    E: ["achievement", "influence"],
    C: ["security", "order"]
  };
  return riasecCodes.flatMap(code => mapping[code] || []).slice(0, 3);
}

function generateSkillScores(riasecCodes: string[]) {
  return {
    technical: riasecCodes.includes('R') || riasecCodes.includes('I') ? 85 : 50,
    creative: riasecCodes.includes('A') ? 90 : 40,
    interpersonal: riasecCodes.includes('S') || riasecCodes.includes('E') ? 85 : 45,
    analytical: riasecCodes.includes('I') ? 90 : 50,
    organizational: riasecCodes.includes('C') ? 85 : 50,
    leadership: riasecCodes.includes('E') ? 85 : 45
  };
}

function generateKeyResponsibilities(primaryCode: string) {
  const templates: any = {
    R: [
      { en: "Operate and maintain equipment and machinery", ru: "Эксплуатация и обслуживание оборудования и механизмов", kk: "Жабдық пен механизмдерді пайдалану және қызмет көрсету" },
      { en: "Perform hands-on tasks and physical work", ru: "Выполнение практических задач и физической работы", kk: "Практикалық тапсырмалар мен физикалық жұмыстарды орындау" },
      { en: "Follow safety protocols and procedures", ru: "Соблюдение протоколов и процедур безопасности", kk: "Қауіпсіздік хаттамалары мен процедураларын сақтау" }
    ],
    I: [
      { en: "Conduct research and data analysis", ru: "Проведение исследований и анализа данных", kk: "Зерттеулер мен деректерді талдау жүргізу" },
      { en: "Solve complex problems and develop solutions", ru: "Решение сложных проблем и разработка решений", kk: "Күрделі мәселелерді шешу және шешімдер әзірлеу" },
      { en: "Test hypotheses and validate findings", ru: "Проверка гипотез и валидация результатов", kk: "Гипотезаларды тексеру және нәтижелерді растау" }
    ],
    A: [
      { en: "Create original designs and artistic works", ru: "Создание оригинальных дизайнов и художественных работ", kk: "Түпнұсқа дизайндар мен көркем жұмыстарды жасау" },
      { en: "Develop creative concepts and ideas", ru: "Разработка креативных концепций и идей", kk: "Шығармашылық тұжырымдамалар мен идеяларды әзірлеу" },
      { en: "Express artistic vision and communicate through media", ru: "Выражение художественного видения и коммуникация через медиа", kk: "Көркемдік көзқарасты білдіру және медиа арқылы қарым-қатынас" }
    ],
    S: [
      { en: "Provide support and assistance to individuals", ru: "Предоставление поддержки и помощи людям", kk: "Адамдарға қолдау және көмек көрсету" },
      { en: "Build relationships and facilitate communication", ru: "Построение отношений и содействие коммуникации", kk: "Қарым-қатынас орнату және байланысты жеңілдету" },
      { en: "Collaborate with teams and stakeholders", ru: "Сотрудничество с командами и заинтересованными сторонами", kk: "Командалар мен мүдделі тараптармен ынтымақтасу" }
    ],
    E: [
      { en: "Lead teams and manage projects", ru: "Руководство командами и управление проектами", kk: "Командаларды басқару және жобаларды басқару" },
      { en: "Make strategic decisions and set goals", ru: "Принятие стратегических решений и постановка целей", kk: "Стратегиялық шешімдер қабылдау және мақсаттар қою" },
      { en: "Negotiate and persuade stakeholders", ru: "Ведение переговоров и убеждение заинтересованных сторон", kk: "Мүдделі тараптармен келіссөздер жүргізу және сендіру" }
    ],
    C: [
      { en: "Organize and maintain records and documentation", ru: "Организация и ведение записей и документации", kk: "Жазбалар мен құжаттаманы ұйымдастыру және жүргізу" },
      { en: "Follow established procedures and protocols", ru: "Следование установленным процедурам и протоколам", kk: "Белгіленген процедуралар мен хаттамаларға сәйкес болу" },
      { en: "Process data and ensure accuracy", ru: "Обработка данных и обеспечение точности", kk: "Деректерді өңдеу және дәлдікті қамтамасыз ету" }
    ]
  };
  return templates[primaryCode] || templates['R'];
}

function generateRequiredSkills(primaryCode: string) {
  const templates: any = {
    R: [
      { en: "Technical and mechanical skills", ru: "Технические и механические навыки", kk: "Техникалық және механикалық дағдылар" },
      { en: "Manual dexterity and physical stamina", ru: "Ловкость рук и физическая выносливость", kk: "Қол икемділігі және физикалық шыдамдылық" },
      { en: "Problem-solving abilities", ru: "Способности к решению проблем", kk: "Мәселелерді шешу қабілеттері" }
    ],
    I: [
      { en: "Analytical and critical thinking", ru: "Аналитическое и критическое мышление", kk: "Аналитикалық және сыни ойлау" },
      { en: "Research and data analysis skills", ru: "Навыки исследований и анализа данных", kk: "Зерттеу және деректерді талдау дағдылары" },
      { en: "Attention to detail", ru: "Внимание к деталям", kk: "Бөлшектерге назар аудару" }
    ],
    A: [
      { en: "Creative and artistic abilities", ru: "Творческие и художественные способности", kk: "Шығармашылық және көркемдік қабілеттер" },
      { en: "Design and visualization skills", ru: "Навыки дизайна и визуализации", kk: "Дизайн және визуализация дағдылары" },
      { en: "Innovation and originality", ru: "Инновации и оригинальность", kk: "Инновациялар және бірегейлік" }
    ],
    S: [
      { en: "Excellent communication skills", ru: "Отличные коммуникативные навыки", kk: "Тамаша коммуникация дағдылары" },
      { en: "Empathy and interpersonal skills", ru: "Эмпатия и навыки межличностного общения", kk: "Эмпатия және адамдармен қарым-қатынас дағдылары" },
      { en: "Active listening and patience", ru: "Активное слушание и терпение", kk: "Белсенді тыңдау және төзімділік" }
    ],
    E: [
      { en: "Leadership and management skills", ru: "Навыки руководства и управления", kk: "Басшылық және басқару дағдылары" },
      { en: "Strategic thinking and planning", ru: "Стратегическое мышление и планирование", kk: "Стратегиялық ойлау және жоспарлау" },
      { en: "Persuasion and negotiation", ru: "Убеждение и ведение переговоров", kk: "Сендіру және келіссөздер жүргізу" }
    ],
    C: [
      { en: "Organizational and administrative skills", ru: "Организационные и административные навыки", kk: "Ұйымдастыру және әкімшілік дағдылар" },
      { en: "Attention to detail and accuracy", ru: "Внимание к деталям и точность", kk: "Бөлшектерге назар аудару және дәлдік" },
      { en: "Data management and record-keeping", ru: "Управление данными и ведение записей", kk: "Деректерді басқару және жазбаларды жүргізу" }
    ]
  };
  return templates[primaryCode] || templates['R'];
}

function generateWorkEnvironment(primaryCode: string) {
  const templates: any = {
    R: {
      en: "Work is typically performed in workshops, factories, or outdoor settings. May involve exposure to noise, physical demands, and safety hazards.",
      ru: "Работа обычно выполняется в мастерских, на заводах или на открытом воздухе. Может включать воздействие шума, физические нагрузки и опасности.",
      kk: "Жұмыс әдетте шеберханаларда, зауыттарда немесе ашық жерлерде орындалады. Шу, физикалық жүктеме және қауіптілікке ұшырауы мүмкін."
    },
    I: {
      en: "Work is typically performed in laboratories, research facilities, or office settings with focus on analysis and investigation.",
      ru: "Работа обычно выполняется в лабораториях, исследовательских центрах или офисах с акцентом на анализ и исследования.",
      kk: "Жұмыс әдетте зертханаларда, зерттеу орталықтарында немесе кеңселерде талдау және зерттеуге баса назар аудара отырып орындалады."
    },
    A: {
      en: "Work is typically performed in studios, creative spaces, or flexible environments that encourage artistic expression and innovation.",
      ru: "Работа обычно выполняется в студиях, творческих пространствах или гибких средах, которые поощряют художественное самовыражение и инновации.",
      kk: "Жұмыс әдетте студияларда, шығармашылық кеңістіктерде немесе көркем өзін-өзі білдіруге және инновацияларға жәрдемдесетін икемді орталарда орындалады."
    },
    S: {
      en: "Work involves frequent interaction with people in schools, hospitals, community centers, or social service organizations.",
      ru: "Работа включает частое взаимодействие с людьми в школах, больницах, общественных центрах или социальных организациях.",
      kk: "Жұмыс мектептерде, аурухана, қоғамдық орталықтарда немесе әлеуметтік қызмет ұйымдарында адамдармен жиі өзара әрекеттесуді қамтиды."
    },
    E: {
      en: "Work is typically performed in office settings with significant time spent in meetings, presentations, and strategic planning sessions.",
      ru: "Работа обычно выполняется в офисах со значительным временем на совещания, презентации и стратегическое планирование.",
      kk: "Жұмыс әдетте кеңселерде кездесулер, презентациялар және стратегиялық жоспарлау сессияларына айтарлықтай уақыт бөле отырып орындалады."
    },
    C: {
      en: "Work is typically performed in structured office environments with focus on organization, data processing, and administrative tasks.",
      ru: "Работа обычно выполняется в структурированных офисных средах с акцентом на организацию, обработку данных и административные задачи.",
      kk: "Жұмыс әдетте ұйымдастыруға, деректерді өңдеуге және әкімшілік тапсырмаларға баса назар аудара отырып құрылымдық кеңсе орталарында орындалады."
    }
  };
  return templates[primaryCode] || templates['R'];
}

function generateTypicalTasks(primaryCode: string) {
  const templates: any = {
    R: [
      { en: "Operating machinery and equipment", ru: "Эксплуатация машин и оборудования", kk: "Машиналар мен жабдықтарды пайдалану" },
      { en: "Performing maintenance and repairs", ru: "Проведение технического обслуживания и ремонта", kk: "Техникалық қызмет көрсету және жөндеу" },
      { en: "Following technical specifications", ru: "Следование техническим спецификациям", kk: "Техникалық сипаттамаларды орындау" }
    ],
    I: [
      { en: "Conducting experiments and research", ru: "Проведение экспериментов и исследований", kk: "Тәжірибелер мен зерттеулер жүргізу" },
      { en: "Analyzing data and interpreting results", ru: "Анализ данных и интерпретация результатов", kk: "Деректерді талдау және нәтижелерді түсіндіру" },
      { en: "Writing reports and documentation", ru: "Написание отчетов и документации", kk: "Есептер мен құжаттаманы жазу" }
    ],
    A: [
      { en: "Creating designs and artistic works", ru: "Создание дизайнов и художественных работ", kk: "Дизайндар мен көркем жұмыстарды жасау" },
      { en: "Developing creative concepts", ru: "Разработка творческих концепций", kk: "Шығармашылық тұжырымдамаларды әзірлеу" },
      { en: "Presenting and showcasing work", ru: "Представление и демонстрация работы", kk: "Жұмысты көрсету және таныстыру" }
    ],
    S: [
      { en: "Assisting and supporting individuals", ru: "Помощь и поддержка людей", kk: "Адамдарға көмек және қолдау көрсету" },
      { en: "Facilitating group activities", ru: "Проведение групповых мероприятий", kk: "Топтық іс-шараларды өткізу" },
      { en: "Building relationships and trust", ru: "Построение отношений и доверия", kk: "Қарым-қатынас пен сенім орнату" }
    ],
    E: [
      { en: "Leading meetings and presentations", ru: "Проведение совещаний и презентаций", kk: "Кездесулер мен презентацияларды өткізу" },
      { en: "Making decisions and solving problems", ru: "Принятие решений и решение проблем", kk: "Шешімдер қабылдау және мәселелерді шешу" },
      { en: "Coordinating teams and resources", ru: "Координация команд и ресурсов", kk: "Командалар мен ресурстарды үйлестіру" }
    ],
    C: [
      { en: "Processing paperwork and documentation", ru: "Обработка документов и документации", kk: "Құжаттар мен құжаттаманы өңдеу" },
      { en: "Maintaining records and databases", ru: "Ведение записей и баз данных", kk: "Жазбалар мен деректер базаларын жүргізу" },
      { en: "Following procedures and schedules", ru: "Следование процедурам и расписаниям", kk: "Процедуралар мен кестелерді орындау" }
    ]
  };
  return templates[primaryCode] || templates['R'];
}

function generateToolsAndTechnologies(primaryCode: string) {
  const templates: any = {
    R: [
      { en: "Hand and power tools", ru: "Ручные и электроинструменты", kk: "Қол және электр құралдары" },
      { en: "Machinery and equipment", ru: "Машины и оборудование", kk: "Машиналар мен жабдықтар" },
      { en: "Safety equipment and gear", ru: "Защитное оборудование и снаряжение", kk: "Қорғаныс жабдығы мен жабдықтар" }
    ],
    I: [
      { en: "Laboratory equipment and instruments", ru: "Лабораторное оборудование и приборы", kk: "Зертханалық жабдық пен аспаптар" },
      { en: "Analysis software and tools", ru: "Программное обеспечение и инструменты анализа", kk: "Талдау бағдарламалық қамтамасыз етуі мен құралдары" },
      { en: "Research databases and resources", ru: "Исследовательские базы данных и ресурсы", kk: "Зерттеу деректер базалары мен ресурстары" }
    ],
    A: [
      { en: "Design software and applications", ru: "Программное обеспечение и приложения для дизайна", kk: "Дизайн бағдарламалық қамтамасыз етуі мен қосымшалары" },
      { en: "Creative tools and materials", ru: "Творческие инструменты и материалы", kk: "Шығармашылық құралдар мен материалдар" },
      { en: "Digital and traditional media", ru: "Цифровые и традиционные медиа", kk: "Цифрлық және дәстүрлі медиа" }
    ],
    S: [
      { en: "Communication platforms and tools", ru: "Коммуникационные платформы и инструменты", kk: "Коммуникация платформалары мен құралдары" },
      { en: "Educational resources and materials", ru: "Образовательные ресурсы и материалы", kk: "Білім беру ресурстары мен материалдары" },
      { en: "Assessment and evaluation tools", ru: "Инструменты оценки и оценивания", kk: "Бағалау және бағалау құралдары" }
    ],
    E: [
      { en: "Business management software", ru: "Программное обеспечение для управления бизнесом", kk: "Бизнесті басқару бағдарламалық қамтамасыз етуі" },
      { en: "Presentation and collaboration tools", ru: "Инструменты презентации и сотрудничества", kk: "Презентация және ынтымақтастық құралдары" },
      { en: "Strategic planning resources", ru: "Ресурсы стратегического планирования", kk: "Стратегиялық жоспарлау ресурстары" }
    ],
    C: [
      { en: "Office productivity software", ru: "Программное обеспечение для офисной работы", kk: "Кеңсе өнімділігі бағдарламалық қамтамасыз етуі" },
      { en: "Database management systems", ru: "Системы управления базами данных", kk: "Деректер базасын басқару жүйелері" },
      { en: "Record-keeping and filing systems", ru: "Системы ведения записей и подачи", kk: "Жазбаларды жүргізу және файлдау жүйелері" }
    ]
  };
  return templates[primaryCode] || templates['R'];
}

function generateSalaryRanges(categoryName: any, riasecCodes: string[]) {
  const baseMultiplier = riasecCodes.includes('E') || riasecCodes.includes('I') ? 1.5 : 1.0;

  return {
    entry: {
      min: Math.floor(150000 * baseMultiplier),
      max: Math.floor(250000 * baseMultiplier),
      currency: "KZT",
      period: "monthly"
    },
    mid: {
      min: Math.floor(250000 * baseMultiplier),
      max: Math.floor(400000 * baseMultiplier),
      currency: "KZT",
      period: "monthly"
    },
    senior: {
      min: Math.floor(400000 * baseMultiplier),
      max: Math.floor(700000 * baseMultiplier),
      currency: "KZT",
      period: "monthly"
    }
  };
}

function generateIndustrySectors(categoryName: any, riasecCodes: string[]) {
  const sectors = [];

  if (riasecCodes.includes('R')) {
    sectors.push(
      { en: "Manufacturing", ru: "Производство", kk: "Өндіріс" },
      { en: "Construction", ru: "Строительство", kk: "Құрылыс" }
    );
  }
  if (riasecCodes.includes('I')) {
    sectors.push(
      { en: "Research & Development", ru: "Исследования и разработки", kk: "Зерттеу және әзірлеу" },
      { en: "Technology", ru: "Технологии", kk: "Технология" }
    );
  }
  if (riasecCodes.includes('A')) {
    sectors.push(
      { en: "Creative Industries", ru: "Креативные индустрии", kk: "Шығармашылық салалар" },
      { en: "Media & Entertainment", ru: "Медиа и развлечения", kk: "Медиа және ойын-сауық" }
    );
  }
  if (riasecCodes.includes('S')) {
    sectors.push(
      { en: "Healthcare", ru: "Здравоохранение", kk: "Денсаулық сақтау" },
      { en: "Education", ru: "Образование", kk: "Білім беру" }
    );
  }
  if (riasecCodes.includes('E')) {
    sectors.push(
      { en: "Business & Finance", ru: "Бизнес и финансы", kk: "Бизнес және қаржы" },
      { en: "Management", ru: "Управление", kk: "Басқару" }
    );
  }
  if (riasecCodes.includes('C')) {
    sectors.push(
      { en: "Administration", ru: "Администрация", kk: "Әкімшілік" },
      { en: "Financial Services", ru: "Финансовые услуги", kk: "Қаржы қызметтері" }
    );
  }

  return sectors.slice(0, 4);
}

function generateTrends(categoryName: any, riasecCodes: string[]) {
  return [
    {
      en: "Growing demand for skilled professionals in Kazakhstan",
      ru: "Растущий спрос на квалифицированных специалистов в Казахстане",
      kk: "Қазақстанда білікті мамандарға сұраныстың өсуі"
    },
    {
      en: "Increasing emphasis on digital skills and technology adoption",
      ru: "Растущий акцент на цифровые навыки и внедрение технологий",
      kk: "Цифрлық дағдыларға және технологияларды енгізуге баса назар аудару"
    },
    {
      en: "Opportunities in emerging industries and sectors",
      ru: "Возможности в новых отраслях и секторах",
      kk: "Жаңа салалар мен секторлардағы мүмкіндіктер"
    }
  ];
}

function getMinimumEducation(trainingLevel: string) {
  const level = parseInt(trainingLevel);
  if (level <= 2) return "High School Diploma or equivalent";
  if (level <= 4) return "Technical or Vocational Certificate";
  if (level <= 6) return "Bachelor's Degree";
  return "Master's Degree or higher";
}

function generatePreferredFields(professionName: any, categoryName: any) {
  return [
    professionName,
    categoryName,
    { en: "Related field", ru: "Смежная область", kk: "Байланысты сала" }
  ];
}

function generateCertifications(riasecCodes: string[]) {
  const certs = [];

  if (riasecCodes.includes('R')) {
    certs.push({ en: "Technical Certification", ru: "Техническая сертификация", kk: "Техникалық сертификаттау" });
  }
  if (riasecCodes.includes('I')) {
    certs.push({ en: "Professional License", ru: "Профессиональная лицензия", kk: "Кәсіби лицензия" });
  }
  if (riasecCodes.includes('S') || riasecCodes.includes('E')) {
    certs.push({ en: "Leadership Certificate", ru: "Сертификат лидерства", kk: "Көшбасшылық сертификаты" });
  }

  return certs.length > 0 ? certs : [
    { en: "Industry Certification", ru: "Отраслевая сертификация", kk: "Салалық сертификаттау" }
  ];
}

function generateLearningPaths(trainingLevel: string) {
  const level = parseInt(trainingLevel);

  if (level <= 4) {
    return [
      {
        type: "vocational",
        description: {
          en: "2-3 year technical or vocational program with hands-on training",
          ru: "2-3-летняя техническая или профессиональная программа с практической подготовкой",
          kk: "Практикалық дайындықпен 2-3 жылдық техникалық немесе кәсіптік бағдарлама"
        }
      }
    ];
  }

  return [
    {
      type: "academic",
      description: {
        en: "4-year bachelor's degree program followed by professional development",
        ru: "4-летняя программа бакалавриата с последующим профессиональным развитием",
        kk: "Кәсіби дамумен 4 жылдық бакалавриат бағдарламасы"
      }
    }
  ];
}

function generateAlternativeTitles(professionName: any) {
  return [
    professionName,
    { en: "Specialist", ru: "Специалист", kk: "Маман" },
    { en: "Professional", ru: "Профессионал", kk: "Кәсіби" }
  ];
}

function generateCareerPath(riasecCodes: string[]) {
  if (riasecCodes.includes('E')) {
    return {
      en: "Entry-level position → Specialist → Senior specialist → Team leader → Manager → Senior manager",
      ru: "Начальная позиция → Специалист → Старший специалист → Руководитель группы → Менеджер → Старший менеджер",
      kk: "Бастапқы позиция → Маман → Аға маман → Топ жетекшісі → Менеджер → Аға менеджер"
    };
  }

  return {
    en: "Entry-level → Junior specialist → Specialist → Senior specialist → Expert",
    ru: "Начальный уровень → Младший специалист → Специалист → Старший специалист → Эксперт",
    kk: "Бастапқы деңгей → Кіші маман → Маман → Аға маман → Сарапшы"
  };
}

async function populate10Professions() {
  try {
    console.log('📖 Reading Excel file...\n');

    const filePath = '/home/bex/projects/profwise.kz/backend/mock-data/job_general_data.xlsx';
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets['gendata'];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Get all profession IDs from database
    const dbProfessions = await prisma.profession.findMany({
      select: { id: true }
    });
    const dbIds = new Set(dbProfessions.map(p => p.id));

    // Filter to only professions that exist in DB and have different RIASEC codes
    const validRecords = data.filter((row: any) => dbIds.has(row.jobid));

    // Group by RIASEC code for diversity
    const riasecGroups: any = {};
    validRecords.forEach((record: any) => {
      const code = record.riaseccodes;
      if (!riasecGroups[code]) riasecGroups[code] = [];
      riasecGroups[code].push(record);
    });

    // Select 10 random professions with diverse RIASEC codes
    const selectedRecords: any[] = [];
    const usedCodes = new Set(['RIC', 'EC']); // Already used codes

    // Try to get different RIASEC codes
    Object.keys(riasecGroups).forEach(code => {
      if (selectedRecords.length < 10 && !usedCodes.has(code)) {
        const record = riasecGroups[code][Math.floor(Math.random() * riasecGroups[code].length)];
        selectedRecords.push(record);
        usedCodes.add(code);
      }
    });

    // If we need more, add random ones
    while (selectedRecords.length < 10) {
      const randomRecord = validRecords[Math.floor(Math.random() * validRecords.length)];
      if (!selectedRecords.find(r => r.jobid === randomRecord.jobid)) {
        selectedRecords.push(randomRecord);
      }
    }

    console.log(`✅ Selected ${selectedRecords.length} professions with diverse RIASEC codes\n`);

    // Process each profession
    for (let i = 0; i < selectedRecords.length; i++) {
      const record = selectedRecords[i];

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📦 Processing ${i + 1}/${selectedRecords.length}: ${record.jobid}`);
      console.log(`🏷️  RIASEC Code: ${record.riaseccodes}`);

      // Get profession from database
      const profession = await prisma.profession.findUnique({
        where: { id: record.jobid },
        include: { category: true }
      });

      if (!profession) {
        console.log('⚠️  Profession not found in database, skipping...');
        continue;
      }

      console.log(`   Name: ${profession.name.en}`);
      console.log(`   Category: ${profession.category?.name.en || 'N/A'}`);

      // Generate data
      const professionData = generateProfessionData(record, profession.name, profession.category?.name);

      // Update profession
      await prisma.profession.update({
        where: { id: record.jobid },
        data: {
          descriptionData: professionData.descriptionData,
          archetypes: professionData.archetypes,
          education: professionData.education,
          marketResearch: professionData.marketResearch,
          general: professionData.general
        }
      });

      console.log('✅ Updated profession data');

      // Add to user profile
      const existing = await prisma.userProfession.findFirst({
        where: {
          userId: USER_ID,
          professionId: record.jobid
        }
      });

      if (!existing) {
        await prisma.userProfession.create({
          data: {
            userId: USER_ID,
            professionId: record.jobid,
            userProfessionArchetypeTypes: {
              create: [
                {
                  archetypeTypeId: 'interest',
                  score: professionData.primaryInterestScore
                }
              ]
            }
          }
        });
        console.log('✅ Added to user profile');
      } else {
        console.log('ℹ️  Already in user profile');
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('\n🎉 Successfully populated 10 professions!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populate10Professions()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
