
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockNews } from '../../services/mockApi';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

const NewsListPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = mockNews.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(mockNews.length / articlesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Berita & Pengumuman</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                        <img className="h-56 w-full object-cover" src={article.imageUrl} alt={article.title} />
                        <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Tag className="w-4 h-4 mr-2 text-secondary" />
                                <span>{article.category}</span>
                                <span className="mx-2">|</span>
                                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                                <span>{article.date}</span>
                            </div>
                            <h3 className="text-xl font-bold font-poppins text-gray-800 h-16 overflow-hidden">{article.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm h-24 overflow-hidden">{article.excerpt}</p>
                            <Link to={`/berita/${article.id}`} className="mt-4 inline-block font-semibold text-primary hover:text-primary-dark">
                                Baca Selengkapnya &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                                currentPage === number
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </nav>
            </div>
        </>
    );
};

const NewsDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const article = mockNews.find(a => a.id === id);

    if (!article) {
        return <div className="text-center py-20">Artikel tidak ditemukan.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg">
            <Link to="/berita" className="inline-flex items-center text-primary hover:underline mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Berita
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <Tag className="w-4 h-4 mr-2 text-secondary" />
                <span>{article.category}</span>
                <span className="mx-2">|</span>
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                <span>{article.date}</span>
            </div>
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8" />
            <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    );
};

const NewsPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {id ? <NewsDetailPage /> : <NewsListPage />}
            </div>
        </div>
    );
}

export default NewsPage;
