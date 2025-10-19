import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const PROFESSION_ID = '233db5ae-9569-4596-88a5-92960c710653'; // Mechanics

async function populateMechanics() {
  try {
    console.log('📖 Reading Excel file...\n');

    const filePath = '/home/bex/projects/profwise.kz/backend/mock-data/job_general_data.xlsx';
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets['gendata'];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Find the mechanics profession in Excel
    const record = data.find((row: any) => row.jobid === PROFESSION_ID) as any;

    if (!record) {
      throw new Error(`Profession ${PROFESSION_ID} not found in Excel`);
    }

    console.log('📦 Processing Job ID:', record.jobid);
    console.log('🏷️  RIASEC Code:', record.riaseccodes);

    // Parse Excel data
    const archetypeRaw = JSON.parse(record.archetype_data);
    const marketRaw = JSON.parse(record.market_data.replace(/"rate":\s*([^,}]+),/, '"rate": "$1",').replace(/"popular":\s*([^,}]+)}/, '"popular": "$1"}'));

    console.log('\n✅ Parsed archetype data');
    console.log('✅ Parsed market data');
    console.log('\nArchetype values:', archetypeRaw);
    console.log('Market data:', marketRaw);

    // 1. CREATE DESCRIPTION DATA
    const descriptionData = {
      overview: {
        en: "Mechanics install, maintain, and repair machinery, mechanical equipment, and components. They diagnose mechanical problems, dismantle defective machines and equipment, and install, repair, or replace faulty or worn parts using hand and power tools.",
        ru: "Слесари устанавливают, обслуживают и ремонтируют машины, механическое оборудование и компоненты. Они диагностируют механические проблемы, разбирают неисправное оборудование и устанавливают, ремонтируют или заменяют неисправные или изношенные детали с помощью ручных и электроинструментов.",
        kk: "Слесарьлар машиналарды, механикалық жабдықтар мен компоненттерді орнатады, қызмет көрсетеді және жөндейді. Олар механикалық ақауларды диагностикалайды, ақаулы жабдықтарды бөлшектейді және қол мен электр құралдарының көмегімен ақаулы немесе тозған бөлшектерді орнатады, жөндейді немесе ауыстырады."
      },
      keyResponsibilities: [
        {
          en: "Inspect machinery and equipment to identify defects and malfunctions",
          ru: "Осмотр машин и оборудования для выявления дефектов и неисправностей",
          kk: "Ақаулар мен ақауларды анықтау үшін машиналар мен жабдықтарды тексеру"
        },
        {
          en: "Dismantle devices to access and remove defective parts using hand and power tools",
          ru: "Разборка устройств для доступа и удаления неисправных деталей с помощью ручных и электроинструментов",
          kk: "Қол мен электр құралдарының көмегімен ақаулы бөлшектерге қол жеткізу және оларды алу үшін құрылғыларды бөлшектеу"
        },
        {
          en: "Repair or replace broken or malfunctioning components and parts",
          ru: "Ремонт или замена сломанных или неисправных компонентов и деталей",
          kk: "Сынған немесе ақаулы компоненттер мен бөлшектерді жөндеу немесе ауыстыру"
        },
        {
          en: "Test repaired equipment to ensure proper functioning",
          ru: "Тестирование отремонтированного оборудования для обеспечения правильной работы",
          kk: "Дұрыс жұмыс істеуін қамтамасыз ету үшін жөнделген жабдықты сынау"
        },
        {
          en: "Perform routine preventive maintenance to ensure machines continue running smoothly",
          ru: "Выполнение планового профилактического обслуживания для обеспечения бесперебойной работы машин",
          kk: "Машиналардың үздіксіз жұмыс істеуін қамтамасыз ету үшін жоспарлы профилактикалық қызмет көрсету"
        }
      ],
      requiredSkills: [
        {
          en: "Mechanical aptitude and technical understanding",
          ru: "Механические способности и техническое понимание",
          kk: "Механикалық қабілеттер және техникалық түсінік"
        },
        {
          en: "Proficiency with hand and power tools",
          ru: "Владение ручными и электроинструментами",
          kk: "Қол мен электр құралдарын пайдалану дағдылары"
        },
        {
          en: "Problem-solving and troubleshooting skills",
          ru: "Навыки решения проблем и устранения неполадок",
          kk: "Мәселелерді шешу және ақауларды жою дағдылары"
        },
        {
          en: "Ability to read and interpret technical drawings and manuals",
          ru: "Умение читать и интерпретировать технические чертежи и руководства",
          kk: "Техникалық сызбалар мен нұсқаулықтарды оқу және түсіндіру қабілеті"
        },
        {
          en: "Physical stamina and dexterity",
          ru: "Физическая выносливость и ловкость",
          kk: "Физикалық шыдамдылық және икемділік"
        },
        {
          en: "Attention to detail and precision",
          ru: "Внимание к деталям и точность",
          kk: "Бөлшектерге назар аудару және дәлдік"
        },
        {
          en: "Safety awareness and compliance",
          ru: "Осведомленность о безопасности и соблюдение правил",
          kk: "Қауіпсіздік туралы хабардарлық және ережелерді сақтау"
        }
      ],
      workEnvironment: {
        en: "Mechanics typically work in workshops, factories, or on-site at client locations. Work environments can be noisy and involve exposure to machinery, oils, and chemicals. Physical demands include standing for long periods, lifting heavy equipment, and working in confined spaces.",
        ru: "Слесари обычно работают в мастерских, на заводах или на объектах заказчиков. Рабочая среда может быть шумной и связана с воздействием машин, масел и химикатов. Физические требования включают длительное стояние, подъем тяжелого оборудования и работу в ограниченных пространствах.",
        kk: "Слесарьлар әдетте шеберханаларда, зауыттарда немесе тапсырыс берушілердің объектілерінде жұмыс істейді. Жұмыс ортасы шулы болуы мүмкін және машиналар, майлар және химикаттардың әсеріне байланысты. Физикалық талаптарға ұзақ уақыт тұру, ауыр жабдықты көтеру және шектеулі кеңістікте жұмыс істеу кіреді."
      },
      typicalTasks: [
        {
          en: "Performing scheduled maintenance on machinery",
          ru: "Проведение планового технического обслуживания машин",
          kk: "Машиналарға жоспарлы техникалық қызмет көрсету"
        },
        {
          en: "Diagnosing mechanical failures and malfunctions",
          ru: "Диагностика механических сбоев и неисправностей",
          kk: "Механикалық ақаулар мен бұзылыстарды диагностикалау"
        },
        {
          en: "Replacing worn bearings, gears, and other components",
          ru: "Замена изношенных подшипников, шестерен и других компонентов",
          kk: "Тозған подшипниктерді, тісті дөңгелектер мен басқа компоненттерді ауыстыру"
        },
        {
          en: "Adjusting and calibrating mechanical systems",
          ru: "Настройка и калибровка механических систем",
          kk: "Механикалық жүйелерді баптау және калибрлеу"
        }
      ],
      toolsAndTechnologies: [
        {
          en: "Hand tools (wrenches, screwdrivers, pliers)",
          ru: "Ручные инструменты (гаечные ключи, отвертки, плоскогубцы)",
          kk: "Қол құралдары (кілт, бұрағыш, қысқыш)"
        },
        {
          en: "Power tools (drills, grinders, impact wrenches)",
          ru: "Электроинструменты (дрели, шлифовальные машины, гайковерты)",
          kk: "Электр құралдары (бұрғы, тегістеуіш, гайколық)"
        },
        {
          en: "Measuring instruments (calipers, micrometers, gauges)",
          ru: "Измерительные приборы (штангенциркули, микрометры, калибры)",
          kk: "Өлшеу құралдары (штангенциркуль, микрометр, калибр)"
        },
        {
          en: "Welding and cutting equipment",
          ru: "Сварочное и режущее оборудование",
          kk: "Дәнекерлеу және кесу жабдығы"
        },
        {
          en: "Diagnostic equipment and testing devices",
          ru: "Диагностическое оборудование и испытательные устройства",
          kk: "Диагностикалық жабдық және сынау құрылғылары"
        }
      ]
    };

    // 2. CREATE ARCHETYPES DATA
    const archetypesData = {
      riasecCodes: record.riaseccodes.split('').map((c: string) => c.toUpperCase()), // ["R", "I", "C"]
      primaryArchetypes: {
        interests: ["realistic", "investigative"],
        skills: ["mechanical", "technical", "problem-solving"],
        personality: ["practical", "analytical", "detail-oriented"],
        values: ["stability", "tangible-results", "independence"]
      },
      archetypeScores: {
        interests: {
          realistic: 90,      // Primary - hands-on, practical work
          investigative: 75,  // Secondary - problem diagnosis
          artistic: 20,
          social: 30,
          enterprising: 40,
          conventional: 70    // Tertiary - following procedures
        },
        skills: {
          mechanical: 95,
          technical: 90,
          problemSolving: 85,
          attention: 80,
          manual: 90,
          analytical: 70
        },
        personality: {
          openness: archetypeRaw.openness,
          conscientiousness: archetypeRaw.conscientiousness,
          extraversion: 45, // Moderate - can work alone or in teams
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

    // 3. CREATE MARKET RESEARCH DATA (Kazakhstan market)
    const marketResearch = {
      demandLevel: marketRaw.popular === 'Y' ? "high" : "moderate",
      jobGrowth: marketRaw.rate,
      annualOpenings: 2500,
      salaryRanges: {
        entry: { min: 120000, max: 180000, currency: "KZT", period: "monthly" },
        mid: { min: 180000, max: 300000, currency: "KZT", period: "monthly" },
        senior: { min: 300000, max: 500000, currency: "KZT", period: "monthly" }
      },
      industrySectors: [
        { en: "Manufacturing", ru: "Производство", kk: "Өндіріс" },
        { en: "Automotive", ru: "Автомобильная промышленность", kk: "Автомобиль өнеркәсібі" },
        { en: "Construction", ru: "Строительство", kk: "Құрылыс" },
        { en: "Mining", ru: "Горнодобывающая промышленность", kk: "Тау-кен өнеркәсібі" },
        { en: "Oil and Gas", ru: "Нефть и газ", kk: "Мұнай және газ" }
      ],
      geographicHotspots: [
        { en: "Almaty", ru: "Алматы", kk: "Алматы" },
        { en: "Shymkent", ru: "Шымкент", kk: "Шымкент" },
        { en: "Karaganda", ru: "Караганда", kk: "Қарағанды" },
        { en: "Aktobe", ru: "Актобе", kk: "Ақтөбе" }
      ],
      trends: [
        {
          en: "Increasing automation requiring mechanics to work with advanced machinery",
          ru: "Растущая автоматизация требует от слесарей работы со сложным оборудованием",
          kk: "Өсіп келе жатқан автоматтандыру слесарьлардан күрделі жабдықпен жұмыс істеуді талап етеді"
        },
        {
          en: "Growing need for specialists in industrial equipment maintenance",
          ru: "Растущая потребность в специалистах по обслуживанию промышленного оборудования",
          kk: "Өнеркәсіптік жабдықты қызмет көрсету мамандарына сұраныстың өсуі"
        },
        {
          en: "Emphasis on energy-efficient and sustainable machinery",
          ru: "Акцент на энергоэффективное и устойчивое оборудование",
          kk: "Энергия үнемдейтін және тұрақты жабдыққа баса назар аудару"
        }
      ]
    };

    // 4. CREATE EDUCATION DATA
    const educationData = {
      minimumEducation: "Technical or Vocational Certificate",
      preferredFields: [
        { en: "Mechanical Engineering", ru: "Механическая инженерия", kk: "Механикалық инженерия" },
        { en: "Industrial Mechanics", ru: "Промышленная механика", kk: "Өнеркәсіптік механика" },
        { en: "Equipment Maintenance", ru: "Обслуживание оборудования", kk: "Жабдықты қызмет көрсету" }
      ],
      certifications: [
        { en: "Industrial Mechanic Certificate", ru: "Сертификат промышленного механика", kk: "Өнеркәсіптік механик сертификаты" },
        { en: "Welding Certification", ru: "Сертификат сварщика", kk: "Дәнекерлеуші сертификаты" },
        { en: "Safety Training Certificate", ru: "Сертификат по технике безопасности", kk: "Қауіпсіздік техникасы сертификаты" }
      ],
      learningPaths: [
        {
          type: "vocational",
          description: {
            en: "2-3 year technical or vocational program in mechanical trades, followed by apprenticeship or on-the-job training",
            ru: "2-3-летняя техническая или профессиональная программа по механическим специальностям с последующей стажировкой или обучением на рабочем месте",
            kk: "Механикалық мамандықтар бойынша 2-3 жылдық техникалық немесе кәсіптік бағдарлама, содан кейін тәлімгерлік немесе жұмыс орнында оқыту"
          }
        },
        {
          type: "apprenticeship",
          description: {
            en: "3-4 year apprenticeship program combining classroom instruction with hands-on training",
            ru: "3-4-летняя программа стажировки, сочетающая аудиторное обучение с практической подготовкой",
            kk: "Сынып оқытуын практикалық дайындықпен біріктіретін 3-4 жылдық тәлімгерлік бағдарлама"
          }
        }
      ]
    };

    // 5. CREATE GENERAL DATA
    const generalData = {
      overview: {
        en: "Mechanics are skilled tradespeople who work with their hands to install, maintain, and repair mechanical equipment across various industries",
        ru: "Слесари - это квалифицированные специалисты, которые работают руками для установки, обслуживания и ремонта механического оборудования в различных отраслях",
        kk: "Слесарьлар әртүрлі салаларда механикалық жабдықты орнату, қызмет көрсету және жөндеу үшін қолдарымен жұмыс істейтін білікті мамандар"
      },
      alternativeTitles: [
        { en: "Industrial Mechanic", ru: "Промышленный механик", kk: "Өнеркәсіптік механик" },
        { en: "Maintenance Mechanic", ru: "Механик по обслуживанию", kk: "Қызмет көрсету механигі" },
        { en: "Equipment Technician", ru: "Техник по оборудованию", kk: "Жабдық техниггі" },
        { en: "Machinist", ru: "Машинист", kk: "Машинист" }
      ],
      careerPath: {
        en: "Entry-level helper → Journeyman mechanic → Senior mechanic → Maintenance supervisor → Shop manager",
        ru: "Помощник начального уровня → Квалифицированный слесарь → Старший слесарь → Супервайзер по обслуживанию → Руководитель цеха",
        kk: "Бастапқы көмекші → Білікті слесарь → Аға слесарь → Қызмет көрсету супервайзері → Цех басшысы"
      }
    };

    // Get the profession from database
    console.log('\n🔍 Finding profession in database...');
    const profession = await prisma.profession.findUnique({
      where: { id: PROFESSION_ID },
      include: { category: true }
    });

    if (!profession) {
      throw new Error(`Profession ${PROFESSION_ID} not found in database`);
    }

    console.log('✅ Found profession:', profession.name);
    console.log('   Category:', profession.category?.name);

    // Update the profession with all JSON data
    console.log('\n📝 Updating profession with JSON data...');

    const updated = await prisma.profession.update({
      where: { id: PROFESSION_ID },
      data: {
        descriptionData: descriptionData,
        archetypes: archetypesData,
        education: educationData,
        marketResearch: marketResearch,
        general: generalData
      }
    });

    console.log('\n✅ SUCCESS! Profession updated:');
    console.log('   ID:', updated.id);
    console.log('   Name:', updated.name);
    console.log('\n📊 Populated fields:');
    console.log('   ✓ descriptionData (6 sections)');
    console.log('   ✓ archetypes (RIASEC: RIC)');
    console.log('   ✓ marketResearch (salary, demand, trends)');
    console.log('   ✓ education (vocational training)');
    console.log('   ✓ general (overview, career path)');

    // Now let's also add this profession to the current user's professions
    console.log('\n👤 Adding profession to user profile...');

    const USER_ID = 'c3ed58fd-8d73-40ca-9ac6-468949b56af0'; // Bex's user ID

    // First check if this profession is already added
    const existing = await prisma.userProfession.findFirst({
      where: {
        userId: USER_ID,
        professionId: PROFESSION_ID
      }
    });

    if (!existing) {
      // Add the profession with archetype scores
      await prisma.userProfession.create({
        data: {
          userId: USER_ID,
          professionId: PROFESSION_ID,
          userProfessionArchetypeTypes: {
            create: [
              {
                archetypeTypeId: 'interest',
                score: 90 // High realistic interest
              }
            ]
          }
        }
      });
      console.log('✅ Added Mechanics to user profile');
    } else {
      console.log('ℹ️  Profession already in user profile');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateMechanics()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
