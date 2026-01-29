'use client';

import { useEffect, useState } from 'react';
import { donationsApi } from '@/lib/services';

interface Donation {
    id: string;
    amount: number;
    currency: string;
    type: string;
    donorName: string;
    isAnonymous: boolean;
    message?: string;
    createdAt: string;
    project?: { id: string; slug: string };
    campaign?: { id: string; slug: string };
}

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                const response = await donationsApi.getRecent({ page, limit: 20 });
                setDonations(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (error) {
                console.error('Error fetching donations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [page]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Dons</h1>
                    <p className="text-neutral-500">Historique des dons reçus</p>
                </div>
                <button className="px-5 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors">
                    📥 Exporter CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Aujourd'hui", value: '0', color: 'text-emerald-600' },
                    { label: 'Cette semaine', value: '0', color: 'text-blue-600' },
                    { label: 'Ce mois', value: '0', color: 'text-amber-600' },
                    { label: 'Total', value: donations.length.toString(), color: 'text-neutral-900' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
                        <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-neutral-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : donations.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">💰</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">
                            Aucun don pour le moment
                        </div>
                        <p className="text-neutral-500">
                            Les dons apparaîtront ici une fois confirmés
                        </p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Donateur</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Montant</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Type</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Projet/Campagne</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium">
                                                    {donation.isAnonymous ? '?' : (donation.donorName?.[0] || 'D')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900">
                                                        {donation.isAnonymous ? 'Anonyme' : donation.donorName || 'Donateur'}
                                                    </div>
                                                    {donation.message && (
                                                        <div className="text-sm text-neutral-500 truncate max-w-xs">
                                                            {donation.message}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-emerald-600">
                                                {donation.amount.toLocaleString()} {donation.currency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${donation.type === 'MONTHLY'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-neutral-100 text-neutral-600'
                                                }`}>
                                                {donation.type === 'MONTHLY' ? 'Mensuel' : 'Ponctuel'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">
                                            {donation.project?.slug || donation.campaign?.slug || 'Général'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {formatDate(donation.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 p-4 border-t border-neutral-100">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-neutral-200 rounded-lg text-sm disabled:opacity-50"
                                >
                                    Précédent
                                </button>
                                <span className="px-4 py-2 text-sm text-neutral-600">
                                    Page {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border border-neutral-200 rounded-lg text-sm disabled:opacity-50"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
