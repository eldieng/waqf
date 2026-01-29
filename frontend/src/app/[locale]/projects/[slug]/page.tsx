'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/services';
import { useParams } from 'next/navigation';

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const t = useTranslations();
    const routeParams = useParams();
    const locale = (routeParams.locale as string) || 'fr';
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const data = await projectsApi.getBySlug(slug);
                setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen py-16">
                <div className="container max-w-4xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-100 rounded w-1/2 mb-4" />
                        <div className="h-64 bg-neutral-100 rounded-2xl mb-8" />
                        <div className="h-4 bg-neutral-100 rounded w-full mb-2" />
                        <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-neutral-100 rounded w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen py-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-4">{t('projects.detail.notFound')}</h1>
                    <Link href={`/${locale}/projects`} className="text-emerald-600 hover:underline">
                        ← {t('projects.backToProjects')}
                    </Link>
                </div>
            </div>
        );
    }

    const trans =
        project.translations?.find((tr) => tr.language === locale.toUpperCase())
        || project.translations?.[0]
        || { title: t('news.untitled'), description: '' };
    const progress = project.goalAmount
        ? Math.min(Math.round((Number(project.collectedAmount) / Number(project.goalAmount)) * 100), 100)
        : 0;

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link href={`/${locale}/projects`} className="text-sm text-neutral-500 hover:text-neutral-900">
                        ← {t('projects.backToProjects')}
                    </Link>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    {project.isUrgent && (
                        <span className="badge badge-urgent mb-4">{t('projects.filter.urgent')}</span>
                    )}
                    <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
                        {trans.title}
                    </h1>
                </div>

                {/* Image */}
                <div className="h-64 md:h-96 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
                    {project.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={project.featuredImage}
                            alt={trans.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-8xl">🏫</span>
                    )}
                </div>

                {/* Progress Card */}
                <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center md:text-left">
                            <div className="text-2xl font-semibold text-emerald-700">
                                {(Number(project.collectedAmount) / 1000000).toFixed(1)}M {t('common.currency')}
                            </div>
                            <div className="text-sm text-emerald-600">{t('projects.detail.collected')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-neutral-700">
                                {(Number(project.goalAmount) / 1000000).toFixed(1)}M {t('common.currency')}
                            </div>
                            <div className="text-sm text-neutral-500">{t('projects.detail.goal')}</div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-2xl font-semibold text-neutral-700">
                                {project.donorCount}
                            </div>
                            <div className="text-sm text-neutral-500">{t('projects.card.donors')}</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-600">{t('projects.detail.progress')}</span>
                            <span className="font-semibold text-emerald-600">{progress}%</span>
                        </div>
                        <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        href={`/${locale}/donate?project=${project.id}`}
                        className="block w-full py-4 bg-emerald-600 text-white text-center font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        {t('projects.card.support')}
                    </Link>
                </div>

                {/* Description */}
                <div className="prose prose-neutral max-w-none">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                        {t('projects.about')}
                    </h2>
                    <p className="text-neutral-600 whitespace-pre-wrap leading-relaxed">
                        {trans.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
