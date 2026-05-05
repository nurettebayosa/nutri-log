import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function MaintenanceJournal({ blocks = [], entries = [], filters = {} }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'fertigasi',
        title: '',
        description: '',
        occurred_at: new Date().toISOString().slice(0, 16),
        block_ids: [],
    });

    const categories = [
        { id: 'fertigasi', label: 'Pemupukan / Fertigasi', icon: '💧' },
        { id: 'hama', label: 'Hama', icon: '🐛' },
        { id: 'penyakit', label: 'Penyakit', icon: '🤒' },
        { id: 'panen', label: 'Panen', icon: '🌾' },
        { id: 'pruning', label: 'Pruning', icon: '✂️' },
        { id: 'alat', label: 'Maintenance Alat', icon: '🔧' },
        { id: 'lainnya', label: 'Lainnya', icon: '📝' },
    ];

    const handleFilterChange = (key, value) => {
        router.get('/maintenance', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitNew = (e) => {
        e.preventDefault();
        post('/maintenance', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const toggleBlock = (id) => {
        setData('block_ids', data.block_ids.includes(id)
            ? data.block_ids.filter(b => b !== id)
            : [...data.block_ids, id]);
    };

    const handleDelete = (id) => {
        if (!confirm('Yakin ingin menghapus catatan ini?')) return;
        router.delete(`/maintenance/${id}`, { preserveScroll: true });
    };

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
                                    defaultValue={filters.search}
                                    onBlur={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
                                    placeholder="Cari keyword (tekan Enter)..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>
                        </div>

                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                            ))}
                        </select>

                        <select
                            value={filters.block_id}
                            onChange={(e) => handleFilterChange('block_id', e.target.value)}
                            className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                        >
                            <option value="">Semua Blok</option>
                            {blocks.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                            className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-12 text-center">
                            <p className="text-sm text-[var(--neutral-600)]">Belum ada catatan maintenance.</p>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div key={entry.id} className="bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-[var(--primary-700)]">
                                            {entry.user_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <span className="font-semibold text-[var(--neutral-900)]">{entry.user_name}</span>
                                            <span className="text-xs text-[var(--neutral-500)]">{entry.occurred_at}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <span className="px-2 py-0.5 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs rounded-full">
                                                {entry.category_label}
                                            </span>
                                            {entry.block_names.map((bn, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-700)] text-xs rounded-full">
                                                    {bn}
                                                </span>
                                            ))}
                                        </div>

                                        {entry.title && <p className="font-medium text-sm text-[var(--neutral-900)] mb-1">{entry.title}</p>}
                                        <p className="text-sm text-[var(--neutral-700)] mb-3">{entry.description}</p>

                                        {entry.photo_count > 0 && (
                                            <div className="text-xs text-[var(--neutral-500)] mb-3">
                                                📸 {entry.photo_count} foto terlampir
                                            </div>
                                        )}

                                        {entry.can_delete && (
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                className="text-xs text-[var(--danger)] hover:text-[var(--danger)]/80 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4">Tambah Catatan Baru</h3>

                        <form onSubmit={submitNew} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Tanggal & Waktu</label>
                                <input
                                    type="datetime-local"
                                    value={data.occurred_at}
                                    onChange={(e) => setData('occurred_at', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                                {errors.occurred_at && <p className="text-xs text-[var(--danger)] mt-1">{errors.occurred_at}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Kategori</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map(cat => (
                                        <label
                                            key={cat.id}
                                            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-[var(--neutral-50)] ${
                                                data.category === cat.id
                                                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                                                    : 'border-[var(--neutral-300)]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                checked={data.category === cat.id}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{cat.icon} {cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.category && <p className="text-xs text-[var(--danger)] mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Blok terkait</label>
                                <div className="flex flex-wrap gap-2">
                                    {blocks.map(b => (
                                        <label
                                            key={b.id}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer text-sm ${
                                                data.block_ids.includes(b.id)
                                                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                    : 'border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.block_ids.includes(b.id)}
                                                onChange={() => toggleBlock(b.id)}
                                                className="w-4 h-4"
                                            />
                                            {b.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Judul (opsional)</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Singkat dan jelas..."
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Deskripsi *</label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Sertakan detail apa yang dilihat dan tindakan yang diambil..."
                                    required
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                                />
                                {errors.description && <p className="text-xs text-[var(--danger)] mt-1">{errors.description}</p>}
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
                                    disabled={processing}
                                    className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
