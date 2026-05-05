import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminActivityLog({ logs, users = [], filters = {} }) {
    const handleFilterChange = (key, value) => {
        router.get('/log-aktivitas', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getAksiColor = (action) => {
        if (action === 'LOGIN' || action === 'LOGOUT') return 'bg-[var(--info)]/10 text-[var(--info)]';
        if (action.startsWith('KONTROL')) return 'bg-[var(--warning)]/10 text-[var(--warning)]';
        if (action.startsWith('HAPUS')) return 'bg-[var(--danger)]/10 text-[var(--danger)]';
        return 'bg-[var(--neutral-100)] text-[var(--neutral-700)]';
    };

    return (
        <DashboardLayout>
            <Head title="Log Aktivitas" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Log Aktivitas</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Audit trail siapa-melakukan-apa untuk akuntabilitas sistem
                    </p>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--neutral-200)]">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
                                    <input
                                        type="text"
                                        defaultValue={filters.search}
                                        onBlur={(e) => handleFilterChange('search', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
                                        placeholder="Cari keyword (Enter)..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>

                            <select
                                value={filters.user_id}
                                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                            >
                                <option value="">Semua User</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>

                            <select
                                value={filters.action}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                            >
                                <option value="">Semua Aksi</option>
                                <option value="LOGIN">LOGIN</option>
                                <option value="LOGOUT">LOGOUT</option>
                                <option value="EDIT">EDIT</option>
                                <option value="HAPUS">HAPUS</option>
                                <option value="KONTROL_POMPA">KONTROL_POMPA</option>
                                <option value="TANDAI_FERTIGASI">TANDAI_FERTIGASI</option>
                            </select>

                            <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--neutral-50)] text-xs font-semibold text-[var(--neutral-700)]">
                                <tr>
                                    <th className="px-4 py-3 text-left">Waktu</th>
                                    <th className="px-4 py-3 text-left">User</th>
                                    <th className="px-4 py-3 text-left">Aksi</th>
                                    <th className="px-4 py-3 text-left">Target</th>
                                    <th className="px-4 py-3 text-left">Detail</th>
                                    <th className="px-4 py-3 text-left">IP</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-[var(--neutral-500)]">
                                            Tidak ada log untuk filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                            <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{log.created_at}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)]">{log.user_name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${getAksiColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--neutral-700)] text-xs">{log.target}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-600)] text-xs">{log.description}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-600)] font-mono text-xs">{log.ip_address}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="text-[var(--neutral-600)]">
                            Menampilkan {logs.from ?? 0}–{logs.to ?? 0} dari {logs.total} entri
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {logs.links?.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                    className={`px-3 py-1.5 border rounded-lg text-sm ${
                                        link.active
                                            ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                                            : 'border-[var(--neutral-300)] hover:bg-[var(--neutral-50)] disabled:opacity-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
