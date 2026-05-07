import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Grid3x3, List, Search, Trash2, Pencil, Image as ImageIcon, X } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const emptyBlockForm = {
    code: '',
    name: '',
    plant_type: 'Pakcoy',
    location: '',
    polybag_count: '',
    notes: '',
    has_sensor: false,
    device_id: '',
    device_token: '',
    photo: null,
};

export default function BlocksIndex({ blocks = [], flash = {} }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role ?? 'karyawan';
    const isOwner = userRole === 'owner';

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);

    const addForm = useForm(emptyBlockForm);

    const editForm = useForm({
        _method: 'patch',
        ...emptyBlockForm,
        remove_photo: false,
    });

    const getHstBadge = (block) => {
        if (block.status_label === 'Siap Panen') return 'bg-[var(--success)]/10 text-[var(--success)]';
        if (block.status_label === 'Tumbuh (Fase Rawan)') return 'bg-[var(--danger)]/10 text-[var(--danger)]';
        return 'bg-[var(--neutral-100)] text-[var(--neutral-600)]';
    };

    const openAdd = () => {
        addForm.reset();
        addForm.clearErrors();
        setShowAddModal(true);
    };

    const closeAdd = () => {
        setShowAddModal(false);
        addForm.reset();
        addForm.clearErrors();
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post('/blok', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeAdd(),
        });
    };

    const openEdit = (block) => {
        editForm.clearErrors();
        editForm.setData({
            _method: 'patch',
            code: block.code ?? '',
            name: block.name ?? '',
            plant_type: block.plant_type ?? 'Pakcoy',
            location: block.location ?? '',
            polybag_count: block.polybag_count ?? '',
            notes: block.notes ?? '',
            has_sensor: !!block.has_sensor,
            device_id: block.device_id ?? '',
            device_token: '',
            photo: null,
            remove_photo: false,
        });
        setEditingBlock(block);
    };

    const closeEdit = () => {
        setEditingBlock(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.post(`/blok/${editingBlock.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeEdit(),
        });
    };

    const handleDelete = (block) => {
        const msg =
            `Yakin ingin menghapus blok ${block.code} — ${block.name}?\n\n` +
            `PERINGATAN: Semua data terkait blok ini (siklus tanam, riwayat sensor, threshold, jadwal & log fertigasi, riwayat pompa) akan IKUT TERHAPUS dan tidak bisa dikembalikan.`;
        if (!confirm(msg)) return;
        router.delete(`/blok/${block.id}`, { preserveScroll: true });
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Blok" />
            <div className="space-y-6">
                {flash?.success && (
                    <div className="bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] px-4 py-3 rounded-lg text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Manajemen Blok</h1>
                        <p className="text-sm text-[var(--neutral-600)]">Daftar semua blok dengan kemampuan CRUD</p>
                    </div>
                    {isOwner && (
                        <button
                            onClick={openAdd}
                            className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Blok
                        </button>
                    )}
                </div>

                {/* Filter UI — visual only, akan di-wire-up di follow-up berikutnya */}
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

                {blocks.length === 0 ? (
                    <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-12 text-center">
                        <p className="text-sm text-[var(--neutral-600)] mb-4">Belum ada blok terdaftar.</p>
                        {isOwner && (
                            <button
                                onClick={openAdd}
                                className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Blok Pertama
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {blocks.map((block) => (
                            <div key={block.id} className="bg-white border border-[var(--neutral-200)] rounded-xl p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-[var(--neutral-900)] mb-1 truncate">
                                            {block.name} — {block.plant_type}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {block.hst != null && (
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getHstBadge(block)}`}>
                                                    HST {block.hst} ({block.status_label})
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                                                block.has_sensor
                                                    ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                    : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    block.has_sensor ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-400)]'
                                                }`} />
                                                {block.has_sensor ? 'Sensor Aktif' : 'Belum Terpasang'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-32 bg-[var(--neutral-100)] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                    {block.photo_url ? (
                                        <img src={block.photo_url} alt={block.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-xs text-[var(--neutral-500)] flex flex-col items-center gap-1">
                                            <ImageIcon className="w-6 h-6 opacity-40" />
                                            <span>Belum ada foto</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[var(--neutral-600)]">Lokasi:</span>
                                        <span className="text-[var(--neutral-900)] font-medium text-right truncate">{block.location ?? '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[var(--neutral-600)]">Polybag:</span>
                                        <span className="text-[var(--neutral-900)] font-medium">{block.polybag_count ?? '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[var(--neutral-600)]">Status:</span>
                                        <span className="text-[var(--neutral-900)] font-medium">{block.status_label}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/blok/${block.id}`}
                                        className="flex-1 py-2 text-sm text-center text-[var(--primary-500)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
                                    >
                                        Detail
                                    </Link>
                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={() => openEdit(block)}
                                                className="px-3 py-2 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center gap-1"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(block)}
                                                className="px-3 py-2 text-sm bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Hapus
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <BlockFormModal
                    title="Tambah Blok Baru"
                    submitLabel="Tambah"
                    form={addForm}
                    onSubmit={submitAdd}
                    onCancel={closeAdd}
                    formKey="add"
                />
            )}

            {editingBlock && (
                <BlockFormModal
                    title={`Edit Blok ${editingBlock.code}`}
                    submitLabel="Simpan Perubahan"
                    form={editForm}
                    onSubmit={submitEdit}
                    onCancel={closeEdit}
                    existingPhotoUrl={editingBlock.photo_url}
                    isEdit
                    formKey="edit"
                />
            )}
        </DashboardLayout>
    );
}

