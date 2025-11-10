import React, { useState } from 'react';
import { mockTeachers } from '../../services/mockApi';
import { Teacher } from '../../types';
import { PlusCircle, Edit, Trash2, X } from 'lucide-react';

const AdminTeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);

    const openModal = (teacher: Teacher | null = null) => {
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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
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
        setCurrentTeacher({ ...currentTeacher, [field]: value.split('\n') });
    };

    const renderModal = () => {
        if (!isModalOpen || !currentTeacher) return null;

        const isEditing = teachers.some(t => t.id === currentTeacher.id);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4">
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
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Guru</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                    <PlusCircle size={18} /> Tambah Guru
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama</th>
                            <th className="px-6 py-3">Jabatan</th>
                            <th className="px-6 py-3">Mata Pelajaran</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                             <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                    <img src={teacher.imageUrl} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                                    {teacher.name}
                                </td>
                                <td className="px-6 py-4">{teacher.position}</td>
                                <td className="px-6 py-4">{teacher.subject}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModal(teacher)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminTeachersPage;
