import { NewsArticle, Teacher, GalleryImage, PpdbApplicant, PpdbStatus, Parent, Student, AcademicRecord, AttendanceRecord, SchoolAnnouncement, SemesterData } from '../types';

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'MIN Singkawang Meraih Juara 1 Lomba Cerdas Cermat Tingkat Kota',
    category: 'Prestasi',
    date: '15 Juli 2024',
    imageUrl: 'https://picsum.photos/seed/news1/800/600',
    excerpt: 'Tim cerdas cermat MIN Singkawang berhasil menunjukkan keunggulannya dengan meraih Juara 1 dalam ajang Lomba Cerdas Cermat (LCC) tingkat Madrasah Ibtidaiyah se-Kota Singkawang.',
    content: '<p>Tim cerdas cermat MIN Singkawang berhasil menunjukkan keunggulannya dengan meraih Juara 1 dalam ajang Lomba Cerdas Cermat (LCC) tingkat Madrasah Ibtidaiyah se-Kota Singkawang. Kompetisi yang diikuti oleh puluhan madrasah ini berlangsung sengit, namun tim MIN Singkawang mampu menjawab pertanyaan-pertanyaan dengan cepat dan tepat.</p><p>Kemenangan ini merupakan buah dari kerja keras siswa dan bimbingan para guru. "Kami sangat bangga dengan pencapaian anak-anak. Ini adalah hasil dari persiapan matang dan semangat juang yang tinggi," ujar salah satu guru pembimbing.</p>',
  },
  {
    id: '2',
    title: 'Kegiatan Manasik Haji Cilik untuk Siswa Kelas 1 dan 2',
    category: 'Kegiatan',
    date: '12 Juli 2024',
    imageUrl: 'https://picsum.photos/seed/news2/800/600',
    excerpt: 'Dalam rangka menanamkan nilai-nilai keagamaan sejak dini, MIN Singkawang mengadakan kegiatan Manasik Haji Cilik yang diikuti oleh seluruh siswa kelas 1 dan 2.',
    content: '<p>Dalam rangka menanamkan nilai-nilai keagamaan sejak dini, MIN Singkawang mengadakan kegiatan Manasik Haji Cilik yang diikuti oleh seluruh siswa kelas 1 dan 2. Siswa diajarkan tata cara pelaksanaan ibadah haji secara sederhana, mulai dari tawaf, sa\'i, hingga wukuf di Arafah mini yang telah disiapkan di halaman sekolah.</p><p>Anak-anak tampak antusias mengikuti setiap rangkaian kegiatan. Diharapkan, kegiatan ini dapat memberikan pemahaman dan kecintaan terhadap rukun Islam yang kelima.</p>',
  },
  {
    id: '3',
    title: 'Pengumuman Jadwal Penerimaan Rapor Semester Genap',
    category: 'Pengumuman',
    date: '10 Juli 2024',
    imageUrl: 'https://picsum.photos/seed/news3/800/600',
    excerpt: 'Diberitahukan kepada seluruh orang tua/wali murid MIN Singkawang, bahwa pembagian rapor hasil belajar semester genap tahun ajaran 2023/2024 akan dilaksanakan pada hari Sabtu, 22 Juli 2024.',
    content: '<p>Diberitahukan kepada seluruh orang tua/wali murid MIN Singkawang, bahwa pembagian rapor hasil belajar semester genap tahun ajaran 2023/2024 akan dilaksanakan pada hari Sabtu, 22 Juli 2024. Pengambilan rapor dimulai pukul 08.00 - 11.00 WIB di kelas masing-masing. Kehadiran orang tua/wali murid sangat diharapkan untuk dapat berkonsultasi langsung dengan wali kelas mengenai perkembangan belajar siswa.</p>',
  },
  {
    id: '4',
    title: 'Peringatan Hari Kemerdekaan RI ke-79 di MIN Singkawang',
    category: 'Kegiatan',
    date: '17 Agustus 2024',
    imageUrl: 'https://picsum.photos/seed/news4/800/600',
    excerpt: 'MIN Singkawang menggelar upacara bendera dan berbagai perlombaan untuk memeriahkan Hari Kemerdekaan Republik Indonesia yang ke-79.',
    content: '<p>MIN Singkawang menggelar upacara bendera dan berbagai perlombaan untuk memeriahkan Hari Kemerdekaan Republik Indonesia yang ke-79. Seluruh siswa dan guru mengikuti upacara dengan khidmat. Setelah upacara, diadakan berbagai lomba tradisional seperti balap karung, makan kerupuk, dan tarik tambang yang menambah semarak suasana.</p>',
  },
    {
    id: '5',
    title: 'Siswa MIN Singkawang Borong Medali di Ajang O2SN',
    category: 'Prestasi',
    date: '5 Juni 2024',
    imageUrl: 'https://picsum.photos/seed/news5/800/600',
    excerpt: 'Kontingen MIN Singkawang berhasil membawa pulang 3 medali emas dan 2 perak dalam Olimpiade Olahraga Siswa Nasional (O2SN) tingkat kecamatan.',
    content: '<p>Kontingen MIN Singkawang berhasil membawa pulang 3 medali emas dan 2 perak dalam Olimpiade Olahraga Siswa Nasional (O2SN) tingkat kecamatan. Medali emas diraih dari cabang atletik lari 60 meter putra, bulu tangkis tunggal putri, dan catur. Prestasi ini membuktikan bahwa siswa MIN Singkawang tidak hanya unggul di bidang akademik, tetapi juga di bidang olahraga.</p>',
  },
  {
    id: '6',
    title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2024/2025 Telah Dibuka',
    category: 'Pengumuman',
    date: '1 Juni 2024',
    imageUrl: 'https://picsum.photos/seed/news6/800/600',
    excerpt: 'MIN Singkawang secara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) untuk tahun ajaran 2024/2025. Pendaftaran dibuka mulai tanggal 5 hingga 20 Juli 2024.',
    content: '<p>MIN Singkawang secara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) untuk tahun ajaran 2024/2025. Pendaftaran dibuka mulai tanggal 5 hingga 20 Juli 2024. Calon siswa dapat mendaftar secara online melalui website sekolah atau datang langsung ke sekretariat PPDB di MIN Singkawang. Informasi lebih lanjut dapat diakses pada menu PPDB di website ini.</p>',
  },
  {
    id: '7',
    title: 'Studi Tur Edukatif ke Museum dan Taman Kota',
    category: 'Kegiatan',
    date: '20 Mei 2024',
    imageUrl: 'https://picsum.photos/seed/news7/800/600',
    excerpt: 'Siswa-siswi kelas 4, 5, dan 6 MIN Singkawang mengikuti kegiatan studi tur edukatif ke Museum Daerah dan Taman Kota Singkawang.',
    content: '<p>Siswa-siswi kelas 4, 5, dan 6 MIN Singkawang mengikuti kegiatan studi tur edukatif ke Museum Daerah dan Taman Kota Singkawang. Kegiatan ini bertujuan untuk menambah wawasan siswa tentang sejarah dan budaya lokal serta menumbuhkan kesadaran akan pentingnya menjaga lingkungan. Siswa diajak untuk mengamati koleksi museum dan melakukan kegiatan bersih-bersih di area taman kota.</p>',
  },
];