function BlockFormModal({ title, submitLabel, form, onSubmit, onCancel, existingPhotoUrl, isEdit = false, formKey = 'form' }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--neutral-200)] flex-shrink-0">
                    <h3 className="text-lg font-bold text-[var(--neutral-900)]">{title}</h3>
                    <button type="button" onClick={onCancel} className="p-1 hover:bg-[var(--neutral-100)] rounded-lg">
                        <X className="w-5 h-5 text-[var(--neutral-600)]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Kode Blok *</label>
                            <input
                                type="text"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value)}
                                required
                                maxLength={20}
                                placeholder="Contoh: A1, B2"
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {form.errors.code && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Nama Blok *</label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                                maxLength={100}
                                placeholder="Contoh: Blok A - Utara"
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {form.errors.name && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Jenis Tanaman</label>
                            <input
                                type="text"
                                value={form.data.plant_type}
                                onChange={(e) => form.setData('plant_type', e.target.value)}
                                maxLength={50}
                                placeholder="Pakcoy"
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {form.errors.plant_type && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.plant_type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Lokasi</label>
                            <input
                                type="text"
                                value={form.data.location}
                                onChange={(e) => form.setData('location', e.target.value)}
                                maxLength={150}
                                placeholder="Contoh: Greenhouse 1"
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {form.errors.location && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.location}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Jumlah Polybag</label>
                            <input
                                type="number"
                                value={form.data.polybag_count}
                                onChange={(e) => form.setData('polybag_count', e.target.value)}
                                min={0}
                                max={99999}
                                placeholder="500"
                                className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {form.errors.polybag_count && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.polybag_count}</p>}
                        </div>

                        <div className="flex items-center gap-2 md:pt-7">
                            <input
                                id={`has_sensor_${formKey}`}
                                type="checkbox"
                                checked={!!form.data.has_sensor}
                                onChange={(e) => form.setData('has_sensor', e.target.checked)}
                                className="w-4 h-4 rounded border-[var(--neutral-300)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                            />
                            <label htmlFor={`has_sensor_${formKey}`} className="text-sm text-[var(--neutral-700)]">
                                Sensor ESP32 sudah terpasang
                            </label>
                        </div>
                    </div>

                    {form.data.has_sensor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-200)]">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Device ID (ESP32)</label>
                                <input
                                    type="text"
                                    value={form.data.device_id}
                                    onChange={(e) => form.setData('device_id', e.target.value)}
                                    maxLength={50}
                                    placeholder="ESP32_A1_001"
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] font-mono"
                                />
                                {form.errors.device_id && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.device_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">
                                    Device Token {isEdit && <span className="text-[var(--neutral-500)] font-normal">(opsional)</span>}
                                </label>
                                <input
                                    type="text"
                                    value={form.data.device_token}
                                    onChange={(e) => form.setData('device_token', e.target.value)}
                                    maxLength={100}
                                    placeholder={isEdit ? 'Kosongkan untuk tidak mengubah' : 'Token auth ESP32'}
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] font-mono"
                                />
                                {form.errors.device_token && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.device_token}</p>}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Catatan</label>
                        <textarea
                            value={form.data.notes ?? ''}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                            maxLength={5000}
                            placeholder="Catatan tambahan tentang blok ini (opsional)"
                            className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-y"
                        />
                        {form.errors.notes && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.notes}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Foto Blok</label>
                        {isEdit && existingPhotoUrl && !form.data.remove_photo && !form.data.photo && (
                            <div className="mb-2 relative inline-block">
                                <img src={existingPhotoUrl} alt="Foto saat ini" className="h-24 rounded-lg border border-[var(--neutral-200)]" />
                                <button
                                    type="button"
                                    onClick={() => form.setData('remove_photo', true)}
                                    className="absolute -top-2 -right-2 p-1 bg-[var(--danger)] text-white rounded-full hover:opacity-90"
                                    title="Hapus foto"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {isEdit && form.data.remove_photo && (
                            <p className="text-xs text-[var(--danger)] mb-2">
                                Foto akan dihapus saat disimpan.{' '}
                                <button type="button" onClick={() => form.setData('remove_photo', false)} className="underline">
                                    Batalkan
                                </button>
                            </p>
                        )}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => form.setData('photo', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-[var(--neutral-700)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[var(--primary-50)] file:text-[var(--primary-700)] hover:file:bg-[var(--primary-100)]"
                        />
                        <p className="text-xs text-[var(--neutral-500)] mt-1">JPG/PNG/WEBP, maks 2 MB.</p>
                        {form.errors.photo && <p className="text-xs text-[var(--danger)] mt-1">{form.errors.photo}</p>}
                    </div>
                </form>

                <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--neutral-200)] flex-shrink-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-white border border-[var(--neutral-300)] rounded-lg font-medium hover:bg-[var(--neutral-50)]"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        disabled={form.processing}
                        className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] disabled:opacity-50"
                    >
                        {form.processing ? 'Menyimpan...' : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
