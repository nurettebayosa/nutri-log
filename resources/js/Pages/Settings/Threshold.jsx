import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

function TdsBlock({ block }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] flex items-center justify-center">📊</div>
                <h4 className="font-semibold text-[var(--neutral-900)]">TDS — {block}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Min Kritis</label>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={800} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                        <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">Di bawah ini = alert merah</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Optimal Min</label>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={1000} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                        <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">Di bawah ini = alert kuning</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Optimal Max</label>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={1200} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                        <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">Di atas ini = alert kuning</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Max Kritis</label>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={1400} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                        <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">Di atas ini = alert merah</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Toleransi</label>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={5} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                        <span className="text-sm text-[var(--neutral-600)]">menit</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">Alert nyala kalau out-of-range &gt; X menit</p>
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[var(--primary-500)]" />
                        <span className="text-sm text-[var(--neutral-700)]">Aktifkan alert</span>
                    </label>
                </div>
            </div>

            {/* Visual Range */}
            <div className="p-4 bg-[var(--neutral-50)] rounded-lg">
                <div className="text-xs text-[var(--neutral-600)] mb-2">Preview Range:</div>
                <div className="h-8 bg-white border border-[var(--neutral-200)] rounded-lg relative overflow-hidden flex">
                    <div className="flex-1 bg-[var(--danger)]/20"></div>
                    <div className="flex-[2] bg-[var(--warning)]/20"></div>
                    <div className="flex-[4] bg-[var(--success)]/20"></div>
                    <div className="flex-[2] bg-[var(--warning)]/20"></div>
                    <div className="flex-1 bg-[var(--danger)]/20"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--neutral-500)] mt-1">
                    <span>&lt;800</span>
                    <span>800-1000</span>
                    <span className="font-semibold text-[var(--success)]">1000-1200</span>
                    <span>1200-1400</span>
                    <span>&gt;1400</span>
                </div>
            </div>

            <div className="text-xs text-[var(--neutral-500)] mt-3">
                Disimpan otomatis · Terakhir diubah: <span className="font-medium">Pak Kiki</span> · 25/04 10:00
            </div>
        </div>
    );
}

function MoistureBlock({ block }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--info)]/10 flex items-center justify-center">💧</div>
                <h4 className="font-semibold text-[var(--neutral-900)]">Soil Moisture — {block}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Min Kritis', val: 40 },
                    { label: 'Optimal Min', val: 55 },
                    { label: 'Optimal Max', val: 80 },
                    { label: 'Max Kritis', val: 90 },
                ].map((f) => (
                    <div key={f.label}>
                        <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">{f.label}</label>
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue={f.val} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                            <span className="text-sm text-[var(--neutral-600)]">%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TurbidityBlock({ block }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-500)]/10 flex items-center justify-center">🌊</div>
                <h4 className="font-semibold text-[var(--neutral-900)]">Turbidity — {block}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Optimal Max', val: 30 },
                    { label: 'Warning Max', val: 50 },
                ].map((f) => (
                    <div key={f.label}>
                        <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">{f.label}</label>
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue={f.val} className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                            <span className="text-sm text-[var(--neutral-600)]">NTU</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ThresholdSettings() {
    const blocks = ['Blok A1', 'Blok A2', 'Blok A3', 'Blok B1'];

    return (
        <DashboardLayout>
            <Head title="Threshold Sensor" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Threshold Sensor</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Atur batas minimal/optimal/maksimal per sensor per blok. Setiap blok dapat memiliki konfigurasi berbeda.
                    </p>
                </div>

                <div className="space-y-4">
                    {blocks.map((block) => (
                        <div key={block} className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                            <div className="px-5 py-4 bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
                                <h3 className="font-semibold text-[var(--neutral-900)]">{block}</h3>
                            </div>

                            <div className="p-5 space-y-6">
                                <TdsBlock block={block} />
                                <div className="border-t border-[var(--neutral-200)]"></div>
                                <MoistureBlock block={block} />
                                <div className="border-t border-[var(--neutral-200)]"></div>
                                <TurbidityBlock block={block} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
