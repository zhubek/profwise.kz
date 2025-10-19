import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kazakhstan universities database
const UNIVERSITIES = [
  { name: "Nazarbayev University", type: "Public", hasScholarships: true },
  { name: "Al-Farabi Kazakh National University", type: "Public", hasScholarships: true },
  { name: "KIMEP University", type: "Private", hasScholarships: true },
  { name: "Satbayev University", type: "Public", hasScholarships: true },
  { name: "NARXOZ University", type: "Private", hasScholarships: true },
  { name: "Almaty Management University", type: "Private", hasScholarships: false },
  { name: "Karaganda Technical University", type: "Public", hasScholarships: true },
  { name: "L.N. Gumilyov Eurasian National University", type: "Public", hasScholarships: true },
  { name: "Abai Kazakh National Pedagogical University", type: "Public", hasScholarships: true },
  { name: "Karaganda Medical University", type: "Public", hasScholarships: true },
  { name: "Asfendiyarov Kazakh National Medical University", type: "Public", hasScholarships: true },
];

// Category to specializations mapping
const CATEGORY_SPECIALIZATIONS: Record<string, any[]> = {
  "Finance": [
    {
      nameEn: "Finance",
      nameRu: "Финансы",
      nameKk: "Қаржы",
      code: "6B04103",
      descEn: "Study of financial management, investments, and corporate finance",
      descRu: "Изучение финансового менеджмента, инвестиций и корпоративных финансов",
      descKk: "Қаржылық менеджментті, инвестицияларды және корпоративтік қаржыны зерттеу",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["KIMEP University", "NARXOZ University", "Al-Farabi Kazakh National University"]
    },
    {
      nameEn: "Accounting and Auditing",
      nameRu: "Учет и аудит",
      nameKk: "Есеп және аудит",
      code: "6B04101",
      descEn: "Professional accounting, financial reporting, and auditing practices",
      descRu: "Профессиональный учет, финансовая отчетность и аудиторская практика",
      descKk: "Кәсіби есеп, қаржылық есептілік және аудиторлық практика",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["KIMEP University", "NARXOZ University", "Almaty Management University"]
    }
  ],
  "Business Management & Administration": [
    {
      nameEn: "Business Administration",
      nameRu: "Бизнес-администрирование",
      nameKk: "Бизнес әкімшілігі",
      code: "6B04102",
      descEn: "Comprehensive business management and organizational leadership",
      descRu: "Комплексное управление бизнесом и организационное лидерство",
      descKk: "Кешенді бизнес басқару және ұйымдық көшбасшылық",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["KIMEP University", "NARXOZ University", "Almaty Management University"]
    },
    {
      nameEn: "Management",
      nameRu: "Менеджмент",
      nameKk: "Менеджмент",
      code: "6B04105",
      descEn: "Organizational management, strategic planning, and leadership",
      descRu: "Организационное управление, стратегическое планирование и лидерство",
      descKk: "Ұйымдық басқару, стратегиялық жоспарлау және көшбасшылық",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["NARXOZ University", "Al-Farabi Kazakh National University", "Almaty Management University"]
    }
  ],
  "Information Technology": [
    {
      nameEn: "Information Systems",
      nameRu: "Информационные системы",
      nameKk: "Ақпараттық жүйелер",
      code: "6B06102",
      descEn: "Design, development, and management of information systems",
      descRu: "Проектирование, разработка и управление информационными системами",
      descKk: "Ақпараттық жүйелерді жобалау, әзірлеу және басқару",
      groupEn: "Information and Communication Technologies",
      groupRu: "Информационные и коммуникационные технологии",
      groupKk: "Ақпараттық және коммуникациялық технологиялар",
      subjectsEn: "Math, Physics, English",
      subjectsRu: "Математика, Физика, Английский",
      subjectsKk: "Математика, Физика, Ағылшын тілі",
      universities: ["Nazarbayev University", "Satbayev University", "KIMEP University"]
    },
    {
      nameEn: "Computer Science",
      nameRu: "Компьютерные науки",
      nameKk: "Компьютерлік ғылымдар",
      code: "6B06101",
      descEn: "Fundamentals of computing, algorithms, and software development",
      descRu: "Основы вычислений, алгоритмов и разработки программного обеспечения",
      descKk: "Есептеу, алгоритмдер және бағдарламалық қамтамасыз етуді әзірлеу негіздері",
      groupEn: "Information and Communication Technologies",
      groupRu: "Информационные и коммуникационные технологии",
      groupKk: "Ақпараттық және коммуникациялық технологиялар",
      subjectsEn: "Math, Physics, English",
      subjectsRu: "Математика, Физика, Английский",
      subjectsKk: "Математика, Физика, Ағылшын тілі",
      universities: ["Nazarbayev University", "Satbayev University", "Al-Farabi Kazakh National University"]
    }
  ],
  "Education & Training": [
    {
      nameEn: "Pedagogy and Psychology",
      nameRu: "Педагогика и психология",
      nameKk: "Педагогика және психология",
      code: "6B01101",
      descEn: "Educational theory, teaching methods, and child psychology",
      descRu: "Педагогическая теория, методы обучения и детская психология",
      descKk: "Педагогикалық теория, оқыту әдістері және балалар психологиясы",
      groupEn: "Education",
      groupRu: "Образование",
      groupKk: "Білім беру",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["Abai Kazakh National Pedagogical University", "L.N. Gumilyov Eurasian National University", "Al-Farabi Kazakh National University"]
    },
    {
      nameEn: "Foreign Language: Two Foreign Languages",
      nameRu: "Иностранный язык: два иностранных языка",
      nameKk: "Шетел тілі: екі шетел тілі",
      code: "6B01103",
      descEn: "Advanced study of two foreign languages and linguistics",
      descRu: "Углубленное изучение двух иностранных языков и лингвистики",
      descKk: "Екі шетел тілі мен лингвистиканы тереңдетіп зерттеу",
      groupEn: "Education",
      groupRu: "Образование",
      groupKk: "Білім беру",
      subjectsEn: "History, English, Geography",
      subjectsRu: "История, Английский, География",
      subjectsKk: "Тарих, Ағылшын тілі, География",
      universities: ["Abai Kazakh National Pedagogical University", "Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University"]
    }
  ],
  "Health Science": [
    {
      nameEn: "General Medicine",
      nameRu: "Общая медицина",
      nameKk: "Жалпы медицина",
      code: "6B10101",
      descEn: "Medical education for general practitioners and physicians",
      descRu: "Медицинское образование для врачей общей практики",
      descKk: "Жалпы практика дәрігерлері үшін медициналық білім",
      groupEn: "Health and Welfare",
      groupRu: "Здравоохранение и социальное обеспечение",
      groupKk: "Денсаулық сақтау және әлеуметтік қамсыздандыру",
      subjectsEn: "Biology, Chemistry, Physics",
      subjectsRu: "Биология, Химия, Физика",
      subjectsKk: "Биология, Химия, Физика",
      universities: ["Asfendiyarov Kazakh National Medical University", "Karaganda Medical University", "Nazarbayev University"]
    },
    {
      nameEn: "Nursing",
      nameRu: "Сестринское дело",
      nameKk: "Мейірбике ісі",
      code: "6B10102",
      descEn: "Professional nursing care and healthcare management",
      descRu: "Профессиональный сестринский уход и управление здравоохранением",
      descKk: "Кәсіби мейірбике күтімі және денсаулық сақтауды басқару",
      groupEn: "Health and Welfare",
      groupRu: "Здравоохранение и социальное обеспечение",
      groupKk: "Денсаулық сақтау және әлеуметтік қамсыздандыру",
      subjectsEn: "Biology, Chemistry, English",
      subjectsRu: "Биология, Химия, Английский",
      subjectsKk: "Биология, Химия, Ағылшын тілі",
      universities: ["Asfendiyarov Kazakh National Medical University", "Karaganda Medical University"]
    }
  ],
  "Science, Technology, Engineering & Mathematics": [
    {
      nameEn: "Chemical Engineering and Technology",
      nameRu: "Химическая инженерия и технология",
      nameKk: "Химиялық инженерия және технология",
      code: "6B07201",
      descEn: "Chemical processes, industrial technology, and engineering",
      descRu: "Химические процессы, промышленные технологии и инженерия",
      descKk: "Химиялық процестер, өнеркәсіптік технологиялар және инженерия",
      groupEn: "Engineering and Engineering Trades",
      groupRu: "Инженерное дело и инженерные специальности",
      groupKk: "Инженерлік іс және инженерлік мамандықтар",
      subjectsEn: "Math, Physics, Chemistry",
      subjectsRu: "Математика, Физика, Химия",
      subjectsKk: "Математика, Физика, Химия",
      universities: ["Satbayev University", "Karaganda Technical University", "Al-Farabi Kazakh National University"]
    },
    {
      nameEn: "Mathematics",
      nameRu: "Математика",
      nameKk: "Математика",
      code: "6B05401",
      descEn: "Pure and applied mathematics, statistics, and analysis",
      descRu: "Чистая и прикладная математика, статистика и анализ",
      descKk: "Таза және қолданбалы математика, статистика және талдау",
      groupEn: "Natural Sciences, Mathematics and Statistics",
      groupRu: "Естественные науки, математика и статистика",
      groupKk: "Жаратылыстану ғылымдары, математика және статистика",
      subjectsEn: "Math, Physics, English",
      subjectsRu: "Математика, Физика, Английский",
      subjectsKk: "Математика, Физика, Ағылшын тілі",
      universities: ["Nazarbayev University", "Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University"]
    }
  ],
  "Architecture & Construction": [
    {
      nameEn: "Architecture",
      nameRu: "Архитектура",
      nameKk: "Сәулет",
      code: "6B07301",
      descEn: "Architectural design, urban planning, and building design",
      descRu: "Архитектурное проектирование, градостроительство и проектирование зданий",
      descKk: "Сәулеттік жобалау, қала құрылысы және ғимараттарды жобалау",
      groupEn: "Engineering and Engineering Trades",
      groupRu: "Инженерное дело и инженерные специальности",
      groupKk: "Инженерлік іс және инженерлік мамандықтар",
      subjectsEn: "Math, Physics, Geography",
      subjectsRu: "Математика, Физика, География",
      subjectsKk: "Математика, Физика, География",
      universities: ["Satbayev University", "Nazarbayev University", "Karaganda Technical University"]
    },
    {
      nameEn: "Construction and Civil Engineering",
      nameRu: "Строительство и гражданское строительство",
      nameKk: "Құрылыс және азаматтық құрылыс",
      code: "6B07302",
      descEn: "Civil engineering, structural design, and construction management",
      descRu: "Гражданское строительство, проектирование конструкций и управление строительством",
      descKk: "Азаматтық құрылыс, конструкцияларды жобалау және құрылысты басқару",
      groupEn: "Engineering and Engineering Trades",
      groupRu: "Инженерное дело и инженерные специальности",
      groupKk: "Инженерлік іс және инженерлік мамандықтар",
      subjectsEn: "Math, Physics, Geography",
      subjectsRu: "Математика, Физика, География",
      subjectsKk: "Математика, Физика, География",
      universities: ["Satbayev University", "Karaganda Technical University", "L.N. Gumilyov Eurasian National University"]
    }
  ],
  "Transportation, Distribution & Logistics": [
    {
      nameEn: "Logistics and Supply Chain Management",
      nameRu: "Логистика и управление цепями поставок",
      nameKk: "Логистика және жабдықтау тізбегін басқару",
      code: "6B04104",
      descEn: "Supply chain operations, transportation, and logistics management",
      descRu: "Операции цепи поставок, транспортировка и управление логистикой",
      descKk: "Жабдықтау тізбегі операциялары, тасымалдау және логистиканы басқару",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["NARXOZ University", "KIMEP University", "Almaty Management University"]
    }
  ],
  "Marketing": [
    {
      nameEn: "Marketing",
      nameRu: "Маркетинг",
      nameKk: "Маркетинг",
      code: "6B04106",
      descEn: "Market analysis, consumer behavior, and marketing strategy",
      descRu: "Анализ рынка, поведение потребителей и маркетинговая стратегия",
      descKk: "Нарық талдауы, тұтынушылар мінез-құлқы және маркетинг стратегиясы",
      groupEn: "Business and Management",
      groupRu: "Бизнес и управление",
      groupKk: "Бизнес және менеджмент",
      subjectsEn: "Math, Geography, English",
      subjectsRu: "Математика, География, Английский",
      subjectsKk: "Математика, География, Ағылшын тілі",
      universities: ["NARXOZ University", "KIMEP University", "Almaty Management University"]
    }
  ],
  "Law, Public Safety, Corrections & Security": [
    {
      nameEn: "Jurisprudence",
      nameRu: "Юриспруденция",
      nameKk: "Заңтану",
      code: "6B03101",
      descEn: "Legal theory, law practice, and jurisprudence",
      descRu: "Правовая теория, юридическая практика и юриспруденция",
      descKk: "Құқықтық теория, заң практикасы және заңтану",
      groupEn: "Social Sciences, Journalism and Information",
      groupRu: "Социальные науки, журналистика и информация",
      groupKk: "Әлеуметтік ғылымдар, журналистика және ақпарат",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["KIMEP University", "Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University"]
    }
  ],
  "Government & Public Administration": [
    {
      nameEn: "Public Administration",
      nameRu: "Государственное и местное управление",
      nameKk: "Мемлекеттік және жергілікті басқару",
      code: "6B03104",
      descEn: "Public sector management, policy, and administration",
      descRu: "Управление государственным сектором, политика и администрирование",
      descKk: "Мемлекеттік сектор басқару, саясат және әкімшілік",
      groupEn: "Social Sciences, Journalism and Information",
      groupRu: "Социальные науки, журналистика и информация",
      groupKk: "Әлеуметтік ғылымдар, журналистика және ақпарат",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["L.N. Gumilyov Eurasian National University", "Al-Farabi Kazakh National University", "KIMEP University"]
    }
  ],
  "Human Services": [
    {
      nameEn: "Social Work",
      nameRu: "Социальная работа",
      nameKk: "Әлеуметтік жұмыс",
      code: "6B03102",
      descEn: "Social welfare, community services, and support programs",
      descRu: "Социальное обеспечение, общественные услуги и программы поддержки",
      descKk: "Әлеуметтік қамсыздандыру, қоғамдық қызметтер және қолдау бағдарламалары",
      groupEn: "Social Sciences, Journalism and Information",
      groupRu: "Социальные науки, журналистика и информация",
      groupKk: "Әлеуметтік ғылымдар, журналистика және ақпарат",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University", "Abai Kazakh National Pedagogical University"]
    }
  ],
  "Arts, Audio/Video Technology & Communications": [
    {
      nameEn: "Journalism",
      nameRu: "Журналистика",
      nameKk: "Журналистика",
      code: "6B03201",
      descEn: "Media, communication, and journalistic practices",
      descRu: "СМИ, коммуникация и журналистская практика",
      descKk: "БАҚ, коммуникация және журналистік практика",
      groupEn: "Social Sciences, Journalism and Information",
      groupRu: "Социальные науки, журналистика и информация",
      groupKk: "Әлеуметтік ғылымдар, журналистика және ақпарат",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University", "KIMEP University"]
    },
    {
      nameEn: "Design",
      nameRu: "Дизайн",
      nameKk: "Дизайн",
      code: "6B02101",
      descEn: "Visual design, graphic arts, and creative production",
      descRu: "Визуальный дизайн, графические искусства и креативное производство",
      descKk: "Визуалды дизайн, графикалық өнер және креативті өндіріс",
      groupEn: "Arts and Humanities",
      groupRu: "Искусство и гуманитарные науки",
      groupKk: "Өнер және гуманитарлық ғылымдар",
      subjectsEn: "History, Geography, English",
      subjectsRu: "История, География, Английский",
      subjectsKk: "Тарих, География, Ағылшын тілі",
      universities: ["Al-Farabi Kazakh National University", "Nazarbayev University"]
    }
  ],
  "Manufacturing": [
    {
      nameEn: "Mechanical Engineering",
      nameRu: "Машиностроение",
      nameKk: "Машина жасау",
      code: "6B07101",
      descEn: "Manufacturing processes, machinery, and production systems",
      descRu: "Производственные процессы, машины и производственные системы",
      descKk: "Өндірістік процестер, машиналар және өндіріс жүйелері",
      groupEn: "Engineering and Engineering Trades",
      groupRu: "Инженерное дело и инженерные специальности",
      groupKk: "Инженерлік іс және инженерлік мамандықтар",
      subjectsEn: "Math, Physics, English",
      subjectsRu: "Математика, Физика, Английский",
      subjectsKk: "Математика, Физика, Ағылшын тілі",
      universities: ["Satbayev University", "Karaganda Technical University"]
    }
  ],
  "Agriculture, Food & Natural Resources": [
    {
      nameEn: "Agronomy",
      nameRu: "Агрономия",
      nameKk: "Агрономия",
      code: "6B08101",
      descEn: "Crop production, soil science, and agricultural practices",
      descRu: "Растениеводство, почвоведение и сельскохозяйственные практики",
      descKk: "Өсімдік шаруашылығы, топырақтану және ауыл шаруашылығы практикасы",
      groupEn: "Agriculture",
      groupRu: "Сельское хозяйство",
      groupKk: "Ауыл шаруашылығы",
      subjectsEn: "Biology, Chemistry, Geography",
      subjectsRu: "Биология, Химия, География",
      subjectsKk: "Биология, Химия, География",
      universities: ["Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University"]
    }
  ]
};

