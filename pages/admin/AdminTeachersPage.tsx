import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Teacher } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X } from 'lucide-react';

type TeacherFormData = Omit<Teacher, 'id'>;

const emptyTeacher: TeacherFormData = {
    name: '',
    position: '',
    subject: '',
    imageUrl: '',
    bio: '',
    education: [],
    achievements: []
};

const TeacherFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (teacher: TeacherFormData, id?: string) => void;
    teacher: Teacher | null;
}> = ({ isOpen, onClose, onSave, teacher }) => {
    const [formData, setFormData] = useState<TeacherFormData>(emptyTeacher);

    useEffect(() => {
        if (teacher) {
            setFormData({
                ...teacher,
                education: teacher.education || [],
                achievements: teacher.achievements || []
            });
        } else {
            setFormData(emptyTeacher);
        }
    }, [teacher, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.split('\n').filter(item => item.trim() !== '') }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData, teacher?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{teacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h2>
                        <button onClick={onClose}><X /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" className="w-full p-2 border rounded" required />
                        <input name="position" value={formData.position} onChange={handleChange} placeholder="Jabatan" className="w-full p-2 border rounded" required />
                        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Mata Pelajaran" className="w-full p-2 border rounded" required />
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Foto" className="w-full p-2 border rounded" required />
                        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio Singkat" className="w-full p-2 border rounded h-24" />
                        <textarea name="education" value={formData.education.join('\n')} onChange={handleArrayChange} placeholder="Riwayat Pendidikan (satu per baris)" className="w-full p-2 border rounded h-24" />
                        <textarea name="achievements" value={formData.achievements.join('\n')} onChange={handleArrayChange} placeholder="Prestasi (satu per baris)" className="w-full p-2 border rounded h-24" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const AdminTeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "teachers"), orderBy("name", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const teachersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
            setTeachers(teachersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching teachers in real-time:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: TeacherFormData, id?: string) => {
        try {
            if (id) {
                await updateDoc(doc(db, "teachers", id), data);
            } else {
                await addDoc(collection(db, "teachers"), data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving teacher:", error);
            alert("Gagal menyimpan data guru.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
            try {
                await deleteDoc(doc(db, "teachers", id));
            } catch (error) {
                console.error("Error deleting teacher:", error);
                alert("Gagal menghapus data guru.");
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Guru</h1>
                <button onClick={() => { setSelectedTeacher(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <PlusCircle size={18} /> Tambah Guru
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                         <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nama</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Jabatan</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Mapel</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-800">{teacher.name}</td>
                                    <td className="py-3 px-4">{teacher.position}</td>
                                    <td className="py-3 px-4">{teacher.subject}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button onClick={() => { setSelectedTeacher(teacher); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(teacher.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <TeacherFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} teacher={selectedTeacher} />
        </div>
    );
};

export default AdminTeachersPage;