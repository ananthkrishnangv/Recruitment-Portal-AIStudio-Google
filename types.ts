export enum UserRole {
  GUEST = 'GUEST',
  APPLICANT = 'APPLICANT',
  ADMIN = 'ADMIN'
}

export enum PostType {
  SCIENTIST = 'Scientist',
  TECHNICAL_OFFICER = 'Technical Officer',
  TECHNICIAN = 'Technician',
  TECHNICAL_ASSISTANT = 'Technical Assistant'
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_SCRUTINY = 'Under Scrutiny',
  ELIGIBLE = 'Eligible',
  NOT_ELIGIBLE = 'Not Eligible',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  SELECTED = 'Selected',
  REJECTED = 'Rejected'
}

export enum Category {
  GEN = 'GEN',
  OBC = 'OBC',
  SC = 'SC',
  ST = 'ST',
  EWS = 'EWS',
  PWD = 'PWD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  mobile: string;
  aadhaar: string;
}

export interface JobPost {
  id: string;
  code: string;
  title: string;
  type: PostType;
  department: string;
  lastDate: string;
  vacancies: number;
  description: string;
  status: 'OPEN' | 'CLOSED';
}

export interface EducationEntry {
  id: string;
  level: string; // 10th, 12th, PhD, etc.
  institution: string;
  board: string;
  year: string;
  percentage: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  designation: string;
  fromDate: string;
  toDate: string;
  responsibilities: string;
}

export interface ApplicationFormState {
  postId: string | null;
  personalDetails: {
    fullName: string;
    dob: string;
    gender: string;
    category: Category;
    fatherName: string;
    mobile: string;
    aadhaar: string;
    address: string;
    nationality: string;
  };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  publications: string[];
  documents: {
    photo: File | null;
    signature: File | null;
    resume: File | null;
    casteCertificate: File | null;
  };
  statementOfPurpose: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingScrutiny: number;
  eligible: number;
  interviews: number;
}