import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function NotificationsIndex({ alerts = [], blocks = [], counts = {}, filters = {} }) {
    const handleFilterChange = (key, value) => {
        router.get('/notifikasi', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResolve = (id) => {
        if (!confirm('Tandai alert ini selesai?')) return;
        router.post(`/notifikasi/${id}/resolve`, {}, { preserveScroll: true });
    };

    const handleIgnore = (id) => {
        if (!confirm('Abaikan alert ini?')) return;
        router.post(`/notifikasi/${id}/ignore`, {}, { preserveScroll: true });
    };

    const getSeverityIcon = (severity) => {
        if (severity === 'critical') return '🔴';
        if (severity === 'warning') return '🟡';
        if (severity === 'info') return '🔵';
        return '⚪';
    };

    const getStatusPill = (status) => {
        if (status === 'aktif') return <span className="px-2 py-0.5 bg-[var(--danger)]/10 text-[var(--danger)] text-xs rounded-full">Aktif</span>;
        if (status === 'selesai') return <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Selesai</span>;
        if (status === 'diabaikan') return <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full">Diabaikan</span>;
        return null;
    };

    return (
        <DashboardLayout>
            <Head title="Notifikasi & Alert" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Notifikasi & Alert</h1>
                        <p className="text-sm text-[var(--neutral-600)]">Pusat semua peringatan, info, dan event sistem</p>
                    </div>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="border-b border-[var(--neutral-200)] flex overflow-x-auto">
                        {[
                            { id: 'semua', label: 'Semua' },
                            { id: 'aktif', label: 'Aktif' },
                            { id: 'selesai', label: 'Selesai' },
                            { id: 'diabaikan', label: 'Diabaikan' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleFilterChange('tab', tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    filters.tab === tab.id
                                        ? 'border-[var(--primary-500)] text-[var(--primary-500)]'
                                        : 'border-transparent text-[var(--neutral-600)] hover:text-[var(--neutral-900)]'
                                }`}
                            >
                                {tab.label} {counts[tab.id] != null && `(${counts[tab.id]})`}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={filters.severity}
                                onChange={(e) => handleFilterChange('severity', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg"
                            >
                                <option value="">Semua Severity</option>
                                <option value="critical">Kritis</option>
                                <option value="warning">Peringatan</option>
                                <option value="info">Info</option>
                            </select>
                            <select
                                value={filters.block_id}
                                onChange={(e) => handleFilterChange('block_id', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg"
                            >
                                <option value="">Semua Blok</option>
                                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        {alerts.length === 0 ? (
                            <div className="p-12 text-center text-sm text-[var(--neutral-500)]">
                                Tidak ada alert untuk filter ini.
                            </div>
                        ) : (
                            alerts.map((notif) => (
                                <div key={notif.id} className="p-5 border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                    <div className="flex items-start gap-4">
                                        <div className="text-2xl flex-shrink-0">{getSeverityIcon(notif.severity)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">{notif.title}</h3>
                                                    <p className="text-sm text-[var(--neutral-700)]">{notif.message}</p>
                                                </div>
                                                {getStatusPill(notif.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)] flex-wrap">
                                                <span>{notif.date} {notif.time}</span>
                                                <span className="px-2 py-0.5 bg-[var(--neutral-100)] rounded-full">{notif.block_name}</span>
                                            </div>
                                            {notif.status === 'aktif' && (
                                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                    <button
                                                        onClick={() => handleResolve(notif.id)}
                                                        className="px-3 py-1.5 text-xs bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                    <button
                                                        onClick={() => handleIgnore(notif.id)}
                                                        className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] text-[var(--neutral-600)] rounded-lg hover:bg-[var(--neutral-50)]"
                                                    >
                                                        Abaikan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
