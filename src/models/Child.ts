export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const;

export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date, 'YYYY-MM-DD'
  gender: Gender;
  avatarUri: string | null;
  weightKg: number | null;
  heightCm: number | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface NewChildInput {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  avatarUri: string | null;
  weightKg: number | null;
  heightCm: number | null;
}
