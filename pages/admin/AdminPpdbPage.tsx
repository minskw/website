
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { PpdbApplicant, PpdbStatus, AIVerificationStatus } from '../../types';
import { Bot, LoaderCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI. Make sure API_KEY is configured.", error);
}

const getStatusColor = (status: PpdbStatus) => {
    switch (status) {
        case PpdbStatus.ACCEPTED: return 'bg-green-100 text-green-800';
        case PpdbStatus.REJECTED: return 'bg-red-100 text-red-800';
        case PpdbStatus.VERIFIED: return 'bg-blue-100 text-blue-800';
        case PpdbStatus.WAITING: return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const AIVerificationCell: React.FC<{ status: AIVerificationStatus; notes?: string }> = ({ status, notes }) => {
    switch (status) {
        case AIVerificationStatus.VERIFIED:
            return <span className="flex items-center justify-center gap-1.5 text-green-600" title={notes || 'Terverifikasi oleh AI'}><ShieldCheck size={16} /> Terverifikasi</span>;
        case AIVerificationStatus.MANUAL_REVIEW:
            return <span className="flex items-center justify-center gap-1.5 text-yellow-600" title={notes || 'Perlu tinjauan manual'}><ShieldAlert size={16} /> Perlu Review</span>;
        case AIVerificationStatus.NOT_CHECKED:
        default:
            return <span className="text-gray-500">Belum Dicek</span>;
    }
};

const AdminPpdbPage: React.FC = () => {
    const [applicants, setApplicants] = useState<PpdbApplicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "ppdb_applicants"), orderBy("submissionDate", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const applicantsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PpdbApplicant));
            setApplicants(applicantsData);
            setIsLoading(false);
        }, (err) => {
            console.error(err);
            setError("Gagal memuat data pendaftar secara real-time.");
            setIsLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, []);

    const handleUpdateStatus = async (id: string, status: PpdbStatus) => {
        try {
            const applicantDoc = doc(db, "ppdb_applicants", id);
            await updateDoc(applicantDoc, { status });
            // State will update automatically via onSnapshot
        } catch (err) {
            console.error(err);
            alert("Gagal memperbarui status.");
        }
    };

    const handleAIVerify = async (applicant: PpdbApplicant) => {
        if (!ai) {
            alert("Layanan AI tidak tersedia. Pastikan API Key sudah dikonfigurasi.");
            return;
        }
        setVerifyingId(applicant.id);
        try {
            const prompt = `Analisis data pendaftar siswa baru berikut untuk kemungkinan anomali. Data: Nama Lengkap: ${applicant.fullName}, NIK: ${applicant.nik}, Sekolah Asal: ${applicant.originSchool}, Nama Ayah: ${applicant.fatherName}, Nama Ibu: ${applicant.motherName}. Berikan respons dalam format: STATUS | ALASAN. STATUS harus '${AIVerificationStatus.VERIFIED}' atau '${AIVerificationStatus.MANUAL_REVIEW}'. ALASAN harus singkat (maks 10 kata). Contoh: ${AIVerificationStatus.VERIFIED} | Data terlihat konsisten.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            const text = response.text;
            
            const [statusText, reason] = text.split('|').map(s => s.trim());

            let newStatus: AIVerificationStatus = AIVerificationStatus.MANUAL_REVIEW;
            if (statusText === AIVerificationStatus.VERIFIED) {
                newStatus = AIVerificationStatus.VERIFIED;
            }

            const applicantDoc = doc(db, "ppdb_applicants", applicant.id);
            await updateDoc(applicantDoc, {
                aiVerificationStatus: newStatus,
                aiVerificationNotes: reason || "Tidak ada catatan.",
            });
            // State will update automatically via onSnapshot
        } catch (err) {
            console.error("AI verification failed:", err);
            alert("Verifikasi AI gagal. Periksa konsol untuk detail.");
        } finally {
            setVerifyingId(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin text-primary" size={32} /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pendaftar PPDB</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No. Reg</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nama</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tanggal Daftar</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Verifikasi AI</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {applicants.map(app => (
                            <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{app.registrationNumber}</td>
                                <td className="py-3 px-4">{app.fullName}</td>
                                <td className="py-3 px-4">{new Date(app.submissionDate).toLocaleDateString('id-ID')}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <AIVerificationCell status={app.aiVerificationStatus} notes={app.aiVerificationNotes} />
                                </td>
                                <td className="py-3 px-4 flex items-center gap-2">
                                    <button
                                        onClick={() => handleAIVerify(app)}
                                        disabled={verifyingId === app.id || !ai}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={ai ? "Verifikasi dengan AI" : "AI tidak tersedia"}
                                    >
                                        {verifyingId === app.id ? <LoaderCircle className="animate-spin" size={18} /> : <Bot size={18} />}
                                    </button>
                                     <select
                                        value={app.status}
                                        onChange={(e) => handleUpdateStatus(app.id, e.target.value as PpdbStatus)}
                                        className="text-sm border-gray-300 rounded p-1"
                                    >
                                        <option value={PpdbStatus.WAITING}>Menunggu</option>
                                        <option value={PpdbStatus.VERIFIED}>Verifikasi</option>
                                        <option value={PpdbStatus.ACCEPTED}>Terima</option>
                                        <option value={PpdbStatus.REJECTED}>Tolak</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPpdbPage;
