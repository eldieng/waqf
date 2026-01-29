'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { projectsApi, campaignsApi, donationsApi, productsApi, contentsApi, Project } from '@/lib/services';

interface Campaign {
    id: string;
    slug: string;
    status: string;
    isUrgent: boolean;
    goalAmount: number;
    collectedAmount: number;
    featuredImage?: string;
    translations?: { title?: string; description?: string }[];
}

interface Product {
    id: string;
    slug: string;
    price: number;
    images: string[];
    translations?: { language: string; name: string; description?: string }[];
}

interface Stats {
    totalDonations: number;
    totalProjects: number;
    totalDonors: number;
    totalCampaigns: number;
}

interface Content {
    id: string;
    slug: string;
    type: string;
    featuredImage?: string;
    createdAt: string;
    translations?: { language: string; title: string; excerpt?: string; body?: string }[];
}

export default function HomePage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';

    const [projects, setProjects] = useState<Project[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [contents, setContents] = useState<Content[]>([]);
    const [stats, setStats] = useState<Stats>({ totalDonations: 0, totalProjects: 0, totalDonors: 0, totalCampaigns: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, campaignsRes, statsRes, productsRes, contentsRes] = await Promise.all([
                    projectsApi.getAll({ limit: 3 }),
                    campaignsApi.getAll({ limit: 3 }),
                    donationsApi.getStats().catch(() => ({ totalAmount: 0, totalDonors: 0 })),
                    productsApi.getAll({ limit: 6 }).catch(() => ({ data: [] })),
                    contentsApi.getAll({ type: 'ARTICLE', isPublished: true, limit: 3 }).catch(() => ({ data: [] })),
                ]);
                setProjects(projectsRes.data || []);
                setCampaigns(campaignsRes.data || []);
                setProducts(productsRes.data || []);
                setContents(contentsRes.data || []);
                setStats({
                    totalDonations: statsRes.totalAmount || 0,
                    totalProjects: projectsRes.meta?.total || projectsRes.data?.length || 0,
                    totalDonors: statsRes.totalDonors || 0,
                    totalCampaigns: campaignsRes.meta?.total || campaignsRes.data?.length || 0,
                });
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatAmount = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toLocaleString();
    };

    const getProgress = (collected: number, goal: number) => {
        if (!goal) return 0;
        return Math.min(Math.round((collected / goal) * 100), 100);
    };

    const getProjectTitle = (project: Project) => {
        const trans = project.translations?.find(t => t.language === locale.toUpperCase()) || project.translations?.[0];
        return trans?.title || project.slug;
    };

    const getCampaignTitle = (campaign: Campaign) => {
        return campaign.translations?.[0]?.title || campaign.slug;
    };

    const getProductName = (product: Product) => {
        const trans = product.translations?.find(t => t.language === locale.toUpperCase()) || product.translations?.[0];
        return trans?.name || product.slug;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Style waqfald.com */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/img/imgi_50_Image_fx90.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-emerald-900/80 to-emerald-900/60" />
                </div>

                <div className="container relative z-10 py-20">
                    <div className="max-w-3xl">
                        {/* Wolof text */}
                        <p className="text-emerald-300 text-lg md:text-xl font-medium mb-4 tracking-wide">
                            {t('home.hero.wolof')}
                        </p>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {t('home.hero.mainTitle')}<br />
                            <span className="text-emerald-400">{t('home.hero.mainTitleHighlight')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                            {t('home.hero.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href={`/${locale}/donate`} 
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 text-lg"
                            >
                                {t('home.hero.donateNow')}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Video Section */}
            <section className="py-16 bg-slate-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                {t('home.video.badge')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {t('home.video.title')}
                            </h2>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <iframe
                                src="https://www.youtube.com/embed/cxRMUCUBvp8"
                                title="Waqf Sénégal - Notre Mission"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section - Don Perpétuel */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/img/imgi_3_Image_fx103.jpg"
                                    alt="Enfants dans un Daara"
                                    width={600}
                                    height={500}
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                            </div>
                            {/* Floating card */}
                            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                        <span className="text-3xl">🤲</span>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-emerald-600">95%</div>
                                        <div className="text-sm text-slate-600">{t('home.mission.donationsUsed')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                {t('home.mission.badge')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                {t('home.mission.title')}
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                {t('home.mission.description1')}
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {t('home.mission.description2')}
                            </p>
                            <Link 
                                href={`/${locale}/about`}
                                className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-lg hover:text-emerald-700 transition-colors"
                            >
                                {t('home.mission.learnMore')}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="py-20 bg-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {t('home.stats.title')}
                        </h2>
                        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                            {t('home.stats.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                {loading ? '...' : formatAmount(stats.totalDonations)}
                            </div>
                            <div className="text-emerald-100 text-lg">{t('home.stats.donations')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                {loading ? '...' : stats.totalProjects}+
                            </div>
                            <div className="text-emerald-100 text-lg">{t('home.stats.projects')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                {loading ? '...' : stats.totalDonors}+
                            </div>
                            <div className="text-emerald-100 text-lg">{t('home.stats.donors')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                500+
                            </div>
                            <div className="text-emerald-100 text-lg">{t('home.stats.children')}</div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-xl text-white mb-6">
                            {t('home.stats.ctaText')}
                        </p>
                        <Link 
                            href={`/${locale}/donate`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-slate-100 transition-all text-lg"
                        >
                            {t('home.stats.donateBtn')}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Projects Section - Clean Cards */}
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                {t('home.urgentProjects.title')}
                            </h2>
                            <p className="text-slate-500 max-w-xl">
                                {t('home.urgentProjects.subtitle')}
                            </p>
                        </div>
                        <Link 
                            href={`/${locale}/projects`}
                            className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2"
                        >
                            {t('home.urgentProjects.viewAll')}
                            <span>→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                                    <div className="h-40 bg-slate-100 rounded-2xl mb-4" />
                                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {t('home.urgentProjects.noProjects')}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const progress = getProgress(Number(project.collectedAmount), Number(project.goalAmount));
                                return (
                                    <Link 
                                        key={project.id} 
                                        href={`/${locale}/projects/${project.slug}`}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                                    >
                                        <div className="h-44 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                                            {project.featuredImage ? (
                                                <img
                                                    src={project.featuredImage}
                                                    alt={getProjectTitle(project)}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🏫</span>
                                            )}
                                            {project.isUrgent && (
                                                <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                    {t('home.urgentProjects.urgent')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {getProjectTitle(project)}
                                            </h3>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-slate-500">
                                                        {formatAmount(Number(project.collectedAmount))} / {formatAmount(Number(project.goalAmount))} FCFA
                                                    </span>
                                                    <span className="font-bold text-emerald-600">{progress}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400">{project.donorCount || 0} {t('home.urgentProjects.donors')}</span>
                                                <span className="text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                                                    {t('home.urgentProjects.support')} →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Campaigns Section */}
            {campaigns.length > 0 && (
                <section className="py-20">
                    <div className="container">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                    {t('home.campaigns.title')}
                                </h2>
                                <p className="text-slate-500">
                                    {t('home.campaigns.subtitle')}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => {
                                const progress = getProgress(Number(campaign.collectedAmount), Number(campaign.goalAmount));
                                return (
                                    <div 
                                        key={campaign.id}
                                        className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 text-white overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        {campaign.isUrgent && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full mb-4">
                                                🔥 Urgent
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold mb-2 relative z-10">
                                            {getCampaignTitle(campaign)}
                                        </h3>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2 text-white/80">
                                                <span>{formatAmount(Number(campaign.collectedAmount))} FCFA</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-white rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/${locale}/donate`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                                        >
                                            {t('home.campaigns.participate')}
                                            <span>→</span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="py-20">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
                                {t('home.about.badge')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                {t('home.about.title')}
                            </h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {t('home.about.description')}
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        ✓
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{t('home.about.transparency')}</div>
                                        <div className="text-sm text-slate-500">{t('home.about.transparencyDesc')}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        ✓
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{t('home.about.impact')}</div>
                                        <div className="text-sm text-slate-500">{t('home.about.impactDesc')}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        ✓
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{t('home.about.proximity')}</div>
                                        <div className="text-sm text-slate-500">{t('home.about.proximityDesc')}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        ✓
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{t('home.about.expertise')}</div>
                                        <div className="text-sm text-slate-500">{t('home.about.expertiseDesc')}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                                <Image
                                    src="/img/imgi_9_Image_fx86.jpg"
                                    alt="Waqf Sénégal - Notre équipe"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="text-2xl font-bold">{t('home.about.orgName')}</div>
                                    <div className="text-emerald-200">{t('home.about.orgSlogan')}</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                                        🤝
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">10+</div>
                                        <div className="text-sm text-slate-500">{t('home.about.yearsExp')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Section */}
            {contents.length > 0 && (
                <section className="py-20 bg-slate-50">
                    <div className="container">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                            <div>
                                <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                                    {t('home.news.badge')}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                    {t('home.news.title')}
                                </h2>
                            </div>
                            <Link 
                                href={`/${locale}/news`}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2"
                            >
                                {t('home.news.viewAll')}
                                <span>→</span>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {contents.map((content) => {
                                const trans = content.translations?.find(t => t.language === locale.toUpperCase()) || content.translations?.[0];
                                const date = new Date(content.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                                return (
                                    <Link 
                                        key={content.id}
                                        href={`/${locale}/news/${content.slug}`}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                                            {content.featuredImage ? (
                                                <img
                                                    src={content.featuredImage}
                                                    alt={trans?.title || ''}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <span className="text-5xl">📰</span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                    {t('home.news.article')}
                                                </span>
                                                <span className="text-sm text-slate-400">{date}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                {trans?.title || content.slug}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2">
                                                {trans?.excerpt || ''}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}


            {/* Shop Section - Enhanced */}
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                                {t('home.shop.badge')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {t('home.shop.title')}
                            </h2>
                        </div>
                        <Link 
                            href={`/${locale}/shop`}
                            className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2"
                        >
                            {t('home.shop.viewAll')}
                            <span>→</span>
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                            {products.slice(0, 5).map((product) => (
                                <Link 
                                    key={product.id}
                                    href={`/${locale}/shop/${product.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
                                >
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={getProductName(product)}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl">🛍️</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                            {getProductName(product)}
                                        </h3>
                                        <div className="text-emerald-600 font-bold">
                                            {Number(product.price).toLocaleString()} FCFA
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { name: "Livre de prières", price: "5 000 FCFA", icon: "📖" },
                                { name: "Tapis de prière", price: "15 000 FCFA", icon: "🧎" },
                                { name: "Chapelet artisanal", price: "3 000 FCFA", icon: "📿" },
                                { name: "Coffret cadeau", price: "25 000 FCFA", icon: "🎁" },
                            ].map((product, i) => (
                                <Link 
                                    key={i}
                                    href={`/${locale}/shop`}
                                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <span className="text-4xl">{product.icon}</span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="text-emerald-600 font-bold">{product.price}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section - Style waqfald.com */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                            {t('home.testimonials.badge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {t('home.testimonials.title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: t('home.testimonials.items.0.name'),
                                role: t('home.testimonials.items.0.role'),
                                text: t('home.testimonials.items.0.text'),
                                avatar: "C"
                            },
                            {
                                name: t('home.testimonials.items.1.name'),
                                role: t('home.testimonials.items.1.role'),
                                text: t('home.testimonials.items.1.text'),
                                avatar: "F"
                            },
                            {
                                name: t('home.testimonials.items.2.name'),
                                role: t('home.testimonials.items.2.role'),
                                text: t('home.testimonials.items.2.text'),
                                avatar: "M"
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-slate-50 rounded-3xl p-8 relative">
                                <div className="absolute top-6 right-6 text-6xl text-emerald-200 font-serif">&ldquo;</div>
                                <p className="text-slate-600 text-lg mb-6 relative z-10">
                                    {testimonial.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Style waqfald.com */}
            <section className="py-20 bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1920')] bg-cover bg-center opacity-20" />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                            {t('home.cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href={`/${locale}/donate`} 
                                className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-full hover:bg-slate-100 transition-all text-lg shadow-xl"
                            >
                                {t('home.cta.donate')}
                            </Link>
                            <Link 
                                href={`/${locale}/contact`} 
                                className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all text-lg"
                            >
                                {t('home.cta.contact')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
