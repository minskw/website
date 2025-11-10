import React, { useState, useEffect, FormEvent } from 'react';
import { SCHOOL_INFO } from '../../constants';
import { Calendar, CheckCircle, Info, LoaderCircle, AlertTriangle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

interface PpdbSchedule {
    startDate: string;
    endDate: string;
    announcementDate: string;
}

const PpdbPage: React.FC = () => {
    const [schedule, setSchedule] = useState<PpdbSchedule | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        fullName: '', nik: '', originSchool: '', fatherName: '', motherName: '', phone: ''
    });

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'settings', 'ppdbSchedule');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSchedule(docSnap.data() as PpdbSchedule);
            } else {
                console.log("No PPDB schedule settings found!");
            }
            setIsLoading(false);
        };
        fetchSchedule();
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Basic validation
            if (Object.values(formData).some(val => val.trim() === '')) {
                throw new Error("Semua field wajib diisi.");
            }
            if (formData.nik.length !== 16) {
                throw new Error("NIK harus terdiri dari 16 digit.");
            }

            // In a real app, you would handle file uploads here.
            // For this example, we just add the text data.
            await addDoc(collection(db, "ppdb_applicants"), {
                ...formData,
                registrationNumber: `PPDB24${Math.floor(1000 + Math.random() * 9000)}`, // Simple random number
                submissionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                status: 'Menunggu Verifikasi',
                aiVerificationStatus: 'Belum Dicek',
                documents: { kk: '', akta: '', ijazah: '' } // Placeholder paths
            });
            setSubmitStatus('success');
            setFormData({ fullName: '', nik: '', originSchool: '', fatherName: '', motherName: '', phone: '' });
        } catch (error) {
            console.error("Submission failed:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const today = new Date();
    const startDate = schedule ? new Date(schedule.startDate + 'T00:00:00') : null;
    const endDate = schedule ? new Date(schedule.endDate + 'T23:59:59') : null;
    const isRegistrationOpen = startDate && endDate && today >= startDate && today <= endDate;

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-4">Penerimaan Peserta Didik Baru (PPDB)</h1>
                <p className="text-center text-gray-600 mb-10">Tahun Ajaran 2024/2025</p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Information Column */}
                    <div className="lg:col-span-1 space-y-6">
                         <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><Calendar className="text-secondary" /> Jadwal PPDB</h2>
                            {schedule ? (
                                <ul className="space-y-2 text-gray-600">
                                    <li><strong>Pendaftaran:</strong> {new Date(schedule.startDate).toLocaleDateString('id-ID')} - {new Date(schedule.endDate).toLocaleDateString('id-ID')}</li>
                                    <li><strong>Pengumuman:</strong> {new Date(schedule.announcementDate).toLocaleDateString('id-ID')}</li>
                                </ul>
                            ) : <p>Jadwal belum tersedia.</p>}
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><Info className="text-secondary" /> Informasi</h2>
                            <p className="text-gray-600 text-sm">Pastikan semua data yang diisi adalah benar dan valid. Untuk informasi lebih lanjut, silakan hubungi kontak sekolah.</p>
                        </div>
                    </div>
                    
                    {/* Form Column */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                         <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">Formulir Pendaftaran</h2>
                         {isRegistrationOpen ? (
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">Nama Lengkap Calon Siswa</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">NIK Calon Siswa (16 digit)</label><input type="text" name="nik" value={formData.nik} onChange={handleInputChange} required minLength={16} maxLength={16} className="mt-1 w-full p-2 border rounded"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Asal Sekolah (TK/RA)</label><input type="text" name="originSchool" value={formData.originSchool} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Nama Ayah</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Nama Ibu</label><input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">No. HP Orang Tua (Aktif)</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded"/></div>
                                
                                {submitStatus === 'success' && <div className="p-4 bg-green-100 text-green-800 rounded flex items-center gap-2"><CheckCircle size={20}/> Pendaftaran berhasil dikirim! Silakan tunggu informasi selanjutnya.</div>}
                                {submitStatus === 'error' && <div className="p-4 bg-red-100 text-red-800 rounded flex items-center gap-2"><AlertTriangle size={20}/> Terjadi kesalahan. Silakan coba lagi.</div>}

                                <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                    {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
                                </button>
                             </form>
                         ) : (
                             <div className="text-center py-10">
                                <h3 className="text-xl font-semibold text-gray-700">{today < (startDate || new Date()) ? 'Pendaftaran Belum Dibuka' : 'Pendaftaran Telah Ditutup'}</h3>
                                <p className="text-gray-500 mt-2">Terima kasih atas antusiasme Anda. Silakan kunjungi halaman ini kembali sesuai jadwal yang ditentukan.</p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PpdbPage;
