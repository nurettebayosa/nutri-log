import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Power } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function PumpControl() {
    const [pumpOn, setPumpOn] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const pumpHistory = [
        { waktu: '26/04 12:00', blok: 'A1', mode: 'Auto (Jadwal Fertigasi)', durasi: '8m 30s', trigger: 'Jadwal 12:00', oleh: 'Sistem' },
        { waktu: '26/04 11:42', blok: 'A1', mode: 'Manual', durasi: '2m 10s', trigger: 'Tombol manual', oleh: 'Pak Tedi' },
        { waktu: '26/04 07:00', blok: 'A1', mode: 'Auto (Jadwal Fertigasi)', durasi: '8m 30s', trigger: 'Jadwal 07:00', oleh: 'Sistem' },
        { waktu: '26/04 03:14', blok: 'A1', mode: 'Auto (Moisture <50%)', durasi: '4m 00s', trigger: 'Threshold tercapai', oleh: 'Sistem' },
    ];

    return (
        <DashboardLayout>
            <Head title="Kontrol Pompa" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Kontrol Pompa</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Lihat status pompa real-time, kontrol manual, dan riwayat aktivasi
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Status & Control */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Blok A1 - dengan hardware */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                            <div className="text-sm font-medium text-[var(--neutral-600)] mb-4">Blok A1</div>

                            <div className="flex flex-col items-center mb-6">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                                    pumpOn ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-200)]'
                                }`}>
                                    <Power className={`w-12 h-12 ${pumpOn ? 'text-white animate-pulse' : 'text-[var(--neutral-500)]'}`} />
                                </div>

                                <div className={`text-3xl font-bold mb-2 ${
                                    pumpOn ? 'text-[var(--primary-500)]' : 'text-[var(--neutral-600)]'
                                }`}>
                                    {pumpOn ? '● MENYALA' : '○ MATI'}
                                </div>

                                <div className="text-sm text-[var(--neutral-600)] mb-1">
                                    Mode: <span className="font-semibold text-[var(--neutral-900)]">
                                        {pumpOn ? 'MANUAL' : 'AUTO (Jadwal)'}
                                    </span>
                                </div>

                                <div className="text-xs text-[var(--neutral-500)]">
                                    {pumpOn ? 'Durasi: 2 menit 34 detik' : 'Terakhir nyala 2 jam 14 menit lalu'}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                                        pumpOn
                                            ? 'bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90'
                                            : 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]'
                                    }`}
                                >
                                    {pumpOn ? 'MATIKAN POMPA' : 'NYALAKAN POMPA'}
                                </button>

                                <div className="flex items-center justify-between p-3 bg-[var(--neutral-50)] rounded-lg">
                                    <span className="text-sm text-[var(--neutral-700)]">Mode Otomatis</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-[var(--neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-500)]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Blok tanpa hardware */}
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                            <div className="text-sm font-medium text-[var(--neutral-600)] mb-4">Blok A2</div>
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-[var(--neutral-100)] flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📡</span>
                                </div>
                                <p className="text-sm text-[var(--neutral-600)]">
                                    Pasang sensor untuk mengaktifkan kontrol pompa
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat */}
                    <div className="lg:col-span-3 bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-[var(--neutral-200)]">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="font-semibold text-[var(--neutral-900)]">Riwayat Aktivasi</h3>
                                <select className="px-3 py-1.5 text-sm border border-[var(--neutral-300)] rounded-lg">
                                    <option>Semua Mode</option>
                                    <option>Manual</option>
                                    <option>Auto</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--neutral-50)] text-xs font-semibold text-[var(--neutral-700)]">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Waktu</th>
                                        <th className="px-4 py-3 text-left">Blok</th>
                                        <th className="px-4 py-3 text-left">Mode</th>
                                        <th className="px-4 py-3 text-left">Durasi</th>
                                        <th className="px-4 py-3 text-left">Trigger</th>
                                        <th className="px-4 py-3 text-left">Oleh</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {pumpHistory.map((row, idx) => (
                                        <tr key={idx} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                            <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{row.waktu}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)]">{row.blok}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    row.mode.startsWith('Manual')
                                                        ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                                                        : 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                }`}>
                                                    {row.mode}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)] font-mono text-xs">{row.durasi}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-600)] text-xs">{row.trigger}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-900)]">{row.oleh}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-2">Konfirmasi Kontrol Pompa</h3>
                        <p className="text-sm text-[var(--neutral-600)] mb-6">
                            Yakin ingin {pumpOn ? 'mematikan' : 'menyalakan'} pompa Blok A1 secara manual?
                            Aksi ini akan tercatat di log aktivitas dengan nama Anda.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 bg-white border border-[var(--neutral-300)] rounded-lg font-medium hover:bg-[var(--neutral-50)]"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    setPumpOn(!pumpOn);
                                    setShowConfirm(false);
                                }}
                                className={`flex-1 py-3 rounded-lg font-medium text-white ${
                                    pumpOn
                                        ? 'bg-[var(--danger)] hover:bg-[var(--danger)]/90'
                                        : 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)]'
                                }`}
                            >
                                Ya, {pumpOn ? 'Matikan' : 'Nyalakan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
