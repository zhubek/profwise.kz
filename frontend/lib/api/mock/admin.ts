import type { AdminUserData } from '@/types/admin';

// Mock admin user data
const mockAdminUsers: AdminUserData[] = [
  {
    id: 'user-1',
    licenseCode: 'SCHOOL-2024-ABC123',
    name: 'Aidar',
    surname: 'Zhumirov',
    email: 'aidar.zhumirov@example.com',
    grade: '10',
    gender: 'Male',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-15T10:30:00Z',
      },
    ],
  },
  {
    id: 'user-2',
    licenseCode: 'SCHOOL-2024-ABC123',
    name: 'Assel',
    surname: 'Nurbekova',
    email: 'assel.nurbekova@example.com',
    grade: '11',
    gender: 'Female',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-14T14:20:00Z',
      },
    ],
  },
  {
    id: 'user-3',
    licenseCode: 'SCHOOL-2024-XYZ789',
    name: 'Daniyar',
    surname: 'Karimov',
    email: 'daniyar.karimov@example.com',
    grade: '9',
    gender: 'Male',
    results: [],
  },
  {
    id: 'user-4',
    licenseCode: 'SCHOOL-2024-ABC123',
    name: 'Madina',
    surname: 'Akhmetova',
    email: 'madina.akhmetova@example.com',
    grade: '10',
    gender: 'Female',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-16T09:15:00Z',
      },
    ],
  },
  {
    id: 'user-5',
    licenseCode: 'SCHOOL-2024-XYZ789',
    name: 'Arman',
    surname: 'Tulegenov',
    email: 'arman.tulegenov@example.com',
    grade: '11',
    gender: 'Male',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-13T16:45:00Z',
      },
    ],
  },
  {
    id: 'user-6',
    licenseCode: 'SCHOOL-2024-ABC123',
    name: 'Diana',
    surname: 'Serikova',
    email: 'diana.serikova@example.com',
    grade: '10',
    gender: 'Female',
    results: [],
  },
  {
    id: 'user-7',
    licenseCode: 'CORP-2024-DEF456',
    name: 'Miras',
    surname: 'Bekbolatov',
    email: 'miras.bekbolatov@example.com',
    grade: undefined,
    gender: 'Male',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-12T11:30:00Z',
      },
    ],
  },
  {
    id: 'user-8',
    licenseCode: 'SCHOOL-2024-XYZ789',
    name: 'Aliya',
    surname: 'Sultanbekova',
    email: 'aliya.sultanbekova@example.com',
    grade: '11',
    gender: 'Female',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-11T13:00:00Z',
      },
    ],
  },
  {
    id: 'user-9',
    licenseCode: 'CORP-2024-DEF456',
    name: 'Yerlan',
    surname: 'Nurlanuly',
    email: 'yerlan.nurlanuly@example.com',
    grade: undefined,
    gender: 'Male',
    results: [],
  },
  {
    id: 'user-10',
    licenseCode: 'SCHOOL-2024-ABC123',
    name: 'Kamila',
    surname: 'Aisarina',
    email: 'kamila.aisarina@example.com',
    grade: '9',
    gender: 'Female',
    results: [
      {
        id: 'result-1',
        testName: 'Holland RIASEC Test',
        completedAt: '2025-10-10T15:20:00Z',
      },
    ],
  },
];

// Helper function to simulate delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAdminUsers(): Promise<AdminUserData[]> {
  await delay(500);
  return mockAdminUsers;
}

export async function getAdminUser(id: string): Promise<AdminUserData> {
  await delay(300);
  const user = mockAdminUsers.find((u) => u.id === id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  return user;
}
