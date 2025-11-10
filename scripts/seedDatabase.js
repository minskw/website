
// This is a one-time script to seed your Firestore database with initial data.
// Run this from your terminal using: node scripts/seedDatabase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Paste your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyBeAB2Zrxh-YGJxS-S5DxIR1daknZg9E5I",
  authDomain: "min-singkawang-website.firebaseapp.com",
  projectId: "min-singkawang-website",
  storageBucket: "min-singkawang-website.appspot.com",
  messagingSenderId: "26160860019",
  appId: "1:26160860019:web:c6390fba26af450bc59306"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase Initialized. Starting database seeding...');

// --- Data copied from mockApi.ts ---

const mockNews = [
  {
    title: 'MIN Singkawang Meraih Juara 1 Lomba Cerdas Cermat Tingkat Kota',
    category: 'Prestasi',
    date: '2024-07-15',
    imageUrl: 'https://picsum.photos/seed/news1/800/600',
    excerpt: 'Tim cerdas cermat MIN Singkawang berhasil menunjukkan keunggulannya dengan meraih Juara 1 dalam ajang Lomba Cerdas Cermat (LCC) tingkat Madrasah Ibtidaiyah se-Kota Singkawang.',
    content: '<p>Tim cerdas cermat MIN Singkawang berhasil menunjukkan keunggulannya dengan meraih Juara 1 dalam ajang Lomba Cerdas Cermat (LCC) tingkat Madrasah Ibtidaiyah se-Kota Singkawang. Kompetisi yang diikuti oleh puluhan madrasah ini berlangsung sengit, namun tim MIN Singkawang mampu menjawab pertanyaan-pertanyaan dengan cepat dan tepat.</p><p>Kemenangan ini merupakan buah dari kerja keras siswa dan bimbingan para guru. "Kami sangat bangga dengan pencapaian anak-anak. Ini adalah hasil dari persiapan matang dan semangat juang yang tinggi," ujar salah satu guru pembimbing.</p>',
  },
  {
    title: 'Kegiatan Manasik Haji Cilik untuk Siswa Kelas 1 dan 2',
    category: 'Kegiatan',
    date: '2024-07-12',
    imageUrl: 'https://picsum.photos/seed/news2/800/600',
    excerpt: 'Dalam rangka menanamkan nilai-nilai keagamaan sejak dini, MIN Singkawang mengadakan kegiatan Manasik Haji Cilik yang diikuti oleh seluruh siswa kelas 1 dan 2.',
    content: '<p>Dalam rangka menanamkan nilai-nilai keagamaan sejak dini, MIN Singkawang mengadakan kegiatan Manasik Haji Cilik yang diikuti oleh seluruh siswa kelas 1 dan 2. Siswa diajarkan tata cara pelaksanaan ibadah haji secara sederhana, mulai dari tawaf, sa\'i, hingga wukuf di Arafah mini yang telah disiapkan di halaman sekolah.</p><p>Anak-anak tampak antusias mengikuti setiap rangkaian kegiatan. Diharapkan, kegiatan ini dapat memberikan pemahaman dan kecintaan terhadap rukun Islam yang kelima.</p>',
  },
  {
    title: 'Pengumuman Jadwal Penerimaan Rapor Semester Genap',
    category: 'Pengumuman',
    date: '2024-07-10',
    imageUrl: 'https://picsum.photos/seed/news3/800/600',
    excerpt: 'Diberitahukan kepada seluruh orang tua/wali murid MIN Singkawang, bahwa pembagian rapor hasil belajar semester genap tahun ajaran 2023/2024 akan dilaksanakan pada hari Sabtu, 22 Juli 2024.',
    content: '<p>Diberitahukan kepada seluruh orang tua/wali murid MIN Singkawang, bahwa pembagian rapor hasil belajar semester genap tahun ajaran 2023/2024 akan dilaksanakan pada hari Sabtu, 22 Juli 2024. Pengambilan rapor dimulai pukul 08.00 - 11.00 WIB di kelas masing-masing. Kehadiran orang tua/wali murid sangat diharapkan untuk dapat berkonsultasi langsung dengan wali kelas mengenai perkembangan belajar siswa.</p>',
  },
];

const mockTeachers = [
  { 
    name: 'Drs. H. Muhammad Saleh', 
    position: 'Kepala Madrasah', 
    subject: 'Manajerial', 
    imageUrl: 'https://i.pravatar.cc/150?u=t1',
    bio: 'Menjabat sebagai Kepala Madrasah sejak tahun 2018 dengan pengalaman lebih dari 20 tahun di dunia pendidikan. Berkomitmen untuk membawa MIN Singkawang menjadi madrasah unggul yang berlandaskan nilai-nilai Islam.',
    education: ['S1 Pendidikan Agama Islam, IAIN Pontianak', 'S2 Manajemen Pendidikan, Universitas Tanjungpura'],
    achievements: ['Kepala Sekolah Berprestasi Tingkat Kota (2020)', 'Satya Lencana Karya Satya XX Tahun']
  },
  { 
    name: 'Siti Aminah, S.Pd.I', 
    position: 'Waka Kurikulum', 
    subject: 'Akidah Akhlak & SKI', 
    imageUrl: 'https://i.pravatar.cc/150?u=t2',
    bio: 'Seorang pendidik yang berdedikasi dalam pengembangan kurikulum yang inovatif dan relevan. Aktif dalam berbagai pelatihan untuk meningkatkan mutu pembelajaran di madrasah.',
    education: ['S1 Pendidikan Guru Madrasah Ibtidaiyah, STAIN Pontianak'],
    achievements: ['Guru Teladan Tingkat Kecamatan (2019)', 'Pengembang Kurikulum Merdeka Terbaik (2022)']
  },
  { 
    name: 'Ahmad Fauzi, S.Ag', 
    position: 'Guru Kelas VI', 
    subject: 'IPAS & Pendidikan Pancasila', 
    imageUrl: 'https://i.pravatar.cc/150?u=t3',
    bio: 'Memiliki semangat tinggi dalam mendidik siswa kelas akhir untuk siap melanjutkan ke jenjang pendidikan berikutnya. Menguasai metode pembelajaran yang interaktif dan menyenangkan.',
    education: ['S1 Tarbiyah, IAIN Antasari Banjarmasin'],
    achievements: ['Juara 1 Lomba Inovasi Pembelajaran (2021)', 'Pembimbing Tim Cerdas Cermat Juara Kota']
  },
];

