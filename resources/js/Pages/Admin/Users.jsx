import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminUsers({ users = [], filters = {} }) {
    const [showAddModal, setShowAddModal] = useState(false);

    const addForm = useForm({
        name: '',
        email: '',
        wa_number: '',
        role: 'karyawan',
        password: '',
        password_confirmation: '',
    });

    const handleFilterChange = (key, value) => {
        router.get('/kelola-pengguna', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post('/kelola-pengguna', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            },
        });
    };

    const handleDelete = (user) => {
        if (!confirm(`Yakin ingin menghapus pengguna ${user.name}?`)) return;
        router.delete(`/kelola-pengguna/${user.id}`, { preserveScroll: true });
    };

    return (
        <DashboardLayout>
            <Head title="Kelola Pengguna" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Kelola Pengguna</h1>
                        <p className="text-sm text-[var(--neutral-600)]">CRUD karyawan + lihat status akses</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Pengguna
                    </button>
                </div>

                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--neutral-200)]">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
                                    <input
                                        type="text"
                                        defaultValue={filters.search}
                                        onBlur={(e) => handleFilterChange('search', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
                                        placeholder="Cari nama atau email (Enter)..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>
                            <select
                                value={filters.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                            >
                                <option value="">Semua Role</option>
                                <option value="owner">Owner</option>
                                <option value="karyawan">Karyawan</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--neutral-50)] text-xs font-semibold text-[var(--neutral-700)]">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nama</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-left">No. WA</th>
                                    <th className="px-4 py-3 text-left">Login Terakhir</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-[var(--neutral-500)]">
                                            Tidak ada pengguna ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-semibold text-[var(--primary-700)]">
                                                            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-[var(--neutral-900)]">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--neutral-700)]">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    user.role === 'Owner'
                                                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                                                        : 'bg-[var(--neutral-100)] text-[var(--neutral-700)]'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--neutral-700)]">{user.wa_number}</td>
                                            <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{user.last_login}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    user.is_active
                                                        ? 'bg-[var(--success)]/10 text-[var(--success)]'
                                                        : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                                }`}>
                                                    {user.status_label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        disabled
                                                        className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg opacity-50 cursor-not-allowed"
                                                        title="Edit segera hadir"
                                                    >
                                                        Edit
                                                    </button>
                                                    {user.role !== 'Owner' && (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            className="px-3 py-1.5 text-xs bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-4">Tambah Pengguna Baru</h3>

                        <form onSubmit={submitAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                                {addForm.errors.name && <p className="text-xs text-[var(--danger)] mt-1">{addForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={addForm.data.email}
                                    onChange={(e) => addForm.setData('email', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                                {addForm.errors.email && <p className="text-xs text-[var(--danger)] mt-1">{addForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">No. WhatsApp</label>
                                <input
                                    type="tel"
                                    value={addForm.data.wa_number}
                                    onChange={(e) => addForm.setData('wa_number', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Role *</label>
                                <select
                                    value={addForm.data.role}
                                    onChange={(e) => addForm.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                >
                                    <option value="karyawan">Karyawan</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Password *</label>
                                <input
                                    type="password"
                                    value={addForm.data.password}
                                    onChange={(e) => addForm.setData('password', e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                                {addForm.errors.password && <p className="text-xs text-[var(--danger)] mt-1">{addForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Konfirmasi Password *</label>
                                <input
                                    type="password"
                                    value={addForm.data.password_confirmation}
                                    onChange={(e) => addForm.setData('password_confirmation', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); addForm.reset(); }}
                                    className="flex-1 py-3 bg-white border border-[var(--neutral-300)] rounded-lg font-medium hover:bg-[var(--neutral-50)]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] disabled:opacity-50"
                                >
                                    {addForm.processing ? 'Menyimpan...' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
