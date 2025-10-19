export interface AdminUserData {
  id: string;
  licenseCode: string;
  name: string;
  surname: string;
  email: string;
  grade?: string;
  gender?: string;
  results: {
    id: string;
    testName: string;
    completedAt: string;
  }[];
}
