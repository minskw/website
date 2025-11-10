import React, { useState } from 'react';
import { db } from '../../services/firebase';
// FIX: Added 'collection' to the import to resolve "Cannot find name 'collection'" error.
import { doc, writeBatch, collection } from 'firebase/firestore';
import { SCHOOL_INFO, SOCIAL_LINKS } from '../../constants';
import { LoaderCircle } from 'lucide-react';
import { GalleryAlbum } from '../../types';

// Dummy data for seeding
const initialHomepageContent = {
    heroImageUrl: 'https://images.unsplash.com/photo-1576765682835-a73c552096e2?q=80&w=2070&auto=format&fit=crop',
    welcomeTitle: `Selamat Datang di ${SCHOOL_INFO.name}`,
    welcomeText: `Kami berkomitmen untuk memberikan pendidikan berkualitas yang berlandaskan nilai-nilai Islam, menciptakan generasi yang cerdas, berakhlak mulia, dan berprestasi.`,
    welcomeImageUrl: 'https://images.unsplash.com/photo-1594400273525-242d20bcca6b?q=80&w=1974&auto=format&fit=crop',
};

const initialProfileContent = {
    vision: 'Terwujudnya peserta didik yang berakhlak mulia, cerdas, terampil, dan berprestasi.',
    mission: 'Menyelenggarakan pendidikan yang berkualitas.\nMengembangkan potensi siswa secara optimal.\nMembina akhlak mulia dan budi pekerti luhur.',
    orgChartUrl: 'https://via.placeholder.com/800x600.png?text=Bagan+Struktur+Organisasi',
};

const initialPpdbSchedule = {
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    announcementDate: '2024-07-10',
};

const initialSchoolInfo = {
    info: { ...SCHOOL_INFO },
    socialLinks: { ...SOCIAL_LINKS }
};

const initialGalleryAlbums: Omit<GalleryAlbum, 'id'>[] = [
    {
        title: "Peringatan 17 Agustus",
        category: "Kegiatan",
        createdAt: new Date().toISOString(),
        images: [
            { imageUrl: "https://picsum.photos/seed/17agustus-1/800/600", caption: "Lomba balap karung." },
            { imageUrl: "https://picsum.photos/seed/17agustus-2/800/600", caption: "Upacara bendera." },
        ]
    },
    {
        title: "Juara Lomba Cerdas Cermat",
        category: "Prestasi",
        createdAt: new Date().toISOString(),
        images: [
            { imageUrl: "https://picsum.photos/seed/juara-1/800/600", caption: "Penyerahan piala oleh kepala sekolah." }
        ]
    }
];


const AdminSetupPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleSeedDatabase = async () => {
        if (!window.confirm("Apakah Anda yakin ingin melakukan setup awal? Ini akan menimpa pengaturan dan galeri yang ada dengan data default.")) {
            return;
        }

        setIsLoading(true);
        setStatusMessage('Memulai proses setup...');

        try {
            const batch = writeBatch(db);

            // Settings documents
            batch.set(doc(db, 'settings', 'homepageContent'), initialHomepageContent);
            batch.set(doc(db, 'settings', 'profileContent'), initialProfileContent);
            batch.set(doc(db, 'settings', 'ppdbSchedule'), initialPpdbSchedule);
            batch.set(doc(db, 'settings', 'schoolInfo'), initialSchoolInfo);

            // Gallery Albums
            initialGalleryAlbums.forEach(album => {
                const albumRef = doc(collection(db, 'gallery_albums'));
                batch.set(albumRef, album);
            });
            
            await batch.commit();

            setStatusMessage('Setup awal berhasil! Pengaturan dan galeri telah diisi dengan data default.');
        } catch (error) {
            console.error("Database seeding failed:", error);
            setStatusMessage('Terjadi kesalahan saat setup. Silakan periksa konsol untuk detail.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Setup Awal Website</h1>
            <p className="text-gray-600 mb-6">
                Gunakan tombol di bawah ini untuk mengisi database dengan data awal (default). 
                Ini berguna untuk penggunaan pertama kali atau untuk mereset pengaturan website.
                <strong> Peringatan:</strong> Tindakan ini akan menimpa data pengaturan dan galeri yang ada.
            </p>
            
            <button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Jalankan Setup Awal'}
            </button>

            {statusMessage && (
                <div className={`mt-4 p-4 rounded-md text-sm ${statusMessage.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default AdminSetupPage;