export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Drs. H. Muhammad Saleh', position: 'Kepala Madrasah', subject: 'Manajerial', imageUrl: 'https://i.pravatar.cc/150?u=t1' },
  { id: 't2', name: 'Siti Aminah, S.Pd.I', position: 'Waka Kurikulum', subject: 'Akidah Akhlak & SKI', imageUrl: 'https://i.pravatar.cc/150?u=t2' },
  { id: 't3', name: 'Ahmad Fauzi, S.Ag', position: 'Guru Kelas VI', subject: 'IPAS & Pendidikan Pancasila', imageUrl: 'https://i.pravatar.cc/150?u=t3' },
  { id: 't4', name: 'Zainab, S.Pd', position: 'Guru Kelas V', subject: 'Matematika', imageUrl: 'https://i.pravatar.cc/150?u=t4' },
  { id: 't5', name: 'Budi Santoso, S.Kom', position: 'Guru Bahasa Arab', subject: 'Bahasa Arab', imageUrl: 'https://i.pravatar.cc/150?u=t5' },
  { id: 't6', name: 'Dewi Lestari, S.Pd', position: 'Guru Kelas IV', subject: 'Bahasa Indonesia', imageUrl: 'https://i.pravatar.cc/150?u=t6' },
  { id: 't7', name: 'Irfan Hakim, S.Pd.Or', position: 'Guru Olahraga', subject: 'PJOK', imageUrl: 'https://i.pravatar.cc/150?u=t7' },
  { id: 't8', name: 'Nurhayati, S.Ag', position: 'Guru PAI', subject: 'Al-Qur\'an Hadis & Fikih', imageUrl: 'https://i.pravatar.cc/150?u=t8' },
];

