import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Grid3x3, List, Search } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function BlocksIndex() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';

    const blocks = [
        { id: 'a1', nama: 'Blok A1', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi utara', polybag: 250, hst: 14, sensor: true, status: 'Tumbuh' },
        { id: 'a2', nama: 'Blok A2', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi tengah', polybag: 250, hst: 7, sensor: false, status: 'Tumbuh' },
        { id: 'a3', nama: 'Blok A3', tanaman: 'Pakcoy', lokasi: 'Greenhouse 1 sisi selatan', polybag: 250, hst: 21, sensor: false, status: 'Tumbuh' },
        { id: 'b1', nama: 'Blok B1', tanaman: 'Pakcoy', lokasi: 'Greenhouse 2', polybag: 200, hst: 28, sensor: false, status: 'Siap Panen' },
        { id: 'b2', nama: 'Blok B2', tanaman: 'Pakcoy', lokasi: 'Greenhouse 2', polybag: 200, hst: null, sensor: false, status: 'Idle' },
        { id: 'c1', nama: 'Blok C1', tanaman: 'Pakcoy', lokasi: 'Greenhouse 3', polybag: 300, hst: 5, sensor: false, status: 'Tumbuh' },
    ];

    const getHstBadge = (block) => {
        if (block.status === 'Siap Panen') return 'bg-[var(--success)]/10 text-[var(--success)]';
        if (block.hst === 14) return 'bg-[var(--danger)]/10 text-[var(--danger)]';
        return 'bg-[var(--neutral-100)] text-[var(--neutral-600)]';
    };

    const getHstLabel = (block) => {
        if (block.status === 'Siap Panen') return ' (Siap Panen)';
        if (block.hst === 14) return ' (Fase Rawan)';
        return '';
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Blok" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Manajemen Blok</h1>
                        <p className="text-sm text-[var(--neutral-600)]">Daftar semua blok dengan kemampuan CRUD</p>
                    </div>
                    {userRole === 'owner' && (
                        <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Blok
                        </button>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
                                <input
                                    type="text"
                                    placeholder="Cari nama blok..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>
                        </div>

                        <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                            <option>Semua Status</option>
                            <option>Sensor Aktif</option>
                            <option>Belum Terpasang</option>
                            <option>Siap Panen</option>
                            <option>Idle</option>
                        </select>

                        <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                            <option>Sort: Terbaru</option>
                            <option>Sort: Nama</option>
                            <option>Sort: HST</option>
                        </select>

                        <div className="flex items-center gap-1 border border-[var(--neutral-300)] rounded-lg p-1">
                            <button className="p-1.5 bg-[var(--primary-500)] text-white rounded">
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] rounded">
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            className="bg-white border border-[var(--neutral-200)] rounded-xl p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--neutral-900)] mb-1">
                                        {block.nama} — {block.tanaman}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {block.hst && (
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getHstBadge(block)}`}>
                                                HST {block.hst}{getHstLabel(block)}
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                                                block.sensor
                                                    ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                    : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                            }`}
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    block.sensor ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-400)]'
                                                }`}
                                            />
                                            {block.sensor ? 'Sensor Aktif' : 'Belum Terpasang'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-32 bg-[var(--neutral-100)] rounded-lg mb-3 flex items-center justify-center">
                                <div className="text-center text-xs text-[var(--neutral-500)]">[Foto blok — placeholder]</div>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--neutral-600)]">Lokasi:</span>
                                    <span className="text-[var(--neutral-900)] font-medium text-right">{block.lokasi}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--neutral-600)]">Polybag:</span>
                                    <span className="text-[var(--neutral-900)] font-medium">{block.polybag}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--neutral-600)]">Status:</span>
                                    <span className="text-[var(--neutral-900)] font-medium">{block.status}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/blok/${block.id}`}
                                    className="flex-1 py-2 text-sm text-center text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                                >
                                    Detail
                                </Link>
                                {userRole === 'owner' && (
                                    <>
                                        <button className="px-3 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                            Edit
                                        </button>
                                        <button className="px-3 py-2 text-sm bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5">
                                            Hapus
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
