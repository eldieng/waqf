'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { authApi, donationsApi } from '@/lib/services';
import { useParams } from 'next/navigation';

type DonorProfile = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    createdAt?: string;
};

type DonationRow = {
    id: string;
    amount: number;
    createdAt: string;
    paymentMethod: string;
    project?: {
        translations?: Array<{ title: string }>;
    };
};

export default function DonorDashboard() {
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string || 'fr';
    const [profile, setProfile] = useState<DonorProfile | null>(null);
    const [recentDonations, setRecentDonations] = useState<DonationRow[]>([]);
    const [loading, setLoading] = useState(true);

    const currency = t('common.currency');
    const dateLocale = locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, donationsData] = await Promise.all([
                    authApi.getProfile(),
                    donationsApi.getMyDonations(),
                ]);
                setProfile(profileData as DonorProfile);
                setRecentDonations((donationsData.data || []) as DonationRow[]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        {t('dashboard.greeting', { name: profile?.firstName || t('dashboard.defaultName') })}
                    </h1>
                    <p className="text-neutral-500">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    {(profile?.role === 'ADMIN' || profile?.role === 'MANAGER') && (
                        <Link 
                            href={`/${locale}/admin`} 
                            className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Administration
                        </Link>
                    )}
                    <Link href={`/${locale}/donate`} className="btn-primary">
                        {t('dashboard.actions.newDonation')}
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-6">{t('dashboard.profile.title')}</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                                {profile?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                                <div className="font-semibold text-lg">{profile?.firstName} {profile?.lastName}</div>
                                <div className="text-sm text-neutral-500">{profile?.email}</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">{t('dashboard.profile.phone')}</span>
                                <span className="font-medium">{profile?.phone || t('dashboard.profile.notProvided')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">{t('dashboard.profile.memberSince')}</span>
                                <span className="font-medium">
                                    {profile?.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString(dateLocale)
                                        : t('dashboard.profile.defaultMemberSince')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                            <div className="text-sm text-emerald-600 font-semibold mb-1 uppercase tracking-wider">{t('dashboard.stats.totalDonations')}</div>
                            <div className="text-3xl font-bold text-emerald-900">
                                {recentDonations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()} <span className="text-lg">{currency}</span>
                            </div>
                        </div>
                        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                            <div className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">{t('dashboard.stats.donationCount')}</div>
                            <div className="text-3xl font-bold text-blue-900">{recentDonations.length}</div>
                        </div>
                    </div>

                    {/* Recent Donations */}
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="font-bold text-xl">{t('dashboard.donations.recentTitle')}</h2>
                            <Link href={`/${locale}/dashboard/donations`} className="text-emerald-600 font-medium text-sm hover:underline">
                                {t('common.viewAll')}
                            </Link>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {recentDonations.length > 0 ? (
                                recentDonations.slice(0, 5).map((donation) => (
                                    <div key={donation.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                        <div>
                                            <div className="font-semibold text-neutral-900">
                                                {donation.project?.translations?.[0]?.title || t('donate.allocation.general')}
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                {new Date(donation.createdAt).toLocaleDateString(dateLocale)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-emerald-600">+{donation.amount.toLocaleString()} {currency}</div>
                                            <div className="text-xs text-neutral-400 capitalize">{donation.paymentMethod}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-neutral-500">
                                    <div className="text-4xl mb-4">🕌</div>
                                    <p>{t('dashboard.donations.empty')}</p>
                                    <Link href={`/${locale}/donate`} className="text-emerald-600 font-medium mt-2 inline-block">
                                        {t('dashboard.donations.startSupporting')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
