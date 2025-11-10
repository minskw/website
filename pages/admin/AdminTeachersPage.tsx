import React, { useState, useEffect, FormEvent } from 'react';
import { Teacher } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { PlusCircle, Edit, Trash2, X, LoaderCircle } from 'lucide-react';

const AdminTeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const teachersCollectionRef = collection(db, "teachers");

    useEffect(() => {
        const getTeachers = async () => {
            setIsLoading(true);
            const q = query(teachersCollectionRef, orderBy("name"));
            const data = await getDocs(q);
            const teachersData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Teacher));
            setTeachers(teachersData);
            setIsLoading(false);
        };
        getTeachers();
    }, []);

    const openModal = (teacher: Teacher | null = null) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingTeacher(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
            const teacherDoc = doc(db, "teachers", id);
            await deleteDoc(teacherDoc);
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };
    
    const TeacherForm: React.FC<{ teacher: Teacher | null; onSave: () => void; onCancel: () => void; }> = ({ teacher, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            name: teacher?.name || '',
            position: teacher?.position || '',
            subject: teacher?.subject || '',
            imageUrl: teacher?.imageUrl || '',
            bio: teacher?.bio || '',
            education: teacher?.education.join('\n') || '',
            achievements: teacher?.achievements.join('\n') || '',
        });

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            const payload = {
                ...formData,
                education: formData.education.split('\n').filter(Boolean),
                achievements: formData.achievements.split('\n').filter(Boolean),
            };

            if (teacher) {
                // Update
                const teacherDoc = doc(db, "teachers", teacher.id);
                await updateDoc(teacherDoc, payload);
            } else {
                // Create
                await addDoc(teachersCollectionRef, payload);
            }
            onSave();
        };

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{teacher ? 'Edit Guru' : 'Tambah Guru Baru'}</h3>
                        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="text-sm font-medium">Nama Lengkap</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Jabatan</label><input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Mata Pelajaran</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">URL Foto</label><input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Bio Singkat</label><textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full mt-1 p-2 border rounded" rows={3}></textarea></div>
                        <div><label className="text-sm font-medium">Riwayat Pendidikan (1 per baris)</label><textarea value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full mt-1 p-2 border rounded" rows={3}></textarea></div>
                        <div><label className="text-sm font-medium">Prestasi (1 per baris)</label><textarea value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} className="w-full mt-1 p-2 border rounded" rows={3}></textarea></div>
                    
                        <div className="p-6 bg-gray-50 rounded-b-lg text-right space-x-3 -m-6 mt-4">
                            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Guru & Tenaga Kependidikan</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <PlusCircle size={18} /> Tambah Guru
                </button>
            </div>
            <div className="overflow-x-auto">
                 {isLoading ? (
                    <div className="flex justify-center py-8"><LoaderCircle className="animate-spin text-primary" size={32}/></div>
                ) : (
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
                                <td className="px-6 py-4 font-medium text-gray-900">{teacher.name}</td>
                                <td className="px-6 py-4">{teacher.position}</td>
                                <td className="px-6 py-4">{teacher.subject}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => openModal(teacher)} title="Edit" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(teacher.id)} title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 )}
            </div>
            {isModalOpen && <TeacherForm teacher={editingTeacher} onSave={() => { closeModal(); window.location.reload(); }} onCancel={closeModal} />}
        </div>
    );
};

export default AdminTeachersPage;
