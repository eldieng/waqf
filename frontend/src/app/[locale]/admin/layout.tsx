'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';

const menuItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/projects', icon: '🏫', label: 'Projets' },
    { href: '/admin/campaigns', icon: '📢', label: 'Campagnes' },
    { href: '/admin/donations', icon: '💰', label: 'Dons' },
    { href: '/admin/shop', icon: '🛍️', label: 'Boutique' },
    { href: '/admin/orders', icon: '📦', label: 'Commandes' },
    { href: '/admin/users', icon: '👥', label: 'Utilisateurs' },
    { href: '/admin/content', icon: '📄', label: 'Contenu' },
    { href: '/admin/settings', icon: '⚙️', label: 'Paramètres' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const locale = params.locale as string || 'fr';

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-neutral-800">
                    <Link href="/" className="block">
                        <Image
                            src="/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png"
                            alt="Waqf And Liggeyal Daara"
                            width={180}
                            height={50}
                            className="h-10 w-auto object-contain brightness-0 invert"
                        />
                        <div className="text-xs text-neutral-400 mt-2">Panel Admin</div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const href = `/${locale}${item.href}`;
                            // Match either exactly the href or a sub-path
                            const isActive = pathname === href || pathname.startsWith(`${href}/`);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                        <span>🌐</span>
                        <span>Voir le site</span>
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
                    <div className="text-lg font-semibold text-neutral-900">
                        Administration
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg">
                            🔔
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-medium">
                                A
                            </div>
                            <span className="text-sm font-medium text-neutral-700">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
