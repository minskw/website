export interface NewsArticle {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Pengumuman' | 'Prestasi';
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
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export enum PpdbStatus {
  WAITING = 'Menunggu Verifikasi',
  VERIFIED = 'Terverifikasi',
  ACCEPTED = 'Diterima',
  REJECTED = 'Ditolak',
}

export interface PpdbApplicant {
  id:string;
  registrationNumber: string;
  fullName: string;
  nik: string;
  originSchool: string;
  submissionDate: string;
  status: PpdbStatus;
  fatherName: string;
  motherName: string;
  phone: string;
  documents: {
    kk: string;
    akta: string;
    ijazah: string;
  };
}

// Parent Portal Types
export interface Parent {
  id: string;
  username: string;
  name: string;
  studentId: string;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  class: string;
  imageUrl: string;
}

export interface AcademicRecord {
  subject: string;
  score: number;
  teacher: string;
  date: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetGrade: 'all' | number; // 'all' for all grades or a specific grade number
}