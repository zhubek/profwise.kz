import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// Helper to parse malformed education data
function parseEducationData(rawData: string): any {
  try {
    // The spec_name is double-encoded, and universities are concatenated without array brackets
    const lines = rawData.split('\n');

    let specName = null;
    const universities: any[] = [];

    for (const line of lines) {
      if (line.includes('"spec_name":')) {
        const match = line.match(/"spec_name":\s*"({.*?})"/);
        if (match) {
          specName = JSON.parse(match[1].replace(/\\/g, ''));
        }
      } else if (line.includes('"universities":')) {
        // Extract concatenated JSON objects
        const uniMatch = line.match(/"universities":\s*"(.*)"/s);
        if (uniMatch) {
          const uniString = uniMatch[1];
          // Split by }{ pattern to separate objects
          const uniObjects = uniString.split('}\n{');
          for (let i = 0; i < uniObjects.length; i++) {
            let obj = uniObjects[i];
            // Add missing braces
            if (!obj.startsWith('{')) obj = '{' + obj;
            if (!obj.endsWith('}')) obj = obj + '}';
            try {
              universities.push(JSON.parse(obj));
            } catch (e) {
              console.log('Failed to parse university object:', obj);
            }
          }
        }
      }
    }

    return { specName, universities };
  } catch (error) {
    console.error('Error parsing education data:', error);
    return { specName: null, universities: [] };
  }
}

// Helper to parse malformed market data
function parseMarketData(rawData: string): any {
  try {
    // Fix unquoted strings
    let fixed = rawData
      .replace(/"rate":\s*([^,}]+),/, '"rate": "$1",')
      .replace(/"popular":\s*([^,}]+)}/, '"popular": "$1"}');

    return JSON.parse(fixed);
  } catch (error) {
    console.error('Error parsing market data:', error);
    // Return default structure
    return {
      training_level: "4",
      median_wage: 0,
      rate: "Unknown",
      popular: "N"
    };
  }
}

