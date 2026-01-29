'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { projectsApi, Project } from '@/lib/services';
import api from '@/lib/api';

export default function AdminProjectsPage() {
    const params = useParams();
    const locale = params.locale as string || 'fr';
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsApi.getAll({ limit: 50 });
            setProjects(response.data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const getProgress = (project: Project) => {
        if (!project.goalAmount) return 0;
        return Math.min(Math.round((Number(project.collectedAmount) / Number(project.goalAmount)) * 100), 100);
    };

    const statusColors: Record<string, string> = {
        DRAFT: 'bg-neutral-100 text-neutral-600',
        ACTIVE: 'bg-emerald-100 text-emerald-600',
        PAUSED: 'bg-amber-100 text-amber-600',
        COMPLETED: 'bg-blue-100 text-blue-600',
        CANCELLED: 'bg-red-100 text-red-600',
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Projets</h1>
                    <p className="text-neutral-500">Gérez les projets de la plateforme</p>
                </div>
                <Link
                    href={`/${locale}/admin/projects/new`}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    + Nouveau projet
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📭</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">
                            Aucun projet
                        </div>
                        <p className="text-neutral-500 mb-6">
                            Créez votre premier projet pour commencer
                        </p>
                        <Link
                            href={`/${locale}/admin/projects/new`}
                            className="inline-flex px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Créer un projet
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Projet</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Statut</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Progression</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Donateurs</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {projects.map((project) => {
                                    const trans = project.translations?.[0] || { title: 'Sans titre' };
                                    const progress = getProgress(project);

                                    return (
                                        <tr key={project.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-lg">
                                                        🏫
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-neutral-900">{trans.title}</div>
                                                        <div className="text-xs text-neutral-500">{project.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors.DRAFT}`}>
                                                    {project.status}
                                                </span>
                                                {project.isUrgent && (
                                                    <span className="ml-2 inline-flex px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                                        Urgent
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-32">
                                                    <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                                                        <span>{(Number(project.collectedAmount) / 1000000).toFixed(1)}M</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {project.donorCount}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/${locale}/admin/projects/${project.id}/edit`}
                                                        className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        ✏️
                                                    </Link>
                                                    <Link
                                                        href={`/${locale}/projects/${project.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Voir"
                                                    >
                                                        👁️
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
