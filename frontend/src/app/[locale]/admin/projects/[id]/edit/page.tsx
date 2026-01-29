'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Project } from '@/lib/services';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function EditProjectPage() {
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

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get<Project>(`/projects/${id}`);

                const translationsMap = {
                    fr: { title: '', description: '', shortDesc: '' },
                    en: { title: '', description: '', shortDesc: '' },
                    ar: { title: '', description: '', shortDesc: '' },
                };

                data.translations.forEach(t => {
                    const lang = t.language.toLowerCase() as keyof typeof translationsMap;
                    if (translationsMap[lang]) {
                        translationsMap[lang] = {
                            title: t.title || '',
                            description: t.description || '',
                            shortDesc: t.shortDesc || '',
                        };
                    }
                });

                const projectData = data as Project & { featuredImage?: string; gallery?: string[] };
                setFormData({
                    slug: projectData.slug,
                    goalAmount: projectData.goalAmount.toString(),
                    status: projectData.status,
                    isUrgent: projectData.isUrgent,
                    isFeatured: projectData.isFeatured,
                    featuredImage: projectData.featuredImage || '',
                    gallery: projectData.gallery || [],
                    translations: translationsMap,
                });
            } catch (err) {
                console.error('Error fetching project:', err);
                setError('Impossible de charger le projet');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug || !formData.goalAmount) {
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

            await api.put(`/projects/${id}`, {
                slug: formData.slug,
                goalAmount: parseFloat(formData.goalAmount),
                status: formData.status,
                isUrgent: formData.isUrgent,
                isFeatured: formData.isFeatured,
                featuredImage: formData.featuredImage || null,
                gallery: formData.gallery,
                translations,
            });

            router.push(`/${locale}/admin/projects`);
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
                <h1 className="text-2xl font-semibold text-neutral-900">Modifier le projet</h1>
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
                                    Description complète
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
