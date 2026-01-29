'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/services';
import { useParams } from 'next/navigation';

export default function ProjectsPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectsApi.getAll({ page, limit: 9 });
                setProjects(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [page]);

    const getTranslation = (project: Project) => {
        const trans = project.translations?.find((tr) => tr.language === locale.toUpperCase());
        return trans || project.translations?.[0] || { title: t('news.untitled'), description: '', shortDesc: '' };
    };

    const getProgress = (project: Project) => {
        if (!project.goalAmount) return 0;
        return Math.min(Math.round((Number(project.collectedAmount) / Number(project.goalAmount)) * 100), 100);
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-neutral-900 mb-4">{t('projects.title')}</h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        {t('projects.subtitle')}
                    </p>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card p-6 animate-pulse">
                                <div className="h-40 bg-neutral-100 rounded-xl mb-5" />
                                <div className="h-4 bg-neutral-100 rounded w-3/4 mb-3" />
                                <div className="h-3 bg-neutral-100 rounded w-full mb-2" />
                                <div className="h-3 bg-neutral-100 rounded w-2/3 mb-4" />
                                <div className="h-2 bg-neutral-100 rounded w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const trans = getTranslation(project);
                            const progress = getProgress(project);

                            return (
                                <Link
                                    key={project.id}
                                    href={`/${locale}/projects/${project.slug}`}
                                    className="card group"
                                >
                                    {/* Image */}
                                    <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center relative overflow-hidden">
                                        {project.featuredImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={project.featuredImage}
                                                alt={trans.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="text-5xl">🏫</span>
                                        )}
                                        {project.isUrgent && (
                                            <span className="absolute top-3 left-3 badge badge-urgent">
                                                {t('projects.filter.urgent')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {trans.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                            {trans.shortDesc || trans.description}
                                        </p>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-neutral-500">
                                                    {(Number(project.collectedAmount) / 1000000).toFixed(1)}M {t('common.currency')}
                                                </span>
                                                <span className="font-medium text-emerald-600">{progress}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-neutral-500">
                                            <span>{project.donorCount} {t('projects.card.donors')}</span>
                                            <span className="text-emerald-600 font-medium group-hover:underline">
                                                {t('projects.card.viewMore')} →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                        >
                            {t('projects.pagination.previous')}
                        </button>
                        <span className="px-4 py-2 text-sm text-neutral-600">
                            {t('projects.pagination.page', { page, totalPages })}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                        >
                            {t('projects.pagination.next')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