export const mockGallery: GalleryImage[] = [
  { id: 'g1', imageUrl: 'https://picsum.photos/seed/gallery1/600/400', caption: 'Upacara Bendera Hari Senin', category: 'Kegiatan' },
  { id: 'g2', imageUrl: 'https://picsum.photos/seed/gallery2/600/400', caption: 'Lomba Cerdas Cermat', category: 'Prestasi' },
  { id: 'g3', imageUrl: 'https://picsum.photos/seed/gallery3/600/400', caption: 'Kegiatan Pramuka', category: 'Ekstrakurikuler' },
  { id: 'g4', imageUrl: 'https://picsum.photos/seed/gallery4/600/400', caption: 'Manasik Haji Cilik', category: 'Kegiatan' },
  { id: 'g5', imageUrl: 'https://picsum.photos/seed/gallery5/600/400', caption: 'Class Meeting Akhir Semester', category: 'Kegiatan' },
  { id: 'g6', imageUrl: 'https://picsum.photos/seed/gallery6/600/400', caption: 'Penyerahan Piala Juara Futsal', category: 'Prestasi' },
  { id: 'g7', imageUrl: 'https://picsum.photos/seed/gallery7/600/400', caption: 'Kerja Bakti Membersihkan Lingkungan Sekolah', category: 'Kegiatan' },
  { id: 'g8', imageUrl: 'https://picsum.photos/seed/gallery8/600/400', caption: 'Praktikum di Laboratorium IPA', category: 'Akademik' },
];

export const mockPpdbApplicants: PpdbApplicant[] = [
  {
    id: 'app1',
    registrationNumber: 'PPDB24001',
    fullName: 'Aditya Pratama',
    nik: '1234567890123456',
    originSchool: 'TK Harapan Bangsa',
    submissionDate: '2024-07-05',
    status: PpdbStatus.ACCEPTED,
    fatherName: 'Joko Susilo',
    motherName: 'Sri Wahyuni',
    phone: '081234567890',
    documents: { kk: 'path/to/kk1.pdf', akta: 'path/to/akta1.pdf', ijazah: 'path/to/ijazah1.pdf' },
  },
  {
    id: 'app2',
    registrationNumber: 'PPDB24002',
    fullName: 'Bunga Citra Lestari',
    nik: '2345678901234567',
    originSchool: 'RA Al-Ikhlas',
    submissionDate: '2024-07-06',
    status: PpdbStatus.WAITING,
    fatherName: 'Bambang Irawan',
    motherName: 'Dewi Sartika',
    phone: '081234567891',
    documents: { kk: 'path/to/kk2.pdf', akta: 'path/to/akta2.pdf', ijazah: '' },
  },
  {
    id: 'app3',
    registrationNumber: 'PPDB24003',
    fullName: 'Candra Wijaya',
    nik: '3456789012345678',
    originSchool: 'TK Pertiwi',
    submissionDate: '2024-07-06',
    status: PpdbStatus.REJECTED,
    fatherName: 'Agus Setiawan',
    motherName: 'Wulan Sari',
    phone: '081234567892',
    documents: { kk: 'path/to/kk3.pdf', akta: 'path/to/akta3.pdf', ijazah: 'path/to/ijazah3.pdf' },
  },
    {
    id: 'app4',
    registrationNumber: 'PPDB24004',
    fullName: 'Dian Permatasari',
    nik: '4567890123456789',
    originSchool: 'RA An-Nur',
    submissionDate: '2024-07-07',
    status: PpdbStatus.VERIFIED,
    fatherName: 'Eko Prasetyo',
    motherName: 'Yuni Shara',
    phone: '081234567893',
    documents: { kk: 'path/to/kk4.pdf', akta: 'path/to/akta4.pdf', ijazah: 'path/to/ijazah4.pdf' },
  },
  {
    id: 'app5',
    registrationNumber: 'PPDB24005',
    fullName: 'Eka Saputra',
    nik: '5678901234567890',
    originSchool: 'TK Ceria',
    submissionDate: '2024-07-08',
    status: PpdbStatus.WAITING,
    fatherName: 'Fajar Nugroho',
    motherName: 'Rina Astuti',
    phone: '081234567894',
    documents: { kk: 'path/to/kk5.pdf', akta: 'path/to/akta5.pdf', ijazah: '' },
  },
];

