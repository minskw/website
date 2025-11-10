import React, { useState, useMemo } from 'react';
import { mockPpdbApplicants, ppdbSchedule } from '../../services/mockApi';
import { PpdbApplicant, PpdbStatus, AIVerificationStatus } from '../../types';
import { Search, ChevronDown, Check, X, Clock, Eye, Bot, Edit, Download, Trash2, UserPlus } from 'lucide-react';

const getStatusBadge = (status: PpdbStatus) => {
    switch (status) {
        case PpdbStatus.ACCEPTED:
            return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Diterima</span>;
        case PpdbStatus.REJECTED:
            return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Ditolak</span>;
        case PpdbStatus.VERIFIED:
            return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Terverifikasi</span>;
        case PpdbStatus.WAITING:
            return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Menunggu</span>;
        default:
            return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Unknown</span>;
    }
};

const getAIVerificationBadge = (status: AIVerificationStatus) => {
    switch(status) {
        case AIVerificationStatus.VERIFIED:
            return <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"><Check size={12}/> Terverifikasi AI</span>;
        case AIVerificationStatus.MANUAL_REVIEW:
            return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full"><Eye size={12}/> Perlu Review Manual</span>;
        case AIVerificationStatus.NOT_CHECKED:
        default:
             return <span className="flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"><Clock size={12}/> Belum Dicek</span>;
    }
}