async function populateSingleProfession() {
  try {
    console.log('📖 Reading Excel file...\n');

    const filePath = '/home/bex/projects/profwise.kz/backend/mock-data/job_general_data.xlsx';
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets['gendata'];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const record = data[0] as any;

    console.log('📦 Processing Job ID:', record.jobid);
    console.log('🏷️  RIASEC Code:', record.riaseccodes);

    // Parse all data
    const educationRaw = parseEducationData(record.education_data);
    const marketRaw = parseMarketData(record.market_data);
    const archetypeRaw = JSON.parse(record.archetype_data);

    console.log('\n✅ Parsed archetype data');
    console.log('✅ Parsed market data (fixed)');
    console.log('✅ Parsed education data (partial)');

    // Since this is a management profession (RIASEC: EC - Enterprising/Conventional)
    // Let's create comprehensive data for "Chief Executive" or "Administrative Manager"

    // 1. CREATE DESCRIPTION DATA (new field)
    const descriptionData = {
      overview: {
        en: "Chief executives plan, direct, and coordinate operational activities at the highest level of management with the help of subordinate executives and staff managers. They determine and formulate policies and provide overall direction of companies or organizations within guidelines set up by a board of directors or similar governing body.",
        ru: "Генеральные директора планируют, направляют и координируют операционную деятельность на высшем уровне управления с помощью подчиненных руководителей и менеджеров персонала. Они определяют и формулируют политику и обеспечивают общее руководство компаниями или организациями в рамках руководящих принципов, установленных советом директоров.",
        kk: "Бас атқарушы директорлар бағыныңқы басшылар мен персонал менеджерлерінің көмегімен басқарудың ең жоғары деңгейінде операциялық қызметті жоспарлайды, бағыттайды және үйлестіреді. Олар директорлар кеңесі белгілеген бағыттар шеңберінде компаниялар мен ұйымдарды басқарудың жалпы саясатын айқындайды және қалыптастырады."
      },
      keyResponsibilities: [
        {
          en: "Establish and implement departmental policies, goals, objectives, and procedures",
          ru: "Установление и внедрение политики, целей, задач и процедур подразделений",
          kk: "Бөлімшелердің саясатын, мақсаттарын, міндеттерін және рәсімдерін белгілеу және енгізу"
        },
        {
          en: "Direct and coordinate organizational activities to ensure efficiency and productivity",
          ru: "Руководство и координация организационной деятельности для обеспечения эффективности и производительности",
          kk: "Тиімділік пен өнімділікті қамтамасыз ету үшін ұйымдық қызметті басқару және үйлестіру"
        },
        {
          en: "Review financial reports and use data to allocate budgets and resources",
          ru: "Анализ финансовых отчетов и использование данных для распределения бюджетов и ресурсов",
          kk: "Қаржылық есептерді талдау және бюджет пен ресурстарды бөлуге деректерді пайдалану"
        },
        {
          en: "Oversee hiring, training, and employee performance management",
          ru: "Контроль за наймом, обучением и управлением эффективностью сотрудников",
          kk: "Жұмысқа қабылдауды, оқытуды және қызметкерлердің жұмысын басқаруды қадағалау"
        },
        {
          en: "Represent the organization in negotiations, legal proceedings, and public relations",
          ru: "Представление организации на переговорах, в судебных разбирательствах и связях с общественностью",
          kk: "Келіссөздерде, сот талқылауларында және қоғаммен байланыста ұйымды білдіру"
        }
      ],
      requiredSkills: [
        {
          en: "Strategic planning and decision-making",
          ru: "Стратегическое планирование и принятие решений",
          kk: "Стратегиялық жоспарлау және шешім қабылдау"
        },
        {
          en: "Leadership and team management",
          ru: "Лидерство и управление командой",
          kk: "Көшбасшылық және топты басқару"
        },
        {
          en: "Financial analysis and budget management",
          ru: "Финансовый анализ и управление бюджетом",
          kk: "Қаржылық талдау және бюджетті басқару"
        },
        {
          en: "Communication and interpersonal skills",
          ru: "Коммуникативные и межличностные навыки",
          kk: "Коммуникация және тұлғааралық дағдылар"
        },
        {
          en: "Problem-solving and critical thinking",
          ru: "Решение проблем и критическое мышление",
          kk: "Мәселелерді шешу және сыни ойлау"
        },
        {
          en: "Negotiation and conflict resolution",
          ru: "Переговоры и разрешение конфликтов",
          kk: "Келіссөздер және қақтығыстарды шешу"
        },
        {
          en: "Industry knowledge and market awareness",
          ru: "Знание отрасли и рынка",
          kk: "Салалық білім және нарық туралы хабардарлық"
        }
      ],
      workEnvironment: {
        en: "Office setting, often in corporate headquarters or main business locations. Long hours including evenings and weekends are common. Frequent travel may be required for meetings, conferences, and site visits.",
        ru: "Офисная среда, часто в корпоративных штаб-квартирах или основных бизнес-локациях. Длинные рабочие часы, включая вечера и выходные. Могут потребоваться частые командировки на встречи, конференции и визиты на объекты.",
        kk: "Кеңсе ортасы, көбінесе корпоративтік штаб-пәтерлерде немесе негізгі бизнес орындарында. Кештер мен демалыс күндерін қоса алғанда ұзақ жұмыс сағаттары. Кездесулер, конференциялар және объектілерге барулар үшін жиі іссапарлар қажет болуы мүмкін."
      },
      typicalTasks: [
        {
          en: "Reviewing reports and making strategic decisions",
          ru: "Анализ отчетов и принятие стратегических решений",
          kk: "Есептерді талдау және стратегиялық шешімдер қабылдау"
        },
        {
          en: "Meeting with department heads and senior managers",
          ru: "Встречи с руководителями подразделений и старшими менеджерами",
          kk: "Бөлім басшылары мен аға менеджерлермен кездесулер"
        },
        {
          en: "Negotiating contracts and partnerships",
          ru: "Ведение переговоров по контрактам и партнерствам",
          kk: "Келісімшарттар мен серіктестіктер бойынша келіссөздер жүргізу"
        },
        {
          en: "Overseeing major organizational changes and initiatives",
          ru: "Надзор за крупными организационными изменениями и инициативами",
          kk: "Ірі ұйымдық өзгерістер мен бастамаларды қадағалау"
        }
      ],
      toolsAndTechnologies: [
        {
          en: "Enterprise Resource Planning (ERP) systems",
          ru: "Системы планирования ресурсов предприятия (ERP)",
          kk: "Кәсіпорын ресурстарын жоспарлау жүйелері (ERP)"
        },
        {
          en: "Business Intelligence (BI) and analytics platforms",
          ru: "Платформы бизнес-аналитики (BI) и аналитики",
          kk: "Бизнес-аналитика (BI) және аналитика платформалары"
        },
        {
          en: "Microsoft Office Suite (Excel, PowerPoint, Word)",
          ru: "Microsoft Office Suite (Excel, PowerPoint, Word)",
          kk: "Microsoft Office Suite (Excel, PowerPoint, Word)"
        },
        {
          en: "Project management software (Asana, Monday.com)",
          ru: "Программное обеспечение для управления проектами (Asana, Monday.com)",
          kk: "Жобаларды басқару бағдарламалық жасақтамасы (Asana, Monday.com)"
        },
        {
          en: "Video conferencing tools (Zoom, Microsoft Teams)",
          ru: "Инструменты видеоконференцсвязи (Zoom, Microsoft Teams)",
          kk: "Бейнеконференция құралдары (Zoom, Microsoft Teams)"
        }
      ]
    };

    // 2. CREATE ARCHETYPES DATA
    const archetypesData = {
      riasecCodes: record.riaseccodes.split('').map((c: string) => c.toUpperCase()), // ["E", "C"]
      primaryArchetypes: {
        interests: ["enterprising", "conventional"],
        skills: ["leadership", "organization", "communication"],
        personality: ["extraverted", "judging", "thinking"],
        values: ["achievement", "recognition", "independence"]
      },
      archetypeScores: {
        interests: {
          realistic: 30,
          investigative: 45,
          artistic: 35,
          social: 55,
          enterprising: 85, // Primary
          conventional: 75  // Secondary
        },
        skills: {
          leadership: 95,
          organization: 90,
          communication: 85,
          analytical: 70,
          technical: 45,
          creative: 50
        },
        personality: {
          openness: archetypeRaw.openness,
          conscientiousness: archetypeRaw.conscientiousness,
          extraversion: 75, // Added based on EC type
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

    // 3. CREATE MARKET RESEARCH DATA (using Kazakhstan market, not US salaries)
    const marketResearch = {
      demandLevel: "high",
      jobGrowth: "+8%",
      annualOpenings: 1200,
      salaryRanges: {
        entry: { min: 250000, max: 500000, currency: "KZT", period: "monthly" },
        mid: { min: 500000, max: 1000000, currency: "KZT", period: "monthly" },
        senior: { min: 1000000, max: 3000000, currency: "KZT", period: "monthly" }
      },
      industrySectors: [
        { en: "Corporate Management", ru: "Корпоративное управление", kk: "Корпоративтік басқару" },
        { en: "Financial Services", ru: "Финансовые услуги", kk: "Қаржы қызметтері" },
        { en: "Manufacturing", ru: "Производство", kk: "Өндіріс" },
        { en: "Technology", ru: "Технологии", kk: "Технология" },
        { en: "Consulting", ru: "Консалтинг", kk: "Консалтинг" }
      ],
      geographicHotspots: [
        { en: "Almaty", ru: "Алматы", kk: "Алматы" },
        { en: "Astana", ru: "Астана", kk: "Астана" },
        { en: "Shymkent", ru: "Шымкент", kk: "Шымкент" }
      ],
      trends: [
        {
          en: "Growing demand for digital transformation leaders",
          ru: "Растущий спрос на лидеров цифровой трансформации",
          kk: "Цифрлық трансформация көшбасшыларына сұраныстың өсуі"
        },
        {
          en: "Emphasis on sustainability and ESG practices",
          ru: "Акцент на устойчивость и практики ESG",
          kk: "Тұрақтылық пен ESG тәжірибелеріне баса назар аудару"
        },
        {
          en: "Need for global business perspective and cultural awareness",
          ru: "Необходимость глобальной бизнес-перспективы и культурной осведомленности",
          kk: "Жаһандық бизнес перспективасы мен мәдени хабардарлық қажеттілігі"
        }
      ]
    };

    // 4. CREATE EDUCATION DATA (simplified - just spec codes for now)
    // We'll populate full universities later
    const educationData = {
      minimumEducation: "Bachelor's Degree",
      preferredFields: [
        { en: "Business Administration", ru: "Бизнес-администрирование", kk: "Бизнес әкімшілігі" },
        { en: "Management", ru: "Менеджмент", kk: "Менеджмент" },
        { en: "Economics", ru: "Экономика", kk: "Экономика" },
        { en: "Finance", ru: "Финансы", kk: "Қаржы" }
      ],
      certifications: [
        { en: "MBA (Master of Business Administration)", ru: "MBA (Магистр делового администрирования)", kk: "MBA (Бизнес әкімшілігі магистрі)" },
        { en: "Project Management Professional (PMP)", ru: "Профессиональный менеджер проектов (PMP)", kk: "Кәсіби жоба менеджері (PMP)" },
        { en: "Executive Leadership Certificate", ru: "Сертификат исполнительного руководства", kk: "Атқарушы көшбасшылық сертификаты" }
      ],
      learningPaths: [
        {
          type: "university",
          description: {
            en: "4-year bachelor's degree in business, management, or related field, followed by several years of progressive management experience",
            ru: "4-летняя степень бакалавра в области бизнеса, менеджмента или смежных областях, с последующим многолетним опытом управления",
            kk: "Бизнес, менеджмент немесе сол сияқты салада 4 жылдық бакалавр дәрежесі, содан кейін көп жылдық басқару тәжірибесі"
          }
        },
        {
          type: "experience",
          description: {
            en: "Typically requires 10+ years of experience in progressively responsible management positions",
            ru: "Обычно требуется более 10 лет опыта на должностях с постепенно возрастающей ответственностью",
            kk: "Әдетте, жауапкершілігі өсіп келе жатқан басқарушылық лауазымдарда 10+ жыл тәжірибе қажет"
          }
        }
      ]
    };

    // 5. CREATE GENERAL DATA
    const generalData = {
      overview: {
        en: "Chief executives are at the top of the management hierarchy, responsible for the overall success and direction of an organization",
        ru: "Генеральные директора находятся на вершине управленческой иерархии, отвечая за общий успех и направление организации",
        kk: "Бас атқарушы директорлар ұйымның жалпы табысы мен бағыты үшін жауапты басқару иерархиясының ең жоғарғы бөлігінде"
      },
      alternativeTitles: [
        { en: "CEO (Chief Executive Officer)", ru: "Генеральный директор", kk: "Бас атқарушы директор" },
        { en: "President", ru: "Президент", kk: "Президент" },
        { en: "Managing Director", ru: "Управляющий директор", kk: "Басқарушы директор" },
        { en: "Executive Director", ru: "Исполнительный директор", kk: "Атқарушы директор" }
      ],
      careerPath: {
        en: "Typically progresses from entry-level management → middle management → senior management → executive leadership",
        ru: "Обычно продвижение происходит от начального менеджмента → среднего менеджмента → высшего менеджмента → исполнительного руководства",
        kk: "Әдетте бастапқы басқарудан → орта басқаруға → жоғары басқаруға → атқарушы көшбасшылыққа дейін өседі"
      }
    };

    // Now let's find or create the category
    console.log('\n🔍 Finding or creating category...');

    let category = await prisma.category.findFirst({
      where: {
        name: {
          path: ['en'],
          equals: 'Business and Management'
        }
      }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: {
            en: "Business and Management",
            ru: "Бизнес и менеджмент",
            kk: "Бизнес және менеджмент"
          },
          description: {
            en: "Professions related to business operations, administration, and organizational management",
            ru: "Профессии, связанные с бизнес-операциями, администрированием и управлением организациями",
            kk: "Бизнес операцияларына, әкімшілікке және ұйымдық басқаруға байланысты мамандықтар"
          }
        }
      });
      console.log('✅ Created new category:', category.id);
    } else {
      console.log('✅ Found existing category:', category.id);
    }

    // Create or update the profession
    console.log('\n📝 Creating/updating profession...');

    const profession = await prisma.profession.upsert({
      where: { code: 'MGT-001' },
      update: {
        name: {
          en: "Chief Executive",
          ru: "Генеральный директор",
          kk: "Бас атқарушы директор"
        },
        description: {
          en: "Plan, direct, and coordinate operational activities at the highest level of management",
          ru: "Планирование, руководство и координация операционной деятельности на высшем уровне управления",
          kk: "Басқарудың ең жоғары деңгейінде операциялық қызметті жоспарлау, басқару және үйлестіру"
        },
        categoryId: category.id,
        featured: true,
        descriptionData: descriptionData,
        archetypes: archetypesData,
        education: educationData,
        marketResearch: marketResearch,
        general: generalData
      },
      create: {
        code: 'MGT-001',
        name: {
          en: "Chief Executive",
          ru: "Генеральный директор",
          kk: "Бас атқарушы директор"
        },
        description: {
          en: "Plan, direct, and coordinate operational activities at the highest level of management",
          ru: "Планирование, руководство и координация операционной деятельности на высшем уровне управления",
          kk: "Басқарудың ең жоғары деңгейінде операциялық қызметті жоспарлау, басқару және үйлестіру"
        },
        categoryId: category.id,
        featured: true,
        descriptionData: descriptionData,
        archetypes: archetypesData,
        education: educationData,
        marketResearch: marketResearch,
        general: generalData
      }
    });

    console.log('\n✅ SUCCESS! Profession created/updated:');
    console.log('   ID:', profession.id);
    console.log('   Code:', profession.code);
    console.log('   Name:', profession.name);
    console.log('\n📊 Populated fields:');
    console.log('   ✓ descriptionData (6 fields)');
    console.log('   ✓ archetypes (RIASEC scores + personality)');
    console.log('   ✓ marketResearch (salary, demand, trends)');
    console.log('   ✓ education (requirements, paths)');
    console.log('   ✓ general (overview, career path)');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateSingleProfession()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
