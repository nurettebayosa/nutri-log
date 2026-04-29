import { Head } from '@inertiajs/react';
import { FileText, Download, Printer, Trash2 } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function ReportsIndex() {
    const reportHistory = [
        { tanggal: '26/04/2026 14:30', jenis: 'Stabilitas Nutrisi', blok: 'Blok A1', periode: '13-26 Apr 2026', dibuat: 'Pak Kiki' },
        { tanggal: '20/04/2026 09:15', jenis: 'Aktivitas Mingguan', blok: 'Semua Blok', periode: '13-20 Apr 2026', dibuat: 'Pak Kiki' },
        { tanggal: '13/04/2026 16:00', jenis: 'Siklus Tanam', blok: 'Blok C1', periode: '13 Mar - 13 Apr 2026', dibuat: 'Pak Kiki' },
    ];

    return (
        <DashboardLayout>
            <Head title="Laporan" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-900)] mb-2">Laporan</h1>
                    <p className="text-sm text-[var(--neutral-600)]">
                        Generate laporan stabilitas nutrisi & aktivitas yang exportable PDF/Excel
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <h2 className="font-semibold text-[var(--neutral-900)] mb-4">Buat Laporan Baru</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Jenis Laporan</label>
                                <div className="space-y-2">
                                    <label className="flex items-start gap-3 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]">
                                        <input type="radio" name="jenis" defaultChecked className="mt-0.5 w-4 h-4 text-[var(--primary-500)]" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm text-[var(--neutral-900)] mb-0.5">📊 Stabilitas Nutrisi & Sensor</div>
                                            <div className="text-xs text-[var(--neutral-600)]">Untuk pembeli (Mayapada, Hypermart, dll)</div>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]">
                                        <input type="radio" name="jenis" className="mt-0.5 w-4 h-4 text-[var(--primary-500)]" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm text-[var(--neutral-900)] mb-0.5">📅 Aktivitas Harian/Mingguan</div>
                                            <div className="text-xs text-[var(--neutral-600)]">Log operasional kebun</div>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 border border-[var(--neutral-300)] rounded-lg cursor-pointer hover:bg-[var(--neutral-50)]">
                                        <input type="radio" name="jenis" className="mt-0.5 w-4 h-4 text-[var(--primary-500)]" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm text-[var(--neutral-900)] mb-0.5">🌱 Siklus Tanam</div>
                                            <div className="text-xs text-[var(--neutral-600)]">Per blok, dari tanam hingga panen</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Blok</label>
                                <select className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]">
                                    <option>Blok A1</option>
                                    <option>Blok A2</option>
                                    <option>Blok A3</option>
                                    <option>Blok B1</option>
                                    <option>Semua Blok</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Dari</label>
                                    <input type="date" defaultValue="2026-04-13" className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-700)] mb-1">Hingga</label>
                                    <input type="date" defaultValue="2026-04-26" className="w-full px-3 py-2 text-sm border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Sertakan</label>
                                <div className="space-y-2">
                                    {['Grafik sensor', 'Tabel data', 'Catatan maintenance', 'Foto blok', 'Tanda tangan owner'].map((item) => (
                                        <label key={item} className="flex items-center gap-2 text-sm text-[var(--neutral-700)]">
                                            <input
                                                type="checkbox"
                                                defaultChecked={['Grafik sensor', 'Tabel data', 'Tanda tangan owner'].includes(item)}
                                                className="w-4 h-4 text-[var(--primary-500)] rounded"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="button" className="w-full py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]">
                                Generate Preview
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-3 bg-white border border-[var(--neutral-200)] rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <h2 className="font-semibold text-[var(--neutral-900)]">Preview Laporan</h2>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 text-sm bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    PDF
                                </button>
                                <button className="px-3 py-1.5 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)] flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Excel
                                </button>
                                <button className="px-3 py-1.5 text-sm bg-white border border-[var(--neutral-300)] rounded-lg hover:bg-[var(--neutral-50)]">
                                    <Printer className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* A4 Preview */}
                        <div className="bg-white border-2 border-[var(--neutral-300)] rounded-lg p-8 aspect-[210/297]">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between pb-4 border-b-2 border-[var(--neutral-200)]">
                                    <div>
                                        <div className="w-12 h-12 rounded-full bg-[var(--primary-500)] flex items-center justify-center mb-2">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-xs font-bold text-[var(--neutral-900)]">NUTRI-LOG</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-semibold text-[var(--neutral-900)]">PT. Prodaya Anugerah Selaras</div>
                                        <div className="text-xs text-[var(--neutral-600)]">Jabong Hydro Farm</div>
                                    </div>
                                </div>

                                <div className="text-center py-3">
                                    <h3 className="text-lg font-bold text-[var(--neutral-900)] mb-1">Laporan Stabilitas Nutrisi & Sensor</h3>
                                    <p className="text-xs text-[var(--neutral-600)]">Blok A1 — Pakcoy · Periode 13–26 April 2026</p>
                                </div>

                                <div className="p-4 bg-[var(--primary-50)] border border-[var(--primary-200)] rounded-lg">
                                    <div className="text-xs font-semibold text-[var(--neutral-900)] mb-2">Ringkasan</div>
                                    <p className="text-xs text-[var(--neutral-700)]">
                                        Selama 14 hari, TDS terjaga di 1,080±60 ppm (97% waktu di range optimal). Kelembaban media stabil di 65–75%. Tidak ditemukan indikasi hama atau penyakit.
                                    </p>
                                </div>

                                <div className="h-32 bg-[var(--neutral-100)] rounded-lg flex items-center justify-center">
                                    <div className="text-center text-xs text-[var(--neutral-500)]">[Grafik TDS 14 Hari]</div>
                                </div>

                                <div className="border border-[var(--neutral-200)] rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-3 gap-px bg-[var(--neutral-200)]">
                                        <div className="bg-[var(--neutral-50)] p-2 text-center">
                                            <div className="text-xs text-[var(--neutral-600)]">Rata-rata TDS</div>
                                            <div className="text-sm font-bold text-[var(--neutral-900)]">1,080 ppm</div>
                                        </div>
                                        <div className="bg-[var(--neutral-50)] p-2 text-center">
                                            <div className="text-xs text-[var(--neutral-600)]">Moisture</div>
                                            <div className="text-sm font-bold text-[var(--neutral-900)]">68%</div>
                                        </div>
                                        <div className="bg-[var(--neutral-50)] p-2 text-center">
                                            <div className="text-xs text-[var(--neutral-600)]">Turbidity</div>
                                            <div className="text-sm font-bold text-[var(--neutral-900)]">14 NTU</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[var(--neutral-200)]">
                                    <div className="text-xs text-[var(--neutral-600)]">
                                        Diterbitkan oleh <span className="font-medium text-[var(--neutral-900)]">Pak Kiki Muhammad Iqbal</span> · 26 April 2026 14:30 WIB · Sistem Nutri-Log
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riwayat Laporan */}
                <div className="bg-white border border-[var(--neutral-200)] rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-[var(--neutral-200)]">
                        <h2 className="font-semibold text-[var(--neutral-900)]">Riwayat Laporan</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--neutral-50)] text-xs font-semibold text-[var(--neutral-700)]">
                                <tr>
                                    <th className="px-4 py-3 text-left">Tanggal</th>
                                    <th className="px-4 py-3 text-left">Jenis</th>
                                    <th className="px-4 py-3 text-left">Blok</th>
                                    <th className="px-4 py-3 text-left">Periode</th>
                                    <th className="px-4 py-3 text-left">Dibuat oleh</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {reportHistory.map((row, idx) => (
                                    <tr key={idx} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]">
                                        <td className="px-4 py-3 text-[var(--neutral-700)] font-mono text-xs">{row.tanggal}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{row.jenis}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{row.blok}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-600)]">{row.periode}</td>
                                        <td className="px-4 py-3 text-[var(--neutral-900)]">{row.dibuat}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 hover:bg-[var(--neutral-100)] rounded" title="Download">
                                                    <Download className="w-4 h-4 text-[var(--neutral-600)]" />
                                                </button>
                                                <button className="p-1.5 hover:bg-[var(--danger)]/10 rounded text-[var(--danger)]" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
