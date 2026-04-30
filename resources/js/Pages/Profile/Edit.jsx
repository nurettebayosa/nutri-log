import { Head, usePage } from '@inertiajs/react';
import { Upload, LogOut } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function ProfileEdit() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const userName = user?.name ?? 'User';
    const userEmail = user?.email ?? '-';
    const userRole = user?.role ?? 'karyawan';
    const initials =
        userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

    return (
        <DashboardLayout>
            <Head title="Profil Akun" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Profil Akun</h1>
                    <p className="text-sm text-[var(--neutral-600)]">Edit info pribadi & ganti password</p>
                </div>

                {/* Profile Info */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Informasi Profil</h3>

                    <div className="flex items-start gap-6 mb-6 flex-wrap">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-[var(--primary-200)] flex items-center justify-center">
                                <span className="text-3xl font-bold text-[var(--primary-700)]">{initials}</span>
                            </div>
                            <button className="mt-3 w-24 px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center justify-center gap-1">
                                <Upload className="w-3 h-3" />
                                Upload
                            </button>
                        </div>

                        <div className="flex-1 min-w-[250px] space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    defaultValue={userName}
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue={userEmail}
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">No. WhatsApp</label>
                                <input
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Role</label>
                                <div className="px-4 py-2.5 bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg">
                                    <span className="px-3 py-1 bg-[var(--primary-50)] text-[var(--primary-700)] text-sm rounded-full capitalize">
                                        {userRole}
                                    </span>
                                </div>
                            </div>

                            <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] text-sm">
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Ganti Password</h3>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Password Lama</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Password Baru</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Konfirmasi Password Baru</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]" />
                        </div>
                        <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] text-sm">
                            Ubah Password
                        </button>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Sesi Aktif</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-[var(--neutral-50)] rounded-lg flex-wrap gap-2">
                            <div className="flex-1 min-w-[200px]">
                                <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">💻 Chrome di Windows · Jakarta</div>
                                <div className="text-xs text-[var(--neutral-600)]">Sesi saat ini · IP: 36.79.x.x · Login: 30/04 08:14</div>
                            </div>
                            <span className="px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">Aktif</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[var(--neutral-50)] rounded-lg flex-wrap gap-2">
                            <div className="flex-1 min-w-[200px]">
                                <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">📱 Safari di iPhone · Subang</div>
                                <div className="text-xs text-[var(--neutral-600)]">IP: 192.168.1.x · Login: 25/04 19:30</div>
                            </div>
                            <button className="px-3 py-1 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/5 rounded-lg">Logout</button>
                        </div>
                    </div>

                    <button className="mt-4 px-4 py-2 bg-white border border-[var(--danger)] text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/5 text-sm flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout dari semua device lain
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
