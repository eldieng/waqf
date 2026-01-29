'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { contentsApi } from '@/lib/services';

interface Article {
    id: string;
    slug: string;
    featuredImage?: string;
    publishedAt: string;
    createdAt: string;
    translations: Array<{
        language: string;
        title: string;
        body: string;
        excerpt?: string;
    }>;
}

export default function NewsDetailPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const slug = params.slug as string;

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await contentsApi.getBySlug(slug, locale.toUpperCase());
                setArticle(data);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug, locale]);

    const getTranslation = () => {
        if (!article) return { title: '', body: '', excerpt: '' };
        return article.translations?.find(tr => tr.language === locale.toUpperCase())
            || article.translations?.[0]
            || { title: '', body: '', excerpt: '' };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-neutral-500">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-6">📰</div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-4">Article non trouvé</h1>
                    <p className="text-neutral-600 mb-6">L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.</p>
                    <Link
                        href={`/${locale}/news`}
                        className="inline-flex px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        ← Retour aux actualités
                    </Link>
                </div>
            </div>
        );
    }

    const trans = getTranslation();

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link href={`/${locale}`} className="hover:text-emerald-600">
                        {t('common.home')}
                    </Link>
                    <span>/</span>
                    <Link href={`/${locale}/news`} className="hover:text-emerald-600">
                        {t('news.title')}
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-900 truncate max-w-[200px]">{trans.title}</span>
                </div>

                {/* Featured Image */}
                {article.featuredImage && (
                    <div className="aspect-video bg-neutral-100 rounded-2xl overflow-hidden mb-8">
                        <img
                            src={article.featuredImage}
                            alt={trans.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Article Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                            Article
                        </span>
                        <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                        {trans.title}
                    </h1>
                    {trans.excerpt && (
                        <p className="text-xl text-neutral-600 leading-relaxed">
                            {trans.excerpt}
                        </p>
                    )}
                </header>

                {/* Article Body */}
                <article className="prose prose-lg max-w-none">
                    <div 
                        className="text-neutral-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: trans.body.replace(/\n/g, '<br/>') }}
                    />
                </article>

                {/* Back Link */}
                <div className="mt-12 pt-8 border-t border-neutral-200">
                    <Link
                        href={`/${locale}/news`}
                        className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
                    >
                        ← {t('common.back')} aux actualités
                    </Link>
                </div>
            </div>
        </div>
    );
}
