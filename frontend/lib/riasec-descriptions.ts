// RIASEC Archetype Descriptions and Trait Information

export interface RIASECTrait {
  code: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  characteristics: string[];
  idealEnvironments: string[];
}

export interface ArchetypeDescription {
  name: string;
  primaryCode: string;
  secondaryCode: string;
  description: string;
}

// Individual RIASEC trait descriptions
export const RIASEC_TRAITS: Record<string, RIASECTrait> = {
  R: {
    code: 'R',
    name: 'Realistic',
    shortDescription: 'Practical, hands-on problem solvers',
    fullDescription:
      'Realistic types enjoy working with tools, machines, and physical tasks. They prefer concrete, tangible problems and hands-on work.',
    characteristics: [
      'Practical and hands-on',
      'Mechanically inclined',
      'Prefers working with objects',
      'Physically active',
      'Problem-solvers',
    ],
    idealEnvironments: [
      'Workshops and labs',
      'Outdoor settings',
      'Construction sites',
      'Manufacturing facilities',
    ],
  },
  I: {
    code: 'I',
    name: 'Investigative',
    shortDescription: 'Analytical thinkers and researchers',
    fullDescription:
      'Investigative types love research, inquiry, and solving complex problems. They are analytical thinkers who enjoy working with ideas and data.',
    characteristics: [
      'Analytical and logical',
      'Curious and inquisitive',
      'Loves research and analysis',
      'Problem-solving oriented',
      'Intellectually driven',
    ],
    idealEnvironments: [
      'Research laboratories',
      'Academic institutions',
      'Think tanks',
      'Data analysis centers',
    ],
  },
  A: {
    code: 'A',
    name: 'Artistic',
    shortDescription: 'Creative and expressive individuals',
    fullDescription:
      'Artistic types express themselves through art, music, writing, or design. They value creativity, originality, and self-expression.',
    characteristics: [
      'Creative and imaginative',
      'Values self-expression',
      'Appreciates beauty',
      'Original and innovative',
      'Emotionally expressive',
    ],
    idealEnvironments: [
      'Creative studios',
      'Theaters and galleries',
      'Design firms',
      'Flexible, unstructured spaces',
    ],
  },
  S: {
    code: 'S',
    name: 'Social',
    shortDescription: 'People-oriented helpers and communicators',
    fullDescription:
      'Social types enjoy teaching, counseling, and supporting others. They are empathetic, communicative, and thrive on helping people.',
    characteristics: [
      'Empathetic and caring',
      'Excellent communicators',
      'Enjoys helping others',
      'Team-oriented',
      'Patient and understanding',
    ],
    idealEnvironments: [
      'Schools and universities',
      'Healthcare facilities',
      'Community centers',
      'Counseling offices',
    ],
  },
  E: {
    code: 'E',
    name: 'Enterprising',
    shortDescription: 'Leaders and persuaders',
    fullDescription:
      'Enterprising types thrive in business, sales, and entrepreneurial roles. They are natural leaders who enjoy persuading and influencing others.',
    characteristics: [
      'Confident and assertive',
      'Persuasive communicators',
      'Goal-oriented',
      'Enjoys leading others',
      'Risk-takers',
    ],
    idealEnvironments: [
      'Corporate offices',
      'Sales environments',
      'Startups',
      'Leadership positions',
    ],
  },
  C: {
    code: 'C',
    name: 'Conventional',
    shortDescription: 'Organized and detail-oriented',
    fullDescription:
      'Conventional types excel at data management and structured tasks. They value organization, precision, and working within established systems.',
    characteristics: [
      'Detail-oriented',
      'Organized and methodical',
      'Values structure',
      'Reliable and dependable',
      'Prefers clear procedures',
    ],
    idealEnvironments: [
      'Structured offices',
      'Banks and financial institutions',
      'Administrative settings',
      'Record-keeping facilities',
    ],
  },
};

