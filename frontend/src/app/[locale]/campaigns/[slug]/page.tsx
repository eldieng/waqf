'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { campaignsApi } from '@/lib/services';

interface Campaign {
    id: string;
    slug: string;
    status: string;
    goalAmount: number;
    collectedAmount: number;
    isUrgent: boolean;
    featuredImage?: string;
    startDate: string;
    endDate?: string;
    translations: Array<{
        language: string;
        title: string;
        description: string;
    }>;
}

export default function CampaignDetailPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const slug = params.slug as string;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await campaignsApi.getBySlug(slug, locale.toUpperCase());
                setCampaign(data);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [slug, locale]);

    const getTranslation = () => {
        if (!campaign) return { title: '', description: '' };
        return campaign.translations?.find(tr => tr.language === locale.toUpperCase())
            || campaign.translations?.[0]
            || { title: '', description: '' };
    };

    const getProgress = () => {
        if (!campaign) return 0;
        return Math.min(100, Math.round((campaign.collectedAmount / campaign.goalAmount) * 100));
    };

    const formatAmount = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toLocaleString();
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

    if (error || !campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-6">🎯</div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-4">Campagne non trouvée</h1>
                    <p className="text-neutral-600 mb-6">La campagne que vous recherchez n&apos;existe pas ou a été supprimée.</p>
                    <Link
                        href={`/${locale}`}
                        className="inline-flex px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        ← Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        );
    }

    const trans = getTranslation();
    const progress = getProgress();

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link href={`/${locale}`} className="hover:text-emerald-600">
                        {t('common.home')}
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-900">{trans.title}</span>
                </div>

                {/* Featured Image */}
                {campaign.featuredImage && (
                    <div className="aspect-video bg-neutral-100 rounded-2xl overflow-hidden mb-8">
                        <img
                            src={campaign.featuredImage}
                            alt={trans.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Campaign Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        {campaign.isUrgent && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                🔥 Urgent
                            </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === 'ACTIVE' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-neutral-100 text-neutral-700'
                        }`}>
                            {campaign.status === 'ACTIVE' ? 'En cours' : campaign.status}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                        {trans.title}
                    </h1>
                </header>

                {/* Progress Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="text-sm text-white/80 mb-1">Collecté</div>
                            <div className="text-4xl font-bold mb-4">
                                {formatAmount(campaign.collectedAmount)} FCFA
                            </div>
                            <div className="text-sm text-white/80">
                                Objectif: {formatAmount(campaign.goalAmount)} FCFA
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-white/80 mb-2">Progression</div>
                            <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-2xl font-bold">{progress}%</div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="text-white/70">Début:</span>{' '}
                            <span className="font-medium">{formatDate(campaign.startDate)}</span>
                        </div>
                        {campaign.endDate && (
                            <div>
                                <span className="text-white/70">Fin:</span>{' '}
                                <span className="font-medium">{formatDate(campaign.endDate)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">À propos de cette campagne</h2>
                    <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {trans.description || 'Aucune description disponible.'}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href={`/${locale}/donate`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-lg"
                    >
                        🕌 Participer à cette campagne
                    </Link>
                </div>
            </div>
        </div>
    );
}
