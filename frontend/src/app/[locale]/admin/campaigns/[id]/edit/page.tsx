'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Campaign } from '@/lib/services';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function EditCampaignPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const locale = params.locale as string || 'fr';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        slug: '',
        goalAmount: '',
        status: '',
        startDate: '',
        endDate: '',
        isUrgent: false,
        featuredImage: '',
        translations: {
            fr: { title: '', description: '' },
            en: { title: '', description: '' },
            ar: { title: '', description: '' },
        },
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const { data } = await api.get<Campaign>(`/campaigns/${id}`);

                const translationsMap = {
                    fr: { title: '', description: '' },
                    en: { title: '', description: '' },
                    ar: { title: '', description: '' },
                };

                data.translations.forEach(t => {
                    const lang = t.language.toLowerCase() as keyof typeof translationsMap;
                    if (translationsMap[lang]) {
                        translationsMap[lang] = {
                            title: t.title || '',
                            description: t.description || '',
                        };
                    }
                });

                // Format dates for input type="date" (YYYY-MM-DD)
                const formatDate = (dateStr: string) => {
                    if (!dateStr) return '';
                    return new Date(dateStr).toISOString().split('T')[0];
                };

                const campaignData = data as Campaign & { featuredImage?: string };
                setFormData({
                    slug: campaignData.slug,
                    goalAmount: campaignData.goalAmount.toString(),
                    status: campaignData.status,
                    startDate: formatDate(campaignData.startDate),
                    endDate: formatDate(campaignData.endDate),
                    isUrgent: campaignData.isUrgent,
                    featuredImage: campaignData.featuredImage || '',
                    translations: translationsMap,
                });
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError('Impossible de charger la campagne');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCampaign();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug || !formData.goalAmount || !formData.startDate || !formData.endDate) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const translations = Object.entries(formData.translations)
                .filter(([, data]) => data.title)
                .map(([lang, data]) => ({
                    language: lang.toUpperCase(),
                    ...data,
                }));

            await api.put(`/campaigns/${id}`, {
                slug: formData.slug,
                goalAmount: parseFloat(formData.goalAmount),
                status: formData.status,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                isUrgent: formData.isUrgent,
                featuredImage: formData.featuredImage || null,
                translations,
            });

            router.push(`/${locale}/admin/campaigns`);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const updateTranslation = (lang: string, field: string, value: string) => {
        setFormData({
            ...formData,
            translations: {
                ...formData.translations,
                [lang]: {
                    ...formData.translations[lang as keyof typeof formData.translations],
                    [field]: value,
                },
            },
        });
    };

    if (loading) return <div className="p-8 text-center text-neutral-500">Chargement...</div>;

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-neutral-900">Modifier la campagne</h1>
                <p className="text-neutral-500">Modification de {formData.slug}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Base info */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                        Informations générales
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Statut
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            >
                                <option value="DRAFT">Brouillon</option>
                                <option value="ACTIVE">Actif</option>
                                <option value="PAUSED">En pause</option>
                                <option value="COMPLETED">Terminé</option>
                                <option value="CANCELLED">Annulé</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Objectif (FCFA) *
                            </label>
                            <input
                                type="number"
                                value={formData.goalAmount}
                                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Date de début *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Date de fin *
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isUrgent}
                                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-neutral-700">Urgent</span>
                        </label>
                    </div>
                </div>

                {/* Image */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Image de la campagne
                    </h2>
                    <CloudinaryUpload
                        value={formData.featuredImage ? [formData.featuredImage] : []}
                        onChange={(urls) => setFormData({ ...formData, featuredImage: urls[0] || '' })}
                        maxFiles={1}
                        folder="waqf/campaigns"
                    />
                </div>

                {/* Translations */}
                {['fr', 'en', 'ar'].map((lang) => (
                    <div key={lang} className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                            {lang === 'fr' && '🇫🇷 Français'}
                            {lang === 'en' && '🇬🇧 English'}
                            {lang === 'ar' && '🇸🇦 العربية'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations[lang as keyof typeof formData.translations].title}
                                    onChange={(e) => updateTranslation(lang, 'title', e.target.value)}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.translations[lang as keyof typeof formData.translations].description}
                                    onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
