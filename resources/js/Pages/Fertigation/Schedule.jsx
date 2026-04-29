import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, Clock, X } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function FertigationSchedule() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const [activeTab, setActiveTab] = useState('hari-ini');
    const [showModal, setShowModal] = useState(false);

    const schedules = [
        { waktu: '07:00', blok: 'Blok A1', target: 1100, aktual: 1085, status: 'selesai', oleh: 'Pak Tedi', waktuSelesai: '07:14' },
        { waktu: '12:00', blok: 'Blok A1', target: 1100, aktual: null, status: 'pending', oleh: null, waktuSelesai: null },
        { waktu: '17:00', blok: 'Blok A1', target: 1100, aktual: null, status: 'belum-waktunya', oleh: null, waktuSelesai: null },
    ];

    const tabs = [
        { id: 'hari-ini', label: 'Hari Ini' },
        { id: 'kalender', label: 'Kalender Mingguan' },
        ...(userRole === 'owner' ? [{ id: 'pengaturan', label: 'Pengaturan Jadwal' }] : []),
    ];

    return (
        <DashboardLayout>
            <Head title="Jadwal Fertigasi" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Jadwal Fertigasi</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Pengaturan jadwal pemberian nutrisi 3x sehari + checklist pelaksanaan
                    </p>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="border-b border-[var(--neutral-200)] flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-[var(--primary-500)] text-[var(--primary-500)]'
                                        : 'border-transparent text-[var(--neutral-600)] hover:text-[var(--neutral-900)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'hari-ini' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <h3 className="font-semibold text-[var(--neutral-900)]">Senin, 27 April 2026</h3>
                                    <button className="px-3 py-1.5 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                        Semua Blok
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {schedules.map((schedule, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${
                                                schedule.status === 'selesai'
                                                    ? 'bg-[var(--success)]/5 border-[var(--success)]/20'
                                                    : schedule.status === 'pending'
                                                    ? 'bg-[var(--warning)]/5 border-[var(--warning)]/20'
                                                    : 'bg-[var(--neutral-50)] border-[var(--neutral-200)]'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3 flex-wrap">
                                                {schedule.status === 'selesai' ? (
                                                    <CheckCircle className="w-6 h-6 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                                ) : schedule.status === 'pending' ? (
                                                    <Clock className="w-6 h-6 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <Clock className="w-6 h-6 text-[var(--neutral-400)] flex-shrink-0 mt-0.5" />
                                                )}

                                                <div className="flex-1 min-w-[200px]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-lg font-bold text-[var(--neutral-900)]">{schedule.waktu}</span>
                                                        <span className="text-sm text-[var(--neutral-600)]">{schedule.blok}</span>
                                                    </div>

                                                    <div className="text-sm text-[var(--neutral-700)] mb-1">
                                                        Target ppm: <span className="font-semibold">{schedule.target}</span>
                                                        {schedule.aktual && (
                                                            <> · Aktual: <span className="font-semibold">{schedule.aktual} ppm</span></>
                                                        )}
                                                    </div>

                                                    {schedule.status === 'selesai' && (
                                                        <div className="text-sm text-[var(--success)]">
                                                            ✓ Selesai oleh {schedule.oleh} · {schedule.waktuSelesai}
                                                        </div>
                                                    )}
                                                    {schedule.status === 'pending' && (
                                                        <div className="text-sm text-[var(--warning)]">⏰ Belum dilakukan</div>
                                                    )}
                                                    {schedule.status === 'belum-waktunya' && (
                                                        <div className="text-sm text-[var(--neutral-500)]">🌙 Belum waktunya</div>
                                                    )}
                                                </div>

                                                {schedule.status === 'pending' && (
                                                    <button
                                                        onClick={() => setShowModal(true)}
                                                        className="px-4 py-2 bg-[var(--primary-500)] text-white text-sm rounded-lg hover:bg-[var(--primary-600)] whitespace-nowrap"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'kalender' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                        <div key={day} className="py-2 text-xs font-semibold text-[var(--neutral-600)]">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                    [Kalender grid dengan status fertigasi per hari]
                                </div>
                            </div>
                        )}

                        {activeTab === 'pengaturan' && userRole === 'owner' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--neutral-900)]">Template Jadwal per Blok</h3>
                                <div className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                        <span className="font-medium text-[var(--neutral-900)]">Blok A1</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-[var(--neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-500)]"></div>
                                            <span className="ms-3 text-sm font-medium text-[var(--neutral-700)]">Aktifkan</span>
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { waktu: '07:00', target: 1100 },
                                            { waktu: '12:00', target: 1100 },
                                            { waktu: '17:00', target: 1100 },
                                        ].map((slot, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 flex-wrap">
                                                <input
                                                    type="time"
                                                    defaultValue={slot.waktu}
                                                    className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                                />
                                                <input
                                                    type="number"
                                                    defaultValue={slot.target}
                                                    className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg w-32"
                                                />
                                                <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                                                <button className="ml-auto p-2 text-[var(--danger)] hover:bg-[var(--danger)]/5 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-3 px-4 py-2 text-sm bg-white border border-[var(--primary-500)] text-[var(--primary-500)] rounded-lg hover:bg-[var(--primary-50)]">
                                        + Tambah Slot
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4">Tandai Fertigasi Selesai</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">
                                    PPM Aktual (dari TDS pen manual)
                                </label>
                                <input
                                    type="number"
                                    placeholder="1085"
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-white border border-[var(--neutral-300)] rounded-lg font-medium hover:bg-[var(--neutral-50)]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]"
                                >
                                    Catat & Selesai
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
