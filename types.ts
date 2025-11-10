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

// For Gallery
export interface GalleryImage {
    id: string;
    imageUrl: string;
    caption: string;
    category: string;
    uploadedAt: string; // ISO date string
}
