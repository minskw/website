
import React from 'react';
import { mockTeachers } from '../../services/mockApi';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const AdminTeachersPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Guru</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          <PlusCircle size={18} /> Tambah Guru
        </button>
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
            {mockTeachers.map(teacher => (
              <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <img src={teacher.imageUrl} alt={teacher.name} className="w-10 h-10 rounded-full object-cover"/>
                    {teacher.name}
                </td>
                <td className="px-6 py-4">{teacher.position}</td>
                <td className="px-6 py-4">{teacher.subject}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button title="Edit" className="text-yellow-600 hover:text-yellow-800"><Edit size={18} /></button>
                  <button title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeachersPage;
