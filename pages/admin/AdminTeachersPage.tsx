import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, LoaderCircle } from 'lucide-react';

type ModalMode = 'add' | 'edit' | 'delete' | null;

const AdminTeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | Partial<Teacher> | null>(null);

    const teachersCollectionRef = collection(db, "teachers");

    const fetchTeachers = async () => {
        setIsLoading(true);
        const q = query(teachersCollectionRef, orderBy("name", "asc"));
        const data = await getDocs(q);
        setTeachers(data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Teacher)));
        setIsLoading(false);
    };

    useEffect(() => { fetchTeachers(); }, []);

    const openModal = (mode: ModalMode, teacher?: Teacher) => {
        setModalMode(mode);
        setSelectedTeacher(mode === 'add' ? { name: '', position: '', subject: '', imageUrl: '', bio: '', education: [], achievements: [] } : teacher || null);
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedTeacher(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!selectedTeacher) return;
        const { name, value } = e.target;
        if (name === 'education' || name === 'achievements') {
            setSelectedTeacher({ ...selectedTeacher, [name]: value.split('\n') });
        } else {
            setSelectedTeacher({ ...selectedTeacher, [name]: value });
        }
    };

    const handleSubmit = async () => {
        if (!selectedTeacher) return;
        if (modalMode === 'add') {
            await addDoc(teachersCollectionRef, selectedTeacher);
        } else if (modalMode === 'edit' && selectedTeacher.id) {
            const teacherDoc = doc(db, "teachers", selectedTeacher.id);
            const { id, ...data } = selectedTeacher;
            await updateDoc(teacherDoc, data);
        }
        fetchTeachers();
        closeModal();
    };

    const handleDelete = async () => {
        if (modalMode === 'delete' && selectedTeacher?.id) {
            await deleteDoc(doc(db, "teachers", selectedTeacher.id));
            fetchTeachers();
            closeModal();
        }
    };
    
    const renderModal = () => {
        if (!modalMode || !selectedTeacher) return null;

        if (modalMode === 'delete') {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Hapus Guru?</h3>
                        <p>Anda yakin ingin menghapus data "<strong>{selectedTeacher.name}</strong>"?</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Hapus</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh]">
                    <div className="p-6 border-b flex justify-between items-center">
                         <h3 className="text-xl font-bold font-poppins">{modalMode === 'add' ? 'Tambah Guru Baru' : 'Edit Guru'}</h3>
                         <button onClick={closeModal}><X/></button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div><label>Nama Lengkap</label><input type="text" name="name" value={selectedTeacher.name} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Jabatan</label><input type="text" name="position" value={selectedTeacher.position} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Mata Pelajaran</label><input type="text" name="subject" value={selectedTeacher.subject} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>URL Foto</label><input type="text" name="imageUrl" value={selectedTeacher.imageUrl} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Bio Singkat</label><textarea name="bio" value={selectedTeacher.bio} onChange={handleFormChange} rows={3} className="w-full mt-1 p-2 border rounded"></textarea></div>
                        <div><label>Pendidikan (satu per baris)</label><textarea name="education" value={Array.isArray(selectedTeacher.education) ? selectedTeacher.education.join('\n') : ''} onChange={handleFormChange} rows={3} className="w-full mt-1 p-2 border rounded"></textarea></div>
                        <div><label>Prestasi (satu per baris)</label><textarea name="achievements" value={Array.isArray(selectedTeacher.achievements) ? selectedTeacher.achievements.join('\n') : ''} onChange={handleFormChange} rows={3} className="w-full mt-1 p-2 border rounded"></textarea></div>
                    </div>
                    <div className="p-6 bg-gray-50 text-right">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Guru</h1>
                <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <Plus size={18} /> Tambah Guru
                </button>
            </div>
             {isLoading ? <div className="flex justify-center py-10"><LoaderCircle className="animate-spin text-primary" size={32}/></div> : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr><th className="px-6 py-3">Nama</th><th className="px-6 py-3">Jabatan</th><th className="px-6 py-3">Mapel</th><th className="px-6 py-3 text-center">Aksi</th></tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{teacher.name}</td>
                                <td className="px-6 py-4">{teacher.position}</td>
                                <td className="px-6 py-4">{teacher.subject}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={() => openModal('edit', teacher)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => openModal('delete', teacher)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            {renderModal()}
        </div>
    );
};

export default AdminTeachersPage;
