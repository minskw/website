import React, { useState, useEffect, FormEvent } from 'react';
import { HomepageContent } from '../../types';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, LoaderCircle } from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
    const [homepageContent, setHomepageContent] = useState<HomepageContent>({
        heroImageUrl: '',
        welcomeTitle: '',
        welcomeText: '',
        welcomeImageUrl: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'settings', 'homepageContent');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setHomepageContent(docSnap.data() as HomepageContent);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleHomepageSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const docRef = doc(db, 'settings', 'homepageContent');
        await setDoc(docRef, homepageContent);
        setIsSaving(false);
        alert('Pengaturan halaman utama berhasil disimpan!');
    };
    
    if (isLoading) {
        return <div className="flex justify-center py-8"><LoaderCircle className="animate-spin text-primary" size={32}/></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Website</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Halaman Utama</h2>
                <form onSubmit={handleHomepageSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Gambar Hero</label>
                        <input 
                            type="text" 
                            value={homepageContent.heroImageUrl}
                            onChange={e => setHomepageContent({...homepageContent, heroImageUrl: e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                         <p className="text-xs text-gray-500 mt-1">URL gambar besar yang tampil di bagian atas halaman utama.</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Judul Sambutan</label>
                        <input 
                            type="text" 
                            value={homepageContent.welcomeTitle}
                            onChange={e => setHomepageContent({...homepageContent, welcomeTitle: e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Teks Sambutan</label>
                        <textarea 
                            rows={4}
                            value={homepageContent.welcomeText}
                            onChange={e => setHomepageContent({...homepageContent, welcomeText: e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">URL Gambar Sambutan</label>
                        <input 
                            type="text" 
                            value={homepageContent.welcomeImageUrl}
                            onChange={e => setHomepageContent({...homepageContent, welcomeImageUrl: e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL gambar yang tampil di samping teks sambutan.</p>
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                             {isSaving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
                             {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tambahkan form pengaturan lain di sini jika diperlukan, misal: Info Sekolah, Jadwal PPDB, dll. */}
        </div>
    );
};

export default AdminSettingsPage;
