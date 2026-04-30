import { Head, router } from '@inertiajs/react';
import { Search, Download } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SensorHistory({ blocks = [], readings, filters }) {
    const handleFilterChange = (key, value) => {
        router.get('/riwayat-sensor', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusColor = (sensorType, value) => {
        // sederhanain dulu — nanti di Phase D bisa pakai threshold dari DB
        return 'bg-[var(--success)]/10 text-[var(--success)]';
    };

    const getStatusLabel = (sensorType) => {
        if (sensorType === 'tds') return 'Optimal';
        if (sensorType === 'moisture') return 'Normal';
        if (sensorType === 'turbidity') return 'Jernih';
        return '-';
    };

    const formatValue = (value) => {
        return Number(value).toLocaleString('id-ID');
    };

    return (
        <DashboardLayout>
            <Head title="Riwayat Sensor" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Riwayat Sensor</h1>
                    <p className="text-sm text-[var(--neutral-600)]">Eksplorasi data historis dengan filter mendalam</p>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Blok</label>
                            <select
                                value={filters.block_id}
                                onChange={(e) => handleFilterChange('block_id', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            >
                                {blocks.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Sensor</label>
                            <select
                                value={filters.sensor_type}
                                onChange={(e) => handleFilterChange('sensor_type', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            >
                                <option value="all">Semua Sensor</option>
                                <option value="tds">TDS</option>
                                <option value="moisture">Moisture</option>
                                <option value="turbidity">Turbidity</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Periode</label>
                            <select
                                value={filters.period}
                                onChange={(e) => handleFilterChange('period', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            >
                                <option value="today">Hari ini</option>
                                <option value="yesterday">Kemarin</option>
                                <option value="7days">7 hari</option>
                                <option value="30days">30 hari</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Granularitas</label>
                            <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" disabled>
                                <option>Per menit</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={() => router.get('/riwayat-sensor', {}, { preserveScroll: true })}
                                className="flex-1 px-3 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]"
                            >
                                Reset
                            </button>
                            <button className="px-3 py-2 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chart placeholder */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                    <div className="h-64 bg-[var(--neutral-50)] rounded-lg flex items-center justify-center">
                        <div className="text-sm text-[var(--neutral-500)]">[Chart akan dipasang di Phase polishing dengan recharts]</div>
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
                                    <th className="px-4 py-3 text-left">Sumber</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {readings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-[var(--neutral-500)]">
                                            Tidak ada data sensor untuk filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    readings.data.map((row) => (
                                        <tr key={row.id} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                            <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{row.recorded_at}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)]">{row.block_name}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)] uppercase">{row.sensor_type}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-[var(--neutral-900)]">{formatValue(row.value)}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-600)]">{row.unit}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-600)] text-xs capitalize">
                                                {row.source}{row.recorder_name && ` (${row.recorder_name})`}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(row.sensor_type, row.value)}`}>
                                                    {getStatusLabel(row.sensor_type)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="text-[var(--neutral-600)]">
                            Menampilkan {readings.from ?? 0}–{readings.to ?? 0} dari {readings.total} entri
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {readings.links?.map((link, idx) => (
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
