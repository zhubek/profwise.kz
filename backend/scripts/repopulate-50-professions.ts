import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

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

interface UniversityData {
  name: string;
  isEnglishAvailable: boolean;
  minPointsForGrant: number;
  minPointsGeneralGrant: number;
  generalGrantCount: number;
  maxPointsGeneralGrant: number;
  minPointsAUL: number;
  maxPointsAUL: number;
  aulGrantCount: number;
}

// Parse education_data to extract specializations with universities and UNT points
function parseEducationData(educationDataStr: string): any {
  if (!educationDataStr || educationDataStr.trim() === '') {
    return null;
  }

  try {
    // Split by spec objects
    const specObjects = educationDataStr.split(/\n(?=\{"spec_name":)/).filter((obj: string) => obj.trim());

    const specializations: any[] = [];

    for (const specObj of specObjects) {
      try {
        // Extract spec_name and universities using regex
        const specNameMatch = specObj.match(/"spec_name":\s*"(.+?)"\s*,\s*"universities"/s);
        const universitiesMatch = specObj.match(/"universities":\s*"(.+)"\s*\}\s*$/s);

        if (!specNameMatch || !universitiesMatch) {
          continue;
        }

        const specNameStr = specNameMatch[1];
        const universitiesStr = universitiesMatch[1];

        // Parse spec_name
        let specName: { ru: string; en: string; kz: string };
        try {
          specName = JSON.parse(specNameStr);
        } catch {
          continue;
        }

        // Parse universities
        const universityLines = universitiesStr.split(/\n(?=\{)/)
;
        const universities: any[] = [];

        for (const uniLine of universityLines) {
          if (!uniLine.trim()) continue;

          try {
            const uniData: UniversityData = JSON.parse(uniLine);

            const untPoints: any[] = [];

            // Add general grant if exists
            if (uniData.minPointsGeneralGrant > 0 && uniData.maxPointsGeneralGrant > 0) {
              untPoints.push({
                year: 2024,
                generalGrant: {
                  min: uniData.minPointsGeneralGrant,
                  max: uniData.maxPointsGeneralGrant,
                  count: uniData.generalGrantCount || 0,
                },
              });
            }

            // Add aul grant if exists
            if (uniData.minPointsAUL > 0 && uniData.maxPointsAUL > 0) {
              untPoints.push({
                year: 2024,
                aulGrant: {
                  min: uniData.minPointsAUL,
                  max: uniData.maxPointsAUL,
                  count: uniData.aulGrantCount || 0,
                },
              });
            }

            // Only add university if it has UNT data
            if (untPoints.length > 0) {
              universities.push({
                name: uniData.name,
                type: 'Public',
                scholarships: true,
                untPoints,
              });
            }
          } catch (error) {
            // Skip malformed university data
            continue;
          }
        }

        // Only add specialization if it has universities
        if (universities.length > 0) {
          specializations.push({
            name: specName,
            code: `SPEC-${specName.en.substring(0, 5).toUpperCase()}`,
            description: specName,
            subjects: {
              en: 'N/A',
              ru: 'Н/Д',
              kk: 'Ж/А',
            },
            groupName: specName,
            universities,
          });
        }
      } catch (error) {
        // Skip malformed spec
        continue;
      }
    }

    return specializations;
  } catch (error) {
    return null;
  }
}

// [Keep all the helper functions from populate-50-professions.ts]
// I'll include the key ones here

function generateProfessionData(record: any, professionName: any, categoryName: any) {
  const archetypeRaw = JSON.parse(record.archetype_data);
  const marketRaw = JSON.parse(
    record.market_data
      .replace(/"rate":\s*([^,}]+),/, '"rate": "$1",')
      .replace(/"popular":\s*([^,}]+)}/, '"popular": "$1"}')
  );

  const riasecCodes = record.riaseccodes.split('').map((c: string) => c.toUpperCase());
  const primaryCode = riasecCodes[0];

  // Parse education data with specializations and UNT points
  const specializations = parseEducationData(record.education_data);

  const educationData: any = {
    minimumEducation: getMinimumEducation(marketRaw.training_level),
    preferredFields: [professionName, categoryName, { en: "Related field", ru: "Смежная область", kk: "Байланысты сала" }],
    certifications: generateCertifications(riasecCodes),
    learningPaths: generateLearningPaths(marketRaw.training_level),
  };

  // Add specializations if we have them
  if (specializations && specializations.length > 0) {
    educationData.specializations = specializations;
  }

  return {
    descriptionData: {
      overview: professionName,
      keyResponsibilities: generateKeyResponsibilities(primaryCode),
      requiredSkills: generateRequiredSkills(primaryCode),
      workEnvironment: generateWorkEnvironment(primaryCode),
      typicalTasks: generateTypicalTasks(primaryCode),
      toolsAndTechnologies: generateToolsAndTechnologies(primaryCode)
    },
    archetypes: {
      riasecCodes: riasecCodes,
      primaryArchetypes: {
        interests: getPrimaryInterests(riasecCodes),
        skills: getPrimarySkills(riasecCodes),
        personality: getPrimaryPersonality(riasecCodes),
        values: getPrimaryValues(riasecCodes)
      },
      archetypeScores: {
        interests: generateInterestScores(riasecCodes),
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
    },
    marketResearch: {
      demandLevel: marketRaw.popular === 'Y' ? "high" : "moderate",
      jobGrowth: marketRaw.rate,
      annualOpenings: Math.floor(Math.random() * 5000) + 1000,
      salaryRanges: generateSalaryRanges(riasecCodes),
      industrySectors: generateIndustrySectors(riasecCodes),
      geographicHotspots: [
        { en: "Almaty", ru: "Алматы", kk: "Алматы" },
        { en: "Nur-Sultan", ru: "Нұр-Султан", kk: "Нұр-Сұлтан" },
        { en: "Shymkent", ru: "Шымкент", kk: "Шымкент" }
      ],
      trends: [
        {
          en: "Growing demand for skilled professionals in Kazakhstan",
          ru: "Растущий спрос на квалифицированных специалистов в Казахстане",
          kk: "Қазақстанда білікті мамандарға сұраныстың өсуі"
        },
        {
          en: "Increasing emphasis on digital skills and technology adoption",
          ru: "Растущий акцент на цифровые навыки и внедрение технологий",
          kk: "Цифрлық дағдыларға және технологияларды енгізуге баса назар аудару"
        }
      ]
    },
    education: educationData,
    general: {
      overview: professionName,
      alternativeTitles: [professionName, { en: "Specialist", ru: "Специалист", kk: "Маман" }],
      careerPath: generateCareerPath(riasecCodes)
    }
  };
}

