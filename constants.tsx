import React from 'react';
import { Home, Info, Newspaper, Image, Users, GraduationCap, Phone, LayoutDashboard, UserCheck, Settings, PenSquare, BookUser } from 'lucide-react';

export const SCHOOL_INFO = {
  name: 'Madrasah Ibtidaiyah Negeri (MIN) Singkawang',
  logo: 'https://i.imgur.com/ruwOS0c.jpeg',
  address: 'Jl. Marhaban, Kel. Sedau, Kec. Singkawang Selatan, Kota Singawang',
  affiliation: 'Kementerian Agama Republik Indonesia',
  motto: 'Berakhlak Mulia, Cerdas, dan Berprestasi',
  email: 'info@minsingkawang.sch.id',
  phone: '(0562) 123456',
  website: 'www.minsingkawang.sch.id',
  founded: 1982,
};

export const NAV_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '/profil' },
  { name: 'Berita', href: '/berita' },
  { name: 'Guru & Galeri', href: '/guru-dan-galeri' },
  { name: 'PPDB', href: '/ppdb' },
  { name: 'Kontak', href: '/kontak' },
  { name: 'Portal Wali Murid', href: '/portal/login' },
];

export const ADMIN_NAV_LINKS = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
    { name: 'Manajemen PPDB', href: '/admin/ppdb', icon: <UserCheck size={20}/> },
    { name: 'Manajemen Berita', href: '/admin/berita', icon: <Newspaper size={20}/> },
    { name: 'Data Guru', href: '/admin/guru', icon: <Users size={20}/> },
    { name: 'Pengaturan Website', href: '/admin/pengaturan', icon: <Settings size={20}/> },
]

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
};