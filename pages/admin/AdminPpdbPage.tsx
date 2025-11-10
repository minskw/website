import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { mockPpdbApplicants } from '../../services/mockApi';
import { PpdbApplicant, PpdbStatus, AIVerificationStatus } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { Search, Filter, Edit, Trash2, Download, FileText, CalendarDays, ChevronsUpDown, ChevronUp, ChevronDown, FolderDown, ShieldCheck, LoaderCircle, X, User, Users, Sparkles } from 'lucide-react';

const getStatusClass = (status: PpdbStatus) => {
    switch (status) {
        case PpdbStatus.WAITING: return 'bg-yellow-100 text-yellow-800';
        case PpdbStatus.VERIFIED: return 'bg-blue-100 text-blue-800';
        case PpdbStatus.ACCEPTED: return 'bg-green-100 text-green-800';
        case PpdbStatus.REJECTED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const getAIVerificationStatusClass = (status: AIVerificationStatus) => {
    switch (status) {
        case AIVerificationStatus.VERIFIED: return 'bg-teal-100 text-teal-800';
        case AIVerificationStatus.MANUAL_REVIEW: return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Interface for the schedule
interface PpdbSchedule {
    startDate: string;
    endDate: string;
    verificationDeadline: string;
    announcementDate: string;
}

// Props for the component
interface ImportantDatesSectionProps {
    schedule: PpdbSchedule;
    onUpdateSchedule: (newSchedule: PpdbSchedule) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'Belum diatur';
    // Add T00:00:00 to ensure date is parsed in local timezone, not UTC
    return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const ApplicantDetailModal: React.FC<{ applicant: PpdbApplicant | null; onClose: () => void }> = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 relative flex-grow overflow-y-auto">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                    
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800">{applicant.fullName}</h2>
                        <p className="text-gray-500">No. Pendaftaran: <span className="font-semibold text-gray-700">{applicant.registrationNumber}</span></p>
                        <div className="mt-2 flex items-center flex-wrap gap-2">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(applicant.status)}`}>
                                Status: {applicant.status}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${getAIVerificationStatusClass(applicant.aiVerificationStatus)}`}>
                                <ShieldCheck size={14} />
                                {applicant.aiVerificationStatus}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Data Diri Siswa */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><User className="text-primary"/> Data Diri Siswa</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">NIK</strong>: {applicant.nik}</p>
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">Asal Sekolah</strong>: {applicant.originSchool}</p>
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">Tanggal Daftar</strong>: {formatDate(applicant.submissionDate)}</p>
                            </div>
                        </div>

                        {/* Data Orang Tua */}
                        <div>
                             <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users className="text-primary"/> Data Orang Tua</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">Nama Ayah</strong>: {applicant.fatherName}</p>
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">Nama Ibu</strong>: {applicant.motherName}</p>
                                <p><strong className="font-medium text-gray-800 w-28 inline-block">No. Telepon</strong>: {applicant.phone}</p>
                            </div>
                        </div>

                        {/* Dokumen */}
                        <div className="md:col-span-2">
                             <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText className="text-primary"/> Dokumen Terlampir</h3>
                             <div className="flex flex-wrap gap-3">
                                <button onClick={() => alert(`Mengunduh KK untuk ${applicant.fullName}`)} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100">
                                    <Download size={14}/> Kartu Keluarga
                                </button>
                                <button onClick={() => alert(`Mengunduh Akta untuk ${applicant.fullName}`)} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100">
                                    <Download size={14}/> Akta Kelahiran
                                </button>
                                {applicant.documents.ijazah ? (
                                    <button onClick={() => alert(`Mengunduh Ijazah untuk ${applicant.fullName}`)} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100">
                                        <Download size={14}/> Ijazah TK/RA
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-2 text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-md cursor-not-allowed">
                                        Ijazah (Tidak ada)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 text-right border-t">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};


const ImportantDatesSection: React.FC<ImportantDatesSectionProps> = ({ schedule, onUpdateSchedule }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableSchedule, setEditableSchedule] = useState(schedule);

    // Sync local state if parent prop changes (e.g., after save)
    useEffect(() => {
        setEditableSchedule(schedule);
    }, [schedule]);

    const handleSave = () => {
        onUpdateSchedule(editableSchedule);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableSchedule(schedule); // Revert changes
        setIsEditing(false);
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableSchedule(prev => ({...prev, [name]: value}));
    }

    const dates = [
        { key: 'startDate', label: 'Mulai Pendaftaran', icon: <CalendarDays className="text-blue-500" size={24} /> },
        { key: 'endDate', label: 'Selesai Pendaftaran', icon: <CalendarDays className="text-red-500" size={24} /> },
        { key: 'verificationDeadline', label: 'Batas Akhir Verifikasi', icon: <CalendarDays className="text-yellow-500" size={24} /> },
        { key: 'announcementDate', label: 'Pengumuman Hasil', icon: <CalendarDays className="text-green-500" size={24} /> }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Jadwal Penting PPDB</h2>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Edit size={16} /> Edit Jadwal
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                         <button onClick={handleCancel} className="text-sm text-gray-600 hover:underline px-3 py-1.5 rounded-lg">
                            Batal
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark">
                           Simpan Perubahan
                        </button>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dates.map((item) => (
                    <div key={item.key} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        {item.icon}
                        <div>
                            <p className="text-xs text-gray-500">{item.label}</p>
                            {isEditing ? (
                                <input 
                                    type="date" 
                                    name={item.key}
                                    value={editableSchedule[item.key as keyof PpdbSchedule]}
                                    onChange={handleDateChange}
                                    className="font-semibold text-gray-800 bg-transparent focus:outline-none w-full border-b border-gray-300 focus:border-primary"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{formatDate(schedule[item.key as keyof PpdbSchedule])}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminPpdbPage: React.FC = () => {
  const [applicants, setApplicants] = useState<PpdbApplicant[]>(mockPpdbApplicants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PpdbStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: 'registrationNumber' | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<PpdbApplicant | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);


  const [schedule, setSchedule] = useState<PpdbSchedule>({
      startDate: '2024-07-05',
      endDate: '2024-07-20',
      verificationDeadline: '2024-07-23',
      announcementDate: '2024-07-25',
  });

  const handleUpdateSchedule = (newSchedule: PpdbSchedule) => {
    setSchedule(newSchedule);
    alert('Jadwal PPDB berhasil diperbarui!');
  };
  
  const handleGenerateSummary = async () => {
      setIsGeneratingSummary(true);
      setAiSummary(null);

      const statusCounts = applicants.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
      }, {} as Record<PpdbStatus, number>);

      const total = applicants.length;
      const waiting = statusCounts[PpdbStatus.WAITING] || 0;
      const verified = statusCounts[PpdbStatus.VERIFIED] || 0;
      const accepted = statusCounts[PpdbStatus.ACCEPTED] || 0;
      const rejected = statusCounts[PpdbStatus.REJECTED] || 0;

      const prompt = `
          Anda adalah asisten administrasi sekolah yang cerdas. Berdasarkan data status pendaftar PPDB berikut, buat ringkasan singkat dalam satu paragraf yang informatif dan mudah dipahami dalam Bahasa Indonesia.

          Data Pendaftar:
          - Total Pendaftar: ${total}
          - Menunggu Verifikasi: ${waiting}
          - Terverifikasi: ${verified}
          - Diterima: ${accepted}
          - Ditolak: ${rejected}
          
          Tuliskan ringkasan untuk data yang diberikan. Jangan gunakan format list, cukup paragraf biasa.
      `;
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
          });
          const summaryText = response.text;
          setAiSummary(summaryText);
      } catch (error) {
          console.error("Error generating AI summary:", error);
          setAiSummary("Gagal membuat ringkasan. Silakan coba lagi.");
      } finally {
          setIsGeneratingSummary(false);
      }
  };


  const handleAiVerify = (applicantId: string) => {
    setVerifyingId(applicantId);
    const applicant = applicants.find(app => app.id === applicantId);
    if (!applicant) return;

    // Simulate AI call to verify documents
    setTimeout(() => {
        const isMatch = Math.random() > 0.3; // 70% chance of success
        const isReadable = Math.random() > 0.1; // 90% chance of being readable

        let newStatus: AIVerificationStatus;
        let alertMessage: string;

        if (!isReadable) {
            newStatus = AIVerificationStatus.MANUAL_REVIEW;
            alertMessage = `[Simulasi AI] Dokumen untuk ${applicant.fullName} tidak dapat dibaca dengan jelas. Diperlukan review manual.`;
        } else if (isMatch) {
            newStatus = AIVerificationStatus.VERIFIED;
            alertMessage = `[Simulasi AI] Verifikasi berhasil! Data NIK dan Nama pada dokumen untuk ${applicant.fullName} cocok.`;
        } else {
            newStatus = AIVerificationStatus.MANUAL_REVIEW;
            alertMessage = `[Simulasi AI] Ditemukan ketidakcocokan data untuk ${applicant.fullName}. NIK atau Nama pada dokumen berbeda dengan data input. Diperlukan review manual.`;
        }

        setApplicants(prev =>
            prev.map(app =>
                app.id === applicantId ? { ...app, aiVerificationStatus: newStatus } : app
            )
        );

        alert(alertMessage);
        setVerifyingId(null);
    }, 2500); // Simulate 2.5 second delay
  };

  const requestSort = (key: 'registrationNumber') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredApplicants = useMemo(() => {
    let sortableItems = [...applicants]
      .filter(app => statusFilter === 'all' || app.status === statusFilter)
      .filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nik.includes(searchTerm)
      );

    if (sortConfig.key === 'registrationNumber') {
      sortableItems.sort((a, b) => {
        const numA = parseInt(a.registrationNumber.substring(6), 10);
        const numB = parseInt(b.registrationNumber.substring(6), 10);
        if (numA < numB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (numA > numB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [applicants, searchTerm, statusFilter, sortConfig]);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredApplicants.map(app => app.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const isAllSelected = filteredApplicants.length > 0 && selectedIds.size === filteredApplicants.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < filteredApplicants.length;

  const handleBulkStatusChange = (newStatus: PpdbStatus) => {
    if (window.confirm(`Ubah status ${selectedIds.size} pendaftar menjadi "${newStatus}"?`)) {
      setApplicants(prev =>
        prev.map(app =>
          selectedIds.has(app.id) ? { ...app, status: newStatus } : app
        )
      );
      setSelectedIds(new Set());
    }
  };

  const handleBulkAiVerify = () => {
    if (window.confirm(`Tandai ${selectedIds.size} pendaftar sebagai 'Terverifikasi AI'?`)) {
      setApplicants(prev =>
        prev.map(app =>
          selectedIds.has(app.id) ? { ...app, aiVerificationStatus: AIVerificationStatus.VERIFIED } : app
        )
      );
      alert(`${selectedIds.size} pendaftar berhasil ditandai sebagai 'Terverifikasi AI'.`);
      setSelectedIds(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} pendaftar terpilih?`)) {
      setApplicants(prev => prev.filter(app => !selectedIds.has(app.id)));
      setSelectedIds(new Set());
    }
  };
  
  const handleSingleDelete = (applicant: PpdbApplicant) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pendaftar "${applicant.fullName}"?`)) {
        setApplicants(prev => prev.filter(app => app.id !== applicant.id));
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(applicant.id)) {
            newSelectedIds.delete(applicant.id);
            setSelectedIds(newSelectedIds);
        }
    }
  };

  const handleBulkExport = () => {
      const selectedData = applicants.filter(app => selectedIds.has(app.id));
      const headers = "NomorPendaftaran,NamaLengkap,AsalSekolah,Status,NIK,NamaAyah,NamaIbu,Telepon\n";
      const csvContent = selectedData.map(d => `"${d.registrationNumber}","${d.fullName}","${d.originSchool}","${d.status}","${d.nik}","${d.fatherName}","${d.motherName}","${d.phone}"`).join('\n');
      const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data_pendaftar_terpilih.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleBulkDownloadDocuments = () => {
    const selectedApplicants = applicants.filter(app => selectedIds.has(app.id));
    if (selectedApplicants.length === 0) return;
    const applicantNames = selectedApplicants.map(app => app.fullName).join(', ');
    alert(`Ini adalah simulasi.\n\nMengunduh semua dokumen (KK, Akta, Ijazah) untuk pendaftar terpilih:\n- ${applicantNames}`);
  };

  const BulkActionsBar = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white shadow-lg p-3 rounded-lg flex items-center gap-4 border z-10 transition-all duration-300 animate-fade-in-up">
        <span className="text-sm font-semibold">{selectedIds.size} dipilih</span>
        <div className="relative group">
            <button className="flex items-center gap-2 bg-blue-500 px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm">
                <Edit size={16} /> Ubah Status
            </button>
            <div className="absolute bottom-full mb-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block ring-1 ring-black ring-opacity-5">
                {Object.values(PpdbStatus).map(status => (
                    <a key={status} href="#" onClick={(e) => { e.preventDefault(); handleBulkStatusChange(status); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{status}</a>
                ))}
            </div>
        </div>
        <button onClick={handleBulkAiVerify} className="flex items-center gap-2 bg-teal-500 px-3 py-1.5 rounded-md hover:bg-teal-600 text-sm">
            <ShieldCheck size={16} /> Verifikasi AI Terpilih
        </button>
        <button onClick={handleBulkExport} className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-md hover:bg-green-600 text-sm">
            <Download size={16} /> Export Data
        </button>
        <button onClick={handleBulkDownloadDocuments} className="flex items-center gap-2 bg-purple-500 px-3 py-1.5 rounded-md hover:bg-purple-600 text-sm">
            <FolderDown size={16} /> Unduh Dokumen Terpilih
        </button>
        <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 text-sm">
            <Trash2 size={16} /> Hapus
        </button>
    </div>
  );

  return (
    <div className="pb-24">
      {selectedIds.size > 0 && <BulkActionsBar />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pendaftar PPDB</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-700">Ringkasan AI</h2>
                <button 
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark text-sm disabled:bg-gray-400"
                >
                    {isGeneratingSummary ? (
                        <>
                            <LoaderCircle size={16} className="animate-spin" />
                            <span>Membuat...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Buat Ringkasan</span>
                        </>
                    )}
                </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md min-h-[60px] text-gray-700 text-sm italic">
                {isGeneratingSummary && <p>AI sedang menganalisis data pendaftar...</p>}
                {!isGeneratingSummary && aiSummary && <p>{aiSummary}</p>}
                {!isGeneratingSummary && !aiSummary && <p>Klik tombol "Buat Ringkasan" untuk mendapatkan analisis status pendaftar saat ini.</p>}
            </div>
        </div>

      <ImportantDatesSection schedule={schedule} onUpdateSchedule={handleUpdateSchedule} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari nama, NIK, No. Pendaftaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PpdbStatus | 'all')}
                className="border rounded-lg p-2 bg-white text-gray-900 focus:ring-primary focus:border-primary"
              >
                <option value="all">Semua Status</option>
                {Object.values(PpdbStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
             <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
              <Download size={18} /> Export Semua
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                   <input 
                      type="checkbox"
                      checked={isAllSelected}
                      // Fix: The ref callback should not return a value.
                      ref={el => { if (el) { el.indeterminate = isIndeterminate; } }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                </th>
                <th scope="col" className="px-6 py-3">
                    <button onClick={() => requestSort('registrationNumber')} className="flex items-center gap-1.5 hover:text-gray-900">
                        Nomor Pendaftaran
                        {sortConfig.key !== 'registrationNumber' ? <ChevronsUpDown size={14} className="text-gray-400" /> : (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                    </button>
                </th>
                <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3">NIK</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Verifikasi AI</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(app => (
                <tr key={app.id} className={`bg-white border-b hover:bg-gray-100 transition-colors duration-200 cursor-pointer ${selectedIds.has(app.id) ? 'bg-green-50' : ''}`} onClick={() => setSelectedApplicant(app)}>
                  <td className="w-4 p-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        checked={selectedIds.has(app.id)}
                        onChange={() => handleSelectOne(app.id)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{app.registrationNumber}</td>
                  <td className="px-6 py-4">{app.fullName}</td>
                  <td className="px-6 py-4">{app.nik}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {verifyingId === app.id ? (
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                            <LoaderCircle className="animate-spin" size={14} /> Memeriksa...
                        </span>
                    ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAIVerificationStatusClass(app.aiVerificationStatus)}`}>
                            {app.aiVerificationStatus}
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => handleAiVerify(app.id)}
                        disabled={verifyingId === app.id}
                        title="Verifikasi Dokumen dengan AI"
                        className="text-teal-600 hover:text-teal-800 disabled:text-gray-400 disabled:cursor-wait"
                    >
                       <ShieldCheck size={18} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdownId(openDropdownId === app.id ? null : app.id)}
                            title="Dokumen Pendaftar"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <FileText size={18} />
                        </button>
                        {openDropdownId === app.id && (
                            <div 
                                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"
                                onMouseLeave={() => setOpenDropdownId(null)}
                            >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <span className="block px-4 py-2 text-xs text-gray-500 uppercase">Unduh Dokumen</span>
                                <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert(`Mengunduh Kartu Keluarga untuk ${app.fullName}`); setOpenDropdownId(null); }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                                >
                                Kartu Keluarga (KK)
                                </a>
                                <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert(`Mengunduh Akta Kelahiran untuk ${app.fullName}`); setOpenDropdownId(null); }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                                >
                                Akta Kelahiran
                                </a>
                                {app.documents.ijazah ? (
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); alert(`Mengunduh Ijazah TK/RA untuk ${app.fullName}`); setOpenDropdownId(null); }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Ijazah TK/RA
                                </a>
                                ) : (
                                   <span className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">Ijazah (Tidak ada)</span>
                                )}
                            </div>
                            </div>
                        )}
                    </div>
                    <button title="Edit Data" className="text-yellow-600 hover:text-yellow-800"><Edit size={18} /></button>
                    <button 
                        onClick={() => handleSingleDelete(app)} 
                        title="Hapus" 
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplicants.length === 0 && <p className="text-center text-gray-500 mt-6">Tidak ada data pendaftar yang cocok.</p>}
      </div>
      <ApplicantDetailModal applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
    </div>
  );
};

export default AdminPpdbPage;
