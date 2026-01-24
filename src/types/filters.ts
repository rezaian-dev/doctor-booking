export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterConfig {
  id: keyof FilterFormData;
  title: string;
  label: string;
  options: FilterOption[];
}

export interface FilterFormData {
  search: string;
  specialties: string[];
  insurances: string[];
  experience: string[];
  availability: string[];
  city: string[];
  gender: string[];
}
