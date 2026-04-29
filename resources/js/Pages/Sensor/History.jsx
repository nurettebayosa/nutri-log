import { Head } from '@inertiajs/react';
import { Search, Download } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SensorHistory() {
    const sensorData = [
        { waktu: '26/04/2026 14:25', blok: 'Blok A1', sensor: 'TDS', nilai: '1,080', satuan: 'ppm', status: 'optimal' },
        { waktu: '26/04/2026 14:25', blok: 'Blok A1', sensor: 'Moisture', nilai: '68', satuan: '%', status: 'normal' },
        { waktu: '26/04/2026 14:25', blok: 'Blok A1', sensor: 'Turbidity', nilai: '12', satuan: 'NTU', status: 'jernih' },
        { waktu: '26/04/2026 14:20', blok: 'Blok A1', sensor: 'TDS', nilai: '1,075', satuan: 'ppm', status: 'optimal' },
        { waktu: '26/04/2026 14:20', blok: 'Blok A1', sensor: 'Moisture', nilai: '67', satuan: '%', status: 'normal' },
        { waktu: '26/04/2026 14:20', blok: 'Blok A1', sensor: 'Turbidity', nilai: '13', satuan: 'NTU', status: 'jernih' },
        { waktu: '26/04/2026 14:15', blok: 'Blok A1', sensor: 'TDS', nilai: '870', satuan: 'ppm', status: 'warning' },
        { waktu: '26/04/2026 14:15', blok: 'Blok A1', sensor: 'Moisture', nilai: '65', satuan: '%', status: 'normal' },
        { waktu: '26/04/2026 14:15', blok: 'Blok A1', sensor: 'Turbidity', nilai: '18', satuan: 'NTU', status: 'jernih' },
        { waktu: '26/04/2026 14:10', blok: 'Blok A1', sensor: 'TDS', nilai: '1,065', satuan: 'ppm', status: 'optimal' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'optimal':
            case 'normal':
            case 'jernih':
                return 'bg-[var(--success)]/10 text-[var(--success)]';
            case 'warning':
                return 'bg-[var(--warning)]/10 text-[var(--warning)]';
            default:
                return 'bg-[var(--neutral-100)] text-[var(--neutral-600)]';
        }
    };

    const getStatusLabel = (status) => {
        if (status === 'optimal') return 'Optimal';
        if (status === 'warning') return '⚠ Warning';
        if (status === 'normal') return 'Normal';
        return 'Jernih';
    };

    return (
        <DashboardLayout>
            <Head title="Riwayat Sensor" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Riwayat Sensor</h1>
                    <p className="text-sm text-[var(--neutral-600)]">Eksplorasi data historis dengan filter mendalam</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Blok</label>
                            <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                                <option>Blok A1</option>
                                <option>Blok A2</option>
                                <option>Blok A3</option>
                                <option>Blok B1</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Sensor</label>
                            <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                                <option>Semua Sensor</option>
                                <option>TDS</option>
                                <option>Moisture</option>
                                <option>Turbidity</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Periode</label>
                            <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                                <option>Hari ini</option>
                                <option>Kemarin</option>
                                <option>7 hari</option>
                                <option>30 hari</option>
                                <option>Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Granularitas</label>
                            <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                                <option>Per menit</option>
                                <option>Per jam</option>
                                <option>Per hari</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button className="flex-1 px-3 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                Reset
                            </button>
                            <button className="px-3 py-2 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                    <div className="h-96 bg-[var(--neutral-50)] rounded-lg flex items-center justify-center relative">
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
                                    <path
                                        d="M 0 60 L 20 55 L 40 45 L 50 70 L 60 65 L 80 55 L 100 50"
                                        fill="none"
                                        stroke="var(--primary-500)"
                                        strokeWidth="0.5"
                                    />
                                    <path
                                        d="M 0 60 L 20 55 L 40 45 L 50 70 L 60 65 L 80 55 L 100 50 L 100 100 L 0 100 Z"
                                        fill="var(--primary-500)"
                                        fillOpacity="0.1"
                                    />
                                    <line x1="0" y1="30" x2="100" y2="30" stroke="var(--success)" strokeWidth="0.3" strokeDasharray="2,2" />
                                    <line x1="0" y1="70" x2="100" y2="70" stroke="var(--danger)" strokeWidth="0.3" strokeDasharray="2,2" />
                                    <circle cx="50" cy="70" r="1" fill="var(--danger)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--primary-500)]" />
                            <span className="text-[var(--neutral-600)]">TDS Blok A1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--success)]" />
                            <span className="text-[var(--neutral-600)]">Threshold Atas (1200 ppm)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-[var(--danger)]" />
                            <span className="text-[var(--neutral-600)]">Threshold Bawah (1000 ppm)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                            <span className="text-[var(--neutral-600)]">Out of Range</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--neutral-200)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
                            <input
                                type="text"
                                placeholder="Cari di nilai atau timestamp..."
                                className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--neutral-50)] text-xs font-semibold text-[var(--neutral-700)]">
                                <tr>
                                    <th className="px-4 py-3 text-left">Waktu</th>
                                    <th className="px-4 py-3 text-left">Blok</th>
                                    <th className="px-4 py-3 text-left">Sensor</th>
                                    <th className="px-4 py-3 text-right">Nilai</th>
                                    <th className="px-4 py-3 text-left">Satuan</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {sensorData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)] cursor-pointer"
                                    >
                                        <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{row.waktu}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{row.blok}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{row.sensor}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-[var(--neutral-900)]">{row.nilai}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-600)]">{row.satuan}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(row.status)}`}>
                                                {getStatusLabel(row.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="text-[var(--neutral-600)]">Menampilkan 1–10 dari 47 entri</div>
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
