import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Upload, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function BlockShow({ blockId }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const [activeTab, setActiveTab] = useState('ikhtisar');

    // Ambil block id dari URL kalau prop kosong (fallback)
    const id = blockId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'a1');

    const blockData = {
        a1: { nama: 'Blok A1', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi utara', polybag: 250, tanam: '13 April 2026', hst: 14, panen: '13 Mei 2026', sensor: true },
        a2: { nama: 'Blok A2', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi tengah', polybag: 250, tanam: '20 April 2026', hst: 7, panen: '20 Mei 2026', sensor: false },
        a3: { nama: 'Blok A3', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi selatan', polybag: 250, tanam: '06 April 2026', hst: 21, panen: '06 Mei 2026', sensor: false },
        b1: { nama: 'Blok B1', tanaman: 'Pakcoy', lokasi: 'Greenhouse 2', polybag: 200, tanam: '30 Maret 2026', hst: 28, panen: '30 April 2026', sensor: false },
    };

    const block = blockData[id] || blockData.a1;

    const tabs = [
        { id: 'ikhtisar', label: 'Ikhtisar' },
        { id: 'sensor', label: 'Sensor' },
        { id: 'siklus', label: 'Siklus Tanam' },
        { id: 'jadwal', label: 'Jadwal Fertigasi' },
        { id: 'maintenance', label: 'Maintenance Log' },
        ...(userRole === 'owner' ? [{ id: 'pengaturan', label: 'Pengaturan Blok' }] : []),
    ];

    return (
        <DashboardLayout>
            <Head title={`${block.nama} — Detail`} />
            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-[var(--neutral-600)]">
                    <Link href="/blok" className="hover:text-[var(--primary-500)]">Manajemen Blok</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[var(--neutral-900)]">{block.nama}</span>
                </div>

                {/* Header */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">
                                {block.nama} — {block.tanaman}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 text-sm rounded-full ${
                                    block.hst === 14 ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                }`}>
                                    HST {block.hst}{block.hst === 14 ? ' (Fase Rawan)' : ''}
                                </span>
                                <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 ${
                                    block.sensor ? 'bg-[var(--primary-50)] text-[var(--primary-700)]' : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${block.sensor ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-400)]'}`} />
                                    {block.sensor ? 'Sensor Aktif' : 'Sensor Belum Terpasang'}
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
                        <span>{block.lokasi}</span>
                        <span>·</span>
                        <span>{block.polybag} polybag</span>
                        <span>·</span>
                        <span>Tanam: {block.tanam}</span>
                        <span>·</span>
                        <span>Estimasi panen: {block.panen}</span>
                    </div>

                    {/* Photo */}
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
                                {block.sensor ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">TDS</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">1,080</div>
                                                    <div className="text-sm text-[var(--neutral-600)]">ppm</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Optimal</span>
                                            </div>
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">Kelembaban Media</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">68</div>
                                                    <div className="text-sm text-[var(--neutral-600)]">%</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Normal</span>
                                            </div>
                                            <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                                <div className="text-sm text-[var(--neutral-600)] mb-2">Tingkat Kekeruhan</div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <div className="text-3xl font-bold text-[var(--neutral-900)]">12</div>
                                                    <div className="text-sm text-[var(--neutral-600)]">NTU</div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Jernih</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Grafik 7 Hari Terakhir</h3>
                                            <div className="h-64 bg-[var(--neutral-50)] rounded-lg flex items-center justify-center">
                                                <div className="text-sm text-[var(--neutral-500)]">[Chart Placeholder]</div>
                                            </div>
                                        </div>
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
                                        <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)]">
                                            Pelajari cara pasang sensor
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'sensor' && (
                            <div className="text-center py-12">
                                <p className="text-sm text-[var(--neutral-600)]">Data sensor detail untuk {block.nama}</p>
                            </div>
                        )}

                        {activeTab === 'siklus' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--neutral-900)]">Siklus Tanam Saat Ini</h3>
                                <div className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[var(--neutral-600)]">Mulai Tanam:</span>
                                        <span className="text-sm font-medium text-[var(--neutral-900)]">{block.tanam}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[var(--neutral-600)]">Hari Setelah Tanam (HST):</span>
                                        <span className="text-sm font-medium text-[var(--neutral-900)]">{block.hst} hari</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--neutral-600)]">Estimasi Panen:</span>
                                        <span className="text-sm font-medium text-[var(--neutral-900)]">{block.panen}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'jadwal' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Jadwal fertigasi spesifik untuk {block.nama}]
                            </div>
                        )}

                        {activeTab === 'maintenance' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Maintenance log spesifik untuk {block.nama}]
                            </div>
                        )}

                        {activeTab === 'pengaturan' && userRole === 'owner' && (
                            <div className="text-center py-12 text-sm text-[var(--neutral-600)]">
                                [Form edit blok — owner only]
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
