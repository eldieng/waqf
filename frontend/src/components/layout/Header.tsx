'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/lib/cart-context';

const navLinks = [
    { href: '/', key: 'home' },
    { href: '/projects', key: 'projects' },
    { href: '/news', key: 'news' },
    { href: '/shop', key: 'shop' },
    { href: '/about', key: 'about' },
    { href: '/contact', key: 'contact' },
];

export default function Header() {
    const t = useTranslations('nav');
    const pathname = usePathname();
    const params = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { itemCount } = useCart();

    const locale = (params.locale as string) || 'fr';
    void pathname;

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-100/50">
            <div className="container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-3 group">
                        <Image
                            src="/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png"
                            alt="Waqf And Liggeyal Daara"
                            width={180}
                            height={50}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const href = `/${locale}${link.href === '/' ? '' : link.href}`;
                            const isHome = link.href === '/';
                            const isActive = isHome ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname.startsWith(href);
                            return (
                                <Link
                                    key={link.key}
                                    href={href}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isActive
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {t(link.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />

                        <Link
                            href={`/${locale}/shop/cart`}
                            className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all sm:px-4"
                            aria-label="Cart"
                        >
                            <span className="text-base">🛒</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Admin Login Button */}
                        <Link
                            href={`/${locale}/login`}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {t('login')}
                        </Link>

                        <Link
                            href={`/${locale}/donate`}
                            className="hidden sm:flex items-center gap-2 btn-primary py-2.5 px-5 text-sm"
                        >
                            <span>🕌</span>
                            {t('donate')}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => {
                                const href = `/${locale}${link.href === '/' ? '' : link.href}`;
                                return (
                                    <Link
                                        key={link.key}
                                        href={href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                                    >
                                        {t(link.key)}
                                    </Link>
                                );
                            })}

                            <Link
                                href={`/${locale}/shop/cart`}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium flex items-center justify-between"
                            >
                                <span>🛒 {t('cart')}</span>
                                {itemCount > 0 && (
                                    <span className="min-w-6 h-6 px-2 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href={`/${locale}/login`}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                            >
                                🔐 {t('login')}
                            </Link>
                            <Link
                                href={`/${locale}/donate`}
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-3 btn-primary text-center"
                            >
                                🕌 {t('donate')}
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
