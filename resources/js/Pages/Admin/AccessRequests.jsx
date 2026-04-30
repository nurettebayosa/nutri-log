import { Head } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminAccessRequests() {
    const [activeTab, setActiveTab] = useState('menunggu');

    const requests = [
        {
            nama: 'Budi Santoso',
            email: 'budi@prodaya.id',
            jenis: 'Akun Baru',
            alasan: 'Karyawan baru, mulai kerja 1 Mei 2026',
            waktu: '30/04 13:00',
            wa: '0856xxxx',
            status: 'menunggu',
        },
        {
            nama: 'Siti Rahayu',
            email: 'siti@prodaya.id',
            jenis: 'Reset Password',
            alasan: 'Lupa password',
            waktu: '29/04 09:30',
            wa: '0812xxxx',
            status: 'menunggu',
        },
        {
            nama: 'Tedi Suherman',
            email: 'tedi@prodaya.id',
            jenis: 'Reset Password',
            alasan: 'Lupa password setelah libur panjang',
            waktu: '20/04 14:00',
            wa: '0856xxxx',
            status: 'disetujui',
        },
    ];

    const filteredRequests = requests.filter((r) => r.status === activeTab);
    const pendingCount = requests.filter((r) => r.status === 'menunggu').length;

    const handleCopyWA = (wa) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(wa);
        }
    };

    return (
        <DashboardLayout>
            <Head title="Permintaan Akses" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Permintaan Akses</h1>
                        <p className="text-sm text-[var(--neutral-600)]">
                            Daftar permintaan reset password / akun baru dari karyawan
                        </p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="px-4 py-2 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg">
                            <span className="text-sm font-semibold text-[var(--warning)]">
                                {pendingCount} permintaan menunggu
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="border-b border-[var(--neutral-200)] flex overflow-x-auto">
                        {[
                            { id: 'menunggu', label: 'Menunggu' },
                            { id: 'disetujui', label: 'Disetujui' },
                            { id: 'ditolak', label: 'Ditolak' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-[var(--primary-500)] text-[var(--primary-500)]'
                                        : 'border-transparent text-[var(--neutral-600)] hover:text-[var(--neutral-900)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 space-y-4">
                        {filteredRequests.map((req, idx) => (
                            <div key={idx} className="border border-[var(--neutral-200)] rounded-xl p-5">
                                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                                    <div className="flex-1 min-w-[200px]">
                                        <h3 className="font-semibold text-[var(--neutral-900)] mb-1">{req.nama}</h3>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-sm text-[var(--neutral-600)]">{req.email}</span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                req.jenis === 'Akun Baru'
                                                    ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                    : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                                            }`}>
                                                {req.jenis}
                                            </span>
                                        </div>
                                        {req.alasan && (
                                            <p className="text-sm text-[var(--neutral-700)]">
                                                <span className="font-medium">Alasan:</span> {req.alasan}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-xs text-[var(--neutral-500)] mb-4">
                                    Diajukan: {req.waktu} · WA: {req.wa}
                                </div>

                                {req.status === 'menunggu' && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleCopyWA(req.wa)}
                                            className="px-4 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center gap-2"
                                        >
                                            📱 Salin No. WA
                                        </button>
                                        <button className="px-4 py-2 text-sm bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5">
                                            Tolak
                                        </button>
                                        <button className="px-4 py-2 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]">
                                            Setujui
                                        </button>
                                    </div>
                                )}

                                {req.status === 'disetujui' && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--success)]">
                                        ✓ Disetujui
                                    </div>
                                )}

                                {req.status === 'ditolak' && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--danger)]">
                                        ✗ Ditolak
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredRequests.length === 0 && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                Tidak ada permintaan di kategori ini
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
