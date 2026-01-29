'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        slug: '',
        goalAmount: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug || !formData.goalAmount || !formData.startDate || !formData.endDate) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (!formData.translations.fr.title || !formData.translations.fr.description) {
            setError('Le titre et la description en français sont obligatoires');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const translations = Object.entries(formData.translations)
                .filter(([, data]) => data.title && data.description)
                .map(([lang, data]) => ({
                    language: lang.toUpperCase(),
                    ...data,
                }));

            await api.post('/campaigns', {
                slug: formData.slug,
                goalAmount: parseFloat(formData.goalAmount),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                isUrgent: formData.isUrgent,
                featuredImage: formData.featuredImage || null,
                translations,
            });

            router.push('/admin/campaigns');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
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

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-neutral-900">Nouvelle campagne</h1>
                <p className="text-neutral-500">Lancer une nouvelle campagne de collecte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm">
                        {error}
                    </div>
                )}

                {/* Base info */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                        Informations générales
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="ma-campagne-ramadan"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Objectif (FCFA) *
                            </label>
                            <input
                                type="number"
                                value={formData.goalAmount}
                                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                                placeholder="10000000"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Urgent
                            </label>
                            <div className="flex items-center h-[50px]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isUrgent}
                                        onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                                        className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-neutral-700">Marquer comme urgent</span>
                                </label>
                            </div>
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
                </div>

                {/* Image */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
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
                    <div key={lang} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                            {lang === 'fr' && '🇫🇷 Français'}
                            {lang === 'en' && '🇬🇧 English'}
                            {lang === 'ar' && '🇸🇦 العربية'}
                            {lang === 'fr' && <span className="text-xs text-neutral-500">(obligatoire)</span>}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Titre {lang === 'fr' && '*'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations[lang as keyof typeof formData.translations].title}
                                    onChange={(e) => updateTranslation(lang, 'title', e.target.value)}
                                    placeholder={lang === 'fr' ? 'Titre de la campagne' : lang === 'en' ? 'Campaign title' : 'عنوان الحملة'}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description {lang === 'fr' && '*'}
                                </label>
                                <textarea
                                    value={formData.translations[lang as keyof typeof formData.translations].description}
                                    onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                                    rows={4}
                                    placeholder="Décrivez l'objectif de cette campagne..."
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
                        disabled={loading}
                        className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Lancement...' : 'Lancer la campagne'}
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