// Generic fallback specialization
const GENERIC_SPECIALIZATION = {
  nameEn: "General Studies",
  nameRu: "Общие исследования",
  nameKk: "Жалпы зерттеулер",
  code: "6B00000",
  descEn: "Interdisciplinary studies and general education",
  descRu: "Междисциплинарные исследования и общее образование",
  descKk: "Пәнаралық зерттеулер және жалпы білім",
  groupEn: "General Programs",
  groupRu: "Общие программы",
  groupKk: "Жалпы бағдарламалар",
  subjectsEn: "Math, History, English",
  subjectsRu: "Математика, История, Английский",
  subjectsKk: "Математика, Тарих, Ағылшын тілі",
  universities: ["Al-Farabi Kazakh National University", "L.N. Gumilyov Eurasian National University"]
};

function generateUNTPoints(baseScore: number, university: any) {
  const points = [];

  // Generate 2-3 years of data
  const years = [2024, 2023, 2022];
  const yearsToGenerate = Math.min(years.length, 2 + Math.floor(Math.random() * 2));

  for (let i = 0; i < yearsToGenerate; i++) {
    const year = years[i];
    const variance = Math.floor(Math.random() * 10) - 5; // -5 to +5 variance

    const generalGrant = baseScore + variance;
    const aulGrant = university.hasScholarships ? generalGrant - (3 + Math.floor(Math.random() * 7)) : 0; // 3-10 points less

    const generalGrantCount = 5 + Math.floor(Math.random() * 30); // 5-35 grants
    const aulGrantCount = university.hasScholarships ? Math.floor(generalGrantCount * 0.3) : 0; // ~30% of general grants

    points.push({
      year,
      generalGrant: {
        min: generalGrant,
        max: generalGrant + 10 + Math.floor(Math.random() * 15), // 10-25 points range
        count: generalGrantCount
      },
      aulGrant: university.hasScholarships ? {
        min: aulGrant,
        max: aulGrant + 8 + Math.floor(Math.random() * 12), // 8-20 points range
        count: aulGrantCount
      } : null
    });
  }

  return points;
}