const mockPpdbApplicants = [
  {
    registrationNumber: 'PPDB24001',
    fullName: 'Aditya Pratama',
    nik: '1234567890123456',
    originSchool: 'TK Harapan Bangsa',
    submissionDate: '2024-07-05',
    status: 'Diterima',
    aiVerificationStatus: 'Belum Dicek',
    fatherName: 'Joko Susilo',
    motherName: 'Sri Wahyuni',
    phone: '081234567890',
    documents: { kk: 'path/to/kk1.pdf', akta: 'path/to/akta1.pdf', ijazah: 'path/to/ijazah1.pdf' },
  },
  {
    registrationNumber: 'PPDB24002',
    fullName: 'Bunga Citra Lestari',
    nik: '2345678901234567',
    originSchool: 'RA Al-Ikhlas',
    submissionDate: '2024-07-06',
    status: 'Menunggu Verifikasi',
    aiVerificationStatus: 'Belum Dicek',
    fatherName: 'Bambang Irawan',
    motherName: 'Dewi Sartika',
    phone: '081234567891',
    documents: { kk: 'path/to/kk2.pdf', akta: 'path/to/akta2.pdf', ijazah: '' },
  },
];

const mockEvents = [
  {
    title: 'Penilaian Tengah Semester (PTS) Ganjil',
    date: '2024-09-16',
    time: '08:00',
    location: 'Ruang Kelas Masing-masing',
    description: 'Pelaksanaan ujian tengah semester untuk seluruh siswa kelas 1-6.',
    category: 'Akademik',
  },
  {
    title: 'Peringatan Maulid Nabi Muhammad SAW 1446 H',
    date: '2024-09-15',
    time: '08:30',
    location: 'Masjid Sekolah',
    description: 'Peringatan Maulid Nabi dengan ceramah agama dan pembacaan shalawat bersama.',
    category: 'Umum',
  },
];

const schoolInfoSettings = {
    info: {
        name: 'MIN SINGKAWANG',
        logo: 'https://i.imgur.com/ruwOS0c.jpeg',
        address: 'Jl. Marhaban, Kel. Sedau, Kec. Singkawang Selatan, Kota Singawang',
        motto: 'Berakhlak Mulia, Cerdas, dan Berprestasi',
        email: 'info@minsingkawang.sch.id',
        phone: '(0562) 123456',
    },
    socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
    }
};

const profileContentSettings = {
    vision: 'Terwujudnya peserta didik yang berakhlak mulia, cerdas, terampil, dan berprestasi berdasarkan iman dan takwa.',
    mission: 'Menanamkan akidah dan akhlak mulia melalui pembiasaan.\nMengoptimalkan proses pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.\nMengembangkan potensi siswa di bidang akademik dan non-akademik.\nMenciptakan lingkungan madrasah yang religius, aman, dan nyaman.',
    orgChartUrl: 'https://via.placeholder.com/800x500.png?text=Bagan+Struktur+Organisasi'
};

const ppdbScheduleSettings = {
  startDate: '2024-07-05',
  endDate: '2024-07-20',
  verificationDeadline: '2024-07-23',
  announcementDate: '2024-07-25',
};

// --- Uploader Functions ---

async function uploadCollection(collectionName, dataArray) {
    console.log(`Uploading ${collectionName} collection...`);
    const collectionRef = collection(db, collectionName);
    for (const item of dataArray) {
        try {
            await addDoc(collectionRef, item);
            console.log(`  Added document to ${collectionName}.`);
        } catch (error) {
            console.error(`  Error adding document to ${collectionName}:`, error);
        }
    }
    console.log(`${collectionName} collection uploaded successfully!`);
}

async function uploadSingleDoc(collectionName, docId, data) {
    console.log(`Uploading single document ${docId} to ${collectionName}...`);
    try {
        await setDoc(doc(db, collectionName, docId), data);
        console.log(`Document ${docId} uploaded successfully!`);
    } catch (error) {
        console.error(`Error uploading document ${docId}:`, error);
    }
}

async function main() {
    console.log('--- Starting Database Seeding ---');
    
    await uploadCollection('news', mockNews);
    await uploadCollection('teachers', mockTeachers);
    await uploadCollection('ppdb_applicants', mockPpdbApplicants);
    await uploadCollection('events', mockEvents);

    console.log('\n--- Uploading Settings Documents ---');
    await uploadSingleDoc('settings', 'schoolInfo', schoolInfoSettings);
    await uploadSingleDoc('settings', 'profileContent', profileContentSettings);
    await uploadSingleDoc('settings', 'ppdbSchedule', ppdbScheduleSettings);

    console.log('\n--- Database Seeding Complete! ---');
    console.log('You can now close this script (Ctrl+C).');
}

main().catch(console.error);

