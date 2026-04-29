import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard, Clock, FileText, Sprout, Calendar, Power, Wrench, Bell,
    Settings, Users, UserPlus, ScrollText, User, Palette, Leaf, Menu, X, LogOut,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth?.user;
    const userRole = user?.role ?? 'karyawan'; // fallback aman
    const userName = user?.name ?? 'User';
    const initials =
        userName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/dashboard') return currentUrl === '/dashboard' || currentUrl === '/';
        return currentUrl === path || currentUrl.startsWith(path + '/');
    };

    const handleLogout = () => {
        router.post('/logout'); // Diganti jadi URL langsung biar aman dari error Ziggy
    };

    const NavItem = ({ href, icon: Icon, label, badge }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive(href)
                    ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border-l-3 border-[var(--primary-500)]'
                    : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)]'
            }`}
            onClick={() => setMobileMenuOpen(false)}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(sidebarOpen || mobileMenuOpen) && <span className="text-sm">{label}</span>}
            {badge && (sidebarOpen || mobileMenuOpen) && (
                <span className="ml-auto bg-[var(--danger)] text-white text-xs px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    );

    const SectionLabel = ({ children }) =>
        sidebarOpen || mobileMenuOpen ? (
            <div className="px-4 py-2 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                {children}
            </div>
        ) : (
            <div className="h-px bg-[var(--neutral-200)] my-2 mx-2" />
        );

    const NavMenu = () => (
        <>
            <SectionLabel>Monitoring Utama</SectionLabel>
            <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/riwayat-sensor" icon={Clock} label="Riwayat Sensor" />
            <NavItem href="/laporan" icon={FileText} label="Laporan" />

            <SectionLabel>Kebun</SectionLabel>
            <NavItem href="/blok" icon={Sprout} label="Manajemen Blok" />
            <NavItem href="/jadwal-fertigasi" icon={Calendar} label="Jadwal Fertigasi" />

            <SectionLabel>Operasional</SectionLabel>
            <NavItem href="/kontrol-pompa" icon={Power} label="Kontrol Pompa" />
            <NavItem href="/maintenance" icon={Wrench} label="Maintenance Journal" />
            <NavItem href="/notifikasi" icon={Bell} label="Notifikasi & Alert" badge={3} />

            <SectionLabel>Pengaturan</SectionLabel>
            {userRole === 'owner' && (
                <NavItem href="/threshold" icon={Settings} label="Threshold Sensor" />
            )}
            <NavItem href="/profile" icon={User} label="Profil Akun" />
            <NavItem href="/tampilan" icon={Palette} label="Tampilan" />

            {userRole === 'owner' && (
                <>
                    <SectionLabel>Administrasi</SectionLabel>
                    <NavItem href="/kelola-pengguna" icon={Users} label="Kelola Pengguna" />
                    <NavItem href="/permintaan-akses" icon={UserPlus} label="Permintaan Akses" badge={2} />
                    <NavItem href="/log-aktivitas" icon={ScrollText} label="Log Aktivitas" />
                </>
            )}
        </>
    );

    const getBreadcrumb = (url) => {
        const map = {
            '/dashboard': ['Monitoring Utama', 'Dashboard'],
            '/riwayat-sensor': ['Monitoring Utama', 'Riwayat Sensor'],
            '/laporan': ['Monitoring Utama', 'Laporan'],
            '/blok': ['Kebun', 'Manajemen Blok'],
            '/jadwal-fertigasi': ['Kebun', 'Jadwal Fertigasi'],
            '/kontrol-pompa': ['Operasional', 'Kontrol Pompa'],
            '/maintenance': ['Operasional', 'Maintenance Journal'],
            '/notifikasi': ['Operasional', 'Notifikasi & Alert'],
            '/threshold': ['Pengaturan', 'Threshold Sensor'],
            '/profile': ['Pengaturan', 'Profil Akun'],
            '/tampilan': ['Pengaturan', 'Tampilan'],
            '/kelola-pengguna': ['Administrasi', 'Kelola Pengguna'],
            '/permintaan-akses': ['Administrasi', 'Permintaan Akses'],
            '/log-aktivitas': ['Administrasi', 'Log Aktivitas'],
        };
        if (map[url]) return map[url];
        if (url.startsWith('/blok/')) return ['Kebun', 'Detail Blok'];
        return ['Monitoring Utama', 'Dashboard'];
    };

    const [breadcrumbSection, breadcrumbPage] = getBreadcrumb(currentUrl);

    return (
        <div className="flex h-screen bg-[var(--neutral-50)]">
            {/* Sidebar Desktop */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-16'
                } bg-white border-r border-[var(--neutral-200)] transition-all duration-300 hidden md:flex flex-col`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--neutral-200)]">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-[var(--neutral-900)]">NUTRI-LOG</div>
                                <div className="text-xs text-[var(--neutral-500)]">PT. Prodaya Anugerah Selaras</div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] flex items-center justify-center mx-auto">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-[var(--neutral-100)] rounded"
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                    <NavMenu />
                </nav>

                {/* User Profile */}
                <div className="border-t border-[var(--neutral-200)] p-4">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary-200)] flex items-center justify-center">
                                <span className="text-sm font-semibold text-[var(--primary-700)]">{initials}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[var(--neutral-900)] truncate">{userName}</div>
                                <div className="text-xs text-[var(--neutral-500)] truncate capitalize">{userRole}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-[var(--neutral-100)] rounded text-[var(--neutral-600)]"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-200)] flex items-center justify-center mx-auto">
                            <span className="text-sm font-semibold text-[var(--primary-700)]">{initials}</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[var(--neutral-200)] flex flex-col">
                        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--neutral-200)]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-[var(--neutral-900)]">NUTRI-LOG</div>
                                    <div className="text-xs text-[var(--neutral-500)]">Prodaya Anugerah Selaras</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1 hover:bg-[var(--neutral-100)] rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                            <NavMenu />
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-[var(--neutral-200)] flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-[var(--neutral-100)] rounded"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="text-sm text-[var(--neutral-600)]">
                            <span>{breadcrumbSection}</span>
                            <span className="mx-1.5 text-[var(--neutral-400)]">›</span>
                            <span className="text-[var(--neutral-900)] font-medium">{breadcrumbPage}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-50)] rounded-full">
                            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                            <span className="text-xs text-[var(--primary-700)]">ESP32 A1 Online</span>
                        </div>
                        <button className="relative p-2 hover:bg-[var(--neutral-100)] rounded">
                            <Bell className="w-5 h-5 text-[var(--neutral-600)]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-200)] flex items-center justify-center">
                            <span className="text-xs font-semibold text-[var(--primary-700)]">{initials}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
