import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, Clock, X } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function FertigationSchedule({ logs_today = [], schedules = [] }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const [activeTab, setActiveTab] = useState('hari-ini');
    const [activeLogId, setActiveLogId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        actual_ppm: '',
        notes: '',
    });

    const openModal = (logId) => {
        setActiveLogId(logId);
        reset();
    };

    const closeModal = () => {
        setActiveLogId(null);
        reset();
    };

    const submitMarkDone = (e) => {
        e.preventDefault();
        post(`/jadwal-fertigasi/${activeLogId}/done`, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const tabs = [
        { id: 'hari-ini', label: 'Hari Ini' },
        { id: 'kalender', label: 'Kalender Mingguan' },
        ...(userRole === 'owner' ? [{ id: 'pengaturan', label: 'Pengaturan Jadwal' }] : []),
    ];

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

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
                                <h3 className="font-semibold text-[var(--neutral-900)]">{today}</h3>

                                {logs_today.length === 0 ? (
                                    <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                        Tidak ada jadwal fertigasi hari ini.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {logs_today.map((log) => (
                                            <div
                                                key={log.id}
                                                className={`p-4 rounded-xl border ${
                                                    log.status === 'done'
                                                        ? 'bg-[var(--success)]/5 border-[var(--success)]/20'
                                                        : log.status === 'pending'
                                                        ? 'bg-[var(--warning)]/5 border-[var(--warning)]/20'
                                                        : 'bg-[var(--neutral-50)] border-[var(--neutral-200)]'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3 flex-wrap">
                                                    {log.status === 'done' ? (
                                                        <CheckCircle className="w-6 h-6 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                                    ) : log.status === 'pending' ? (
                                                        <Clock className="w-6 h-6 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Clock className="w-6 h-6 text-[var(--neutral-400)] flex-shrink-0 mt-0.5" />
                                                    )}

                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-lg font-bold text-[var(--neutral-900)]">{log.time}</span>
                                                            <span className="text-sm text-[var(--neutral-600)]">{log.block_name}</span>
                                                        </div>

                                                        <div className="text-sm text-[var(--neutral-700)] mb-1">
                                                            Target ppm: <span className="font-semibold">{log.target_ppm}</span>
                                                            {log.actual_ppm && (
                                                                <> · Aktual: <span className="font-semibold">{log.actual_ppm} ppm</span></>
                                                            )}
                                                        </div>

                                                        {log.status === 'done' && log.executor_name && (
                                                            <div className="text-sm text-[var(--success)]">
                                                                ✓ Selesai oleh {log.executor_name} · {log.executed_at}
                                                            </div>
                                                        )}
                                                        {log.status === 'pending' && (
                                                            <div className="text-sm text-[var(--warning)]">⏰ Belum dilakukan</div>
                                                        )}
                                                        {log.status === 'belum-waktunya' && (
                                                            <div className="text-sm text-[var(--neutral-500)]">🌙 Belum waktunya</div>
                                                        )}
                                                    </div>

                                                    {log.status === 'pending' && (
                                                        <button
                                                            onClick={() => openModal(log.id)}
                                                            className="px-4 py-2 bg-[var(--primary-500)] text-white text-sm rounded-lg hover:bg-[var(--primary-600)] whitespace-nowrap"
                                                        >
                                                            Tandai Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    [Kalender grid — soon]
                                </div>
                            </div>
                        )}

                        {activeTab === 'pengaturan' && userRole === 'owner' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--neutral-900)]">Template Jadwal per Blok</h3>

                                {schedules.length === 0 ? (
                                    <p className="text-sm text-[var(--neutral-500)] text-center py-8">
                                        Belum ada template jadwal.
                                    </p>
                                ) : (
                                    schedules.map((tpl) => (
                                        <div key={tpl.block_id} className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                                <span className="font-medium text-[var(--neutral-900)]">{tpl.block_name}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked={tpl.is_active} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-[var(--neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-500)]"></div>
                                                    <span className="ms-3 text-sm font-medium text-[var(--neutral-700)]">Aktifkan</span>
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                {tpl.slots.map((slot) => (
                                                    <div key={slot.id} className="flex items-center gap-3 bg-white rounded-lg p-3 flex-wrap">
                                                        <input
                                                            type="time"
                                                            defaultValue={slot.time}
                                                            className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                                            disabled
                                                        />
                                                        <input
                                                            type="number"
                                                            defaultValue={slot.target_ppm}
                                                            className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg w-32"
                                                            disabled
                                                        />
                                                        <span className="text-sm text-[var(--neutral-600)]">ppm</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <p className="text-xs text-[var(--neutral-500)] italic">
                                    Edit template akan diaktifkan di iterasi selanjutnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Tandai Selesai */}
            {activeLogId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4">Tandai Fertigasi Selesai</h3>
                        <form onSubmit={submitMarkDone} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">
                                    PPM Aktual (dari TDS pen manual) *
                                </label>
                                <input
                                    type="number"
                                    value={data.actual_ppm}
                                    onChange={(e) => setData('actual_ppm', e.target.value)}
                                    placeholder="1085"
                                    required
                                    autoFocus
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                                {errors.actual_ppm && <p className="text-xs text-[var(--danger)] mt-1">{errors.actual_ppm}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Catatan (opsional)</label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-white border border-[var(--neutral-300)] rounded-lg font-medium hover:bg-[var(--neutral-50)]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Catat & Selesai'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
