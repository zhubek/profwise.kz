import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RIASEC data...');

  // Create ArchetypeType for Holland RIASEC
  const archetypeType = await prisma.archetypeType.upsert({
    where: { id: 'holland-riasec' },
    update: {},
    create: {
      id: 'holland-riasec',
      name: {
        en: 'Holland RIASEC',
        ru: 'RIASEC Холланда',
        kk: 'Холланд RIASEC',
      },
      description: {
        en: "John Holland's theory of career choice based on six personality types that match different work environments",
        ru: 'Теория профессионального выбора Джона Холланда, основанная на шести типах личности, соответствующих различным рабочим средам',
        kk: 'Джон Холландтың әртүрлі жұмыс ортасына сәйкес келетін алты тұлға түріне негізделген мансап таңдау теориясы',
      },
    },
  });

  console.log('✓ Created ArchetypeType:', archetypeType.id);

  // Create 6 RIASEC Archetypes
  const archetypes = [
    {
      id: 'riasec-realistic',
      name: {
        en: 'Realistic',
        ru: 'Реалистичный',
        kk: 'Реалистік',
      },
      description: {
        en: "Realistic individuals prefer hands-on, practical work with tools, machines, and tangible objects. They enjoy physical activities, working outdoors, and solving concrete problems. These people are often described as practical, straightforward, and mechanically inclined. They value results and prefer working with things rather than people. Typical careers include engineering, construction, agriculture, mechanics, and technical trades. Realistic types thrive in structured environments where they can see the direct results of their work.",
        ru: 'Реалистичные люди предпочитают практическую работу с инструментами, механизмами и материальными объектами. Им нравится физическая активность, работа на открытом воздухе и решение конкретных задач. Таких людей часто описывают как практичных, прямолинейных и технически склонных. Они ценят результаты и предпочитают работать с вещами, а не с людьми. Типичные профессии включают инженерию, строительство, сельское хозяйство, механику и технические специальности. Реалистичный тип процветает в структурированной среде, где можно видеть прямые результаты своей работы.',
        kk: 'Реалистік адамдар құралдармен, механизмдермен және материалдық нысандармен практикалық жұмыс істеуді ұнатады. Олар физикалық белсенділікті, ашық ауада жұмыс істеуді және нақты мәселелерді шешуді ұнатады. Мұндай адамдарды әдетте практикалық, тікелей және техникалық бейімді деп сипаттайды. Олар нәтижені бағалайды және адамдармен емес, заттармен жұмыс істеуді жөн көреді. Типтік мамандықтарға инженерия, құрылыс, ауыл шаруашылығы, механика және техникалық мамандықтар кіреді. Реалистік типтер өз жұмысының тікелей нәтижелерін көре алатын құрылымдалған ортада табысты болады.',
      },
    },
    {
      id: 'riasec-investigative',
      name: {
        en: 'Investigative',
        ru: 'Исследовательский',
        kk: 'Зерттеушілік',
      },
      description: {
        en: 'Investigative individuals are analytical, curious, and intellectually oriented. They enjoy exploring ideas, conducting research, and solving complex theoretical problems. These people prefer working independently and thinking abstractly. They are methodical, precise, and value knowledge and understanding. Investigative types are often drawn to scientific inquiry, mathematical reasoning, and systematic investigation. Common careers include scientists, researchers, mathematicians, analysts, and medical professionals. They thrive in environments that allow deep thinking and intellectual exploration.',
        ru: 'Исследовательские люди аналитичны, любознательны и интеллектуально ориентированы. Им нравится изучать идеи, проводить исследования и решать сложные теоретические задачи. Эти люди предпочитают работать самостоятельно и мыслить абстрактно. Они методичны, точны и ценят знания и понимание. Исследовательский тип часто тянется к научным исследованиям, математическому мышлению и систематическому изучению. Распространенные профессии включают ученых, исследователей, математиков, аналитиков и медицинских работников. Они процветают в среде, позволяющей глубокое мышление и интеллектуальное исследование.',
        kk: 'Зерттеушілік адамдар аналитикалық, қызығушы және интеллектуалды бағдарланған. Олар идеяларды зерттеуді, зерттеулер жүргізуді және күрделі теориялық мәселелерді шешуді ұнатады. Бұл адамдар тәуелсіз жұмыс істеуді және абстрактілі ойлауды жөн көреді. Олар әдістемелі, нақты және білімді мен түсінікті бағалайды. Зерттеушілік типтер көбінесе ғылыми зерттеулерге, математикалық ойлауға және жүйелі зерттеуге тартылады. Жалпы мамандықтарға ғалымдар, зерттеушілер, математиктер, талдаушылар және медициналық мамандар кіреді. Олар терең ойлауға және интеллектуалды зерттеуге мүмкіндік беретін ортада табысты болады.',
      },
    },
    {
      id: 'riasec-artistic',
      name: {
        en: 'Artistic',
        ru: 'Артистичный',
        kk: 'Шығармашылық',
      },
      description: {
        en: 'Artistic individuals are creative, expressive, and imaginative. They value beauty, originality, and self-expression through various art forms. These people prefer unstructured environments that allow freedom and innovation. They are intuitive, emotional, and appreciate aesthetics. Artistic types enjoy working with colors, sounds, words, and visual media to create something unique. They often pursue careers in arts, design, music, writing, entertainment, and creative industries. They thrive in flexible environments that encourage experimentation and personal expression.',
        ru: 'Артистичные люди креативны, выразительны и обладают богатым воображением. Они ценят красоту, оригинальность и самовыражение через различные формы искусства. Эти люди предпочитают неструктурированную среду, позволяющую свободу и инновации. Они интуитивны, эмоциональны и ценят эстетику. Артистичный тип любит работать с цветами, звуками, словами и визуальными медиа для создания чего-то уникального. Они часто выбирают карьеру в искусстве, дизайне, музыке, писательстве, развлечениях и творческих индустриях. Они процветают в гибкой среде, поощряющей эксперименты и личное самовыражение.',
        kk: 'Шығармашылық адамдар креативті, экспрессивті және қиялшыл. Олар әртүрлі өнер түрлері арқылы сұлулықты, бірегейлікті және өзін-өзі көрсетуді бағалайды. Бұл адамдар еркіндік пен инновацияға мүмкіндік беретін құрылымсыз ортаны ұнатады. Олар интуитивті, эмоционалды және эстетиканы бағалайды. Шығармашылық типтер бірегей нәрсе жасау үшін түстермен, дыбыстармен, сөздермен және визуалды медиамен жұмыс істеуді ұнатады. Олар көбінесе өнер, дизайн, музыка, жазу, ойын-сауық және шығармашылық салаларда мансап таңдайды. Олар эксперимент пен жеке өзін көрсетуді ынталандыратын икемді ортада табысты болады.',
      },
    },
    {
      id: 'riasec-social',
      name: {
        en: 'Social',
        ru: 'Социальный',
        kk: 'Әлеуметтік',
      },
      description: {
        en: "Social individuals are people-oriented, empathetic, and enjoy helping others. They excel at communication, understanding emotions, and building relationships. These people prefer working in teams and collaborative environments. They are caring, supportive, and find fulfillment in making a positive impact on others' lives. Social types are naturally drawn to teaching, counseling, nursing, social work, and community service. They thrive in environments that emphasize human connection, cooperation, and service to others. They value interpersonal relationships and derive satisfaction from nurturing and developing people.",
        ru: 'Социальные люди ориентированы на людей, эмпатичны и любят помогать другим. Они преуспевают в общении, понимании эмоций и построении отношений. Эти люди предпочитают работать в командах и совместной среде. Они заботливы, поддерживают и находят удовлетворение в позитивном влиянии на жизнь других. Социальный тип естественно тянется к преподаванию, консультированию, медицине, социальной работе и общественному служению. Они процветают в среде, которая подчеркивает человеческие связи, сотрудничество и служение другим. Они ценят межличностные отношения и получают удовлетворение от воспитания и развития людей.',
        kk: 'Әлеуметтік адамдар адамдарға бағытталған, эмпатиялы және басқаларға көмектесуді ұнатады. Олар қарым-қатынаста, эмоцияларды түсінуде және қарым-қатынас орнатуда жақсы. Бұл адамдар топта және ынтымақтастық ортада жұмыс істеуді жөн көреді. Олар қамқоршы, қолдаушы және басқалардың өміріне оң әсер етуден қанағаттану табады. Әлеуметтік типтер табиғи түрде оқытуға, кеңес беруге, мейіргерлікке, әлеуметтік жұмысқа және қоғамдық қызметке тартылады. Олар адамдық байланысты, ынтымақтастықты және басқаларға қызмет етуді атап көрсететін ортада табысты болады. Олар тұлғааралық қарым-қатынасты бағалайды және адамдарды тәрбиелеу мен дамытудан қанағаттану алады.',
      },
    },
    {
      id: 'riasec-enterprising',
      name: {
        en: 'Enterprising',
        ru: 'Предприимчивый',
        kk: 'Кәсіпкерлік',
      },
      description: {
        en: 'Enterprising individuals are ambitious, confident, and persuasive leaders. They enjoy influencing others, taking risks, and pursuing goals with determination. These people thrive on challenges, competition, and opportunities for advancement. They are energetic, assertive, and naturally drawn to positions of power and authority. Enterprising types excel at selling, managing, leading, and entrepreneurship. Common careers include business executives, entrepreneurs, sales professionals, lawyers, and politicians. They flourish in dynamic, fast-paced environments where they can take initiative, make decisions, and drive results.',
        ru: 'Предприимчивые люди амбициозны, уверены в себе и являются убедительными лидерами. Им нравится влиять на других, рисковать и целеустремленно добиваться целей. Эти люди процветают на вызовах, конкуренции и возможностях для продвижения. Они энергичны, напористы и естественно тянутся к позициям власти и авторитета. Предприимчивый тип преуспевает в продажах, управлении, лидерстве и предпринимательстве. Распространенные профессии включают руководителей бизнеса, предпринимателей, специалистов по продажам, юристов и политиков. Они процветают в динамичной, быстро меняющейся среде, где могут проявлять инициативу, принимать решения и добиваться результатов.',
        kk: 'Кәсіпкерлік адамдар амбициялы, сенімді және сендіретін көшбасшылар. Олар басқаларға әсер етуді, тәуекел етуді және мақсаттарға табандылықпен жетуді ұнатады. Бұл адамдар қиындықтарда, бәсекелестікте және алға жылжу мүмкіндіктерінде өседі. Олар энергиялы, батыл және билік пен беделдегі позицияларға табиғи түрде тартылады. Кәсіпкерлік типтер сатуда, басқаруда, көшбасшылықта және кәсіпкерлікте жақсы. Жалпы мамандықтарға бизнес басшылары, кәсіпкерлер, сату мамандары, заңгерлер және саясаткерлер кіреді. Олар бастама көрсете алатын, шешім қабылдай алатын және нәтижеге жете алатын динамикалық, жылдам өзгеретін ортада гүлденеді.',
      },
    },
    {
      id: 'riasec-conventional',
      name: {
        en: 'Conventional',
        ru: 'Конвенциональный',
        kk: 'Дәстүрлі',
      },
      description: {
        en: 'Conventional individuals are organized, detail-oriented, and value structure and order. They excel at following procedures, maintaining systems, and working with data and numbers. These people prefer clear guidelines, established routines, and predictable environments. They are reliable, precise, and conscientious workers who take pride in accuracy and efficiency. Conventional types are naturally suited for accounting, administration, data management, clerical work, and financial services. They thrive in stable, well-organized environments with clear expectations and defined processes where attention to detail is valued.',
        ru: 'Конвенциональные люди организованны, внимательны к деталям и ценят структуру и порядок. Они преуспевают в следовании процедурам, поддержании систем и работе с данными и цифрами. Эти люди предпочитают четкие руководства, установленные рутины и предсказуемую среду. Они надежны, точны и добросовестные работники, которые гордятся точностью и эффективностью. Конвенциональный тип естественно подходит для бухгалтерии, администрирования, управления данными, канцелярской работы и финансовых услуг. Они процветают в стабильной, хорошо организованной среде с четкими ожиданиями и определенными процессами, где ценится внимание к деталям.',
        kk: 'Дәстүрлі адамдар ұйымдасқан, егжей-тегжейлі бағытталған және құрылым мен тәртіпті бағалайды. Олар рәсімдерді орындауда, жүйелерді қолдауда және деректер мен сандармен жұмыс істеуде жақсы. Бұл адамдар нақты нұсқауларды, белгіленген тәртіптерді және болжанатын ортаны ұнатады. Олар сенімді, нақты және дәлдік пен тиімділікпен мақтанатын ар-ождандық жұмысшылар. Дәстүрлі типтер есепке алуға, әкімшілікке, деректерді басқаруға, кеңсе жұмысына және қаржылық қызметтерге табиғи түрде сәйкес келеді. Олар егжей-тегжейге назар аудару бағаланатын нақты күтулер мен анықталған процестері бар тұрақты, жақсы ұйымдастырылған ортада табысты болады.',
      },
    },
  ];

  for (const archetype of archetypes) {
    const created = await prisma.archetype.upsert({
      where: { id: archetype.id },
      update: {},
      create: {
        ...archetype,
        archetypeTypeId: 'holland-riasec',
      },
    });
    console.log('✓ Created Archetype:', created.id);
  }

  console.log('✅ RIASEC seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding RIASEC data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
