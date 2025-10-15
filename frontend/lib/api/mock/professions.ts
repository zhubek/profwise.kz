import type {
  Profession,
  ProfessionMatch,
  ProfessionDetails,
  ProfessionLaborMarket,
  ProfessionSalary,
  ProfessionEducation,
  ProfessionArchetypes,
} from '@/types/profession';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockProfessions: Profession[] = [
  {
    id: 'prof-1',
    title: 'Software Developer',
    description: 'Design, develop, and maintain software applications and systems',
    category: 'technology',
    icon: '💻',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-2',
    title: 'Data Scientist',
    description: 'Analyze complex data to help organizations make better decisions',
    category: 'technology',
    icon: '📊',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-3',
    title: 'UX/UI Designer',
    description: 'Create intuitive and visually appealing user interfaces',
    category: 'design',
    icon: '🎨',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-4',
    title: 'Psychologist',
    description: 'Help people overcome mental health challenges and improve well-being',
    category: 'healthcare',
    icon: '🧠',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-5',
    title: 'Business Analyst',
    description: 'Bridge the gap between IT and business using data analytics',
    category: 'business',
    icon: '💼',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-6',
    title: 'Graphic Designer',
    description: 'Create visual concepts to communicate ideas that inspire and inform',
    category: 'design',
    icon: '🖌️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-7',
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to promote products and services',
    category: 'business',
    icon: '📱',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-8',
    title: 'Registered Nurse',
    description: 'Provide patient care and support in hospitals and healthcare facilities',
    category: 'healthcare',
    icon: '👩‍⚕️',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-9',
    title: 'Research Scientist',
    description: 'Conduct experiments and research to advance scientific knowledge',
    category: 'science',
    icon: '🔬',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-10',
    title: 'Content Writer',
    description: 'Create engaging written content for websites, blogs, and marketing materials',
    category: 'communication',
    icon: '✍️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-11',
    title: 'Elementary School Teacher',
    description: 'Educate and inspire young students in foundational academic subjects',
    category: 'education',
    icon: '👨‍🏫',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-12',
    title: 'Musician',
    description: 'Create, perform, and record music for entertainment and artistic expression',
    category: 'arts',
    icon: '🎵',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-13',
    title: 'Cybersecurity Analyst',
    description: 'Protect computer systems and networks from cyber threats and attacks',
    category: 'technology',
    icon: '🔒',
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-14',
    title: 'Financial Advisor',
    description: 'Help clients make informed decisions about investments and financial planning',
    category: 'business',
    icon: '💰',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-15',
    title: 'Physical Therapist',
    description: 'Help patients recover from injuries and improve their physical mobility',
    category: 'healthcare',
    icon: '🏃',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-16',
    title: 'Environmental Scientist',
    description: 'Study the environment and develop solutions to environmental problems',
    category: 'science',
    icon: '🌍',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-17',
    title: 'Public Relations Specialist',
    description: 'Manage public image and communications for organizations and individuals',
    category: 'communication',
    icon: '📢',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-18',
    title: 'Architect',
    description: 'Design buildings and structures that are functional, safe, and aesthetically pleasing',
    category: 'design',
    icon: '🏛️',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-19',
    title: 'Social Worker',
    description: 'Support individuals and communities facing social challenges and hardships',
    category: 'education',
    icon: '🤝',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-20',
    title: 'Film Director',
    description: 'Oversee the creative aspects of film production and bring stories to life',
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
    overview: 'Software developers create the applications and systems that run on computers, mobile devices, and other platforms. They work closely with clients and stakeholders to understand requirements and translate them into functional code.',
    keyResponsibilities: [
      'Write clean, maintainable code following best practices',
      'Debug and troubleshoot software issues',
      'Collaborate with team members on project development',
      'Participate in code reviews and provide constructive feedback',
      'Stay updated with emerging technologies and frameworks',
    ],
    requiredSkills: [
      'Programming Languages (Java, Python, JavaScript)',
      'Problem-solving',
      'Version Control (Git)',
      'Database Management',
      'Agile Methodology',
      'Communication',
    ],
    workEnvironment: 'Office or remote, often in collaborative team settings',
    typicalTasks: [
      'Writing and testing code',
      'Attending team meetings and stand-ups',
      'Reviewing and refactoring existing code',
      'Documenting code and processes',
    ],
    toolsAndTechnologies: ['VS Code', 'Git/GitHub', 'Docker', 'AWS/Azure', 'Jenkins'],
  },
};

export async function getProfessions(): Promise<Profession[]> {
  await delay(500);
  return mockProfessions;
}

export async function getProfession(id: string): Promise<Profession> {
  await delay(500);
  const profession = mockProfessions.find(p => p.id === id);
  if (!profession) throw new Error('Profession not found');
  return profession;
}

export async function getProfessionDetails(id: string): Promise<ProfessionDetails> {
  await delay(600);
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
      workEnvironment: '',
      typicalTasks: [],
    };
  }
  return details;
}

export async function getMatchedProfessions(userId: string): Promise<ProfessionMatch[]> {
  await delay(700);
  return mockProfessionMatches;
}

export async function getProfessionLaborMarket(professionId: string): Promise<ProfessionLaborMarket> {
  await delay(500);
  return {
    professionId,
    demandLevel: 'high',
    jobGrowth: '+15%',
    annualOpenings: 50000,
    industrySectors: ['Technology', 'Finance', 'Healthcare', 'E-commerce'],
    geographicHotspots: ['Almaty', 'Nur-Sultan', 'Shymkent'],
    updatedAt: new Date().toISOString(),
  };
}

export async function getProfessionSalary(professionId: string): Promise<ProfessionSalary> {
  await delay(500);
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
  await delay(500);
  return {
    professionId,
    minimumEducation: 'bachelor',
    preferredFields: ['Computer Science', 'Software Engineering', 'Information Technology'],
    recommendedCourses: {
      core: [
        'Introduction to Programming',
        'Data Structures and Algorithms',
        'Database Systems',
        'Software Engineering',
      ],
      elective: ['Web Development', 'Mobile Development', 'Cloud Computing', 'Machine Learning'],
    },
    certifications: ['AWS Certified Developer', 'Oracle Certified Professional', 'Google Cloud Certified'],
    learningPaths: [
      {
        id: 'lp-1',
        title: 'Entry Level Path',
        description: 'For beginners starting their career',
        duration: '2-4 years',
        steps: [
          'Complete relevant degree or bootcamp',
          'Build portfolio projects',
          'Gain internship experience',
          'Apply for junior positions',
        ],
      },
    ],
  };
}

export async function getProfessionArchetypes(professionId: string): Promise<ProfessionArchetypes> {
  await delay(500);
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
  await delay(400);
  const match = mockProfessionMatches.find(p => p.id === professionId);
  if (match) {
    match.isLiked = isLiked;
  }
}
