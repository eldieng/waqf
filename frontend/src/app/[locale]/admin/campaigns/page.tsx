'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { campaignsApi } from '@/lib/services';
import api from '@/lib/api';

export default function AdminCampaigns() {
    const params = useParams();
    const locale = params.locale as string || 'fr';
    interface CampaignItem {
        id: string;
        slug: string;
        status: string;
        isUrgent: boolean;
        goalAmount: number;
        collectedAmount: number;
        startDate: string;
        endDate: string;
        translations?: { title?: string }[];
    }
    const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await campaignsApi.getAll({ limit: 50 });
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return;
        try {
            await api.delete(`/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
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
                    <h1 className="text-2xl font-semibold text-neutral-900">Campagnes</h1>
                    <p className="text-neutral-500">Gérez vos campagnes de collecte</p>
                </div>
                <Link
                    href={`/${locale}/admin/campaigns/new`}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    + Nouvelle campagne
                </Link>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 animate-pulse">
                            <div className="h-32 bg-neutral-100 rounded-xl mb-4" />
                            <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-neutral-100 rounded w-1/2" />
                        </div>
                    ))
                ) : campaigns.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                        <div className="text-4xl mb-4">📢</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">
                            Aucune campagne
                        </div>
                        <p className="text-neutral-500 mb-6">
                            Lancez votre première campagne de collecte
                        </p>
                        <Link
                            href={`/${locale}/admin/campaigns/new`}
                            className="inline-flex px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Créer une campagne
                        </Link>
                    </div>
                ) : (
                    campaigns.map((campaign) => {
                        const trans = campaign.translations?.[0] || { title: 'Sans titre' };
                        const progress = campaign.goalAmount
                            ? Math.round((Number(campaign.collectedAmount) / Number(campaign.goalAmount)) * 100)
                            : 0;

                        return (
                            <div key={campaign.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-4xl">
                                    📢
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                                            {campaign.status}
                                        </span>
                                        {campaign.isUrgent && (
                                            <span className="inline-flex px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                                Urgent
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-neutral-900 mb-2">{trans.title}</h3>

                                    <div className="text-sm text-neutral-500 mb-4">
                                        {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                            <span>{(Number(campaign.collectedAmount) / 1000000).toFixed(1)}M FCFA</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/${locale}/admin/campaigns/${campaign.id}/edit`}
                                            className="flex-1 py-2 text-center text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                                        >
                                            Modifier
                                        </Link>
                                        <Link
                                            href={`/${locale}/campaigns/${campaign.slug}`}
                                            target="_blank"
                                            className="px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                                            title="Voir"
                                        >
                                            👁️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(campaign.id)}
                                            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
