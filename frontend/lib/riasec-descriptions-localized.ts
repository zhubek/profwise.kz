// RIASEC Archetype Descriptions and Trait Information (Localized)

import type { LocalizedText } from '@/types/test';

export interface RIASECTrait {
  code: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  characteristics: LocalizedText[];
  idealEnvironments: LocalizedText[];
}

export interface ArchetypeDescription {
  name: LocalizedText;
  primaryCode: string;
  secondaryCode: string;
  description: LocalizedText;
}

// Individual RIASEC trait descriptions
export const RIASEC_TRAITS: Record<string, RIASECTrait> = {
  R: {
    code: 'R',
    name: {
      en: 'Realistic',
      ru: 'Реалистичный',
      kz: 'Шынайы'
    },
    shortDescription: {
      en: 'Practical, hands-on problem solvers',
      ru: 'Практичные решатели проблем',
      kz: 'Практикалық мәселелерді шешуші'
    },
    fullDescription: {
      en: 'Realistic types enjoy working with tools, machines, and physical tasks. They prefer concrete, tangible problems and hands-on work.',
      ru: 'Реалистичный тип любит работать с инструментами, механизмами и физическими задачами. Они предпочитают конкретные, осязаемые проблемы и практическую работу.',
      kz: 'Шынайы типтер құралдармен, механизмдермен және физикалық тапсырмалармен жұмыс істегенді ұнатады. Олар нақты, осязаемые мәселелер мен практикалық жұмысты артық көреді.'
    },
    characteristics: [
      {
        en: 'Practical and hands-on',
        ru: 'Практичный и ориентированный на действия',
        kz: 'Практикалық және іс-әрекетке бағытталған'
      },
      {
        en: 'Mechanically inclined',
        ru: 'Склонность к механике',
        kz: 'Механикаға бейімді'
      },
      {
        en: 'Prefers working with objects',
        ru: 'Предпочитает работу с объектами',
        kz: 'Заттармен жұмыс істеуді артық көреді'
      },
      {
        en: 'Physically active',
        ru: 'Физически активный',
        kz: 'Физикалық белсенді'
      },
      {
        en: 'Problem-solvers',
        ru: 'Решатели проблем',
        kz: 'Мәселелерді шешуші'
      }
    ],
    idealEnvironments: [
      {
        en: 'Workshops and labs',
        ru: 'Мастерские и лаборатории',
        kz: 'Шеберханалар мен зертханалар'
      },
      {
        en: 'Outdoor settings',
        ru: 'Открытые площадки',
        kz: 'Ашық алаңдар'
      },
      {
        en: 'Construction sites',
        ru: 'Строительные площадки',
        kz: 'Құрылыс алаңдары'
      },
      {
        en: 'Manufacturing facilities',
        ru: 'Производственные помещения',
        kz: 'Өндірістік кешендер'
      }
    ]
  },
  I: {
    code: 'I',
    name: {
      en: 'Investigative',
      ru: 'Исследовательский',
      kz: 'Зерттеу'
    },
    shortDescription: {
      en: 'Analytical thinkers and researchers',
      ru: 'Аналитические мыслители и исследователи',
      kz: 'Аналитикалық ойшылдар және зерттеушілер'
    },
    fullDescription: {
      en: 'Investigative types love research, inquiry, and solving complex problems. They are analytical thinkers who enjoy working with ideas and data.',
      ru: 'Исследовательский тип любит исследования, изыскания и решение сложных проблем. Они аналитические мыслители, которые любят работать с идеями и данными.',
      kz: 'Зерттеу типі зерттеулерді, іздестірулерді және күрделі мәселелерді шешуді жақсы көреді. Олар идеялар мен деректермен жұмыс істегенді ұнататын аналитикалық ойшылдар.'
    },
    characteristics: [
      {
        en: 'Analytical and logical',
        ru: 'Аналитический и логичный',
        kz: 'Аналитикалық және логикалық'
      },
      {
        en: 'Curious and inquisitive',
        ru: 'Любознательный и пытливый',
        kz: 'Құмар және іздемпаз'
      },
      {
        en: 'Loves research and analysis',
        ru: 'Любит исследования и анализ',
        kz: 'Зерттеу мен талдауды жақсы көреді'
      },
      {
        en: 'Problem-solving oriented',
        ru: 'Ориентирован на решение проблем',
        kz: 'Мәселелерді шешуге бағытталған'
      },
      {
        en: 'Intellectually driven',
        ru: 'Интеллектуально мотивирован',
        kz: 'Интеллектуалды ұмтылған'
      }
    ],
    idealEnvironments: [
      {
        en: 'Research laboratories',
        ru: 'Исследовательские лаборатории',
        kz: 'Зерттеу зертханалары'
      },
      {
        en: 'Academic institutions',
        ru: 'Академические учреждения',
        kz: 'Академиялық мекемелер'
      },
      {
        en: 'Think tanks',
        ru: 'Исследовательские центры',
        kz: 'Зерттеу орталықтары'
      },
      {
        en: 'Data analysis centers',
        ru: 'Центры анализа данных',
        kz: 'Деректерді талдау орталықтары'
      }
    ]
  },
  A: {
    code: 'A',
    name: {
      en: 'Artistic',
      ru: 'Артистичный',
      kz: 'Шығармашыл'
    },
    shortDescription: {
      en: 'Creative and expressive individuals',
      ru: 'Творческие и экспрессивные личности',
      kz: 'Шығармашыл және экспрессивті тұлғалар'
    },
    fullDescription: {
      en: 'Artistic types express themselves through art, music, writing, or design. They value creativity, originality, and self-expression.',
      ru: 'Артистичный тип выражает себя через искусство, музыку, письмо или дизайн. Они ценят творчество, оригинальность и самовыражение.',
      kz: 'Шығармашыл тип өздерін өнер, музыка, жазу немесе дизайн арқылы білдіреді. Олар шығармашылықты, өзгешелікті және өзін-өзі білдіруді бағалайды.'
    },
    characteristics: [
      {
        en: 'Creative and imaginative',
        ru: 'Творческий и изобретательный',
        kz: 'Шығармашыл және қиялшыл'
      },
      {
        en: 'Values self-expression',
        ru: 'Ценит самовыражение',
        kz: 'Өзін-өзі білдіруді бағалайды'
      },
      {
        en: 'Appreciates beauty',
        ru: 'Ценит красоту',
        kz: 'Сұлулықты бағалайды'
      },
      {
        en: 'Original and innovative',
        ru: 'Оригинальный и инновационный',
        kz: 'Өзгеше және инновациялық'
      },
      {
        en: 'Emotionally expressive',
        ru: 'Эмоционально экспрессивный',
        kz: 'Эмоционалды экспрессивті'
      }
    ],
    idealEnvironments: [
      {
        en: 'Creative studios',
        ru: 'Творческие студии',
        kz: 'Шығармашылық студиялар'
      },
      {
        en: 'Theaters and galleries',
        ru: 'Театры и галереи',
        kz: 'Театрлар мен галереялар'
      },
      {
        en: 'Design firms',
        ru: 'Дизайн-фирмы',
        kz: 'Дизайн фирмалары'
      },
      {
        en: 'Flexible, unstructured spaces',
        ru: 'Гибкие, неструктурированные пространства',
        kz: 'Икемді, құрылымсыз кеңістіктер'
      }
    ]
  },
  S: {
    code: 'S',
    name: {
      en: 'Social',
      ru: 'Социальный',
      kz: 'Әлеуметтік'
    },
    shortDescription: {
      en: 'People-oriented helpers and communicators',
      ru: 'Ориентированные на людей помощники и коммуникаторы',
      kz: 'Адамдарға бағытталған көмекшілер және коммуникаторлар'
    },
    fullDescription: {
      en: 'Social types enjoy teaching, counseling, and supporting others. They are empathetic, communicative, and thrive on helping people.',
      ru: 'Социальный тип любит обучать, консультировать и поддерживать других. Они эмпатичны, коммуникабельны и преуспевают в помощи людям.',
      kz: 'Әлеуметтік тип оқытуды, кеңес беруді және басқаларды қолдауды жақсы көреді. Олар эмпатиялық, коммуникабельді және адамдарға көмектесуде табысты.'
    },
    characteristics: [
      {
        en: 'Empathetic and caring',
        ru: 'Эмпатичный и заботливый',
        kz: 'Эмпатиялық және қамқорлық'
      },
      {
        en: 'Excellent communicators',
        ru: 'Отличные коммуникаторы',
        kz: 'Тамаша коммуникаторлар'
      },
      {
        en: 'Enjoys helping others',
        ru: 'Любит помогать другим',
        kz: 'Басқаларға көмектесуді жақсы көреді'
      },
      {
        en: 'Team-oriented',
        ru: 'Ориентирован на команду',
        kz: 'Командаға бағытталған'
      },
      {
        en: 'Patient and understanding',
        ru: 'Терпеливый и понимающий',
        kz: 'Шыдамды және түсінікті'
      }
    ],
    idealEnvironments: [
      {
        en: 'Schools and universities',
        ru: 'Школы и университеты',
        kz: 'Мектептер мен университеттер'
      },
      {
        en: 'Healthcare facilities',
        ru: 'Медицинские учреждения',
        kz: 'Денсаулық сақтау мекемелері'
      },
      {
        en: 'Community centers',
        ru: 'Общественные центры',
        kz: 'Қоғамдық орталықтар'
      },
      {
        en: 'Counseling offices',
        ru: 'Консультационные кабинеты',
        kz: 'Кеңес беру кеңселері'
      }
    ]
  },
  E: {
    code: 'E',
    name: {
      en: 'Enterprising',
      ru: 'Предпринимательский',
      kz: 'Кәсіпкерлік'
    },
    shortDescription: {
      en: 'Leaders and persuaders',
      ru: 'Лидеры и убеждатели',
      kz: 'Көшбасшылар мен сендірушілер'
    },
    fullDescription: {
      en: 'Enterprising types thrive in business, sales, and entrepreneurial roles. They are natural leaders who enjoy persuading and influencing others.',
      ru: 'Предпринимательский тип преуспевает в бизнесе, продажах и предпринимательских ролях. Они прирожденные лидеры, которые любят убеждать и влиять на других.',
      kz: 'Кәсіпкерлік тип бизнесте, сатуда және кәсіпкерлік рөлдерінде табысты. Олар басқаларды сендіруді және әсер етуді жақсы көретін туа біткен көшбасшылар.'
    },
    characteristics: [
      {
        en: 'Confident and assertive',
        ru: 'Уверенный и напористый',
        kz: 'Сенімді және батыл'
      },
      {
        en: 'Persuasive communicators',
        ru: 'Убедительные коммуникаторы',
        kz: 'Сендіруші коммуникаторлар'
      },
      {
        en: 'Goal-oriented',
        ru: 'Ориентирован на цели',
        kz: 'Мақсатқа бағытталған'
      },
      {
        en: 'Enjoys leading others',
        ru: 'Любит руководить другими',
        kz: 'Басқаларды басқаруды жақсы көреді'
      },
      {
        en: 'Risk-takers',
        ru: 'Идущие на риск',
        kz: 'Тәуекелге баратындар'
      }
    ],
    idealEnvironments: [
      {
        en: 'Corporate offices',
        ru: 'Корпоративные офисы',
        kz: 'Корпоративті кеңселер'
      },
      {
        en: 'Sales environments',
        ru: 'Продажная среда',
        kz: 'Сату ортасы'
      },
      {
        en: 'Startups',
        ru: 'Стартапы',
        kz: 'Стартаптар'
      },
      {
        en: 'Leadership positions',
        ru: 'Лидерские позиции',
        kz: 'Көшбасшылық позициялар'
      }
    ]
  },
  C: {
    code: 'C',
    name: {
      en: 'Conventional',
      ru: 'Конвенциональный',
      kz: 'Дәстүрлі'
    },
    shortDescription: {
      en: 'Organized and detail-oriented',
      ru: 'Организованный и детально-ориентированный',
      kz: 'Ұйымдасқан және детальға бағытталған'
    },
    fullDescription: {
      en: 'Conventional types excel at data management and structured tasks. They value organization, precision, and working within established systems.',
      ru: 'Конвенциональный тип преуспевает в управлении данными и структурированных задачах. Они ценят организацию, точность и работу в рамках установленных систем.',
      kz: 'Дәстүрлі тип деректерді басқаруда және құрылымдық тапсырмаларда табысты. Олар ұйымдастыруды, дәлдікті және белгіленген жүйелер аясында жұмыс істеуді бағалайды.'
    },
    characteristics: [
      {
        en: 'Detail-oriented',
        ru: 'Детально-ориентированный',
        kz: 'Детальға бағытталған'
      },
      {
        en: 'Organized and methodical',
        ru: 'Организованный и методичный',
        kz: 'Ұйымдасқан және әдістемелік'
      },
      {
        en: 'Values structure',
        ru: 'Ценит структуру',
        kz: 'Құрылымды бағалайды'
      },
      {
        en: 'Reliable and dependable',
        ru: 'Надежный и ответственный',
        kz: 'Сенімді және жауапты'
      },
      {
        en: 'Prefers clear procedures',
        ru: 'Предпочитает четкие процедуры',
        kz: 'Нақты процедураларды артық көреді'
      }
    ],
    idealEnvironments: [
      {
        en: 'Structured offices',
        ru: 'Структурированные офисы',
        kz: 'Құрылымдалған кеңселер'
      },
      {
        en: 'Banks and financial institutions',
        ru: 'Банки и финансовые учреждения',
        kz: 'Банктер мен қаржы мекемелері'
      },
      {
        en: 'Administrative settings',
        ru: 'Административные условия',
        kz: 'Әкімшілік жағдайлар'
      },
      {
        en: 'Record-keeping facilities',
        ru: 'Учреждения по ведению документации',
        kz: 'Құжаттарды жүргізу мекемелері'
      }
    ]
  }
};