// Helper functions
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

function generateInterestScores(riasecCodes: string[]) {
  return {
    realistic: riasecCodes.includes('R') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    investigative: riasecCodes.includes('I') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    artistic: riasecCodes.includes('A') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    social: riasecCodes.includes('S') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    enterprising: riasecCodes.includes('E') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30),
    conventional: riasecCodes.includes('C') ? 80 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30)
  };
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
      { en: "Perform hands-on tasks and physical work", ru: "Выполнение практических задач и физической работы", kk: "Практикалық тапсырмалар мен физикалық жұмыстарды орындау" }
    ],
    I: [
      { en: "Conduct research and data analysis", ru: "Проведение исследований и анализа данных", kk: "Зерттеулер мен деректерді талдау жүргізу" },
      { en: "Solve complex problems and develop solutions", ru: "Решение сложных проблем и разработка решений", kk: "Күрделі мәселелерді шешу және шешімдер әзірлеу" }
    ],
    A: [
      { en: "Create original designs and artistic works", ru: "Создание оригинальных дизайнов и художественных работ", kk: "Түпнұсқа дизайндар мен көркем жұмыстарды жасау" },
      { en: "Develop creative concepts and ideas", ru: "Разработка креативных концепций и идей", kk: "Шығармашылық тұжырымдамалар мен идеяларды әзірлеу" }
    ],
    S: [
      { en: "Provide support and assistance to individuals", ru: "Предоставление поддержки и помощи людям", kk: "Адамдарға қолдау және көмек көрсету" },
      { en: "Build relationships and facilitate communication", ru: "Построение отношений и содействие коммуникации", kk: "Қарым-қатынас орнату және байланысты жеңілдету" }
    ],
    E: [
      { en: "Lead teams and manage projects", ru: "Руководство командами и управление проектами", kk: "Командаларды басқару және жобаларды басқару" },
      { en: "Make strategic decisions and set goals", ru: "Принятие стратегических решений и постановка целей", kk: "Стратегиялық шешімдер қабылдау және мақсаттар қою" }
    ],
    C: [
      { en: "Organize and maintain records and documentation", ru: "Организация и ведение записей и документации", kk: "Жазбалар мен құжаттаманы ұйымдастыру және жүргізу" },
      { en: "Follow established procedures and protocols", ru: "Следование установленным процедурам и протоколам", kk: "Белгіленген процедуралар мен хаттамаларға сәйкес болу" }
    ]
  };
  return templates[primaryCode] || templates['R'];
}

