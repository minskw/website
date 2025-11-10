
import React, { useState, useMemo } from 'react';
import { mockTeachers } from '../../services/mockApi';
import { Teacher } from '../../types';
import { PlusCircle, Edit, Trash2, Search, X, UserCircle, GraduationCap, Award } from 'lucide-react';

const TeacherDetailModal: React.FC<{ teacher: Teacher; onClose: () => void }> = ({ teacher, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                        <img 
                            src={teacher.imageUrl} 
                            alt={teacher.name} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md flex-shrink-0"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold font-poppins text-gray-800">{teacher.name}</h2>
                            <p className="text-lg text-gray-600 font-semibold">{teacher.position}</p>
                            <p className="text-md text-gray-500 mt-1">Mata Pelajaran: {teacher.subject}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2"><UserCircle className="text-secondary"/> Bio Singkat</h3>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md">{teacher.bio}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2"><GraduationCap className="text-secondary"/> Riwayat Pendidikan</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
                                {teacher.education.map((edu, index) => (
                                    <li key={index}>{edu}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2"><Award className="text-secondary"/> Prestasi & Penghargaan</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
                                {teacher.achievements.map((ach, index) => (
                                    <li key={index}>{ach}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-50 px-6 py-3 text-right">
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


const AdminTeachersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const filteredTeachers = useMemo(() => {
        if (!searchTerm) return mockTeachers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return mockTeachers.filter(teacher =>
            teacher.name.toLowerCase().includes(lowercasedFilter) ||
            teacher.position.toLowerCase().includes(lowercasedFilter) ||
            teacher.subject.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm]);

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Guru</h1>
        <div className="w-full md:w-auto flex items-center gap-4">
            <div className="relative w-full md:w-64">
                <input
                type="text"
                placeholder="Cari guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-primary focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="flex-shrink-0 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
            <PlusCircle size={18} /> <span className="hidden sm:inline">Tambah Guru</span>
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Jabatan</th>
              <th scope="col" className="px-6 py-3">Mata Pelajaran</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map(teacher => (
              <tr 
                key={teacher.id} 
                className="bg-white border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedTeacher(teacher)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <img src={teacher.imageUrl} alt={teacher.name} className="w-10 h-10 rounded-full object-cover"/>
                    {teacher.name}
                </td>
                <td className="px-6 py-4">{teacher.position}</td>
                <td className="px-6 py-4">{teacher.subject}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                        <button title="Edit" className="text-yellow-600 hover:text-yellow-800"><Edit size={18} /></button>
                        <button title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTeachers.length === 0 && (
            <p className="text-center py-6 text-gray-500">Tidak ada guru yang cocok dengan kriteria pencarian.</p>
        )}
      </div>
    </div>
    {selectedTeacher && <TeacherDetailModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />}
    </>
  );
};

export default AdminTeachersPage;
