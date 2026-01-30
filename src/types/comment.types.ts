export interface DoctorData {
  name: string;
  specialty: string;
  image: string;
}

export interface ReviewFormData {
  rating: number;
  recommendation: 'recommend' | 'not-recommend';
  comment?: string;
}
