'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { projectsApi, donationsApi } from '@/lib/services';

interface Stats {
    projects: { total: number; active: number; urgent: number; totalCollected: number };
    donations: { totalDonations: number; totalAmount: number; uniqueDonors: number };
}

export default function AdminDashboard() {
    const params = useParams();
    const locale = params.locale as string || 'fr';
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectStats, donationStats] = await Promise.all([
                    projectsApi.getStats(),
                    donationsApi.getStats(),
                ]);
                setStats({
                    projects: projectStats,
                    donations: donationStats,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Dons',
            value: stats?.donations.totalAmount
                ? `${(stats.donations.totalAmount / 1000000).toFixed(1)}M`
                : '0',
            suffix: 'FCFA',
            icon: '💰',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Donateurs',
            value: stats?.donations.uniqueDonors || 0,
            icon: '👥',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Projets actifs',
            value: stats?.projects.active || 0,
            icon: '🏫',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Projets urgents',
            value: stats?.projects.urgent || 0,
            icon: '🚨',
            color: 'bg-red-50 text-red-600',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500">Vue d&apos;ensemble de la plateforme</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-xl mb-4`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-semibold text-neutral-900">
                            {loading ? '...' : stat.value}
                            {stat.suffix && <span className="text-sm text-neutral-500 ml-1">{stat.suffix}</span>}
                        </div>
                        <div className="text-sm text-neutral-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Link
                    href={`/${locale}/admin/projects/new`}
                    className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            ➕
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Nouveau projet</div>
                            <div className="text-sm text-neutral-500">Créer un projet</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/${locale}/admin/campaigns/new`}
                    className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            📢
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Nouvelle campagne</div>
                            <div className="text-sm text-neutral-500">Lancer une campagne</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/${locale}/admin/donations`}
                    className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-amber-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            📋
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Voir les dons</div>
                            <div className="text-sm text-neutral-500">Historique des dons</div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                    <h2 className="font-semibold text-neutral-900">Activité récente</h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="text-center text-neutral-500 py-8">Chargement...</div>
                    ) : stats?.donations.totalDonations === 0 ? (
                        <div className="text-center text-neutral-500 py-8">
                            Aucune activité récente
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        💰
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-neutral-900">Nouveau don reçu</div>
                                        <div className="text-sm text-neutral-500">Il y a quelques minutes</div>
                                    </div>
                                    <div className="text-sm font-medium text-emerald-600">
                                        10,000 FCFA
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
