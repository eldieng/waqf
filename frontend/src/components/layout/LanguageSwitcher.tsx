'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const locales = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const currentLocale = locales.find((l) => l.code === locale) || locales[0];

    const switchLocale = (newLocale: string) => {
        // Replace the locale in the pathname
        const segments = pathname.split('/');
        if (segments.length > 1) {
            segments[1] = newLocale;
        }
        const newPath = segments.join('/') || `/${newLocale}`;
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
            >
                <span>{currentLocale.flag}</span>
                <span className="hidden sm:inline">{currentLocale.code.toUpperCase()}</span>
                <svg
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden z-50">
                        {locales.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => switchLocale(l.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors ${l.code === locale ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-700'
                                    }`}
                            >
                                <span>{l.flag}</span>
                                <span>{l.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
