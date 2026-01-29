'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function NewProjectPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string || 'fr';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        slug: '',
        goalAmount: '',
        isUrgent: false,
        isFeatured: false,
        featuredImage: '',
        gallery: [] as string[],
        translations: {
            fr: { title: '', description: '', shortDesc: '' },
            en: { title: '', description: '', shortDesc: '' },
            ar: { title: '', description: '', shortDesc: '' },
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug) {
            setError('Le slug (URL) est obligatoire');
            return;
        }

        if (!formData.goalAmount) {
            setError('L\'objectif financier est obligatoire');
            return;
        }

        if (!formData.translations.fr.title) {
            setError('Le titre en français est obligatoire');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const translations = Object.entries(formData.translations)
                .filter(([, data]) => data.title)
                .map(([lang, data]) => ({
                    language: lang.toUpperCase(),
                    ...data,
                }));

            await api.post('/projects', {
                slug: formData.slug,
                goalAmount: parseFloat(formData.goalAmount),
                isUrgent: formData.isUrgent,
                isFeatured: formData.isFeatured,
                featuredImage: formData.featuredImage || null,
                gallery: formData.gallery,
                translations,
            });

            router.push(`/${locale}/admin/projects`);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            console.error('Project creation error:', axiosErr.response?.data);
            setError(axiosErr.response?.data?.message || 'Une erreur est survenue lors de la création');
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
                <h1 className="text-2xl font-semibold text-neutral-900">Nouveau projet</h1>
                <p className="text-neutral-500">Créer un nouveau projet de collecte</p>
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
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="mon-projet"
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
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isUrgent}
                                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-neutral-700">Projet urgent</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-neutral-700">Mettre en avant</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Image principale
                    </h2>
                    <CloudinaryUpload
                        value={formData.featuredImage ? [formData.featuredImage] : []}
                        onChange={(urls) => setFormData({ ...formData, featuredImage: urls[0] || '' })}
                        maxFiles={1}
                        folder="waqf/projects"
                    />
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Galerie d&apos;images
                    </h2>
                    <CloudinaryUpload
                        value={formData.gallery}
                        onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                        maxFiles={10}
                        folder="waqf/projects"
                    />
                </div>

                {/* Translations */}
                {['fr', 'en', 'ar'].map((lang) => (
                    <div key={lang} className="bg-white rounded-2xl border border-neutral-200 p-6">
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
                                    placeholder={lang === 'fr' ? 'Titre du projet' : lang === 'en' ? 'Project title' : 'عنوان المشروع'}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description courte
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations[lang as keyof typeof formData.translations].shortDesc}
                                    onChange={(e) => updateTranslation(lang, 'shortDesc', e.target.value)}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description complète {lang === 'fr' && '*'}
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
                        disabled={loading}
                        className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer le projet'}
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
