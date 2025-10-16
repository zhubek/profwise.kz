import { MultilingualText } from './profession';

export interface Category {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  createdAt: string;
  _count?: {
    professions: number;
  };
}

export interface CategoryWithProfessions extends Category {
  professions: {
    id: string;
    name: MultilingualText;
    code: string;
    description: MultilingualText;
    featured: boolean;
  }[];
}
