import type { Archetype, UserArchetypeProfile, UserArchetypeScore } from '@/types/archetype';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockArchetypes: Archetype[] = [
  {
    id: 'arch-r',
    code: 'R',
    name: 'Realistic',
    category: 'interests',
    description: 'Prefer hands-on, practical activities. Enjoy working with tools, machines, and physical objects.',
    icon: '🔧',
    keyTraits: ['Practical', 'Hands-on', 'Technical', 'Problem-solver'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'arch-i',
    code: 'I',
    name: 'Investigative',
    category: 'interests',
    description: 'Enjoy working with ideas and thinking. Like to search for facts and solve problems.',
    icon: '🔬',
    keyTraits: ['Analytical', 'Curious', 'Intellectual', 'Research-oriented'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'arch-a',
    code: 'A',
    name: 'Artistic',
    category: 'interests',
    description: 'Value creativity and self-expression. Enjoy working with forms, designs, and patterns.',
    icon: '🎨',
    keyTraits: ['Creative', 'Expressive', 'Original', 'Intuitive'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'arch-s',
    code: 'S',
    name: 'Social',
    category: 'interests',
    description: 'Enjoy helping and teaching others. Value relationships and teamwork.',
    icon: '👥',
    keyTraits: ['Helpful', 'Empathetic', 'Collaborative', 'Supportive'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'arch-e',
    code: 'E',
    name: 'Enterprising',
    category: 'interests',
    description: 'Like to lead and persuade others. Enjoy taking risks and making decisions.',
    icon: '📈',
    keyTraits: ['Ambitious', 'Persuasive', 'Confident', 'Risk-taker'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'arch-c',
    code: 'C',
    name: 'Conventional',
    category: 'interests',
    description: 'Prefer working with data and details. Like to follow established procedures.',
    icon: '📋',
    keyTraits: ['Organized', 'Detail-oriented', 'Systematic', 'Reliable'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockUserArchetypeProfile: UserArchetypeProfile = {
  userId: '1',
  interests: [
    {
      archetypeId: 'arch-i',
      archetype: mockArchetypes[1],
      score: 85,
      percentile: 90,
    },
    {
      archetypeId: 'arch-a',
      archetype: mockArchetypes[2],
      score: 72,
      percentile: 75,
    },
    {
      archetypeId: 'arch-r',
      archetype: mockArchetypes[0],
      score: 65,
      percentile: 68,
    },
    {
      archetypeId: 'arch-s',
      archetype: mockArchetypes[3],
      score: 58,
      percentile: 55,
    },
    {
      archetypeId: 'arch-e',
      archetype: mockArchetypes[4],
      score: 45,
      percentile: 42,
    },
    {
      archetypeId: 'arch-c',
      archetype: mockArchetypes[5],
      score: 40,
      percentile: 38,
    },
  ],
  skills: [],
  personality: [],
  values: [],
  abilities: [],
  riasecProfile: {
    realistic: {
      archetypeId: 'arch-r',
      archetype: mockArchetypes[0],
      score: 65,
      percentile: 68,
    },
    investigative: {
      archetypeId: 'arch-i',
      archetype: mockArchetypes[1],
      score: 85,
      percentile: 90,
    },
    artistic: {
      archetypeId: 'arch-a',
      archetype: mockArchetypes[2],
      score: 72,
      percentile: 75,
    },
    social: {
      archetypeId: 'arch-s',
      archetype: mockArchetypes[3],
      score: 58,
      percentile: 55,
    },
    enterprising: {
      archetypeId: 'arch-e',
      archetype: mockArchetypes[4],
      score: 45,
      percentile: 42,
    },
    conventional: {
      archetypeId: 'arch-c',
      archetype: mockArchetypes[5],
      score: 40,
      percentile: 38,
    },
    hollandCode: 'IAR',
  },
  lastUpdated: '2024-10-05T14:12:00Z',
  testsCompleted: {
    interests: true,
    skills: false,
    personality: false,
    values: true,
  },
};

export async function getArchetypes(): Promise<Archetype[]> {
  await delay(400);
  return mockArchetypes;
}

export async function getArchetype(id: string): Promise<Archetype> {
  await delay(400);
  const archetype = mockArchetypes.find(a => a.id === id);
  if (!archetype) throw new Error('Archetype not found');
  return archetype;
}

export async function getUserArchetypeProfile(userId: string): Promise<UserArchetypeProfile> {
  await delay(600);
  return mockUserArchetypeProfile;
}

export async function getArchetypesByCategory(category: string): Promise<UserArchetypeScore[]> {
  await delay(500);

  switch (category) {
    case 'interests':
      return mockUserArchetypeProfile.interests;
    case 'skills':
      return mockUserArchetypeProfile.skills;
    case 'personality':
      return mockUserArchetypeProfile.personality;
    case 'values':
      return mockUserArchetypeProfile.values;
    case 'abilities':
      return mockUserArchetypeProfile.abilities;
    default:
      return [];
  }
}
