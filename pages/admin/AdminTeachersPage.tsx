import React, { useState, useMemo } from 'react';
import { mockTeachers } from '../../services/mockApi';
import { Teacher } from '../../types';
import { PlusCircle, Edit, Trash2, X, Eye, Search, ArrowUp, ArrowDown } from 'lucide-react';

type SortKey = 'name' | 'subject';

const AdminTeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
    const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });

    const sortedAndFilteredTeachers = useMemo(() => {
        let filtered = teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [teachers, searchTerm, sortConfig]);

    const handleSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUp size={14} className="ml-1 inline" />;
        return <ArrowDown size={14} className="ml-1 inline" />;
    };

    const openEditModal = (teacher: Teacher | null = null) => {
        setCurrentTeacher(teacher ? { ...teacher } : {
            id: `teacher-${Date.now()}`,
            name: '',
            position: '',
            subject: '',
            imageUrl: 'https://i.pravatar.cc/150?u=' + Date.now(),
            bio: '',
            education: [],
            achievements: [],
        });
        setIsEditModalOpen(true);
    };
    
    const openDetailModal = (teacher: Teacher) => {
        setViewingTeacher(teacher);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setCurrentTeacher(null);
        setViewingTeacher(null);
    };
    
    const handleSave = () => {
        if (!currentTeacher) return;

        if (!currentTeacher.name || !currentTeacher.position || !currentTeacher.subject) {
            alert('Nama, Jabatan, dan Mata Pelajaran harus diisi.');
            return;
        }

        const isEditing = teachers.some(t => t.id === currentTeacher.id);

        if (isEditing) {
            setTeachers(teachers.map(t => t.id === currentTeacher.id ? currentTeacher : t));
        } else {
            setTeachers([currentTeacher, ...teachers]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!currentTeacher) return;
        const { name, value } = e.target;
        setCurrentTeacher({ ...currentTeacher, [name]: value });
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'education' | 'achievements') => {
        if (!currentTeacher) return;
        const { value } = e.target;
        setCurrentTeacher({ ...currentTeacher, [field]: value.split('\n').filter(item => item.trim() !== '') });
    };

    const renderEditModal = () => {
        if (!isEditModalOpen || !currentTeacher) return null;

        const isEditing = teachers.some(t => t.id === currentTeacher.id);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium">Nama Lengkap</label><input type="text" name="name" value={currentTeacher.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Jabatan</label><input type="text" name="position" value={currentTeacher.position} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Mata Pelajaran</label><input type="text" name="subject" value={currentTeacher.subject} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Image URL</label><input type="text" name="imageUrl" value={currentTeacher.imageUrl} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" /></div>
                        </div>
                        <div><label className="block text-sm font-medium">Bio Singkat</label><textarea name="bio" value={currentTeacher.bio} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea></div>
                        <div><label className="block text-sm font-medium">Pendidikan (satu per baris)</label><textarea name="education" value={currentTeacher.education.join('\n')} onChange={e => handleArrayChange(e, 'education')} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea></div>
                        <div><label className="block text-sm font-medium">Prestasi (satu per baris)</label><textarea name="achievements" value={currentTeacher.achievements.join('\n')} onChange={e => handleArrayChange(e, 'achievements')} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea></div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan Data</button>
                    </div>
                </div>
            </div>
        );
    }
    
    const renderDetailModal = () => {
        if (!viewingTeacher) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">Detail Guru</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center gap-6">
                            <img src={viewingTeacher.imageUrl} alt={viewingTeacher.name} className="w-24 h-24 rounded-full object-cover border-4 border-secondary"/>
                            <div>
                                <h4 className="text-2xl font-bold text-primary">{viewingTeacher.name}</h4>
                                <p className="text-gray-600 font-semibold">{viewingTeacher.position}</p>
                                <p className="text-sm text-gray-500">Mata Pelajaran: {viewingTeacher.subject}</p>
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-gray-700 mb-2">Bio Singkat</h5>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{viewingTeacher.bio}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h5 className="font-bold text-gray-700 mb-2">Riwayat Pendidikan</h5>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {viewingTeacher.education.map((edu, index) => <li key={index}>{edu}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-bold text-gray-700 mb-2">Prestasi & Penghargaan</h5>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {viewingTeacher.achievements.map((ach, index) => <li key={index}>{ach}</li>)}
                                </ul>
                            </div>
                        </div>

                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-lg text-right">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Tutup</button>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Guru</h1>
                <button onClick={() => openEditModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold w-full sm:w-auto justify-center">
                    <PlusCircle size={18} /> Tambah Guru
                </button>
            </div>
            
            <div className="mb-4">
                 <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari nama atau mata pelajaran..."
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
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                Nama {getSortIcon('name')}
                            </th>
                            <th className="px-6 py-3">Jabatan</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('subject')}>
                                Mata Pelajaran {getSortIcon('subject')}
                            </th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredTeachers.map(teacher => (
                             <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                    <img src={teacher.imageUrl} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                                    {teacher.name}
                                </td>
                                <td className="px-6 py-4">{teacher.position}</td>
                                <td className="px-6 py-4">{teacher.subject}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openDetailModal(teacher)} className="text-gray-600 hover:text-gray-800" title="Lihat Detail"><Eye size={18} /></button>
                                        <button onClick={() => openEditModal(teacher)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {sortedAndFilteredTeachers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    Tidak ada data guru yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {renderEditModal()}
            {renderDetailModal()}
        </div>
    );
};

export default AdminTeachersPage;