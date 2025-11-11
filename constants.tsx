import React from 'react';
import { Home, Info, Newspaper, Image, Users, GraduationCap, Phone, LayoutDashboard, UserCheck, Settings, PenSquare, BookUser, DatabaseZap, GalleryHorizontal, Briefcase, Video } from 'lucide-react';

// School Information Constants
export const SCHOOL_INFO = {
  name: 'MIN SINGKAWANG',
  logo: 'https://i.imgur.com/ruwOS0c.jpeg',
  address: 'Jl. Marhaban, Kel. Sedau, Kec. Singkawang Selatan, Kota Singawang',
  affiliation: 'Kementerian Agama Republik Indonesia',
  motto: 'Berakhlak Mulia, Cerdas, dan Berprestasi',
  email: 'info@minsingkawang.sch.id',
  phone: '(0562) 123456',
  website: 'www.minsingkawang.sch.id',
  founded: 1982,
};

// Public Navigation Links
export const NAV_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '/profil' },
  { name: 'Berita', href: '/berita' },
  { name: 'GTK', href: '/gtk' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Kalender Kegiatan', href: '/kalender-kegiatan' },
  { name: 'PPDB', href: '/ppdb' },
  { name: 'Kontak', href: '/kontak' },
];

// Admin Navigation Links
export const ADMIN_NAV_LINKS = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
    { name: 'Manajemen PPDB', href: '/admin/ppdb', icon: <UserCheck size={20}/> },
    { name: 'Manajemen Berita', href: '/admin/berita', icon: <Newspaper size={20}/> },
    { name: 'Manajemen Galeri', href: '/admin/galeri', icon: <Image size={20}/> },
    { name: 'Manajemen Video', href: '/admin/video', icon: <Video size={20}/> },
    { name: 'Manajemen Guru', href: '/admin/guru', icon: <Users size={20}/> },
    { name: 'Pengaturan', href: '/admin/pengaturan', icon: <Settings size={20}/> },
    { name: 'Setup Awal', href: '/admin/setup', icon: <DatabaseZap size={20}/> },
];

// Fix: Added missing SOCIAL_LINKS export for the footer component.
// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
};