// Archetype combinations (primary + secondary) - I'll add a subset for now
export const ARCHETYPE_COMBINATIONS: Record<string, ArchetypeDescription> = {
  IR: {
    name: {
      en: 'The Scientist',
      ru: 'Ученый',
      kz: 'Ғалым'
    },
    primaryCode: 'I',
    secondaryCode: 'R',
    description: {
      en: 'Scientists combine analytical thinking with practical application. They enjoy research and experimentation, applying scientific methods to solve real-world problems. They thrive in careers that involve hands-on investigation and data-driven problem-solving.',
      ru: 'Ученые сочетают аналитическое мышление с практическим применением. Они любят исследования и эксперименты, применяя научные методы для решения реальных проблем. Они преуспевают в карьере, связанной с практическими исследованиями и решением проблем на основе данных.',
      kz: 'Ғалымдар аналитикалық ойлауды практикалық қолданумен біріктіреді. Олар зерттеулер мен эксперименттерді жақсы көреді, нақты мәселелерді шешу үшін ғылыми әдістерді қолданады. Олар практикалық зерттеулер мен деректерге негізделген мәселелерді шешуді қамтитын мансапта табысты.'
    }
  },
  // Add more combinations as needed
};

// Helper functions with locale support
export function getArchetypeDescription(
  primaryCode: string,
  secondaryCode: string
): ArchetypeDescription | null {
  const key = `${primaryCode}${secondaryCode}`;
  return ARCHETYPE_COMBINATIONS[key] || null;
}

export function getRIASECTrait(code: string): RIASECTrait | null {
  return RIASEC_TRAITS[code] || null;
}

// Helper to get localized text
export function getLocalizedText(text: LocalizedText | string, locale: string): string {
  if (typeof text === 'string') return text;
  return text[locale as keyof typeof text] || text.en || '';
}
