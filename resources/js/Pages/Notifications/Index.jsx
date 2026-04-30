import { Head } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function NotificationsIndex() {
    const [activeTab, setActiveTab] = useState('semua');

    const notifications = [
        { id: 1, severity: 'kritis', title: 'TDS Kritis · Blok A1', description: 'Nilai TDS 870 ppm, di bawah threshold minimum 950', time: '14:32', blok: 'Blok A1', status: 'aktif' },
        { id: 2, severity: 'peringatan', title: 'Kelembaban Rendah · Blok A1', description: 'Moisture 48%, mendekati batas minimum 45%', time: '13:15', blok: 'Blok A1', status: 'aktif' },
        { id: 3, severity: 'info', title: 'Fase Rawan · Blok A1', description: 'Memasuki HST 14, fase rawan nutrisi & hama. Tingkatkan pengawasan.', time: '12:00', blok: 'Blok A1', status: 'diabaikan' },
        { id: 4, severity: 'info', title: 'Jadwal Fertigasi · Blok A1', description: 'Jadwal fertigasi 12:00 mendekati', time: '11:55', blok: 'Blok A1', status: 'selesai' },
        { id: 5, severity: 'kritis', title: 'ESP32 Disconnect · Blok A1', description: 'Koneksi terputus selama 5 menit, sudah reconnect', time: '03:14', blok: 'Blok A1', status: 'selesai' },
    ];

    const getSeverityIcon = (severity) => {
        if (severity === 'kritis') return '🔴';
        if (severity === 'peringatan') return '🟡';
        if (severity === 'info') return '🔵';
        return '⚪';
    };

    const getStatusPill = (status) => {
        if (status === 'aktif') return <span className="px-2 py-0.5 bg-[var(--danger)]/10 text-[var(--danger)] text-xs rounded-full">Aktif</span>;
        if (status === 'selesai') return <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Selesai</span>;
        if (status === 'diabaikan') return <span className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs rounded-full">Diabaikan</span>;
        return null;
    };

    return (
        <DashboardLayout>
            <Head title="Notifikasi & Alert" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Notifikasi & Alert</h1>
                        <p className="text-sm text-[var(--neutral-600)]">Pusat semua peringatan, info, dan event sistem</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] text-sm">
                        Tandai Semua Sudah Dibaca
                    </button>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="border-b border-[var(--neutral-200)] flex overflow-x-auto">
                        {[
                            { id: 'semua', label: 'Semua' },
                            { id: 'aktif', label: 'Aktif' },
                            { id: 'selesai', label: 'Selesai' },
                            { id: 'diabaikan', label: 'Diabaikan' },
                        ].map((tab) => (
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

                    {/* Filters */}
                    <div className="p-4 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                        <div className="flex flex-wrap items-center gap-3">
                            <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg">
                                <option>Semua Severity</option>
                                <option>Kritis</option>
                                <option>Peringatan</option>
                                <option>Info</option>
                            </select>
                            <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg">
                                <option>Semua Blok</option>
                                <option>Blok A1</option>
                                <option>Blok A2</option>
                                <option>Blok A3</option>
                                <option>Blok B1</option>
                            </select>
                            <input type="date" className="px-3 py-2 text-sm border border-[var(--neutral-300)] bg-white rounded-lg" />
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        {notifications
                            .filter((n) => activeTab === 'semua' || n.status === activeTab)
                            .map((notif) => (
                                <div key={notif.id} className="p-5 border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)] cursor-pointer">
                                    <div className="flex items-start gap-4">
                                        <div className="text-2xl flex-shrink-0">{getSeverityIcon(notif.severity)}</div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">{notif.title}</h3>
                                                    <p className="text-sm text-[var(--neutral-700)]">{notif.description}</p>
                                                </div>
                                                {getStatusPill(notif.status)}
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)] flex-wrap">
                                                <span>{notif.time}</span>
                                                <span className="px-2 py-0.5 bg-[var(--neutral-100)] rounded-full">{notif.blok}</span>
                                            </div>

                                            {notif.status === 'aktif' && (
                                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                    <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                                        Lihat Detail
                                                    </button>
                                                    <button className="px-3 py-1.5 text-xs bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]">
                                                        Tandai Selesai
                                                    </button>
                                                    <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] text-[var(--neutral-600)] rounded-lg hover:bg-[var(--neutral-50)]">
                                                        Abaikan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