function getCategorySpecializations(categoryName: string | undefined): any[] {
  if (!categoryName) return [GENERIC_SPECIALIZATION];

  const categoryKey = Object.keys(CATEGORY_SPECIALIZATIONS).find(key =>
    categoryName.en?.includes(key) || categoryName.ru?.includes(key) || key.includes(categoryName.en || "")
  );

  return CATEGORY_SPECIALIZATIONS[categoryKey || ""] || [GENERIC_SPECIALIZATION];
}

function getBaseUNTScore(categoryName: string | undefined): number {
  // Different base scores for different fields
  const highDemandFields = ["Health Science", "Medicine", "Medical", "Медицина", "Денсаулық"];
  const stemFields = ["Information Technology", "Science", "Technology", "Engineering", "Mathematics"];

  const catString = JSON.stringify(categoryName || "").toLowerCase();

  if (highDemandFields.some(field => catString.includes(field.toLowerCase()))) {
    return 105 + Math.floor(Math.random() * 15); // 105-120
  } else if (stemFields.some(field => catString.includes(field.toLowerCase()))) {
    return 95 + Math.floor(Math.random() * 15); // 95-110
  } else {
    return 85 + Math.floor(Math.random() * 15); // 85-100
  }
}

async function addSpecializationsToEducation() {
  try {
    console.log('🎓 Adding specialization data to profession education...\n');

    // Get all professions that have been populated with data
    const professions = await prisma.profession.findMany({
      where: {
        descriptionData: { not: null },
        education: { not: null }
      },
      include: {
        category: true
      }
    });

    console.log(`Found ${professions.length} professions to update\n`);

    for (let i = 0; i < professions.length; i++) {
      const profession = professions[i];

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📚 Processing ${i + 1}/${professions.length}: ${profession.name.en}`);
      console.log(`   Category: ${profession.category?.name.en || 'N/A'}`);

      // Get relevant specializations for this category
      const specTemplates = getCategorySpecializations(profession.category?.name);
      const baseScore = getBaseUNTScore(profession.category?.name);

      // Select 1-2 specializations
      const numSpecs = Math.min(specTemplates.length, 1 + Math.floor(Math.random() * 2));
      const selectedSpecs = [];

      for (let j = 0; j < numSpecs; j++) {
        const template = specTemplates[j % specTemplates.length];

        // Select 2-4 universities for this specialization
        const numUnis = 2 + Math.floor(Math.random() * 3);
        const selectedUniNames = template.universities.slice(0, numUnis);

        const universities = selectedUniNames.map((uniName: string) => {
          const uni = UNIVERSITIES.find(u => u.name === uniName) || UNIVERSITIES[0];

          return {
            name: uni.name,
            type: uni.type,
            scholarships: uni.hasScholarships,
            untPoints: generateUNTPoints(baseScore + Math.floor(Math.random() * 5), uni)
          };
        });

        selectedSpecs.push({
          name: {
            en: template.nameEn,
            ru: template.nameRu,
            kk: template.nameKk
          },
          code: template.code,
          description: {
            en: template.descEn,
            ru: template.descRu,
            kk: template.descKk
          },
          subjects: {
            en: template.subjectsEn,
            ru: template.subjectsRu,
            kk: template.subjectsKk
          },
          groupName: {
            en: template.groupEn,
            ru: template.groupRu,
            kk: template.groupKk
          },
          universities
        });
      }

      // Update education data with specializations
      const currentEducation = profession.education as any;
      const updatedEducation = {
        ...currentEducation,
        specializations: selectedSpecs
      };

      await prisma.profession.update({
        where: { id: profession.id },
        data: {
          education: updatedEducation
        }
      });

      console.log(`✅ Added ${selectedSpecs.length} specialization(s) with ${selectedSpecs.reduce((sum, spec) => sum + spec.universities.length, 0)} universities`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n🎉 Successfully added specializations to ${professions.length} professions!`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addSpecializationsToEducation()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
