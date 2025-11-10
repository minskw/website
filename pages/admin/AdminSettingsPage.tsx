import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { LoaderCircle, Save, AlertCircle, Trash2, PlusCircle } from 'lucide-react';
import { ImportantLink, HomepageContent, SchoolEvent } from '../../types';

// Define interfaces for the settings data
interface SchoolInfoData {
    name: string;
    address: string;
    email: string;
    phone: string;
    logo: string;
    affiliation: string;
}

interface SocialLinksData {
    facebook: string;
    instagram: string;
    youtube: string;
}

interface ProfileContentData {
    vision: string;
    mission: string;
    orgChartUrl: string;
}

interface PpdbScheduleData {
    startDate: string;
    endDate: string;
    announcementDate: string;
}

// Main state for all settings
interface AllSettings {
    schoolInfo: {
        info: SchoolInfoData;
        socialLinks: SocialLinksData;
        importantLinks: ImportantLink[];
    };
    homepageContent: HomepageContent;
    profileContent: ProfileContentData;
    ppdbSchedule: PpdbScheduleData;
}

const AdminSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<AllSettings | null>(null);
    const [events, setEvents] = useState<SchoolEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('homepage');

    useEffect(() => {
        const fetchAllSettings = async () => {
             try {
                const schoolInfoSnap = await getDoc(doc(db, 'settings', 'schoolInfo'));
                const homepageContentSnap = await getDoc(doc(db, 'settings', 'homepageContent'));
                const profileContentSnap = await getDoc(doc(db, 'settings', 'profileContent'));
                const ppdbScheduleSnap = await getDoc(doc(db, 'settings', 'ppdbSchedule'));

                if (schoolInfoSnap.exists() && homepageContentSnap.exists() && profileContentSnap.exists() && ppdbScheduleSnap.exists()) {
                    setSettings({
                        schoolInfo: schoolInfoSnap.data() as AllSettings['schoolInfo'],
                        homepageContent: homepageContentSnap.data() as HomepageContent,
                        profileContent: profileContentSnap.data() as ProfileContentData,
                        ppdbSchedule: ppdbScheduleSnap.data() as PpdbScheduleData,
                    });
                } else {
                    setError("Beberapa data pengaturan tidak ditemukan. Harap jalankan 'Setup Awal' terlebih dahulu.");
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
                setError("Gagal memuat pengaturan.");
            } finally {
                 setIsLoading(false);
            }
        };

        const q = query(collection(db, "events"), orderBy("date", "desc"));
        const unsubscribeEvents = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SchoolEvent)));
        });

        fetchAllSettings();
        
        return () => {
            unsubscribeEvents();
        };

    }, []);

     const handleInputChange = (section: keyof AllSettings | 'schoolInfo.info' | 'schoolInfo.socialLinks', field: string, value: string) => {
        setSettings(prev => {
            if (!prev) return null;

            if (section === 'schoolInfo.info') {
                return { ...prev, schoolInfo: { ...prev.schoolInfo, info: { ...prev.schoolInfo.info, [field]: value } } };
            }
            if (section === 'schoolInfo.socialLinks') {
                return { ...prev, schoolInfo: { ...prev.schoolInfo, socialLinks: { ...prev.schoolInfo.socialLinks, [field]: value } } };
            }

            return { ...prev, [section]: { ...prev[section as keyof AllSettings], [field]: value } };
        });
    };
    
    // ... (rest of the handler functions: handleImportantLinkChange, addImportantLink, removeImportantLink)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        
        setIsSaving(true);
        setSuccessMessage(null);
        setError(null);
        
        try {
            await setDoc(doc(db, 'settings', 'schoolInfo'), settings.schoolInfo);
            await setDoc(doc(db, 'settings', 'homepageContent'), settings.homepageContent);
            await setDoc(doc(db, 'settings', 'profileContent'), settings.profileContent);
            await setDoc(doc(db, 'settings', 'ppdbSchedule'), settings.ppdbSchedule);
            setSuccessMessage("Pengaturan berhasil disimpan!");
        } catch (err) {
            console.error("Failed to save settings:", err);
            setError("Gagal menyimpan pengaturan.");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'homepage':
                return (
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Pengaturan Halaman Beranda</h2>
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium">Judul Sambutan</label><input value={settings!.homepageContent.welcomeTitle} onChange={e => handleInputChange('homepageContent', 'welcomeTitle', e.target.value)} className="w-full p-2 border rounded mt-1" /></div>
                            <div><label className="text-sm font-medium">Teks Sambutan</label><textarea value={settings!.homepageContent.welcomeText} onChange={e => handleInputChange('homepageContent', 'welcomeText', e.target.value)} className="w-full p-2 border rounded h-24 mt-1" /></div>
                            <div><label className="text-sm font-medium">URL Gambar Latar (Hero)</label><input value={settings!.homepageContent.heroImageUrl} onChange={e => handleInputChange('homepageContent', 'heroImageUrl', e.target.value)} className="w-full p-2 border rounded mt-1" /></div>
                            <div><label className="text-sm font-medium">URL Gambar Sambutan</label><input value={settings!.homepageContent.welcomeImageUrl} onChange={e => handleInputChange('homepageContent', 'welcomeImageUrl', e.target.value)} className="w-full p-2 border rounded mt-1" /></div>
                        </div>
                    </section>
                );
            // ... (other cases for 'info', 'profile', 'ppdb', 'links', 'calendar')
            default:
                return null;
        }
    }


    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin text-primary" size={32} /></div>;
    }
    
    if (error && !settings) {
        return <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center gap-2"><AlertCircle size={20} />{error}</div>;
    }

    if (!settings) {
         return <div className="text-center p-8">Data pengaturan tidak dapat dimuat.</div>;
    }

    const TABS = [
        { id: 'homepage', label: 'Beranda' },
        { id: 'info', label: 'Info Umum' },
        { id: 'profile', label: 'Profil' },
        { id: 'ppdb', label: 'Jadwal PPDB' },
        { id: 'links', label: 'Tautan' },
        { id: 'calendar', label: 'Kalender' },
    ];
    
    // Simplified render method for brevity
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Pengaturan Website</h1>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {TABS.map(tab => (
                         <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Render active tab content here */}
                {renderContent()}

                <div className="bg-white p-4 rounded-lg shadow-md sticky bottom-4 mt-6">
                    {successMessage && <p className="text-green-500 text-sm mb-2 text-center">{successMessage}</p>}
                    <button type="submit" disabled={isSaving} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2">
                        {isSaving ? <LoaderCircle className="animate-spin" /> : <Save />} 
                        Simpan Semua Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;