const AdminPpdbPage: React.FC = () => {
    const [applicants, setApplicants] = useState<PpdbApplicant[]>(mockPpdbApplicants);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState<PpdbApplicant | null>(null);
    const [editingApplicant, setEditingApplicant] = useState<PpdbApplicant | null>(null);
    const [isVerifying, setIsVerifying] = useState<string | null>(null); // applicant id

    const filteredApplicants = useMemo(() => {
        return applicants.filter(app =>
            app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [applicants, searchTerm]);

    const handleStatusChange = (id: string, newStatus: PpdbStatus) => {
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const handleAIVerify = (id: string) => {
        setIsVerifying(id);
        // Simulate Gemini API call
        setTimeout(() => {
            setApplicants(prev => prev.map(app => {
                if (app.id === id) {
                    const statuses = [AIVerificationStatus.VERIFIED, AIVerificationStatus.MANUAL_REVIEW];
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    return { ...app, aiVerificationStatus: newStatus };
                }
                return app;
            }));
            setIsVerifying(null);
        }, 2000);
    }
    
    const openEditModal = (applicant: PpdbApplicant) => {
        setEditingApplicant({ ...applicant });
    };

    const closeEditModal = () => {
        setEditingApplicant(null);
    };

    const handleUpdateApplicant = () => {
        if (!editingApplicant) return;
        setApplicants(prev => prev.map(app => app.id === editingApplicant.id ? editingApplicant : app));
        closeEditModal();
    };
    
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingApplicant) return;
        setEditingApplicant({ ...editingApplicant, [e.target.name]: e.target.value });
    };
    
    // Modal to show details
    const renderDetailModal = () => {
        if (!selectedApplicant) return null;
        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">Detail Pendaftar</h3>
                        <button onClick={() => setSelectedApplicant(null)} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <p><strong>No. Registrasi:</strong> {selectedApplicant.registrationNumber}</p>
                        <p><strong>Nama Lengkap:</strong> {selectedApplicant.fullName}</p>
                        <p><strong>NIK:</strong> {selectedApplicant.nik}</p>
                        <p><strong>Asal Sekolah:</strong> {selectedApplicant.originSchool}</p>
                        <p><strong>Tanggal Daftar:</strong> {new Date(selectedApplicant.submissionDate).toLocaleDateString('id-ID')}</p>
                        <p><strong>Nama Ayah:</strong> {selectedApplicant.fatherName}</p>
                        <p><strong>Nama Ibu:</strong> {selectedApplicant.motherName}</p>
                        <p><strong>No. HP:</strong> {selectedApplicant.phone}</p>
                        <div>
                            <strong>Dokumen:</strong>
                            <ul className="list-disc list-inside ml-4">
                                <li>Kartu Keluarga: {selectedApplicant.documents.kk ? <a href="#" className="text-blue-600 hover:underline">Unduh</a> : 'Tidak Ada'}</li>
                                <li>Akta Kelahiran: {selectedApplicant.documents.akta ? <a href="#" className="text-blue-600 hover:underline">Unduh</a> : 'Tidak Ada'}</li>
                                <li>Ijazah TK/RA: {selectedApplicant.documents.ijazah ? <a href="#" className="text-blue-600 hover:underline">Unduh</a> : 'Tidak Ada'}</li>
                            </ul>
                        </div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg text-right">
                        <button onClick={() => setSelectedApplicant(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Tutup</button>
                    </div>
                </div>
            </div>
        )
    };
    
     const renderEditModal = () => {
        if (!editingApplicant) return null;

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">Edit Pendaftar</h3>
                        <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="text-sm font-medium">Nama Lengkap</label><input type="text" name="fullName" value={editingApplicant.fullName} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label className="text-sm font-medium">NIK</label><input type="text" name="nik" value={editingApplicant.nik} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label className="text-sm font-medium">Asal Sekolah</label><input type="text" name="originSchool" value={editingApplicant.originSchool} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label className="text-sm font-medium">Nama Ayah</label><input type="text" name="fatherName" value={editingApplicant.fatherName} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label className="text-sm font-medium">Nama Ibu</label><input type="text" name="motherName" value={editingApplicant.motherName} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label className="text-sm font-medium">No. HP</label><input type="text" name="phone" value={editingApplicant.phone} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded" /></div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg text-right space-x-3">
                        <button onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleUpdateApplicant} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan Perubahan</button>
                    </div>
                </div>
            </div>
        )
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pendaftar PPDB</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Cari nama atau no. registrasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">No. Reg</th>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">Asal Sekolah</th>
                            <th className="px-6 py-3">Tgl. Daftar</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Verifikasi AI</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.map(app => (
                            <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{app.registrationNumber}</td>
                                <td className="px-6 py-4">{app.fullName}</td>
                                <td className="px-6 py-4">{app.originSchool}</td>
                                <td className="px-6 py-4">{new Date(app.submissionDate).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                <td className="px-6 py-4 text-center">{getAIVerificationBadge(app.aiVerificationStatus)}</td>
                                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                    <button onClick={() => setSelectedApplicant(app)} title="Lihat Detail" className="text-blue-600 hover:text-blue-800"><Eye size={18} /></button>
                                    <button onClick={() => openEditModal(app)} title="Edit" className="text-green-600 hover:text-green-800"><Edit size={18} /></button>
                                     <button 
                                        onClick={() => handleAIVerify(app.id)} 
                                        title="Verifikasi Dokumen dengan AI" 
                                        className="text-purple-600 hover:text-purple-800 disabled:opacity-50"
                                        disabled={isVerifying === app.id}
                                    >
                                        {isVerifying === app.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div> : <Bot size={18} />}
                                    </button>
                                    <div className="relative group">
                                         <button className="p-1 rounded-md text-gray-600 hover:bg-gray-200"><ChevronDown size={18}/></button>
                                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                             <div className="py-1">
                                                 <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(app.id, PpdbStatus.ACCEPTED)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set Diterima</a>
                                                 <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(app.id, PpdbStatus.REJECTED)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set Ditolak</a>
                                                 <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(app.id, PpdbStatus.VERIFIED)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set Terverifikasi</a>
                                                 <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(app.id, PpdbStatus.WAITING)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set Menunggu</a>
                                             </div>
                                         </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredApplicants.length === 0 && <p className="text-center text-gray-500 py-8">Tidak ada data pendaftar.</p>}
            </div>
            {renderDetailModal()}
            {renderEditModal()}
        </div>
    );
};

export default AdminPpdbPage;