function generateRequiredSkills(primaryCode: string) {
  const templates: any = {
    R: [{ en: "Technical and mechanical skills", ru: "Технические и механические навыки", kk: "Техникалық және механикалық дағдылар" }],
    I: [{ en: "Analytical and critical thinking", ru: "Аналитическое и критическое мышление", kk: "Аналитикалық және сыни ойлау" }],
    A: [{ en: "Creative and artistic abilities", ru: "Творческие и художественные способности", kk: "Шығармашылық және көркемдік қабілеттер" }],
    S: [{ en: "Excellent communication skills", ru: "Отличные коммуникативные навыки", kk: "Тамаша коммуникация дағдылары" }],
    E: [{ en: "Leadership and management skills", ru: "Навыки руководства и управления", kk: "Басшылық және басқару дағдылары" }],
    C: [{ en: "Organizational and administrative skills", ru: "Организационные и административные навыки", kk: "Ұйымдастыру және әкімшілік дағдылар" }]
  };
  return templates[primaryCode] || templates['R'];
}

function generateWorkEnvironment(primaryCode: string) {
  const templates: any = {
    R: { en: "Work is typically performed in workshops, factories, or outdoor settings.", ru: "Работа обычно выполняется в мастерских, на заводах или на открытом воздухе.", kk: "Жұмыс әдетте шеберханаларда, зауыттарда немесе ашық жерлерде орындалады." },
    I: { en: "Work is typically performed in laboratories, research facilities, or office settings.", ru: "Работа обычно выполняется в лабораториях, исследовательских центрах или офисах.", kk: "Жұмыс әдетте зертханаларда, зерттеу орталықтарында немесе кеңселерде орындалады." },
    A: { en: "Work is typically performed in studios, creative spaces, or flexible environments.", ru: "Работа обычно выполняется в студиях, творческих пространствах или гибких средах.", kk: "Жұмыс әдетте студияларда, шығармашылық кеңістіктерде орындалады." },
    S: { en: "Work involves frequent interaction with people in schools, hospitals, or community centers.", ru: "Работа включает частое взаимодействие с людьми в школах, больницах или общественных центрах.", kk: "Жұмыс мектептерде, аурухана, қоғамдық орталықтарда адамдармен жиі өзара әрекеттесуді қамтиды." },
    E: { en: "Work is typically performed in office settings with time spent in meetings.", ru: "Работа обычно выполняется в офисах со временем на совещания.", kk: "Жұмыс әдетте кеңселерде кездесулерге уақыт бөле отырып орындалады." },
    C: { en: "Work is typically performed in structured office environments.", ru: "Работа обычно выполняется в структурированных офисных средах.", kk: "Жұмыс әдетте құрылымдық кеңсе орталарында орындалады." }
  };
  return templates[primaryCode] || templates['R'];
}

function generateTypicalTasks(primaryCode: string) {
  const templates: any = {
    R: [{ en: "Operating machinery and equipment", ru: "Эксплуатация машин и оборудования", kk: "Машиналар мен жабдықтарды пайдалану" }],
    I: [{ en: "Conducting experiments and research", ru: "Проведение экспериментов и исследований", kk: "Тәжірибелер мен зерттеулер жүргізу" }],
    A: [{ en: "Creating designs and artistic works", ru: "Создание дизайнов и художественных работ", kk: "Дизайндар мен көркем жұмыстарды жасау" }],
    S: [{ en: "Assisting and supporting individuals", ru: "Помощь и поддержка людей", kk: "Адамдарға көмек және қолдау көрсету" }],
    E: [{ en: "Leading meetings and presentations", ru: "Проведение совещаний и презентаций", kk: "Кездесулер мен презентацияларды өткізу" }],
    C: [{ en: "Processing paperwork and documentation", ru: "Обработка документов и документации", kk: "Құжаттар мен құжаттаманы өңдеу" }]
  };
  return templates[primaryCode] || templates['R'];
}

