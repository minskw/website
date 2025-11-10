
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LoaderCircle, Save } from 'lucide-react';
import { HomepageContent } from '../../types';

interface ProfileContent {
    vision: string;
    mission: string;
    orgChartUrl: string;
}

interface PpdbSchedule {
    startDate: string;
    endDate: string;
    announcementDate: string;
}

const AdminSettingsPage: React.FC = () => {
    const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
    const [profileContent, setProfileContent] = useState<ProfileContent | null>(null);
    const [ppdbSchedule, setPpdbSchedule] = useState<PpdbSchedule | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const homepageRef = doc(db, 'settings', 'homepageContent');
            const profileRef = doc(db, 'settings', 'profileContent');
            const ppdbRef = doc(db, 'settings', 'ppdbSchedule');
            
            const [homepageSnap, profileSnap, ppdbSnap] = await Promise.all([
                getDoc(homepageRef),
                getDoc(profileRef),
                getDoc(ppdbRef)
            ]);
            
            if (homepageSnap.exists()) setHomepageContent(homepageSnap.data() as HomepageContent);
            if (profileSnap.exists()) setProfileContent(profileSnap.data() as ProfileContent);
            if (ppdbSnap.exists()) setPpdbSchedule(ppdbSnap.data() as PpdbSchedule);
            
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            alert("Gagal memuat pengaturan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async (section: string, data: any) => {
        setIsSaving(section);
        try {
            await setDoc(doc(db, 'settings', section), data);
            alert(`Pengaturan ${section} berhasil disimpan!`);
        } catch (error) {
            console.error(`Failed to save ${section}:`, error);
            alert(`Gagal menyimpan pengaturan ${section}.`);
        } finally {
            setIsSaving(null);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin text-primary" size={32} /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Pengaturan Website</h1>
            
            {/* Homepage Settings */}
            {homepageContent && (
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('homepageContent', homepageContent); }} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Halaman Utama</h2>
                    <div className="space-y-4">
                        <input value={homepageContent.heroImageUrl} onChange={e => setHomepageContent(p => p && {...p, heroImageUrl: e.target.value})} placeholder="URL Gambar Hero" className="w-full p-2 border rounded" />
                        <input value={homepageContent.welcomeTitle} onChange={e => setHomepageContent(p => p && {...p, welcomeTitle: e.target.value})} placeholder="Judul Selamat Datang" className="w-full p-2 border rounded" />
                        <textarea value={homepageContent.welcomeText} onChange={e => setHomepageContent(p => p && {...p, welcomeText: e.target.value})} placeholder="Teks Selamat Datang" className="w-full p-2 border rounded h-24" />
                        <input value={homepageContent.welcomeImageUrl} onChange={e => setHomepageContent(p => p && {...p, welcomeImageUrl: e.target.value})} placeholder="URL Gambar Selamat Datang" className="w-full p-2 border rounded" />
                    </div>
                    <button type="submit" disabled={isSaving === 'homepageContent'} className="mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                        {isSaving === 'homepageContent' ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18} />} Simpan
                    </button>
                </form>
            )}

            {/* Profile Settings */}
            {profileContent && (
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('profileContent', profileContent); }} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Halaman Profil</h2>
                    <div className="space-y-4">
                         <textarea value={profileContent.vision} onChange={e => setProfileContent(p => p && {...p, vision: e.target.value})} placeholder="Visi Sekolah" className="w-full p-2 border rounded h-20" />
                         <textarea value={profileContent.mission} onChange={e => setProfileContent(p => p && {...p, mission: e.target.value})} placeholder="Misi Sekolah (satu per baris)" className="w-full p-2 border rounded h-32" />
                         <input value={profileContent.orgChartUrl} onChange={e => setProfileContent(p => p && {...p, orgChartUrl: e.target.value})} placeholder="URL Bagan Struktur Organisasi" className="w-full p-2 border rounded" />
                    </div>
                     <button type="submit" disabled={isSaving === 'profileContent'} className="mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                        {isSaving === 'profileContent' ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18} />} Simpan
                    </button>
                </form>
            )}

            {/* PPDB Schedule Settings */}
            {ppdbSchedule && (
                 <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('ppdbSchedule', ppdbSchedule); }} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Jadwal PPDB</h2>
                     <div className="space-y-4">
                         <label className="block">Tanggal Mulai: <input type="date" value={ppdbSchedule.startDate} onChange={e => setPpdbSchedule(p => p && {...p, startDate: e.target.value})} className="w-full p-2 border rounded" /></label>
                         <label className="block">Tanggal Selesai: <input type="date" value={ppdbSchedule.endDate} onChange={e => setPpdbSchedule(p => p && {...p, endDate: e.target.value})} className="w-full p-2 border rounded" /></label>
                         <label className="block">Tanggal Pengumuman: <input type="date" value={ppdbSchedule.announcementDate} onChange={e => setPpdbSchedule(p => p && {...p, announcementDate: e.target.value})} className="w-full p-2 border rounded" /></label>
                     </div>
                     <button type="submit" disabled={isSaving === 'ppdbSchedule'} className="mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                        {isSaving === 'ppdbSchedule' ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18} />} Simpan
                    </button>
                </form>
            )}
        </div>
    );
};

export default AdminSettingsPage;
