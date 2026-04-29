import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Dashboard() {
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

    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-1">
                            {greeting}, {firstName}
                        </h1>
                        <p className="text-sm text-[var(--neutral-600)]">
                            {today} · {time} WIB
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                        <span className="text-sm text-[var(--primary-700)]">Blok A1 — Online</span>
                        <span className="text-xs text-[var(--neutral-500)]">· Update 5 detik lalu</span>
                    </div>
                </div>

                {/* Alert Strip */}
                <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl p-4 flex items-start gap-3 flex-wrap">
                    <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-[200px]">
                        <p className="text-sm text-[var(--neutral-900)] font-medium">
                            TDS Blok A1 turun ke 870 ppm (target 1000–1200) — terdeteksi 12 menit lalu
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                            Lihat Detail
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]">
                            Tandai Selesai
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Total Blok Aktif</div>
                        <div className="text-3xl font-bold text-[var(--neutral-900)] mb-2">4 Blok</div>
                        <div className="text-xs text-[var(--neutral-500)]">
                            1 dengan hardware live, 3 menunggu sensor
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">TDS Rata-rata Hari Ini</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">1,080</div>
                            <div className="text-sm text-[var(--neutral-600)]">ppm</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--primary-500)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                Optimal
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Kelembaban Media</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">68</div>
                            <div className="text-sm text-[var(--neutral-600)]">%</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--info)]/20 to-[var(--info)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                Normal
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Tingkat Kekeruhan</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-3xl font-bold text-[var(--neutral-900)]">12</div>
                            <div className="text-sm text-[var(--neutral-600)]">NTU</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 bg-[var(--neutral-100)] rounded">
                                <div className="h-full bg-gradient-to-r from-[var(--accent-500)]/20 to-[var(--accent-500)]/40 rounded" />
                            </div>
                            <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                Jernih
                            </span>
                        </div>
                    </div>
                </div>

                {/* Blok Monitoring */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Blok A1 */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">Blok A1 — Pakcoy</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2 py-0.5 bg-[var(--danger)]/10 text-[var(--danger)] text-xs rounded-full">
                                            HST 14 (Fase Rawan)
                                        </span>
                                        <span className="px-2 py-0.5 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs rounded-full flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-500)]" />
                                            Sensor Aktif
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[var(--neutral-50)] rounded-lg">
                                <div>
                                    <div className="text-xs text-[var(--neutral-600)] mb-1">TDS</div>
                                    <div className="font-semibold text-[var(--success)]">1,080 ppm</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--neutral-600)] mb-1">Moisture</div>
                                    <div className="font-semibold text-[var(--success)]">68%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--neutral-600)] mb-1">Turbidity</div>
                                    <div className="font-semibold text-[var(--success)]">12 NTU</div>
                                </div>
                            </div>
                            <div className="text-xs text-[var(--neutral-600)] mb-3">
                                Tanam: 13 April 2026 · Estimasi panen: 13 Mei 2026
                            </div>
                            <Link
                                href="/blok/a1"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Detail Blok
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Blok A2 */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">Blok A2 — Pakcoy</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full">
                                            HST 7
                                        </span>
                                        <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neutral-400)]" />
                                            Sensor Belum Terpasang
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--neutral-50)] rounded-lg mb-4 text-center">
                                <p className="text-sm text-[var(--neutral-600)]">
                                    Belum ada data sensor untuk blok ini.
                                </p>
                            </div>
                            <div className="text-xs text-[var(--neutral-600)] mb-3">
                                Tanam: 20 April 2026 · Estimasi panen: 20 Mei 2026
                            </div>
                            <Link
                                href="/blok/a2"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Detail Blok
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Blok A3 */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">Blok A3 — Pakcoy</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full">
                                            HST 21
                                        </span>
                                        <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neutral-400)]" />
                                            Belum Terpasang
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--neutral-50)] rounded-lg mb-4 text-center">
                                <p className="text-sm text-[var(--neutral-600)]">
                                    Belum ada data sensor untuk blok ini.
                                </p>
                            </div>
                            <div className="text-xs text-[var(--neutral-600)] mb-3">
                                Tanam: 06 April 2026 · Estimasi panen: 06 Mei 2026
                            </div>
                            <Link
                                href="/blok/a3"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Detail Blok
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Blok B1 */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">Blok B1 — Pakcoy</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                                            HST 28 (Siap Panen)
                                        </span>
                                        <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neutral-400)]" />
                                            Belum Terpasang
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--neutral-50)] rounded-lg mb-4 text-center">
                                <p className="text-sm text-[var(--neutral-600)]">
                                    Belum ada data sensor untuk blok ini.
                                </p>
                            </div>
                            <div className="text-xs text-[var(--neutral-600)] mb-3">
                                Tanam: 30 Maret 2026 · Estimasi panen: 30 April 2026
                            </div>
                            <Link
                                href="/blok/b1"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Detail Blok
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Aktivitas & Jadwal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jadwal Fertigasi */}
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Jadwal Fertigasi Hari Ini</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-[var(--neutral-900)]">07:00</span>
                                        <span className="text-xs text-[var(--neutral-600)]">Blok A1</span>
                                    </div>
                                    <div className="text-xs text-[var(--neutral-600)]">Target: 1,100 ppm · Aktual: 1,085 ppm</div>
                                    <div className="text-xs text-[var(--success)] mt-1">✓ Selesai oleh Pak Tedi · 07:14</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-lg flex-wrap">
                                <Clock className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-[150px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-[var(--neutral-900)]">12:00</span>
                                        <span className="text-xs text-[var(--neutral-600)]">Blok A1</span>
                                    </div>
                                    <div className="text-xs text-[var(--neutral-600)]">Target: 1,100 ppm</div>
                                    <div className="text-xs text-[var(--warning)] mt-1">⏰ Belum dilakukan</div>
                                </div>
                                <button className="px-3 py-1.5 text-xs bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]">
                                    Tandai Selesai
                                </button>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg">
                                <Clock className="w-5 h-5 text-[var(--neutral-400)] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-[var(--neutral-900)]">17:00</span>
                                        <span className="text-xs text-[var(--neutral-600)]">Blok A1</span>
                                    </div>
                                    <div className="text-xs text-[var(--neutral-600)]">Target: 1,100 ppm</div>
                                    <div className="text-xs text-[var(--neutral-500)] mt-1">🌙 Belum waktunya</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aktivitas Terkini */}
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Aktivitas Terkini</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-[var(--primary-700)]">PT</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--neutral-900)]">
                                        <span className="font-medium">Pak Tedi</span> menyelesaikan fertigasi 07:00 Blok A1
                                    </p>
                                    <p className="text-xs text-[var(--neutral-500)] mt-0.5">15 menit lalu</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--accent-400)]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-[var(--accent-600)]">SY</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--neutral-900)]">
                                        <span className="font-medium">Sistem</span> mendeteksi TDS rendah di Blok A1
                                    </p>
                                    <p className="text-xs text-[var(--neutral-500)] mt-0.5">32 menit lalu</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-[var(--primary-700)]">KI</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--neutral-900)]">
                                        <span className="font-medium">Pak Kiki</span> memperbarui threshold TDS Blok A1
                                    </p>
                                    <p className="text-xs text-[var(--neutral-500)] mt-0.5">2 jam lalu</p>
                                </div>
                            </div>
                            <Link
                                href="/maintenance"
                                className="flex items-center justify-center gap-1 w-full py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                            >
                                Lihat semua
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Chart 24 Jam */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-4 flex-wrap">
                            <h3 className="font-semibold text-[var(--neutral-900)]">Grafik Sensor 24 Jam Terakhir</h3>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 text-xs bg-[var(--primary-500)] text-white rounded-lg">TDS</button>
                                <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                    Moisture
                                </button>
                                <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                    Turbidity
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                Hari ini
                            </button>
                            <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                7 hari
                            </button>
                            <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                30 hari
                            </button>
                        </div>
                    </div>

                    <div className="h-64 bg-[var(--neutral-50)] rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 p-4">
                            <div className="h-full border-l border-b border-[var(--neutral-200)] relative">
                                <div className="absolute inset-0">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="absolute left-0 right-0 border-t border-[var(--neutral-200)]"
                                            style={{ top: `${i * 25}%` }}
                                        />
                                    ))}
                                </div>
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M 0 60 Q 25 40, 50 50 T 100 45" fill="none" stroke="var(--primary-500)" strokeWidth="0.5" />
                                    <path d="M 0 60 Q 25 40, 50 50 T 100 45 L 100 100 L 0 100 Z" fill="var(--primary-500)" fillOpacity="0.1" />
                                    <line x1="0" y1="30" x2="100" y2="30" stroke="var(--success)" strokeWidth="0.3" strokeDasharray="2,2" />
                                    <line x1="0" y1="70" x2="100" y2="70" stroke="var(--warning)" strokeWidth="0.3" strokeDasharray="2,2" />
                                </svg>
                                <div className="absolute -left-12 top-[30%] text-xs text-[var(--success)]">1200</div>
                                <div className="absolute -left-12 top-[70%] text-xs text-[var(--warning)]">1000</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-6 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--primary-500)]" />
                            <span className="text-[var(--neutral-600)]">TDS Aktual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--success)]" />
                            <span className="text-[var(--neutral-600)]">Batas Optimal Atas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--warning)]" />
                            <span className="text-[var(--neutral-600)]">Batas Optimal Bawah</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
