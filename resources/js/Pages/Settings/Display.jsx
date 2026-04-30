import { Head } from '@inertiajs/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function DisplaySettings() {
    return (
        <DashboardLayout>
            <Head title="Tampilan" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Tampilan</h1>
                    <p className="text-sm text-[var(--neutral-600)]">Preferensi tampilan personal untuk kenyamanan penggunaan</p>
                </div>

                {/* Theme */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Tema</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="relative flex flex-col items-center p-6 border-2 border-[var(--primary-500)] bg-[var(--primary-50)] rounded-xl cursor-pointer">
                            <input type="radio" name="theme" defaultChecked className="sr-only" />
                            <Sun className="w-8 h-8 text-[var(--primary-500)] mb-3" />
                            <span className="font-medium text-[var(--neutral-900)]">Terang</span>
                            <span className="text-xs text-[var(--neutral-600)] mt-1">Default</span>
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary-500)] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        </label>

                        <label className="relative flex flex-col items-center p-6 border-2 border-[var(--neutral-200)] hover:border-[var(--neutral-300)] rounded-xl cursor-pointer">
                            <input type="radio" name="theme" className="sr-only" />
                            <Moon className="w-8 h-8 text-[var(--neutral-600)] mb-3" />
                            <span className="font-medium text-[var(--neutral-900)]">Gelap</span>
                            <span className="text-xs text-[var(--neutral-600)] mt-1">Hemat mata</span>
                        </label>

                        <label className="relative flex flex-col items-center p-6 border-2 border-[var(--neutral-200)] hover:border-[var(--neutral-300)] rounded-xl cursor-pointer">
                            <input type="radio" name="theme" className="sr-only" />
                            <Monitor className="w-8 h-8 text-[var(--neutral-600)] mb-3" />
                            <span className="font-medium text-[var(--neutral-900)]">Ikuti Sistem</span>
                            <span className="text-xs text-[var(--neutral-600)] mt-1">Auto</span>
                        </label>
                    </div>
                </div>

                {/* Font Size */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Ukuran Font</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center justify-center p-6 border-2 border-[var(--neutral-200)] hover:border-[var(--neutral-300)] rounded-xl cursor-pointer">
                            <input type="radio" name="font" className="sr-only" />
                            <div className="text-center">
                                <div className="text-sm mb-2">Aa</div>
                                <span className="font-medium text-[var(--neutral-900)]">Kecil</span>
                                <div className="text-xs text-[var(--neutral-600)] mt-1">13px</div>
                            </div>
                        </label>

                        <label className="flex items-center justify-center p-6 border-2 border-[var(--primary-500)] bg-[var(--primary-50)] rounded-xl cursor-pointer">
                            <input type="radio" name="font" defaultChecked className="sr-only" />
                            <div className="text-center">
                                <div className="text-base mb-2">Aa</div>
                                <span className="font-medium text-[var(--neutral-900)]">Sedang</span>
                                <div className="text-xs text-[var(--neutral-600)] mt-1">14px (Default)</div>
                            </div>
                        </label>

                        <label className="flex items-center justify-center p-6 border-2 border-[var(--neutral-200)] hover:border-[var(--neutral-300)] rounded-xl cursor-pointer">
                            <input type="radio" name="font" className="sr-only" />
                            <div className="text-center">
                                <div className="text-lg mb-2">Aa</div>
                                <span className="font-medium text-[var(--neutral-900)]">Besar</span>
                                <div className="text-xs text-[var(--neutral-600)] mt-1">16px</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Language */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl p-6">
                    <h3 className="font-semibold text-[var(--neutral-900)] mb-4">Bahasa</h3>
                    <select className="w-full max-w-md px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                        <option>🇮🇩 Bahasa Indonesia (Default)</option>
                        <option disabled>🇬🇧 English (Coming Soon)</option>
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
                            <input type="checkbox" className="w-5 h-5 rounded text-[var(--primary-500)]" />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[var(--neutral-50)] rounded-lg cursor-pointer flex-wrap gap-2">
                            <div>
                                <div className="font-medium text-sm text-[var(--neutral-900)] mb-1">Tampilan Padat</div>
                                <div className="text-xs text-[var(--neutral-600)]">Kurangi spacing untuk menampilkan lebih banyak informasi</div>
                            </div>
                            <input type="checkbox" className="w-5 h-5 rounded text-[var(--primary-500)]" />
                        </label>
                    </div>
                </div>

                <div className="p-4 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-xl text-sm text-[var(--neutral-700)]">
                    ℹ️ Pengaturan disimpan otomatis dan berlaku untuk akun Anda di semua device
                </div>
            </div>
        </DashboardLayout>
    );
}
