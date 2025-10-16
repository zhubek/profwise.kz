import { Language } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  language: Language;
}
