import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function MaintenanceJournal() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const [showModal, setShowModal] = useState(false);

    const entries = [
        {
            tanggal: '26/04 12:14',
            penulis: 'Pak Tedi',
            kategori: 'Pemupukan / Fertigasi',
            blok: ['Blok A1'],
            deskripsi: 'Fertigasi siang dilakukan, ppm aktual terbaca 1,085. Target 1,100. Sedikit di bawah target tapi masih dalam toleransi.',
            foto: false,
        },
        {
            tanggal: '26/04 09:30',
            penulis: 'Pak Tedi',
            kategori: 'Hama',
            blok: ['Blok B1'],
            deskripsi: 'Ditemukan kutu daun (aphid) di 3 polybag sisi timur. Sudah disemprot neem oil. Perlu monitor 3 hari ke depan.',
            foto: true,
        },
        {
            tanggal: '25/04 06:00',
            penulis: 'Pak Kiki',
            kategori: 'Panen',
            blok: ['Blok C1'],
            deskripsi: 'Panen pakcoy siklus 2026-03 selesai. Total 18 kg dari 250 polybag. Kualitas A: daun besar, tidak bolong-bolong. Sudah masuk kontainer pengiriman ke Hypermart.',
            foto: false,
        },
        {
            tanggal: '25/04 14:00',
            penulis: 'Pak Tedi',
            kategori: 'Pruning',
            blok: ['Blok A2'],
            deskripsi: 'Pruning daun bawah 50 polybag, membersihkan daun yang menguning di pinggir.',
            foto: false,
        },
    ];

    const categories = [
        { id: 'pemupukan', label: 'Pemupukan / Fertigasi', icon: '💧' },
        { id: 'hama', label: 'Hama', icon: '🐛' },
        { id: 'penyakit', label: 'Penyakit', icon: '🤒' },
        { id: 'panen', label: 'Panen', icon: '🌾' },
        { id: 'pruning', label: 'Pruning', icon: '✂️' },
        { id: 'alat', label: 'Maintenance Alat', icon: '🔧' },
        { id: 'lainnya', label: 'Lainnya', icon: '📝' },
    ];

    return (
        <DashboardLayout>
            <Head title="Maintenance Journal" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Maintenance Journal</h1>
                        <p className="text-sm text-[var(--neutral-600)]">
                            Catatan harian operasional kebun dengan kategori, foto, dan tag blok
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Catatan
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
                                <input
                                    type="text"
                                    placeholder="Cari keyword..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>
                        </div>

                        <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg">
                            <option>Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>

                        <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg">
                            <option>Semua Blok</option>
                            <option>Blok A1</option>
                            <option>Blok A2</option>
                            <option>Blok A3</option>
                            <option>Blok B1</option>
                        </select>

                        <input type="date" className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                    </div>
                </div>

                {/* Timeline View */}
                <div className="space-y-4">
                    {entries.map((entry, idx) => (
                        <div key={idx} className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-semibold text-[var(--primary-700)]">
                                        {entry.penulis.split(' ').map((n) => n[0]).join('')}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <span className="font-semibold text-[var(--neutral-900)]">{entry.penulis}</span>
                                                <span className="text-xs text-[var(--neutral-500)]">{entry.tanggal}</span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs rounded-full">
                                                    {entry.kategori}
                                                </span>
                                                {entry.blok.map((b) => (
                                                    <span key={b} className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-700)] text-xs rounded-full">
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-[var(--neutral-700)] mb-3">{entry.deskripsi}</p>

                                    {entry.foto && (
                                        <div className="flex gap-2 mb-3">
                                            <div className="w-20 h-20 bg-[var(--neutral-100)] rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-[var(--neutral-500)]">[Foto]</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button className="text-xs text-[var(--neutral-600)] hover:text-[var(--primary-500)]">
                                            Edit
                                        </button>
                                        {(userRole === 'owner' || entry.penulis === 'Pak Tedi') && (
                                            <button className="text-xs text-[var(--danger)] hover:text-[var(--danger)]/80">
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4">Tambah Catatan Baru</h3>

                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                            }}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Tanggal</label>
                                    <input type="date" defaultValue="2026-04-30" className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Waktu</label>
                                    <input type="time" defaultValue="08:14" className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Kategori</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]"
                                        >
                                            <input type="radio" name="kategori" className="w-4 h-4" />
                                            <span className="text-sm">
                                                {cat.icon} {cat.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Blok terkait</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Blok A1', 'Blok A2', 'Blok A3', 'Blok B1'].map((b) => (
                                        <label
                                            key={b}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--neutral-300)] rounded-full cursor-pointer hover:bg-[var(--neutral-50)] text-sm"
                                        >
                                            <input type="checkbox" className="w-4 h-4" />
                                            {b}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Deskripsi</label>
                                <textarea
                                    rows={4}
                                    placeholder="Sertakan detail apa yang dilihat dan tindakan yang diambil..."
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Foto (max 5)</label>
                                <div className="border-2 border-dashed border-[var(--neutral-300)] rounded-lg p-6 text-center hover:bg-[var(--neutral-50)] cursor-pointer">
                                    <div className="text-sm text-[var(--neutral-600)]">
                                        Drag & drop foto di sini atau klik untuk browse
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
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
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
