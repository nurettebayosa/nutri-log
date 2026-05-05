import { Head, useForm } from '@inertiajs/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function DisplaySettings({ settings = {} }) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        theme: settings.theme ?? 'light',
        font_size: settings.font_size ?? 'medium',
        language: settings.language ?? 'id',
        reduced_motion: settings.reduced_motion ?? false,
        density: settings.density ?? 'comfortable',
    });

    const save = (overrides = {}) => {
        patch('/tampilan', {
            data: { ...data, ...overrides },
            preserveScroll: true,
        });
    };

    const handleThemeChange = (newTheme) => {
        setData('theme', newTheme);
        save({ theme: newTheme });
    };

    const handleFontSizeChange = (newSize) => {
        setData('font_size', newSize);
        save({ font_size: newSize });
    };

    const handleToggleChange = (key, value) => {
        setData(key, value);
        save({ [key]: value });
    };

    return (
        <DashboardLayout>
            <Head title="Tampilan" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Tampilan</h1>
                        <p className="text-sm text-[var(--neutral-600)]">Preferensi tampilan personal untuk kenyamanan penggunaan</p>
                    </div>
                    {recentlySuccessful && (
                        <div className="px-3 py-1.5 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-full">
                            ✓ Tersimpan
                        </div>
                    )}
                </div>

                {/* Theme */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'light', label: 'Terang', sub: 'Default', icon: Sun },
                            { id: 'dark', label: 'Gelap', sub: 'Hemat mata', icon: Moon },
                            { id: 'system', label: 'Ikuti Sistem', sub: 'Auto', icon: Monitor },
                        ].map((opt) => {
                            const isActive = data.theme === opt.id;
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleThemeChange(opt.id)}
                                    disabled={processing}
                                    className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                                        isActive
                                            ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                                            : 'border-[var(--neutral-200)] hover:border-[var(--neutral-300)] bg-white'
                                    }`}
                                >
                                    <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-[var(--primary-500)]' : 'text-[var(--neutral-600)]'}`} />
                                    <span className="font-medium text-[var(--neutral-900)]">{opt.label}</span>
                                    <span className="text-xs text-[var(--neutral-600)] mt-1">{opt.sub}</span>
                                    {isActive && (
                                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary-500)] flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Font Size */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Ukuran Font</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'small', label: 'Kecil', size: 'text-sm', sub: '13px' },
                            { id: 'medium', label: 'Sedang', size: 'text-base', sub: '14px (Default)' },
                            { id: 'large', label: 'Besar', size: 'text-lg', sub: '16px' },
                        ].map((opt) => {
                            const isActive = data.font_size === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleFontSizeChange(opt.id)}
                                    disabled={processing}
                                    className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer ${
                                        isActive
                                            ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                                            : 'border-[var(--neutral-200)] hover:border-[var(--neutral-300)] bg-white'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className={`${opt.size} mb-2`}>Aa</div>
                                        <span className="font-medium text-[var(--neutral-900)]">{opt.label}</span>
                                        <div className="text-xs text-[var(--neutral-600)] mt-1">{opt.sub}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Language */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Bahasa</h3>
                    <select
                        value={data.language}
                        onChange={(e) => handleToggleChange('language', e.target.value)}
                        className="w-full max-w-md px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                    >
                        <option value="id">🇮🇩 Bahasa Indonesia (Default)</option>
                        <option value="en" disabled>🇬🇧 English (Coming Soon)</option>
                    </select>
                </div>

                {/* Accessibility */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Aksesibilitas</h3>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-[var(--neutral-50)] rounded-lg cursor-pointer flex-wrap gap-2">
                            <div>
                                <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">Kurangi Animasi</div>
                                <div className="text-xs text-[var(--neutral-600)]">Nonaktifkan efek transisi dan animasi</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.reduced_motion}
                                onChange={(e) => handleToggleChange('reduced_motion', e.target.checked)}
                                className="w-5 h-5 rounded text-[var(--primary-500)]"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[var(--neutral-50)] rounded-lg cursor-pointer flex-wrap gap-2">
                            <div>
                                <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">Tampilan Padat</div>
                                <div className="text-xs text-[var(--neutral-600)]">Kurangi spacing untuk menampilkan lebih banyak informasi</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.density === 'compact'}
                                onChange={(e) => handleToggleChange('density', e.target.checked ? 'compact' : 'comfortable')}
                                className="w-5 h-5 rounded text-[var(--primary-500)]"
                            />
                        </label>
                    </div>
                </div>

                <div className="p-4 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-xl text-sm text-[var(--neutral-700)]">
                    ℹ️ Pengaturan disimpan otomatis ke akun Anda. Theme & font size yang berlaku ke seluruh tampilan akan dipasang di iterasi berikutnya.
                </div>
            </div>
        </DashboardLayout>
    );
}
