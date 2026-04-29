import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk — Nutri-Log" />
            <div className="min-h-screen flex">
                {/* Left Side - Visual */}
                <div className="hidden md:flex md:w-3/5 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] items-center justify-center p-12">
                    <div className="text-center text-white">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                            <Leaf className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">NUTRI-LOG</h1>
                        <p className="text-xl text-white/90">
                            Memantau setiap tetes nutrisi,
                            <br />
                            mencatat setiap panen.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="md:hidden text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[var(--primary-500)] flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[var(--neutral-900)]">NUTRI-LOG</h1>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--neutral-900)] mb-2">
                                Masuk ke Nutri-Log
                            </h2>
                            <p className="text-sm text-[var(--neutral-600)]">
                                Sistem internal PT. Prodaya Anugerah Selaras
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="owner@prodaya.id"
                                    autoComplete="username"
                                    autoFocus
                                    className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-[var(--danger)]">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Kata Sandi</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-[var(--danger)]">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--neutral-300)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-[var(--neutral-700)]">
                                    Ingat saya
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/akses" className="text-sm text-[var(--primary-500)] hover:underline">
                                Lupa akun? Hubungi owner
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--neutral-200)] text-center text-xs text-[var(--neutral-500)]">
                            Powered by Syncore · Politeknik Negeri Subang
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
