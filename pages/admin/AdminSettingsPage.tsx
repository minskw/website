import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LoaderCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface SchoolInfo {
    info: { name: string; logo: string; address: string; motto: string; email: string; phone: string; };
    socialLinks: { facebook: string; instagram: string; youtube: string; };
}
interface ProfileContent { vision: string; mission: string; orgChartUrl: string; }
interface HomepageContent { heroImageUrl: string; welcomeTitle: string; welcomeText: string; welcomeImageUrl: string; }
interface PpdbSchedule { startDate: string; endDate: string; verificationDeadline: string; announcementDate: string; }

type SettingsData = {
    schoolInfo: SchoolInfo | null,
    profileContent: ProfileContent | null,
    homepageContent: HomepageContent | null,
    ppdbSchedule: PpdbSchedule | null,
};

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

const AdminSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SettingsData>({ schoolInfo: null, profileContent: null, homepageContent: null, ppdbSchedule: null });
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const settingIds = ['schoolInfo', 'profileContent', 'homepageContent', 'ppdbSchedule'];
            const promises = settingIds.map(id => getDoc(doc(db, 'settings', id)));
            const docs = await Promise.all(promises);
            const newSettings: any = {};
            docs.forEach((docSnap, index) => {
                if (docSnap.exists()) {
                    newSettings[settingIds[index]] = docSnap.data();
                }
            });
            setSettings(newSettings);
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleInputChange = (category: keyof SettingsData, field: string, value: string, subField?: string) => {
        setSettings(prev => {
            const categoryData = prev[category];
            if (!categoryData) return prev;
            
            let updatedCategoryData;
            if (subField) {
                 updatedCategoryData = { ...categoryData, [subField]: { ...(categoryData as any)[subField], [field]: value } };
            } else {
                 updatedCategoryData = { ...categoryData, [field]: value };
            }

            return { ...prev, [category]: updatedCategoryData };
        });
    };
    
    const handleSave = async (category: keyof SettingsData) => {
        if (!settings[category]) return;
        setSaveStatus('saving');
        try {
            const docRef = doc(db, 'settings', category);
            await updateDoc(docRef, settings[category]!);
            setSaveStatus('success');
        } catch (error) {
            console.error("Failed to save settings:", error);
            setSaveStatus('error');
        } finally {
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center py-10"><LoaderCircle className="animate-spin text-primary" size={32}/></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Pengaturan Website</h1>
            
            {/* School Info Section */}
            {settings.schoolInfo && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Informasi Sekolah</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input value={settings.schoolInfo.info.name} onChange={e => handleInputChange('schoolInfo', 'name', e.target.value, 'info')} placeholder="Nama Sekolah" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.info.motto} onChange={e => handleInputChange('schoolInfo', 'motto', e.target.value, 'info')} placeholder="Motto" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.info.address} onChange={e => handleInputChange('schoolInfo', 'address', e.target.value, 'info')} placeholder="Alamat" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.info.email} onChange={e => handleInputChange('schoolInfo', 'email', e.target.value, 'info')} placeholder="Email" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.info.phone} onChange={e => handleInputChange('schoolInfo', 'phone', e.target.value, 'info')} placeholder="Telepon" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.info.logo} onChange={e => handleInputChange('schoolInfo', 'logo', e.target.value, 'info')} placeholder="URL Logo" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.socialLinks.facebook} onChange={e => handleInputChange('schoolInfo', 'facebook', e.target.value, 'socialLinks')} placeholder="URL Facebook" className="p-2 border rounded" />
                        <input value={settings.schoolInfo.socialLinks.instagram} onChange={e => handleInputChange('schoolInfo', 'instagram', e.target.value, 'socialLinks')} placeholder="URL Instagram" className="p-2 border rounded" />
                    </div>
                    <button onClick={() => handleSave('schoolInfo')} className="mt-4 px-4 py-2 bg-primary text-white rounded">Simpan Info Sekolah</button>
                </div>
            )}
            
            {/* Homepage Content Section */}
            {settings.homepageContent && (
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Konten Halaman Depan</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                       <input value={settings.homepageContent.heroImageUrl} onChange={e => handleInputChange('homepageContent', 'heroImageUrl', e.target.value)} placeholder="URL Gambar Hero" className="p-2 border rounded" />
                       <input value={settings.homepageContent.welcomeImageUrl} onChange={e => handleInputChange('homepageContent', 'welcomeImageUrl', e.target.value)} placeholder="URL Gambar Sambutan" className="p-2 border rounded" />
                    </div>
                    <input value={settings.homepageContent.welcomeTitle} onChange={e => handleInputChange('homepageContent', 'welcomeTitle', e.target.value)} placeholder="Judul Sambutan" className="p-2 border rounded w-full mt-4" />
                    <textarea value={settings.homepageContent.welcomeText} onChange={e => handleInputChange('homepageContent', 'welcomeText', e.target.value)} placeholder="Teks Sambutan" className="p-2 border rounded w-full mt-4" rows={4}></textarea>
                    <button onClick={() => handleSave('homepageContent')} className="mt-4 px-4 py-2 bg-primary text-white rounded">Simpan Konten Halaman Depan</button>
                </div>
            )}

            {/* Save Status Indicator */}
            {saveStatus !== 'idle' && (
                <div className="fixed bottom-8 right-8 p-4 rounded-lg shadow-lg flex items-center gap-3 text-white" style={{
                    backgroundColor: saveStatus === 'success' ? '#28a745' : (saveStatus === 'error' ? '#dc3545' : '#17a2b8')
                }}>
                    {saveStatus === 'saving' && <LoaderCircle className="animate-spin"/>}
                    {saveStatus === 'success' && <CheckCircle/>}
                    {saveStatus === 'error' && <AlertTriangle/>}
                    <span>
                        {saveStatus === 'saving' && 'Menyimpan...'}
                        {saveStatus === 'success' && 'Berhasil disimpan!'}
                        {saveStatus === 'error' && 'Gagal menyimpan.'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default AdminSettingsPage;
