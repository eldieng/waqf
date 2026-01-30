import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtl, type Locale } from '@/i18n';
import { Header, Footer } from '@/components/layout';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: {
        default: 'Waqf And Liggeyal Daara',
        template: '%s | Waqf And Liggeyal Daara',
    },
    description:
        "Plateforme de dons pour l'Association Waqf And Liggeyal Daara. Contribuez à l'éducation et au bien-être des enfants défavorisés.",
    keywords: ['waqf', 'don', 'charité', 'daara', 'éducation', 'sénégal', 'islam'],
    authors: [{ name: 'Waqf And Liggeyal Daara' }],
    icons: {
        icon: '/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png',
        apple: '/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://waqfald.com',
        siteName: 'Waqf And Liggeyal Daara',
        title: 'Waqf And Liggeyal Daara',
        description:
            "Plateforme de dons pour l'Association Waqf And Liggeyal Daara. Contribuez à l'éducation et au bien-être des enfants défavorisés.",
        images: ['/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Waqf And Liggeyal Daara',
        description:
            "Plateforme de dons pour l'Association Waqf And Liggeyal Daara.",
        images: ['/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate locale
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const messages = await getMessages();
    const dir = isRtl(locale as Locale) ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} className={outfit.variable}>
            <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <CartProvider>
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </CartProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
