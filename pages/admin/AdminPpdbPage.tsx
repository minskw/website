import React, { useState, useMemo } from 'react';
import { mockPpdbApplicants } from '../../services/mockApi';
import { PpdbApplicant, PpdbStatus } from '../../types';
import { Search, Filter, Edit, Trash2, Download, FileCheck } from 'lucide-react';

const getStatusClass = (status: PpdbStatus) => {
    switch (status) {
        case PpdbStatus.WAITING: return 'bg-yellow-100 text-yellow-800';
        case PpdbStatus.VERIFIED: return 'bg-blue-100 text-blue-800';
        case PpdbStatus.ACCEPTED: return 'bg-green-100 text-green-800';
        case PpdbStatus.REJECTED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const AdminPpdbPage: React.FC = () => {
  const [applicants, setApplicants] = useState<PpdbApplicant[]>(mockPpdbApplicants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PpdbStatus | 'all'>('all');

  const filteredApplicants = useMemo(() => {
    return applicants
      .filter(app => statusFilter === 'all' || app.status === statusFilter)
      .filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nik.includes(searchTerm)
      );
  }, [applicants, searchTerm, statusFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pendaftar PPDB</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Cari nama, NIK, No. Pendaftaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PpdbStatus | 'all')}
            className="border rounded-lg p-2 bg-white text-gray-900"
          >
            <option value="all">Semua Status</option>
            {Object.values(PpdbStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
           <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">No. Daftar</th>
              <th scope="col" className="px-6 py-3">Nama Lengkap</th>
              <th scope="col" className="px-6 py-3">Asal Sekolah</th>
              <th scope="col" className="px-6 py-3">Tgl Daftar</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map(app => (
              <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{app.registrationNumber}</td>
                <td className="px-6 py-4">{app.fullName}</td>
                <td className="px-6 py-4">{app.originSchool}</td>
                <td className="px-6 py-4">{app.submissionDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button title="Verifikasi Dokumen" className="text-blue-600 hover:text-blue-800"><FileCheck size={18} /></button>
                  <button title="Edit Data" className="text-yellow-600 hover:text-yellow-800"><Edit size={18} /></button>
                  <button title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredApplicants.length === 0 && <p className="text-center text-gray-500 mt-6">Tidak ada data pendaftar yang cocok.</p>}
    </div>
  );
};

export default AdminPpdbPage;