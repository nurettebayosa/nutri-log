import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

function SensorThresholdRow({ sensorType, label, icon, unit, thresholdData }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] flex items-center justify-center">{icon}</div>
                <h4 className="font-semibold text-[var(--neutral-900)]">{label}</h4>
                {!thresholdData.is_active && (
                    <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full">Nonaktif</span>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Min Kritis</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            defaultValue={thresholdData.critical_min ?? ''}
                            placeholder="—"
                            className="flex-1 px-2 py-1.5 text-sm border border-[var(--neutral-300)] rounded-lg"
                        />
                        <span className="text-xs text-[var(--neutral-600)]">{unit}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Optimal Min</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            defaultValue={thresholdData.optimal_min ?? ''}
                            placeholder="—"
                            className="flex-1 px-2 py-1.5 text-sm border border-[var(--neutral-300)] rounded-lg"
                        />
                        <span className="text-xs text-[var(--neutral-600)]">{unit}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Optimal Max</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            defaultValue={thresholdData.optimal_max ?? ''}
                            placeholder="—"
                            className="flex-1 px-2 py-1.5 text-sm border border-[var(--neutral-300)] rounded-lg"
                        />
                        <span className="text-xs text-[var(--neutral-600)]">{unit}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[var(--neutral-700)] mb-1">Max Kritis</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            defaultValue={thresholdData.critical_max ?? ''}
                            placeholder="—"
                            className="flex-1 px-2 py-1.5 text-sm border border-[var(--neutral-300)] rounded-lg"
                        />
                        <span className="text-xs text-[var(--neutral-600)]">{unit}</span>
                    </div>
                </div>
            </div>

            {thresholdData.updated_at && (
                <div className="text-xs text-[var(--neutral-500)] mt-3">
                    Terakhir diubah: <span className="font-medium">{thresholdData.updated_by_name ?? '—'}</span>
                    {' · '}{thresholdData.updated_at}
                </div>
            )}
        </div>
    );
}

export default function ThresholdSettings({ blocks = [] }) {
    return (
        <DashboardLayout>
            <Head title="Threshold Sensor" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Threshold Sensor</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Atur batas minimal/optimal/maksimal per sensor per blok. Setiap blok bisa punya konfigurasi berbeda.
                    </p>
                </div>

                <div className="p-4 bg-[var(--info)]/10 border border-[var(--info)]/30 rounded-xl text-sm text-[var(--neutral-700)]">
                    ℹ️ Form simpan akan diaktifkan di iterasi berikutnya. Saat ini menampilkan data threshold yang sudah ada di database.
                </div>

                {blocks.length === 0 ? (
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-12 text-center">
                        <p className="text-sm text-[var(--neutral-600)]">Belum ada blok terdaftar.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blocks.map((block) => (
                            <div key={block.id} className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                                <div className="px-5 py-4 bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
                                    <h3 className="font-semibold text-[var(--neutral-900)]">{block.name} ({block.code})</h3>
                                </div>

                                <div className="p-5 space-y-6">
                                    <SensorThresholdRow
                                        sensorType="tds"
                                        label="TDS"
                                        icon="📊"
                                        unit="ppm"
                                        thresholdData={block.tds}
                                    />
                                    <div className="border-t border-[var(--neutral-200)]"></div>
                                    <SensorThresholdRow
                                        sensorType="moisture"
                                        label="Soil Moisture"
                                        icon="💧"
                                        unit="%"
                                        thresholdData={block.moisture}
                                    />
                                    <div className="border-t border-[var(--neutral-200)]"></div>
                                    <SensorThresholdRow
                                        sensorType="turbidity"
                                        label="Turbidity"
                                        icon="🌊"
                                        unit="NTU"
                                        thresholdData={block.turbidity}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
