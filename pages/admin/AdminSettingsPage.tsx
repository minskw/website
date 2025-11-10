import React, { useState, useEffect } from 'react';
import { SCHOOL_INFO } from '../../constants';
import { SchoolEvent } from '../../types';
import { Info, Calendar, UserCheck, Users, Save, PlusCircle, Edit, Trash2, X, Building, Flag, Eye } from 'lucide-react';

// Firebase imports
import { db } from '../../services/firebase';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const AdminSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('umum');
    const [isLoading, setIsLoading] = useState(true);

    // --- State for each tab ---
    const [schoolInfo, setSchoolInfo] = useState(SCHOOL_INFO);
    const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', youtube: '' });
    const [profileContent, setProfileContent] = useState({
        vision: '',
        mission: '',
        orgChartUrl: ''
    });
    const [schedule, setSchedule] = useState({ startDate: '', endDate: '', verificationDeadline: '', announcementDate: ''});
    const [events, setEvents] = useState<SchoolEvent[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<SchoolEvent | null>(null);
    
    // --- Firestore Refs ---
    const settingsCollectionRef = collection(db, "settings");
    const eventsCollectionRef = collection(db, "events");

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            // Fetch School Info
            const schoolInfoDoc = await getDoc(doc(settingsCollectionRef, "schoolInfo"));
            if (schoolInfoDoc.exists()) {
                const data = schoolInfoDoc.data();
                setSchoolInfo(prev => ({...prev, ...data.info}));
                setSocialLinks(data.socialLinks);
            }

             // Fetch Profile Content
            const profileDoc = await getDoc(doc(settingsCollectionRef, "profileContent"));
            if (profileDoc.exists()) {
                setProfileContent(profileDoc.data() as any);
            }

            // Fetch PPDB Schedule
            const scheduleDoc = await getDoc(doc(settingsCollectionRef, "ppdbSchedule"));
            if (scheduleDoc.exists()) {
                setSchedule(scheduleDoc.data() as any);
            }
            
            // Fetch Events
            const eventsQuery = query(eventsCollectionRef, orderBy("date", "desc"));
            const eventsSnapshot = await getDocs(eventsQuery);
            setEvents(eventsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SchoolEvent)));

            setIsLoading(false);
        };
        fetchData();
    }, []);


    // --- Handlers ---
    const handleSave = async (section: string) => {
        try {
            if (section === 'Informasi Umum') {
                await setDoc(doc(settingsCollectionRef, "schoolInfo"), { info: schoolInfo, socialLinks });
            } else if (section === 'Halaman Profil') {
                await setDoc(doc(settingsCollectionRef, "profileContent"), profileContent);
            } else if (section === 'Jadwal PPDB') {
                await setDoc(doc(settingsCollectionRef, "ppdbSchedule"), schedule);
            }
             alert(`Pengaturan untuk seksi '${section}' telah disimpan!`);
        } catch (error) {
            console.error("Error saving settings: ", error);
            alert(`Gagal menyimpan pengaturan untuk '${section}'.`);
        }
    };
    
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900";
    const textareaClass = `${inputClass} min-h-[100px]`;

    const openEventModal = (event: SchoolEvent | null = null) => {
        setCurrentEvent(event ? { ...event } : {
            id: '',
            title: '',
            date: '',
            time: '',
            location: '',
            description: '',
            category: 'Umum'
        });
        setIsEventModalOpen(true);
    };

    const closeEventModal = () => setIsEventModalOpen(false);

    const handleSaveEvent = async () => {
        if (!currentEvent) return;
        const { id, ...eventData } = currentEvent;
        if (id) { // Update
            await updateDoc(doc(eventsCollectionRef, id), eventData);
            setEvents(events.map(e => e.id === id ? currentEvent : e));
        } else { // Create
            const docRef = await addDoc(eventsCollectionRef, eventData);
            setEvents([{...currentEvent, id: docRef.id}, ...events]);
        }
        closeEventModal();
    };

    const handleDeleteEvent = async (id: string) => {
        if (window.confirm('Yakin ingin menghapus acara ini?')) {
            await deleteDoc(doc(eventsCollectionRef, id));
            setEvents(events.filter(e => e.id !== id));
        }
    };
    
    const eventCategories: SchoolEvent['category'][] = ['Akademik', 'Olahraga', 'Seni & Budaya', 'Umum'];

    // --- Render Methods ---
    const TABS = [
        { id: 'umum', label: 'Informasi Umum', icon: <Info size={18} /> },
        { id: 'profil', label: 'Halaman Profil', icon: <Building size={18} /> },
        { id: 'ppdb', label: 'Jadwal PPDB', icon: <UserCheck size={18} /> },
        { id: 'kalender', label: 'Kalender Kegiatan', icon: <Calendar size={18} /> },
    ];

    const renderGeneralInfo = () => (
        <div className="space-y-6">
            <div className="p-5 border rounded-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Informasi Kontak</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Nama Sekolah</label><input type="text" value={schoolInfo.name} onChange={e => setSchoolInfo({...schoolInfo, name: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Moto</label><input type="text" value={schoolInfo.motto} onChange={e => setSchoolInfo({...schoolInfo, motto: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Email</label><input type="email" value={schoolInfo.email} onChange={e => setSchoolInfo({...schoolInfo, email: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Telepon</label><input type="tel" value={schoolInfo.phone} onChange={e => setSchoolInfo({...schoolInfo, phone: e.target.value})} className={inputClass} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium">Alamat</label><textarea value={schoolInfo.address} onChange={e => setSchoolInfo({...schoolInfo, address: e.target.value})} className={textareaClass} /></div>
                </div>
            </div>
            <div className="p-5 border rounded-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Media Sosial</h3>
                <div className="grid md:grid-cols-2 gap-4">
                     <div><label className="block text-sm font-medium">URL Facebook</label><input type="url" value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} className={inputClass} /></div>
                     <div><label className="block text-sm font-medium">URL Instagram</label><input type="url" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} className={inputClass} /></div>
                     <div><label className="block text-sm font-medium">URL YouTube</label><input type="url" value={socialLinks.youtube} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} className={inputClass} /></div>
                </div>
            </div>
            <button onClick={() => handleSave('Informasi Umum')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold"><Save size={18} /> Simpan Perubahan</button>
        </div>
    );
    
    const renderProfileSettings = () => (
         <div className="space-y-6">
            <div className="p-5 border rounded-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Eye className="text-secondary"/> Visi</h3>
                <textarea value={profileContent.vision} onChange={e => setProfileContent({...profileContent, vision: e.target.value})} className={textareaClass} />
            </div>
            <div className="p-5 border rounded-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Flag className="text-secondary"/> Misi (pisahkan dengan baris baru)</h3>
                <textarea value={profileContent.mission} onChange={e => setProfileContent({...profileContent, mission: e.target.value})} className={textareaClass} />
            </div>
            <div className="p-5 border rounded-lg">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Lainnya</h3>
                <div><label className="block text-sm font-medium">URL Gambar Struktur Organisasi</label><input type="url" value={profileContent.orgChartUrl} onChange={e => setProfileContent({...profileContent, orgChartUrl: e.target.value})} className={inputClass} /></div>
            </div>
             <button onClick={() => handleSave('Halaman Profil')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold"><Save size={18} /> Simpan Perubahan</button>
        </div>
    );

    const renderPpdbSchedule = () => (
        <div className="space-y-6">
            <div className="p-5 border rounded-lg">
                 <h3 className="text-lg font-bold text-gray-700 mb-4">Atur Jadwal PPDB</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Tanggal Mulai Pendaftaran</label><input type="date" value={schedule.startDate} onChange={e => setSchedule({...schedule, startDate: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Tanggal Selesai Pendaftaran</label><input type="date" value={schedule.endDate} onChange={e => setSchedule({...schedule, endDate: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Batas Akhir Verifikasi</label><input type="date" value={schedule.verificationDeadline} onChange={e => setSchedule({...schedule, verificationDeadline: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-sm font-medium">Tanggal Pengumuman</label><input type="date" value={schedule.announcementDate} onChange={e => setSchedule({...schedule, announcementDate: e.target.value})} className={inputClass} /></div>
                 </div>
            </div>
            <button onClick={() => handleSave('Jadwal PPDB')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold"><Save size={18} /> Simpan Jadwal</button>
        </div>
    );

    const renderCalendarManagement = () => (
        <div className="space-y-6">
            <div className="p-5 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-gray-700">Manajemen Acara Sekolah</h3>
                     <button onClick={() => openEventModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-semibold"><PlusCircle size={18} /> Tambah Acara Baru</button>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Tanggal</th>
                                <th className="px-4 py-2">Nama Acara</th>
                                <th className="px-4 py-2">Kategori</th>
                                <th className="px-4 py-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{event.date}</td>
                                    <td className="px-4 py-2 font-medium">{event.title}</td>
                                    <td className="px-4 py-2">{event.category}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => openEventModal(event)} className="text-blue-600 mr-4"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isEventModalOpen && currentEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h4 className="font-bold">{currentEvent.id ? 'Edit Acara' : 'Tambah Acara Baru'}</h4>
                            <button onClick={closeEventModal}><X/></button>
                        </div>
                        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                            <div><label className="text-sm">Nama Acara</label><input type="text" value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-sm">Tanggal</label><input type="date" value={currentEvent.date} onChange={e => setCurrentEvent({...currentEvent, date: e.target.value})} className={inputClass} /></div>
                                <div><label className="text-sm">Waktu</label><input type="time" value={currentEvent.time} onChange={e => setCurrentEvent({...currentEvent, time: e.target.value})} className={inputClass} /></div>
                            </div>
                            <div><label className="text-sm">Lokasi</label><input type="text" value={currentEvent.location} onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})} className={inputClass} /></div>
                             <div><label className="text-sm">Kategori</label>
                                <select value={currentEvent.category} onChange={e => setCurrentEvent({...currentEvent, category: e.target.value as SchoolEvent['category']})} className={`${inputClass} bg-white`}>
                                    {eventCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div><label className="text-sm">Deskripsi</label><textarea value={currentEvent.description} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})} className={textareaClass} /></div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3">
                            <button onClick={closeEventModal} className="px-3 py-1 bg-gray-200 rounded">Batal</button>
                            <button onClick={handleSaveEvent} className="px-3 py-1 bg-primary text-white rounded">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        if (isLoading) return <p className="text-center py-8">Memuat pengaturan...</p>;
        switch (activeTab) {
            case 'umum': return renderGeneralInfo();
            case 'profil': return renderProfileSettings();
            case 'ppdb': return renderPpdbSchedule();
            case 'kalender': return renderCalendarManagement();
            default: return null;
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Website</h1>
            <div className="flex flex-wrap border-b border-gray-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                            activeTab === tab.id
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-primary'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

export default AdminSettingsPage;