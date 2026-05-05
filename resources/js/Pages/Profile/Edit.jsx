import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Upload, LogOut } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function ProfileEdit({ mustVerifyEmail, status, user }) {
    const userName = user?.name ?? 'User';
    const initials = userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

    // Form 1: Update profile info
    const profileForm = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        wa_number: user?.wa_number ?? '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch('/profile', { preserveScroll: true });
    };

    // Form 2: Update password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put('/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: () => {
                if (passwordForm.errors.password) passwordForm.reset('password', 'password_confirmation');
                if (passwordForm.errors.current_password) passwordForm.reset('current_password');
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Profil Akun" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Profil Akun</h1>
                    <p className="text-sm text-[var(--neutral-600)]">Edit info pribadi & ganti password</p>
                </div>

                {/* Status flash */}
                {status === 'profile-updated' && (
                    <div className="p-3 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg text-sm text-[var(--success)]">
                        ✓ Profil berhasil diperbarui.
                    </div>
                )}
                {status === 'password-updated' && (
                    <div className="p-3 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg text-sm text-[var(--success)]">
                        ✓ Password berhasil diubah.
                    </div>
                )}

                {/* Profile Info */}
                <form onSubmit={submitProfile} className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Informasi Profil</h3>

                    <div className="flex items-start gap-6 mb-6 flex-wrap">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-[var(--primary-200)] flex items-center justify-center">
                                <span className="text-3xl font-bold text-[var(--primary-700)]">{initials}</span>
                            </div>
                            <button
                                type="button"
                                disabled
                                className="mt-3 w-24 px-3 py-1.5 text-xs bg-white border border-[var(--neutral-300)] rounded-lg flex items-center justify-center gap-1 opacity-50 cursor-not-allowed"
                                title="Upload avatar belum tersedia"
                            >
                                <Upload className="w-3 h-3" />
                                Upload
                            </button>
                        </div>

                        <div className="flex-1 min-w-[250px] space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                                {profileForm.errors.name && <p className="text-xs text-[var(--danger)] mt-1">{profileForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                                {profileForm.errors.email && <p className="text-xs text-[var(--danger)] mt-1">{profileForm.errors.email}</p>}
                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <p className="text-xs text-[var(--warning)] mt-1">
                                        Email belum diverifikasi.{' '}
                                        <Link href={route('verification.send')} method="post" as="button" className="underline">
                                            Kirim ulang verifikasi
                                        </Link>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">No. WhatsApp</label>
                                <input
                                    type="tel"
                                    value={profileForm.data.wa_number}
                                    onChange={(e) => profileForm.setData('wa_number', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                                {profileForm.errors.wa_number && <p className="text-xs text-[var(--danger)] mt-1">{profileForm.errors.wa_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Role</label>
                                <div className="px-4 py-2.5 bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg">
                                    <span className="px-3 py-1 bg-[var(--primary-50)] text-[var(--primary-700)] text-sm rounded-full capitalize">
                                        {user?.role ?? 'karyawan'}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--neutral-500)] mt-1">
                                    Role hanya bisa diubah oleh owner via halaman Kelola Pengguna.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] text-sm disabled:opacity-50"
                            >
                                {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Change Password */}
                <form onSubmit={submitPassword} className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Ganti Password</h3>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Password Lama *</label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {passwordForm.errors.current_password && (
                                <p className="text-xs text-[var(--danger)] mt-1">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Password Baru *</label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            {passwordForm.errors.password && (
                                <p className="text-xs text-[var(--danger)] mt-1">{passwordForm.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Konfirmasi Password Baru *</label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] text-sm disabled:opacity-50"
                        >
                            {passwordForm.processing ? 'Memproses...' : 'Ubah Password'}
                        </button>
                    </div>
                </form>

                {/* Active Sessions — placeholder, real implementation butuh package laravel-sessions-tracker */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-2">Sesi Aktif</h3>
                    <p className="text-xs text-[var(--neutral-500)] mb-4 italic">
                        Fitur tracking sesi akan diaktifkan di iterasi berikutnya.
                    </p>
                    <div className="p-4 bg-[var(--neutral-50)] rounded-lg">
                        <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">💻 Browser saat ini</div>
                        <div className="text-xs text-[var(--neutral-600)]">Sesi aktif</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
