// Fix: Added missing type definitions for the application.
export interface NewsArticle {
  id: string;
  title: string;
  category: 'Prestasi' | 'Kegiatan' | 'Pengumuman';
  date: string;
  imageUrl: string;
  excerpt: string;
  content: string;
}

export interface Teacher {
  id: string;
  name: string;
  position: string;
  subject: string;
  imageUrl: string;
  bio: string;
  education: string[];
  achievements: string[];
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'Kegiatan' | 'Prestasi' | 'Ekstrakurikuler' | 'Akademik';
}

export enum PpdbStatus {
  WAITING = 'Menunggu Verifikasi',
  VERIFIED = 'Terverifikasi',
  ACCEPTED = 'Diterima',
  REJECTED = 'Ditolak',
}

export enum AIVerificationStatus {
  NOT_CHECKED = 'Belum Dicek',
  VERIFIED = 'Terverifikasi AI',
  MANUAL_REVIEW = 'Perlu Review Manual',
}

export interface PpdbApplicant {
  id: string;
  registrationNumber: string;
  fullName: string;
  nik: string;
  originSchool: string;
  submissionDate: string; // "YYYY-MM-DD"
  status: PpdbStatus;
  aiVerificationStatus: AIVerificationStatus;
  fatherName: string;
  motherName: string;
  phone: string;
  documents: {
    kk: string;
    akta: string;
    ijazah?: string;
  };
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  class: string;
  imageUrl: string;
}

export interface Parent {
  id: string;
  username: string;
  name: string;
  studentId: string;
}

export interface AcademicRecord {
  subject: string;
  score: number;
  teacher: string;
  date: string; // "YYYY-MM-DD"
}

export interface SemesterData {
  semesterId: string;
  semesterName: string;
  records: AcademicRecord[];
}

export interface AttendanceRecord {
  date: string; // "YYYY-MM-DD"
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string; // "YYYY-MM-DD"
  targetGrade: number | 'all';
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  status: 'Lunas' | 'Belum Lunas';
  dueDate: string; // "YYYY-MM-DD"
  paymentDate?: string; // "YYYY-MM-DD"
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  location: string;
  description: string;
  category: 'Akademik' | 'Olahraga' | 'Seni & Budaya' | 'Umum' | 'Hari Libur Nasional';
}

export interface HomepageContent {
  heroImageUrl: string;
  welcomeTitle: string;
  welcomeText: string;
  welcomeImageUrl: string;
}
