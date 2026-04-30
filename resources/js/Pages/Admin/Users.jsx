import { Head } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function AdminUsers() {
    const users = [
        { nama: 'Kiki Muhammad Iqbal', email: 'kiki@prodaya.id', role: 'Owner', wa: '0823xxxx', lastLogin: '30/04 08:14', status: 'Aktif' },
        { nama: 'Tedi Suherman', email: 'tedi@prodaya.id', role: 'Karyawan', wa: '0856xxxx', lastLogin: '30/04 12:14', status: 'Aktif' },
        { nama: 'Andi Pratama', email: 'andi@prodaya.id', role: 'Karyawan', wa: '0813xxxx', lastLogin: '18/04 14:00', status: 'Nonaktif' },
    ];

    return (
        <DashboardLayout>
            <Head title="Kelola Pengguna" />
            <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Kelola Pengguna</h1>
                        <p className="text-sm text-[var(--neutral-600)]">CRUD karyawan + lihat status akses</p>
                    </div>
                    <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
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
                                        placeholder="Cari nama atau email..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>
                            <select className="px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg">
                                <option>Semua Role</option>
                                <option>Owner</option>
                                <option>Karyawan</option>
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
                                {users.map((user, idx) => (
                                    <tr key={idx} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-semibold text-[var(--primary-700)]">
                                                        {user.nama.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-[var(--neutral-900)]">{user.nama}</span>
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
                                        <td className="px-4 py-3 text-[var(--neutral-700)]">{user.wa}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{user.lastLogin}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                user.status === 'Aktif'
                                                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                                                    : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                                    Edit
                                                </button>
                                                {user.role !== 'Owner' && (
                                                    <button className="px-3 py-1.5 text-xs bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5">
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