export const mockStudents: Student[] = [
    { id: 's1', name: 'Ananda Putri', grade: 4, class: '4A', imageUrl: 'https://i.pravatar.cc/150?u=s1' },
    { id: 's2', name: 'Rizky Maulana', grade: 5, class: '5B', imageUrl: 'https://i.pravatar.cc/150?u=s2' },
];

export const mockParents: Parent[] = [
    { id: 'p1', username: 'budi', name: 'Budi Hartono', studentId: 's1' },
    { id: 'p2', username: 'dewi', name: 'Dewi Anggraini', studentId: 's2' },
];

export const mockAcademicRecords: AcademicRecord[] = [
    { subject: 'Al-Qur\'an Hadis', score: 92, teacher: 'Nurhayati, S.Ag', date: '2024-06-15' },
    { subject: 'Akidah Akhlak', score: 95, teacher: 'Siti Aminah, S.Pd.I', date: '2024-06-15' },
    { subject: 'Fikih', score: 88, teacher: 'Nurhayati, S.Ag', date: '2024-06-15' },
    { subject: 'Bahasa Indonesia', score: 90, teacher: 'Dewi Lestari, S.Pd', date: '2024-06-15' },
    { subject: 'Matematika', score: 85, teacher: 'Zainab, S.Pd', date: '2024-06-15' },
    { subject: 'IPAS', score: 89, teacher: 'Ahmad Fauzi, S.Ag', date: '2024-06-15' },
    { subject: 'Bahasa Arab', score: 87, teacher: 'Budi Santoso, S.Kom', date: '2024-06-15' },
];

export const mockSemesterData: SemesterData[] = [
  {
    semesterId: '2023-genap',
    semesterName: 'Semester Genap 2023/2024',
    records: mockAcademicRecords,
  },
  {
    semesterId: '2023-ganjil',
    semesterName: 'Semester Ganjil 2023/2024',
    records: [
      { subject: 'Al-Qur\'an Hadis', score: 90, teacher: 'Nurhayati, S.Ag', date: '2023-12-10' },
      { subject: 'Akidah Akhlak', score: 94, teacher: 'Siti Aminah, S.Pd.I', date: '2023-12-10' },
      { subject: 'Fikih', score: 85, teacher: 'Nurhayati, S.Ag', date: '2023-12-10' },
      { subject: 'Bahasa Indonesia', score: 88, teacher: 'Dewi Lestari, S.Pd', date: '2023-12-10' },
      { subject: 'Matematika', score: 82, teacher: 'Zainab, S.Pd', date: '2023-12-10' },
      { subject: 'IPAS', score: 87, teacher: 'Ahmad Fauzi, S.Ag', date: '2023-12-10' },
      { subject: 'Pendidikan Pancasila', score: 91, teacher: 'Ahmad Fauzi, S.Ag', date: '2023-12-10' },
      { subject: 'PJOK', score: 90, teacher: 'Irfan Hakim, S.Pd.Or', date: '2023-12-10' },
    ],
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
    { date: '2024-07-19', status: 'Hadir' },
    { date: '2024-07-18', status: 'Sakit' },
    { date: '2024-07-17', status: 'Hadir' },
    { date: '2024-07-16', status: 'Alpa' },
    { date: '2024-07-15', status: 'Hadir' },
];

export const mockSchoolAnnouncements: SchoolAnnouncement[] = [
    { id: 'sa1', title: 'Libur Hari Raya Idul Adha', content: 'Diumumkan bahwa sekolah akan libur pada tanggal 17-18 Juni 2024 dalam rangka Hari Raya Idul Adha. Kegiatan belajar mengajar akan dimulai kembali pada 19 Juni 2024.', date: '2024-06-14', targetGrade: 'all' },
    { id: 'sa2', title: 'Kegiatan Imunisasi BIAS Kelas 1 & 2', content: 'Akan diadakan kegiatan imunisasi (BIAS) untuk siswa kelas 1 dan 2 pada hari Selasa, 23 Juli 2024. Mohon orang tua untuk mempersiapkan anaknya.', date: '2024-07-20', targetGrade: 1 },
    { id: 'sa3', title: 'Informasi Kegiatan Class Meeting', content: 'Class meeting semester genap akan dilaksanakan pada tanggal 19-21 Juni 2024. Akan ada berbagai perlombaan antar kelas. Siswa diharapkan berpartisipasi aktif.', date: '2024-06-15', targetGrade: 'all' },
];