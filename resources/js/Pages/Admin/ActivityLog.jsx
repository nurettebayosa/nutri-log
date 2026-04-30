import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminActivityLog() {
    const logs = [
        { waktu: '30/04 14:32', user: 'Pak Tedi', aksi: 'LOGIN', target: '-', detail: '-', ip: '192.168.1.45' },
        { waktu: '30/04 12:14', user: 'Pak Tedi', aksi: 'TANDAI_FERTIGASI', target: 'Blok A1 12:00', detail: 'ppm aktual: 1,085', ip: '192.168.1.45' },
        { waktu: '30/04 11:42', user: 'Pak Tedi', aksi: 'KONTROL_POMPA_ON', target: 'Blok A1', detail: 'manual override (2m 10s)', ip: '192.168.1.45' },
        { waktu: '30/04 10:00', user: 'Pak Kiki', aksi: 'EDIT_THRESHOLD', target: 'Blok A1 - TDS', detail: 'min: 950→1000', ip: '36.79.x.x' },
        { waktu: '30/04 09:00', user: 'Pak Kiki', aksi: 'TAMBAH_PENGGUNA', target: 'Pak Andi', detail: 'role: Karyawan', ip: '36.79.x.x' },
        { waktu: '30/04 08:14', user: 'Pak Kiki', aksi: 'LOGIN', target: '-', detail: '-', ip: '36.79.x.x' },
        { waktu: '29/04 17:05', user: 'Pak Tedi', aksi: 'TANDAI_FERTIGASI', target: 'Blok A1 17:00', detail: 'ppm aktual: 1,095', ip: '192.168.1.45' },
        { waktu: '29/04 14:30', user: 'Pak Kiki', aksi: 'EXPORT_LAPORAN', target: 'Stabilitas Nutrisi Blok A1', detail: 'PDF generated', ip: '36.79.x.x' },
    ];

    const getAksiColor = (aksi) => {
        if (aksi === 'LOGIN' || aksi === 'LOGOUT') return 'bg-[var(--info)]/10 text-[var(--info)]';
        if (aksi.startsWith('KONTROL')) return 'bg-[var(--warning)]/10 text-[var(--warning)]';
        if (aksi.startsWith('HAPUS')) return 'bg-[var(--danger)]/10 text-[var(--danger)]';
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
                                        placeholder="Cari keyword..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>

                            <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg">
                                <option>Semua User</option>
                                <option>Pak Kiki</option>
                                <option>Pak Tedi</option>
                            </select>

                            <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg">
                                <option>Semua Aksi</option>
                                <option>LOGIN</option>
                                <option>LOGOUT</option>
                                <option>EDIT</option>
                                <option>HAPUS</option>
                                <option>KONTROL_POMPA</option>
                            </select>

                            <input type="date" className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
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
                                    <th className="px-4 py-3 text-left">Detail Sebelum/Sesudah</th>
                                    <th className="px-4 py-3 text-left">IP</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {logs.map((log, idx) => (
                                    <tr key={idx} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                        <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{log.waktu}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{log.user}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${getAksiColor(log.aksi)}`}>
                                                {log.aksi}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[var(--neutral-700)]">{log.target}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-600)] text-xs">{log.detail}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-600)] font-mono text-xs">{log.ip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="text-[var(--neutral-600)]">Menampilkan 1–8 dari 142 entri</div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] disabled:opacity-50">
                                ‹ Prev
                            </button>
                            <button className="px-3 py-1.5 bg-[var(--primary-500)] text-white rounded-lg">1</button>
                            <button className="px-3 py-1.5 border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">2</button>
                            <button className="px-3 py-1.5 border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">3</button>
                            <button className="px-3 py-1.5 border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                Next ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
