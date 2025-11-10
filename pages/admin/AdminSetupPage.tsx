import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, setDoc, doc, writeBatch } from 'firebase/firestore';
import {
  mockNews,
  mockTeachers,
  mockPpdbApplicants,
  mockEvents
} from '../../services/mockApi';
import { DatabaseZap, CheckCircle, AlertTriangle } from 'lucide-react';

// Data settings disalin di sini untuk membuat komponen ini mandiri
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


const AdminSetupPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleSeedDatabase = async () => {
        if (!window.confirm("Apakah Anda yakin ingin mengisi database? Aksi ini akan menambahkan banyak data baru dan sebaiknya hanya dilakukan sekali pada database yang kosong.")) {
            return;
        }

        setIsLoading(true);
        setLogs([]);
        setStatus('idle');

        try {
            addLog("Memulai proses seeding database...");

            // Use a batch write for efficiency
            const batch = writeBatch(db);

            addLog("Mempersiapkan koleksi 'news'...");
            mockNews.forEach(item => {
                const docRef = doc(collection(db, "news"));
                const { id, ...data } = item; // remove id from mock
                batch.set(docRef, data);
            });
            
            addLog("Mempersiapkan koleksi 'teachers'...");
            mockTeachers.forEach(item => {
                const docRef = doc(collection(db, "teachers"));
                 const { id, ...data } = item;
                batch.set(docRef, data);
            });
            
            addLog("Mempersiapkan koleksi 'ppdb_applicants'...");
            mockPpdbApplicants.forEach(item => {
                const docRef = doc(collection(db, "ppdb_applicants"));
                 const { id, ...data } = item;
                batch.set(docRef, data);
            });

            addLog("Mempersiapkan koleksi 'events'...");
            mockEvents.forEach(item => {
                const docRef = doc(collection(db, "events"));
                 const { id, ...data } = item;
                batch.set(docRef, data);
            });

            addLog("Mempersiapkan dokumen 'settings'...");
            batch.set(doc(db, "settings", "schoolInfo"), schoolInfoSettings);
            batch.set(doc(db, "settings", "profileContent"), profileContentSettings);
            batch.set(doc(db, "settings", "ppdbSchedule"), ppdbScheduleSettings);
            
            addLog("Mengirim data ke Firestore... Ini mungkin memakan waktu beberapa saat.");
            await batch.commit();
            
            addLog("Proses seeding database berhasil diselesaikan!");
            setStatus('success');

        } catch (error) {
            console.error("Database seeding failed:", error);
            addLog(`ERROR: Terjadi kesalahan - ${error instanceof Error ? error.message : String(error)}`);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Setup Awal & Inisialisasi Database</h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-yellow-800">Peringatan Penting</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            Fitur ini bertujuan untuk mengisi database Firestore Anda dengan data awal (contoh) untuk pertama kali.
                            Menjalankan ini pada database yang sudah berisi data dapat menyebabkan duplikasi.
                            <strong> Harap gunakan fitur ini hanya satu kali pada saat setup awal.</strong>
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-wait"
            >
                <DatabaseZap size={20} />
                {isLoading ? 'Sedang Memproses...' : 'Isi Database dengan Data Awal'}
            </button>
            
            {logs.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Log Proses:</h2>
                    <pre className="bg-gray-800 text-white text-sm p-4 rounded-lg h-64 overflow-y-auto font-mono">
                        {logs.join('\n')}
                    </pre>
                </div>
            )}
            
            {status === 'success' && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500"/>
                    <p className="font-semibold text-green-800">Database berhasil diisi! Anda sekarang dapat menggunakan semua halaman admin dengan data permanen.</p>
                </div>
            )}
            {status === 'error' && (
                 <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-500"/>
                    <p className="font-semibold text-red-800">Terjadi kesalahan. Silakan periksa log di atas dan konsol browser untuk detailnya.</p>
                </div>
            )}
        </div>
    );
};

export default AdminSetupPage;