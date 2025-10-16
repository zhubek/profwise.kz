import api from './client';
import type {
  License,
  UserLicense,
  ActivateLicenseDTO,
  ActivateLicenseResponse,
  ValidateLicenseResponse,
  LicenseQuizzesResponse,
} from '@/types/license';

// License endpoints
export async function activateLicense(data: ActivateLicenseDTO): Promise<ActivateLicenseResponse> {
  return api.post<ActivateLicenseResponse>('/licenses/activate', data);
}

export async function validateLicenseCode(code: string): Promise<ValidateLicenseResponse> {
  return api.get<ValidateLicenseResponse>(`/licenses/validate/${code}`);
}

export async function getUserLicenses(userId: string): Promise<UserLicense[]> {
  return api.get<UserLicense[]>(`/licenses/user/${userId}`);
}

export async function getLicenseQuizzes(licenseId: string): Promise<LicenseQuizzesResponse> {
  return api.get<LicenseQuizzesResponse>(`/licenses/${licenseId}/quizzes`);
}

export async function getAllLicenses(): Promise<License[]> {
  return api.get<License[]>('/licenses');
}

export async function getLicense(id: string): Promise<License> {
  return api.get<License>(`/licenses/${id}`);
}
