
import React from 'react';
import { mockNews } from '../../services/mockApi';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const AdminNewsPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          <PlusCircle size={18} /> Tambah Berita
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Judul</th>
              <th scope="col" className="px-6 py-3">Kategori</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mockNews.map(article => (
              <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                <td className="px-6 py-4">{article.category}</td>
                <td className="px-6 py-4">{article.date}</td>
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

export default AdminNewsPage;
