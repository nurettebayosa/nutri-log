import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Forbidden() {
    return (
        <DashboardLayout>
            <Head title="Akses Ditolak" />
            <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--danger)]/10 flex items-center justify-center mb-6">
                    <ShieldAlert className="w-10 h-10 text-[var(--danger)]" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-3">Akses Ditolak</h1>
                <p className="text-sm text-[var(--neutral-600)] mb-8">
                    Halaman ini hanya bisa diakses oleh owner. Hubungi owner kalau kamu butuh akses tambahan.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Dashboard
                </Link>
            </div>
        </DashboardLayout>
    );
}
