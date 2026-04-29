import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function AccessRequest() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        whatsapp: '',
        jenis: 'reset',
        alasan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: integrasi ke /akses POST endpoint (besok)
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <>
                <Head title="Permintaan Terkirim" />
                <div className="min-h-screen bg-[var(--neutral-50)] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--neutral-900)] mb-3">Permintaan Terkirim</h2>
                        <p className="text-[var(--neutral-600)] mb-8">
                            Owner akan menghubungi kamu via WhatsApp dalam 1×24 jam.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Permintaan Akses — Nutri-Log" />
            <div className="min-h-screen bg-[var(--neutral-50)] flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-[var(--neutral-900)] mb-2">Permintaan Akses</h2>
                    <p className="text-sm text-[var(--neutral-600)] mb-6">
                        Isi formulir ini untuk minta akses dari owner. Owner akan menghubungi via WhatsApp setelah memproses permintaan.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                placeholder="Tedi Suherman"
                                required
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="tedi@prodaya.id"
                                required
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">No. WhatsApp</label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                placeholder="08xxxxxxxxxx"
                                required
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Jenis Permintaan</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]">
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="reset"
                                        checked={formData.jenis === 'reset'}
                                        onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                                        className="w-4 h-4 text-[var(--primary-500)]"
                                    />
                                    <span className="text-sm text-[var(--neutral-700)]">Reset password</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]">
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="baru"
                                        checked={formData.jenis === 'baru'}
                                        onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                                        className="w-4 h-4 text-[var(--primary-500)]"
                                    />
                                    <span className="text-sm text-[var(--neutral-700)]">Akun baru</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">
                                Alasan / Catatan <span className="text-[var(--neutral-500)]">(opsional)</span>
                            </label>
                            <textarea
                                value={formData.alasan}
                                onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                                placeholder="Jelaskan alasan permintaan akses..."
                                rows={3}
                                className="w-full px-4 py-2.5 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors"
                        >
                            Kirim Permintaan
                        </button>
                    </form>

                    <Link
                        href="/login"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--neutral-600)] hover:text-[var(--primary-500)]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </>
    );
}
