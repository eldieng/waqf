import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl font-bold">W</span>
                            </div>
                            <div>
                                <span className="font-bold text-white text-xl">Waqf And Liggeyal</span>
                                <span className="block text-sm text-gray-400">Daara</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-md">
                            {t('footer.description')}
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: '📘', href: '#', label: 'Facebook' },
                                { icon: '📷', href: '#', label: 'Instagram' },
                                { icon: '📺', href: '#', label: 'YouTube' },
                                { icon: '💬', href: '#', label: 'WhatsApp' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                                >
                                    <span className="text-lg">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Navigation</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/about', label: t('nav.about') },
                                { href: '/projects', label: t('nav.projects') },
                                { href: '/shop', label: t('nav.shop') },
                                { href: '/contact', label: t('nav.contact') },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-white mb-4">{t('footer.newsletter.title')}</h4>
                        <p className="text-gray-400 text-sm mb-4">{t('footer.newsletter.description')}</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t('footer.newsletter.placeholder')}
                                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                            <button className="btn-primary px-4 py-3">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Waqf And Liggeyal Daara. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">🔒 Paiement sécurisé</span>
                        <span className="text-gray-400">📱 Wave • Orange Money</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
