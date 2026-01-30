'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { contentsApi } from '@/lib/services';

const languages = ['fr', 'en', 'ar'];
const contentTypeOptions = [
    { value: 'ARTICLE', label: 'Article' },
    { value: 'EVENT', label: 'Événement' },
    { value: 'PAGE', label: 'Page' },
    { value: 'FAQ', label: 'FAQ' },
];

export default function NewContentPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        slug: '',
        type: 'ARTICLE',
        isPublished: true,
        featuredImage: '',
        translations: {
            fr: { title: '', body: '', excerpt: '' },
            en: { title: '', body: '', excerpt: '' },
            ar: { title: '', body: '', excerpt: '' },
        } as Record<string, { title: string; body: string; excerpt: string }>,
    });

    const updateTranslation = (lang: string, field: string, value: string) => {
        setFormData({
            ...formData,
            translations: {
                ...formData.translations,
                [lang]: {
                    ...formData.translations[lang],
                    [field]: value,
                },
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug) {
            setError('Le slug est obligatoire');
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
                    title: data.title,
                    body: data.body,
                    excerpt: data.excerpt || undefined,
                }));

            await contentsApi.create({
                slug: formData.slug,
                type: formData.type,
                isPublished: formData.isPublished,
                featuredImage: formData.featuredImage || undefined,
                translations,
            });

            router.push(`/${locale}/admin/content`);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            console.error('Content creation error:', axiosErr.response?.data);
            setError(axiosErr.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                        <Link href={`/${locale}/admin/content`} className="hover:text-emerald-600">
                            Contenu
                        </Link>
                        <span>/</span>
                        <span>Nouveau</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Nouveau contenu</h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
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
                                placeholder="mon-article"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Type de contenu *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            >
                                {contentTypeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Image de couverture (URL)
                            </label>
                            <input
                                type="text"
                                value={formData.featuredImage}
                                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="isPublished" className="text-sm font-medium text-neutral-700">
                                Publier immédiatement
                            </label>
                        </div>
                    </div>
                </div>

                {/* Translations */}
                {languages.map((lang) => (
                    <div key={lang} className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm font-bold">
                                {lang.toUpperCase()}
                            </span>
                            {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}
                            {lang === 'fr' && <span className="text-red-500">*</span>}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Titre {lang === 'fr' && '*'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations[lang].title}
                                    onChange={(e) => updateTranslation(lang, 'title', e.target.value)}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Extrait / Résumé
                                </label>
                                <textarea
                                    value={formData.translations[lang].excerpt}
                                    onChange={(e) => updateTranslation(lang, 'excerpt', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Contenu
                                </label>
                                <textarea
                                    value={formData.translations[lang].body}
                                    onChange={(e) => updateTranslation(lang, 'body', e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={`/${locale}/admin/content`}
                        className="px-6 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer le contenu'}
                    </button>
                </div>
            </form>
        </div>
    );
}
