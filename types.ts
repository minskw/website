// This file contains type definitions used throughout the application.

// For PPDB (Penerimaan Peserta Didik Baru)
export enum PpdbStatus {
    WAITING = 'Menunggu Verifikasi',
    VERIFIED = 'Terverifikasi',
    ACCEPTED = 'Diterima',
    REJECTED = 'Ditolak'
}

export enum AIVerificationStatus {
    NOT_CHECKED = 'Belum Dicek',
    VERIFIED = 'Terverifikasi AI',
    MANUAL_REVIEW = 'Perlu Review Manual'
}

export interface PpdbApplicant {
    id: string;
    fullName: string;
    nik: string;
    originSchool: string;
    fatherName: string;
    motherName: string;
    phone: string;
    registrationNumber: string;
    submissionDate: string; // ISO date string
    status: PpdbStatus;
    aiVerificationStatus: AIVerificationStatus;
    aiVerificationNotes?: string;
    documents: {
        kk: string;
        akta: string;
        ijazah: string;
    };
}

// For News Articles
export interface NewsArticle {
    id: string;
    title: string;
    category: 'Prestasi' | 'Kegiatan' | 'Pengumuman';
    date: string; // ISO date string
    imageUrl: string;
    excerpt: string;
    content: string; // HTML content
}

// For Teachers and Staff
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

// For School Events Calendar
export interface SchoolEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // e.g., "08:00 - 10:00 WIB"
    location: string;
    description: string;
    category: 'Akademik' | 'Olahraga' | 'Seni & Budaya' | 'Umum' | 'Hari Libur Nasional';
}

// For Website Settings
export interface HomepageContent {
    heroImageUrl: string;
    welcomeTitle: string;
    welcomeText: string;
    welcomeImageUrl: string;
}

export interface ImportantLink {
  name: string;
  url: string;
}

// For Profile Page
export interface ProfileContent {
    vision: string;
    mission: string;
    orgChartUrl: string;
}

// For PPDB Page
export interface PpdbScheduleData {
    startDate: string;
    endDate: string;
    announcementDate: string;
}

// For School Info Settings
export interface SchoolInfoData {
    name: string;
    address: string;
    email: string;
    phone: string;
    logo: string;
    affiliation: string;
}

export interface SocialLinksData {
    facebook: string;
    instagram: string;
    youtube: string;
}

export interface SchoolInfoSettings {
    info: SchoolInfoData;
    socialLinks: SocialLinksData;
    importantLinks: ImportantLink[];
}

// For Gallery
export interface GalleryImageItem {
  imageUrl: string;
  caption: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  images: GalleryImageItem[];
  createdAt: string; // ISO date string for sorting
}