function generateToolsAndTechnologies(primaryCode: string) {
  const templates: any = {
    R: [{ en: "Hand and power tools", ru: "Ручные и электроинструменты", kk: "Қол және электр құралдары" }],
    I: [{ en: "Laboratory equipment and instruments", ru: "Лабораторное оборудование и приборы", kk: "Зертханалық жабдық пен аспаптар" }],
    A: [{ en: "Design software and applications", ru: "Программное обеспечение для дизайна", kk: "Дизайн бағдарламалық қамтамасыз етуі" }],
    S: [{ en: "Communication platforms and tools", ru: "Коммуникационные платформы и инструменты", kk: "Коммуникация платформалары мен құралдары" }],
    E: [{ en: "Business management software", ru: "Программное обеспечение для управления", kk: "Басқару бағдарламалық қамтамасыз етуі" }],
    C: [{ en: "Office productivity software", ru: "Программное обеспечение для офиса", kk: "Кеңсе өнімділігі бағдарламалық қамтамасыз етуі" }]
  };
  return templates[primaryCode] || templates['R'];
}

function generateSalaryRanges(riasecCodes: string[]) {
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

function generateIndustrySectors(riasecCodes: string[]) {
  const sectors: Array<{en: string, ru: string, kk: string}> = [];
  if (riasecCodes.includes('R')) sectors.push({ en: "Manufacturing", ru: "Производство", kk: "Өндіріс" });
  if (riasecCodes.includes('I')) sectors.push({ en: "Research & Development", ru: "Исследования и разработки", kk: "Зерттеу және әзірлеу" });
  if (riasecCodes.includes('A')) sectors.push({ en: "Creative Industries", ru: "Креативные индустрии", kk: "Шығармашылық салалар" });
  if (riasecCodes.includes('S')) sectors.push({ en: "Healthcare", ru: "Здравоохранение", kk: "Денсаулық сақтау" });
  if (riasecCodes.includes('E')) sectors.push({ en: "Business & Finance", ru: "Бизнес и финансы", kk: "Бизнес және қаржы" });
  if (riasecCodes.includes('C')) sectors.push({ en: "Administration", ru: "Администрация", kk: "Әкімшілік" });
  return sectors.slice(0, 4);
}

function getMinimumEducation(trainingLevel: string) {
  const level = parseInt(trainingLevel);
  if (level <= 2) return "High School Diploma or equivalent";
  if (level <= 4) return "Technical or Vocational Certificate";
  if (level <= 6) return "Bachelor's Degree";
  return "Master's Degree or higher";
}

function generateCertifications(riasecCodes: string[]) {
  const certs: Array<{en: string, ru: string, kk: string}> = [];
  if (riasecCodes.includes('R')) certs.push({ en: "Technical Certification", ru: "Техническая сертификация", kk: "Техникалық сертификаттау" });
  if (riasecCodes.includes('I')) certs.push({ en: "Professional License", ru: "Профессиональная лицензия", kk: "Кәсіби лицензия" });
  if (riasecCodes.includes('S') || riasecCodes.includes('E')) certs.push({ en: "Leadership Certificate", ru: "Сертификат лидерства", kk: "Көшбасшылық сертификаты" });
  return certs.length > 0 ? certs : [{ en: "Industry Certification", ru: "Отраслевая сертификация", kk: "Салалық сертификаттау" }];
}

function generateLearningPaths(trainingLevel: string) {
  const level = parseInt(trainingLevel);
  if (level <= 4) {
    return [{
      type: "vocational",
      description: {
        en: "2-3 year technical or vocational program with hands-on training",
        ru: "2-3-летняя техническая или профессиональная программа с практической подготовкой",
        kk: "Практикалық дайындықпен 2-3 жылдық техникалық немесе кәсіптік бағдарлама"
      }
    }];
  }
  return [{
    type: "academic",
    description: {
      en: "4-year bachelor's degree program followed by professional development",
      ru: "4-летняя программа бакалавриата с последующим профессиональным развитием",
      kk: "Кәсіби дамумен 4 жылдық бакалавриат бағдарламасы"
    }
  }];
}

function generateCareerPath(riasecCodes: string[]) {
  if (riasecCodes.includes('E')) {
    return {
      en: "Entry-level → Specialist → Senior specialist → Team leader → Manager",
      ru: "Начальная позиция → Специалист → Старший специалист → Руководитель группы → Менеджер",
      kk: "Бастапқы позиция → Маман → Аға маман → Топ жетекшісі → Менеджер"
    };
  }
  return {
    en: "Entry-level → Junior specialist → Specialist → Senior specialist → Expert",
    ru: "Начальный уровень → Младший специалист → Специалист → Старший специалист → Эксперт",
    kk: "Бастапқы деңгей → Кіші маман → Маман → Аға маман → Сарапшы"
  };
}

async function main() {
  log('🚀 Starting Profession Repopulation...', colors.yellow);

  try {
    // Read Excel file
    log('\n📊 Reading Excel file...', colors.cyan);
    const workbook = XLSX.readFile('mock-data/job_general_data.xlsx');
    const worksheet = workbook.Sheets['gendata'];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    log(`✓ Found ${data.length} professions in Excel`, colors.green);

    // Get professions that were updated by the previous script (have archetypes but potentially incomplete education)
    log('\n🔍 Finding professions to repopulate...', colors.cyan);

    const allProfessions = await prisma.profession.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        archetypes: true,
        education: true,
        marketResearch: true,
        descriptionData: true,
        general: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Find the 50 most recently updated professions that need fixing
    const needsFixing = allProfessions.filter(p =>
      p.archetypes !== null && p.descriptionData !== null && p.general !== null
    ).slice(0, 50);

    log(`✓ Found ${needsFixing.length} professions to repopulate`, colors.green);

    // Create a map of Excel data by ID
    const excelMap = new Map();
    data.forEach(row => {
      if (row.jobid) {
        excelMap.set(row.jobid, row);
      }
    });

    let updated = 0;
    let skipped = 0;

    for (const profession of needsFixing) {
      const excelRow = excelMap.get(profession.id);

      if (!excelRow) {
        log(`  ⊘ Skipping ${profession.code} - not found in Excel`, colors.yellow);
        skipped++;
        continue;
      }

      try {
        // Generate complete profession data
        const professionData = generateProfessionData(excelRow, profession.name, profession.category?.name);

        // Update the profession with all fields
        await prisma.profession.update({
          where: { id: profession.id },
          data: {
            descriptionData: professionData.descriptionData,
            archetypes: professionData.archetypes,
            education: professionData.education,
            marketResearch: professionData.marketResearch,
            general: professionData.general,
          },
        });

        const hasEducation = professionData.education.specializations ? 'with education' : 'without education';
        log(`  ✓ Updated ${profession.code} ${hasEducation}`, colors.green);
        updated++;
      } catch (error: any) {
        log(`  ✗ Error updating ${profession.code}: ${error.message}`, colors.red);
        skipped++;
      }
    }

    log(`\n✅ Repopulation completed!`, colors.green);
    log(`  Updated: ${updated} professions`, colors.blue);
    log(`  Skipped: ${skipped} professions`, colors.yellow);

    // Show summary
    const allProf = await prisma.profession.findMany({
      select: {
        education: true,
        marketResearch: true,
        archetypes: true,
        descriptionData: true,
      },
    });

    const stats = {
      withEducation: allProf.filter(p => p.education !== null).length,
      withEducationSpecializations: allProf.filter(p => p.education && (p.education as any).specializations).length,
      withMarketResearch: allProf.filter(p => p.marketResearch !== null).length,
      withArchetypes: allProf.filter(p => p.archetypes !== null).length,
      withDescriptionData: allProf.filter(p => p.descriptionData !== null).length,
      total: allProf.length,
    };

    log(`\n📊 Database Summary:`, colors.cyan);
    log(`  Total professions: ${stats.total}`, colors.blue);
    log(`  With education: ${stats.withEducation}`, colors.blue);
    log(`  With education.specializations: ${stats.withEducationSpecializations}`, colors.blue);
    log(`  With marketResearch: ${stats.withMarketResearch}`, colors.blue);
    log(`  With archetypes: ${stats.withArchetypes}`, colors.blue);
    log(`  With descriptionData: ${stats.withDescriptionData}`, colors.blue);

  } catch (error: any) {
    log(`\n❌ Repopulation failed: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
