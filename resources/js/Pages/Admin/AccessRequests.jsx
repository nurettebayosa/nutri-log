import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminAccessRequests({ requests = [], counts = {}, filters = {} }) {
    const handleTabChange = (tab) => {
        router.get('/permintaan-akses', { tab }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleApprove = (req) => {
        if (!confirm(`Setujui permintaan dari ${req.full_name}?`)) return;
        router.post(`/permintaan-akses/${req.id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (req) => {
        const reason = prompt(`Alasan menolak permintaan dari ${req.full_name}? (opsional)`);
        if (reason === null) return; // user cancel
        router.post(`/permintaan-akses/${req.id}/reject`, { reason }, { preserveScroll: true });
    };

    const handleCopyWA = (wa) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(wa);
            alert('No. WA tersalin ke clipboard.');
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
                    {counts.menunggu > 0 && (
                        <div className="px-4 py-2 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg">
                            <span className="text-sm font-semibold text-[var(--warning)]">
                                {counts.menunggu} permintaan menunggu
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
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    filters.tab === tab.id
                                        ? 'border-[var(--primary-500)] text-[var(--primary-500)]'
                                        : 'border-transparent text-[var(--neutral-600)] hover:text-[var(--neutral-900)]'
                                }`}
                            >
                                {tab.label} ({counts[tab.id] ?? 0})
                            </button>
                        ))}
                    </div>

                    <div className="p-6 space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                Tidak ada permintaan di kategori ini.
                            </div>
                        ) : (
                            requests.map((req) => (
                                <div key={req.id} className="border border-[var(--neutral-200)] rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                                        <div className="flex-1 min-w-[200px]">
                                            <h3 className="font-semibold text-[var(--neutral-900)] mb-1">{req.full_name}</h3>
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-sm text-[var(--neutral-600)]">{req.email}</span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    req.request_type === 'Akun Baru'
                                                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                        : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                                                }`}>
                                                    {req.request_type}
                                                </span>
                                            </div>
                                            {req.reason && (
                                                <p className="text-sm text-[var(--neutral-700)]">
                                                    <span className="font-medium">Alasan:</span> {req.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-xs text-[var(--neutral-500)] mb-4">
                                        Diajukan: {req.created_at} · WA: {req.wa_number}
                                        {req.processor_name && req.processed_at && (
                                            <span> · Diproses oleh {req.processor_name} ({req.processed_at})</span>
                                        )}
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleCopyWA(req.wa_number)}
                                                className="px-4 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center gap-2"
                                            >
                                                📱 Salin No. WA
                                            </button>
                                            <button
                                                onClick={() => handleReject(req)}
                                                className="px-4 py-2 text-sm bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleApprove(req)}
                                                className="px-4 py-2 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]"
                                            >
                                                Setujui
                                            </button>
                                        </div>
                                    )}

                                    {req.status === 'approved' && (
                                        <div className="text-sm text-[var(--success)]">✓ Disetujui</div>
                                    )}

                                    {req.status === 'rejected' && (
                                        <div>
                                            <div className="text-sm text-[var(--danger)] mb-1">✗ Ditolak</div>
                                            {req.rejection_reason && (
                                                <p className="text-xs text-[var(--neutral-500)]">Alasan: {req.rejection_reason}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
