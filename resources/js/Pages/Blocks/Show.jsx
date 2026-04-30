import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Upload, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function BlockShow({ block }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const [activeTab, setActiveTab] = useState('ikhtisar');

    const tabs = [
        { id: 'ikhtisar', label: 'Ikhtisar' },
        { id: 'sensor', label: 'Sensor' },
        { id: 'siklus', label: 'Siklus Tanam' },
        { id: 'jadwal', label: 'Jadwal Fertigasi' },
        { id: 'maintenance', label: 'Maintenance Log' },
        ...(userRole === 'owner' ? [{ id: 'pengaturan', label: 'Pengaturan Blok' }] : []),
    ];

    const isFaseRawan = block.hst != null && block.hst >= 14 && block.hst <= 21;
    const isSiapPanen = block.hst != null && block.hst >= 28;

    return (
        <DashboardLayout>
            <Head title={`${block.name} — Detail`} />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-[var(--neutral-600)]">
                    <Link href="/blok" className="hover:text-[var(--primary-500)]">Manajemen Blok</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[var(--neutral-900)]">{block.name}</span>
                </div>

                {/* Header */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">
                                {block.name} — {block.plant_type}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                {block.hst != null && (
                                    <span className={`px-3 py-1 text-sm rounded-full ${
                                        isSiapPanen ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                                        isFaseRawan ? 'bg-[var(--danger)]/10 text-[var(--danger)]' :
                                        'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                    }`}>
                                        HST {block.hst}
                                        {isFaseRawan ? ' (Fase Rawan)' : isSiapPanen ? ' (Siap Panen)' : ''}
                                    </span>
                                )}
                                <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 ${
                                    block.has_sensor
                                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                        : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        block.has_sensor ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-400)]'
                                    }`} />
                                    {block.has_sensor ? 'Sensor Aktif' : 'Sensor Belum Terpasang'}
                                </span>
                            </div>
                        </div>
                        {userRole === 'owner' && (
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="px-4 py-2 bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[var(--neutral-600)] mb-4 flex-wrap">
                        <span>{block.location ?? '-'}</span>
                        <span>·</span>
                        <span>{block.polybag_count ?? '-'} polybag</span>
                        {block.start_date && (
                            <>
                                <span>·</span>
                                <span>Tanam: {block.start_date}</span>
                            </>
                        )}
                        {block.expected_harvest_date && (
                            <>
                                <span>·</span>
                                <span>Estimasi panen: {block.expected_harvest_date}</span>
                            </>
                        )}
                    </div>

                    <div className="h-48 bg-[var(--neutral-100)] rounded-lg flex flex-col items-center justify-center">
                        <div className="text-sm text-[var(--neutral-600)] mb-2">Belum ada foto</div>
                        {userRole === 'owner' && (
                            <button className="px-4 py-2 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Foto
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
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
                        {activeTab === 'ikhtisar' && (
                            <div className="space-y-6">
                                {block.has_sensor && (block.sensors.tds != null || block.sensors.moisture != null || block.sensors.turbidity != null) ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">TDS</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">
                                                        {block.sensors.tds != null ? Math.round(block.sensors.tds).toLocaleString('id-ID') : '—'}
                                                    </div>
                                                    <div className="text-sm text-[var(--neutral-600)]">ppm</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Optimal</span>
                                            </div>
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">Kelembaban Media</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">
                                                        {block.sensors.moisture != null ? Math.round(block.sensors.moisture) : '—'}
                                                    </div>
                                                    <div className="text-sm text-[var(--neutral-600)]">%</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Normal</span>
                                            </div>
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">Tingkat Kekeruhan</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">
                                                        {block.sensors.turbidity != null ? Math.round(block.sensors.turbidity) : '—'}
                                                    </div>
                                                    <div className="text-sm text-[var(--neutral-600)]">NTU</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Jernih</span>
                                            </div>
                                        </div>
                                        {block.sensors.last_update && (
                                            <p className="text-xs text-[var(--neutral-500)] text-center">
                                                Update terakhir: {block.sensors.last_update}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-[var(--neutral-100)] flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl">📡</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[var(--neutral-900)] mb-2">Blok ini belum dipasangi sensor</h3>
                                        <p className="text-sm text-[var(--neutral-600)] mb-4">
                                            Hubungi tim teknis untuk pemasangan, atau lihat panduan instalasi.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'siklus' && block.start_date && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--neutral-900)]">Siklus Tanam Saat Ini</h3>
                                <div className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg p-4 space-y-2">
                                    {block.cycle_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--neutral-600)]">Nomor Siklus:</span>
                                            <span className="text-sm font-medium text-[var(--neutral-900)]">{block.cycle_number}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--neutral-600)]">Mulai Tanam:</span>
                                        <span className="text-sm font-medium text-[var(--neutral-900)]">{block.start_date}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--neutral-600)]">HST:</span>
                                        <span className="text-sm font-medium text-[var(--neutral-900)]">{block.hst} hari</span>
                                    </div>
                                    {block.expected_harvest_date && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--neutral-600)]">Estimasi Panen:</span>
                                            <span className="text-sm font-medium text-[var(--neutral-900)]">{block.expected_harvest_date}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'sensor' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Tab sensor — akan dipasang di iterasi berikut]
                            </div>
                        )}
                        {activeTab === 'jadwal' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Jadwal fertigasi spesifik untuk {block.name} — soon]
                            </div>
                        )}
                        {activeTab === 'maintenance' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Maintenance log spesifik untuk {block.name} — soon]
                            </div>
                        )}
                        {activeTab === 'pengaturan' && userRole === 'owner' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Form edit blok — soon]
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
