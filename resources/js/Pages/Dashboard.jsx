import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Dashboard({ summary, active_alert, blocks, schedules, activities }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? 'User';
    const firstName = userName.split(' ')[0];

    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12 ? 'Selamat pagi' : currentHour < 18 ? 'Selamat siang' : 'Selamat malam';

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Helper: format number with comma separator
    const fmt = (n) => (n != null ? Number(n).toLocaleString('id-ID') : '—');

    // Helper: HST badge color
    const getHstBadgeClass = (block) => {
        if (block.hst == null) return 'bg-[var(--neutral-100)] text-[var(--neutral-600)]';
        if (block.hst >= 28) return 'bg-[var(--success)]/10 text-[var(--success)]';
        if (block.hst >= 14 && block.hst <= 21) return 'bg-[var(--danger)]/10 text-[var(--danger)]';
        return 'bg-[var(--neutral-100)] text-[var(--neutral-600)]';
    };

    const getHstLabel = (block) => {
        if (block.hst == null) return 'Belum ada cycle';
        if (block.hst >= 28) return `HST ${block.hst} (Siap Panen)`;
        if (block.hst >= 14 && block.hst <= 21) return `HST ${block.hst} (Fase Rawan)`;
        return `HST ${block.hst}`;
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-1">
                            {greeting}, {firstName}
                        </h1>
                        <p className="text-sm text-[var(--neutral-600)]">
                            {today} · {time} WIB
                        </p>
                    </div>
                    {summary.blocks_with_sensor > 0 && (
                        <div className="px-4 py-2 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                            <span className="text-sm text-[var(--primary-700)]">
                                {summary.blocks_with_sensor} blok dengan sensor — Online
                            </span>
                        </div>
                    )}
                </div>

                {/* Active Alert */}
                {active_alert && (
                    <div className={`rounded-xl p-4 flex items-start gap-3 flex-wrap border ${
                        active_alert.severity === 'critical'
                            ? 'bg-[var(--danger)]/10 border-[var(--danger)]/30'
                            : active_alert.severity === 'warning'
                            ? 'bg-[var(--warning)]/10 border-[var(--warning)]/30'
                            : 'bg-[var(--info)]/10 border-[var(--info)]/30'
                    }`}>
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            active_alert.severity === 'critical' ? 'text-[var(--danger)]' :
                            active_alert.severity === 'warning' ? 'text-[var(--warning)]' :
                            'text-[var(--info)]'
                        }`} />
                        <div className="flex-1 min-w-[200px]">
                            <p className="text-sm text-[var(--neutral-900)] font-medium">{active_alert.title}</p>
                            <p className="text-xs text-[var(--neutral-600)] mt-1">
                                {active_alert.message} — terdeteksi {active_alert.triggered_ago}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/notifikasi"
                                className="px-3 py-1.5 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]"
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Total Blok Aktif</div>
                        <div className="text-3xl font-bold text-[var(--neutral-900)] mb-2">{summary.total_blocks} Blok</div>
                        <div className="text-xs text-[var(--neutral-500)]">
                            {summary.blocks_with_sensor} dengan hardware live
                            {summary.total_blocks - summary.blocks_with_sensor > 0 &&
                                `, ${summary.total_blocks - summary.blocks_with_sensor} menunggu sensor`}
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">TDS Rata-rata Hari Ini</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">{fmt(summary.avg_tds_today)}</div>
                            <div className="text-sm text-[var(--neutral-600)]">ppm</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--primary-500)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                {summary.avg_tds_today ? 'Optimal' : 'No data'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Kelembaban Media</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">
                                {summary.latest_moisture != null ? Math.round(summary.latest_moisture) : '—'}
                            </div>
                            <div className="text-sm text-[var(--neutral-600)]">%</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--info)]/20 to-[var(--info)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                {summary.latest_moisture != null ? 'Normal' : 'No data'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Tingkat Kekeruhan</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">
                                {summary.latest_turbidity != null ? Math.round(summary.latest_turbidity) : '—'}
                            </div>
                            <div className="text-sm text-[var(--neutral-600)]">NTU</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--accent-500)]/20 to-[var(--accent-500)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                {summary.latest_turbidity != null ? 'Jernih' : 'No data'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Block Cards */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[var(--neutral-900)]">Blok Pemantauan</h2>
                        <Link
                            href="/blok"
                            className="px-4 py-2 bg-white border border-[var(--neutral-300)] rounded-lg text-sm hover:bg-[var(--neutral-50)]"
                        >
                            Kelola Blok
                        </Link>
                    </div>

                    {blocks.length === 0 ? (
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-8 text-center">
                            <p className="text-sm text-[var(--neutral-600)]">Belum ada blok terdaftar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {blocks.map((block) => (
                                <div key={block.id} className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-[var(--neutral-900)] mb-1">
                                                {block.name} — {block.plant_type}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getHstBadgeClass(block)}`}>
                                                    {getHstLabel(block)}
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                                                    block.has_sensor
                                                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                        : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        block.has_sensor ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-400)]'
                                                    }`} />
                                                    {block.has_sensor ? 'Sensor Aktif' : 'Sensor Belum Terpasang'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {block.has_sensor && (block.tds != null || block.moisture != null || block.turbidity != null) ? (
                                        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[var(--neutral-50)] rounded-lg">
                                            <div>
                                                <div className="text-xs text-[var(--neutral-600)] mb-1">TDS</div>
                                                <div className="font-semibold text-[var(--success)]">
                                                    {block.tds != null ? `${fmt(Math.round(block.tds))} ppm` : '—'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--neutral-600)] mb-1">Moisture</div>
                                                <div className="font-semibold text-[var(--success)]">
                                                    {block.moisture != null ? `${Math.round(block.moisture)}%` : '—'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--neutral-600)] mb-1">Turbidity</div>
                                                <div className="font-semibold text-[var(--success)]">
                                                    {block.turbidity != null ? `${Math.round(block.turbidity)} NTU` : '—'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-[var(--neutral-50)] rounded-lg mb-4 text-center">
                                            <p className="text-sm text-[var(--neutral-600)]">
                                                Belum ada data sensor untuk blok ini.
                                            </p>
                                        </div>
                                    )}

                                    {block.start_date && (
                                        <div className="text-xs text-[var(--neutral-600)] mb-3">
                                            Tanam: {block.start_date}
                                            {block.expected_harvest_date && ` · Estimasi panen: ${block.expected_harvest_date}`}
                                        </div>
                                    )}

                                    <Link
                                        href={`/blok/${block.id}`}
                                        className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                                    >
                                        Detail Blok
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Aktivitas & Jadwal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jadwal Fertigasi */}
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Jadwal Fertigasi Hari Ini</h3>
                        <div className="space-y-3">
                            {schedules.length === 0 ? (
                                <p className="text-sm text-[var(--neutral-500)] text-center py-6">
                                    Tidak ada jadwal fertigasi hari ini.
                                </p>
                            ) : (
                                schedules.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                                            s.status === 'done'
                                                ? 'bg-[var(--success)]/5 border-[var(--success)]/20'
                                                : s.status === 'pending'
                                                ? 'bg-[var(--warning)]/5 border-[var(--warning)]/20'
                                                : 'bg-[var(--neutral-50)] border-[var(--neutral-200)]'
                                        }`}
                                    >
                                        {s.status === 'done' ? (
                                            <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Clock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                s.status === 'pending' ? 'text-[var(--warning)]' : 'text-[var(--neutral-400)]'
                                            }`} />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-[var(--neutral-900)]">{s.time}</span>
                                                <span className="text-xs text-[var(--neutral-600)]">{s.block_name}</span>
                                            </div>
                                            <div className="text-xs text-[var(--neutral-600)]">
                                                Target: {fmt(s.target_ppm)} ppm
                                                {s.actual_ppm && ` · Aktual: ${fmt(s.actual_ppm)} ppm`}
                                            </div>
                                            {s.status === 'done' && s.executor_name && (
                                                <div className="text-xs text-[var(--success)] mt-1">
                                                    ✓ Selesai oleh {s.executor_name} · {s.executed_at}
                                                </div>
                                            )}
                                            {s.status === 'pending' && (
                                                <div className="text-xs text-[var(--warning)] mt-1">⏰ Belum dilakukan</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Aktivitas Terkini */}
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Aktivitas Terkini</h3>
                        <div className="space-y-4">
                            {activities.length === 0 ? (
                                <p className="text-sm text-[var(--neutral-500)] text-center py-6">
                                    Belum ada aktivitas.
                                </p>
                            ) : (
                                activities.map((a) => {
                                    const initials = a.user_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
                                    return (
                                        <div key={a.id} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-semibold text-[var(--primary-700)]">{initials}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[var(--neutral-900)]">
                                                    <span className="font-medium">{a.user_name}</span> {a.description ?? a.action}
                                                </p>
                                                <p className="text-xs text-[var(--neutral-500)] mt-0.5">{a.time_ago}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <Link
                                href="/log-aktivitas"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Lihat semua
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Chart 24 Jam — sementara masih placeholder, akan kita isi nanti dengan recharts */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h3 className="font-semibold text-[var(--neutral-900)]">Grafik Sensor 24 Jam Terakhir</h3>
                        <Link
                            href="/riwayat-sensor"
                            className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]"
                        >
                            Lihat Detail
                        </Link>
                    </div>
                    <div className="h-64 bg-[var(--neutral-50)] rounded-lg flex items-center justify-center">
                        <div className="text-sm text-[var(--neutral-500)]">[Chart akan dipasang di Phase polishing]</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