// Archetype combinations (primary + secondary)
export const ARCHETYPE_COMBINATIONS: Record<string, ArchetypeDescription> = {
  // Investigative combinations
  IR: {
    name: 'The Scientist',
    primaryCode: 'I',
    secondaryCode: 'R',
    description:
      'Scientists combine analytical thinking with practical application. They enjoy research and experimentation, applying scientific methods to solve real-world problems. They thrive in careers that involve hands-on investigation and data-driven problem-solving.',
  },
  IA: {
    name: 'The Philosopher',
    primaryCode: 'I',
    secondaryCode: 'A',
    description:
      'Philosophers creatively approach ideas and theories. They possess active imagination and love exploring anomalies in the physical world. They excel in unstructured situations that allow for creative interpretation and intellectual curiosity.',
  },
  IS: {
    name: 'The Researcher',
    primaryCode: 'I',
    secondaryCode: 'S',
    description:
      'Researchers combine analytical skills with people-oriented approaches. They enjoy studying human behavior, conducting social research, and helping others through evidence-based insights. They thrive in academic and clinical research environments.',
  },
  IE: {
    name: 'The Strategist',
    primaryCode: 'I',
    secondaryCode: 'E',
    description:
      'Strategists blend analytical thinking with business acumen. They excel at data-driven decision making, market analysis, and developing innovative business solutions. They thrive in consulting, analytics, and strategic planning roles.',
  },
  IC: {
    name: 'The Analyst',
    primaryCode: 'I',
    secondaryCode: 'C',
    description:
      'Analysts combine systematic investigation with structured approaches. They excel at data analysis, quality assurance, and developing organized systems for problem-solving. They thrive in roles requiring precision and methodical analysis.',
  },

  // Realistic combinations
  RI: {
    name: 'The Engineer',
    primaryCode: 'R',
    secondaryCode: 'I',
    description:
      'Engineers apply practical skills to solve technical problems. They combine hands-on expertise with analytical thinking, excelling in roles that require both physical and intellectual problem-solving in technical fields.',
  },
  RA: {
    name: 'The Craftsperson',
    primaryCode: 'R',
    secondaryCode: 'A',
    description:
      'Craftspeople blend practical skills with creative expression. They create functional art, design physical products, and work with materials in innovative ways. They thrive in roles combining manual dexterity with artistic vision.',
  },
  RS: {
    name: 'The Helper',
    primaryCode: 'R',
    secondaryCode: 'S',
    description:
      'Helpers use practical skills to directly assist others. They excel in hands-on caregiving, physical therapy, emergency services, and other roles where they can provide tangible help to people in need.',
  },
  RE: {
    name: 'The Doer',
    primaryCode: 'R',
    secondaryCode: 'E',
    description:
      'Doers combine practical skills with entrepreneurial drive. They excel at getting things done, managing projects, and leading teams in hands-on environments. They thrive in construction management, operations, and field leadership roles.',
  },
  RC: {
    name: 'The Technician',
    primaryCode: 'R',
    secondaryCode: 'C',
    description:
      'Technicians apply practical skills within structured systems. They excel at following procedures, maintaining equipment, and ensuring quality in technical work. They thrive in roles requiring precision and adherence to standards.',
  },

  // Artistic combinations
  AI: {
    name: 'The Innovator',
    primaryCode: 'A',
    secondaryCode: 'I',
    description:
      'Innovators merge creativity with analytical thinking. They excel at creative problem-solving, design thinking, and developing innovative solutions. They thrive in UX design, creative technology, and research-driven creative fields.',
  },
  AR: {
    name: 'The Designer',
    primaryCode: 'A',
    secondaryCode: 'R',
    description:
      'Designers create tangible, beautiful objects and spaces. They combine artistic vision with practical skills in craftsmanship, product design, and creating functional aesthetics. They thrive in industrial design and applied arts.',
  },
  AS: {
    name: 'The Communicator',
    primaryCode: 'A',
    secondaryCode: 'S',
    description:
      'Communicators use creative expression to connect with and influence others. They excel in writing, performing, teaching arts, and using creativity to inform and inspire. They thrive in media, education, and creative services.',
  },
  AE: {
    name: 'The Visionary',
    primaryCode: 'A',
    secondaryCode: 'E',
    description:
      'Visionaries blend creativity with business leadership. They excel at creative direction, brand development, and entrepreneurial ventures in creative industries. They thrive in advertising, creative agencies, and creative startups.',
  },
  AC: {
    name: 'The Producer',
    primaryCode: 'A',
    secondaryCode: 'C',
    description:
      'Producers organize creative projects and bring artistic visions to life. They excel at production management, event planning, and systematizing creative processes. They thrive in entertainment production and creative operations.',
  },

  // Social combinations
  SI: {
    name: 'The Educator',
    primaryCode: 'S',
    secondaryCode: 'I',
    description:
      'Educators share knowledge and help others learn and grow. They combine people skills with intellectual depth, excelling in teaching, training, and educational development. They thrive in academic and professional development environments.',
  },
  SR: {
    name: 'The Caregiver',
    primaryCode: 'S',
    secondaryCode: 'R',
    description:
      'Caregivers provide hands-on assistance to others. They excel in nursing, therapy, emergency services, and other roles requiring both empathy and practical caregiving skills. They thrive in healthcare and service environments.',
  },
  SA: {
    name: 'The Counselor',
    primaryCode: 'S',
    secondaryCode: 'A',
    description:
      'Counselors use creativity and empathy to help others. They excel in therapeutic arts, expressive therapies, and using creative methods to facilitate healing and growth. They thrive in counseling and therapeutic settings.',
  },
  SE: {
    name: 'The Motivator',
    primaryCode: 'S',
    secondaryCode: 'E',
    description:
      'Motivators inspire and lead others toward goals. They excel at coaching, training, leadership development, and creating positive team dynamics. They thrive in human resources, coaching, and organizational development.',
  },
  SC: {
    name: 'The Administrator',
    primaryCode: 'S',
    secondaryCode: 'C',
    description:
      'Administrators organize systems to serve people effectively. They excel at program management, social services administration, and creating efficient processes for helping others. They thrive in nonprofit management and social services.',
  },

  // Enterprising combinations
  EI: {
    name: 'The Executive',
    primaryCode: 'E',
    secondaryCode: 'I',
    description:
      'Executives combine leadership with strategic thinking. They excel at business strategy, executive management, and making data-driven business decisions. They thrive in senior leadership and consulting roles.',
  },
  ER: {
    name: 'The Manager',
    primaryCode: 'E',
    secondaryCode: 'R',
    description:
      'Managers lead teams in practical, hands-on environments. They excel at operations management, project management, and supervising technical work. They thrive in construction management, manufacturing, and field operations.',
  },
  EA: {
    name: 'The Entrepreneur',
    primaryCode: 'E',
    secondaryCode: 'A',
    description:
      'Entrepreneurs innovate and create new ventures. They excel at creative business development, brand building, and bringing new ideas to market. They thrive in startups, creative industries, and innovative business ventures.',
  },
  ES: {
    name: 'The Leader',
    primaryCode: 'E',
    secondaryCode: 'S',
    description:
      'Leaders inspire and guide teams toward shared goals. They excel at people management, organizational leadership, and creating positive team cultures. They thrive in leadership roles across all industries.',
  },
  EC: {
    name: 'The Organizer',
    primaryCode: 'E',
    secondaryCode: 'C',
    description:
      'Organizers build and manage efficient business systems. They excel at business operations, process optimization, and financial management. They thrive in operations management, finance, and business administration.',
  },

  // Conventional combinations
  CI: {
    name: 'The Data Specialist',
    primaryCode: 'C',
    secondaryCode: 'I',
    description:
      'Data Specialists organize and analyze information systematically. They excel at database management, statistical analysis, and information systems. They thrive in data management, informatics, and analytical roles.',
  },
  CR: {
    name: 'The Specialist',
    primaryCode: 'C',
    secondaryCode: 'R',
    description:
      'Specialists apply structured methods to technical work. They excel at technical documentation, quality control, and systematic technical processes. They thrive in technical operations and precision manufacturing.',
  },
  CA: {
    name: 'The Curator',
    primaryCode: 'C',
    secondaryCode: 'A',
    description:
      'Curators organize and preserve creative works. They excel at archiving, library science, and systematically managing cultural resources. They thrive in museums, libraries, and cultural institutions.',
  },
  CS: {
    name: 'The Coordinator',
    primaryCode: 'C',
    secondaryCode: 'S',
    description:
      'Coordinators organize systems to serve people efficiently. They excel at program coordination, administrative support, and managing people-oriented processes. They thrive in healthcare administration and social services.',
  },
  CE: {
    name: 'The Administrator',
    primaryCode: 'C',
    secondaryCode: 'E',
    description:
      'Administrators manage business operations and resources. They excel at financial management, business administration, and organizational systems. They thrive in corporate administration and business management.',
  },
};

// Helper function to get archetype description
export function getArchetypeDescription(
  primaryCode: string,
  secondaryCode: string
): ArchetypeDescription | null {
  const key = `${primaryCode}${secondaryCode}`;
  return ARCHETYPE_COMBINATIONS[key] || null;
}

// Helper function to get RIASEC trait
export function getRIASECTrait(code: string): RIASECTrait | null {
  return RIASEC_TRAITS[code] || null;
}
