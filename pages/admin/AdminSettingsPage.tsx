
import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { HomepageContent, ProfileContent, PpdbScheduleData, SchoolInfoSettings } from '../../types';
import { LoaderCircle, Save, AlertCircle } from 'lucide-react';

type SettingsTab = 'homepage' | 'profile' | 'ppdb' | 'schoolInfo';

const AdminSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('homepage');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    const [homepageData, setHomepageData] = useState<HomepageContent | null>(null);
    const [profileData, setProfileData] = useState<ProfileContent | null>(null);
    const [ppdbData, setPpdbData] = useState<PpdbScheduleData | null>(null);
    const [schoolInfoData, setSchoolInfoData] = useState<SchoolInfoSettings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const settingsToFetch = {
                    homepageContent: setHomepageData,
                    profileContent: setProfileData,
                    ppdbSchedule: setPpdbData,
                    schoolInfo: setSchoolInfoData
                };

                const promises = Object.entries(settingsToFetch).map(async ([docId, setter]) => {
                    const docRef = doc(db, 'settings', docId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setter(docSnap.data() as any);
                    } else {
                         console.warn(`Settings document '${docId}' not found.`);
                    }
                });

                await Promise.all(promises);

            } catch (err) {
                console.error("Failed to fetch settings:", err);
                setError("Gagal memuat pengaturan. Silakan coba lagi.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);
    
    const handleSave = async (e: FormEvent, docId: string, data: any) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage('');
        try {
            await setDoc(doc(db, 'settings', docId), data, { merge: true });
            setStatusMessage('Pengaturan berhasil disimpan!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (err) {
            console.error(`Failed to save ${docId}:`, err);
            setStatusMessage('Gagal menyimpan pengaturan.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>;
        }
        if (error) {
            return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md flex items-center gap-2"><AlertCircle /> {error}</div>;
        }

        switch (activeTab) {
            case 'homepage':
                return homepageData && <HomepageForm data={homepageData} setData={setHomepageData} onSave={handleSave} isSaving={isSaving} />;
            case 'profile':
                return profileData && <ProfileForm data={profileData} setData={setProfileData} onSave={handleSave} isSaving={isSaving} />;
            case 'ppdb':
                return ppdbData && <PpdbForm data={ppdbData} setData={setPpdbData} onSave={handleSave} isSaving={isSaving} />;
            case 'schoolInfo':
                 return schoolInfoData && <SchoolInfoForm data={schoolInfoData} setData={setSchoolInfoData} onSave={handleSave} isSaving={isSaving} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Website</h1>
            
             {statusMessage && (
                <div className={`mb-4 p-3 rounded-md text-sm ${statusMessage.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {statusMessage}
                </div>
            )}
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {(['homepage', 'profile', 'ppdb', 'schoolInfo'] as SettingsTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {tab === 'schoolInfo' ? 'Info Sekolah' : tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

// Sub-components for forms

const FormField: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {children}
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

const SaveButton: React.FC<{ isSaving: boolean }> = ({ isSaving }) => (
     <button type="submit" disabled={isSaving} className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
        {isSaving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
    </button>
);

const HomepageForm: React.FC<{ data: HomepageContent; setData: Function; onSave: Function; isSaving: boolean }> = ({ data, setData, onSave, isSaving }) => (
    <form onSubmit={(e) => onSave(e, 'homepageContent', data)} className="space-y-4">
        <FormField label="URL Gambar Hero"><input type="text" value={data.heroImageUrl} onChange={e => setData({ ...data, heroImageUrl: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <FormField label="Judul Selamat Datang"><input type="text" value={data.welcomeTitle} onChange={e => setData({ ...data, welcomeTitle: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <FormField label="Teks Selamat Datang"><textarea value={data.welcomeText} onChange={e => setData({ ...data, welcomeText: e.target.value })} className="mt-1 w-full p-2 border rounded h-24" /></FormField>
        <FormField label="URL Gambar Selamat Datang"><input type="text" value={data.welcomeImageUrl} onChange={e => setData({ ...data, welcomeImageUrl: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <SaveButton isSaving={isSaving} />
    </form>
);

const ProfileForm: React.FC<{ data: ProfileContent; setData: Function; onSave: Function; isSaving: boolean }> = ({ data, setData, onSave, isSaving }) => (
    <form onSubmit={(e) => onSave(e, 'profileContent', data)} className="space-y-4">
        <FormField label="Visi Sekolah"><textarea value={data.vision} onChange={e => setData({ ...data, vision: e.target.value })} className="mt-1 w-full p-2 border rounded h-24" /></FormField>
        <FormField label="Misi Sekolah" helpText="Pisahkan setiap poin misi dengan baris baru (Enter)."><textarea value={data.mission} onChange={e => setData({ ...data, mission: e.target.value })} className="mt-1 w-full p-2 border rounded h-32" /></FormField>
        <FormField label="URL Gambar Struktur Organisasi"><input type="text" value={data.orgChartUrl} onChange={e => setData({ ...data, orgChartUrl: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <SaveButton isSaving={isSaving} />
    </form>
);

const PpdbForm: React.FC<{ data: PpdbScheduleData; setData: Function; onSave: Function; isSaving: boolean }> = ({ data, setData, onSave, isSaving }) => (
    <form onSubmit={(e) => onSave(e, 'ppdbSchedule', data)} className="space-y-4">
        <FormField label="Tanggal Mulai Pendaftaran"><input type="date" value={data.startDate} onChange={e => setData({ ...data, startDate: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <FormField label="Tanggal Selesai Pendaftaran"><input type="date" value={data.endDate} onChange={e => setData({ ...data, endDate: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <FormField label="Tanggal Pengumuman"><input type="date" value={data.announcementDate} onChange={e => setData({ ...data, announcementDate: e.target.value })} className="mt-1 w-full p-2 border rounded" /></FormField>
        <SaveButton isSaving={isSaving} />
    </form>
);

const SchoolInfoForm: React.FC<{ data: SchoolInfoSettings; setData: Function; onSave: Function; isSaving: boolean }> = ({ data, setData, onSave, isSaving }) => {
    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, info: { ...data.info, [e.target.name]: e.target.value } });
    };
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, socialLinks: { ...data.socialLinks, [e.target.name]: e.target.value } });
    };
    return (
    <form onSubmit={(e) => onSave(e, 'schoolInfo', data)} className="space-y-6">
        <div>
            <h3 className="text-lg font-medium text-gray-900">Informasi Umum</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nama Sekolah"><input name="name" type="text" value={data.info.name} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="Afiliasi"><input name="affiliation" type="text" value={data.info.affiliation} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="Alamat"><input name="address" type="text" value={data.info.address} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="Email"><input name="email" type="email" value={data.info.email} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="Telepon"><input name="phone" type="tel" value={data.info.phone} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="URL Logo"><input name="logo" type="text" value={data.info.logo} onChange={handleInfoChange} className="mt-1 w-full p-2 border rounded" /></FormField>
            </div>
        </div>
         <div>
            <h3 className="text-lg font-medium text-gray-900">Media Sosial</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="URL Facebook"><input name="facebook" type="text" value={data.socialLinks.facebook} onChange={handleSocialChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="URL Instagram"><input name="instagram" type="text" value={data.socialLinks.instagram} onChange={handleSocialChange} className="mt-1 w-full p-2 border rounded" /></FormField>
                <FormField label="URL Youtube"><input name="youtube" type="text" value={data.socialLinks.youtube} onChange={handleSocialChange} className="mt-1 w-full p-2 border rounded" /></FormField>
            </div>
        </div>
        {/* Important Links editing can be complex, for now let's skip it to keep it simpler. It is seeded in setup page. */}
        <SaveButton isSaving={isSaving} />
    </form>
    );
};

export default AdminSettingsPage;
