import React, { useState, useMemo } from 'react';
import { useParentAuth } from '../../hooks/useParentAuth';
import { mockPayments } from '../../services/mockApi';
import { PaymentRecord } from '../../types';
import { Wallet, CheckCircle, Clock, FileText, Banknote, CalendarDays } from 'lucide-react';

const getStatusClass = (status: 'Lunas' | 'Belum Lunas') => {
    return status === 'Lunas'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
}

const ParentPaymentsPage: React.FC = () => {
    const { student } = useParentAuth();
    const [payments, setPayments] = useState<PaymentRecord[]>(
        mockPayments.filter(p => p.studentId === student?.id)
    );

    const currentMonthBill = useMemo(() => {
        // Note: In a real app, this should handle month transitions more robustly.
        // For this mock, we'll find any "Belum Lunas" bill. A more realistic approach might find the oldest unpaid bill.
        // Let's find the bill for "Agustus" for simulation purposes.
        return payments.find(p => p.month === 'Agustus' && p.status === 'Belum Lunas');
    }, [payments]);
    

    const handlePayNow = () => {
        if (currentMonthBill) {
            setPayments(prevPayments =>
                prevPayments.map(p =>
                    p.id === currentMonthBill.id
                        ? { ...p, status: 'Lunas', paymentDate: new Date().toISOString().split('T')[0] }
                        : p
                )
            );
            alert(`Pembayaran SPP untuk bulan ${currentMonthBill.month} telah berhasil!`);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-poppins text-gray-800 flex items-center gap-3">
                <Wallet className="text-primary" size={32} />
                Informasi Pembayaran SPP
            </h1>

            {/* Payment Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4">Ringkasan Pembayaran</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                        <div className={`p-3 rounded-full ${currentMonthBill ? 'bg-red-100' : 'bg-green-100'}`}>
                            {currentMonthBill ? <Clock className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tagihan Berikutnya</p>
                            <p className={`text-lg font-bold ${currentMonthBill ? 'text-red-600' : 'text-green-600'}`}>
                                {currentMonthBill ? 'BELUM LUNAS' : 'LUNAS'}
                            </p>
                        </div>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100">
                           <Banknote className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jumlah Tagihan</p>
                            <p className="text-lg font-bold text-gray-800">
                                {currentMonthBill ? `Rp ${currentMonthBill.amount.toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-100">
                           <CalendarDays className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jatuh Tempo</p>
                            <p className="text-lg font-bold text-gray-800">
                                {currentMonthBill ? new Date(currentMonthBill.dueDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'}) : '-'}
                            </p>
                        </div>
                    </div>
                </div>
                {currentMonthBill && (
                     <button
                        onClick={handlePayNow}
                        className="mt-6 w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                       <Wallet size={18} /> Bayar Sekarang
                    </button>
                )}
            </div>

            {/* Payment History */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4">Riwayat Pembayaran</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Bulan & Tahun</th>
                                <th scope="col" className="px-6 py-3">Tanggal Bayar</th>
                                <th scope="col" className="px-6 py-3">Jumlah</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map(p => (
                                <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.month} {p.year}</td>
                                    <td className="px-6 py-4">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="px-6 py-4">Rp {p.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.status === 'Lunas' ? (
                                             <button onClick={() => alert(`Membuka invoice untuk ${p.month}`)} className="flex items-center gap-1 text-blue-600 hover:underline">
                                               <FileText size={14} /> Lihat Invoice
                                            </button>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ParentPaymentsPage;
