'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Category {
    id: string;
    slug: string;
    createdAt: string;
    translations: { language: string; name: string }[];
    _count?: { products: number };
}

export default function AdminCategoriesPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        slug: '',
        translations: {
            fr: { name: '' },
            en: { name: '' },
            ar: { name: '' },
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products/categories');
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (cat: Category) => {
        const trans = cat.translations?.find(t => t.language === locale.toUpperCase())
            || cat.translations?.[0];
        return trans?.name || cat.slug;
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({
            slug: '',
            translations: {
                fr: { name: '' },
                en: { name: '' },
                ar: { name: '' },
            },
        });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        const translationsMap = {
            fr: { name: '' },
            en: { name: '' },
            ar: { name: '' },
        };
        category.translations?.forEach(t => {
            const lang = t.language.toLowerCase() as keyof typeof translationsMap;
            if (translationsMap[lang]) {
                translationsMap[lang] = { name: t.name || '' };
            }
        });
        setFormData({
            slug: category.slug,
            translations: translationsMap,
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug) {
            setError('Le slug est obligatoire');
            return;
        }
        if (!formData.translations.fr.name) {
            setError('Le nom en français est obligatoire');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const translations = Object.entries(formData.translations)
                .filter(([, data]) => data.name)
                .map(([lang, data]) => ({
                    language: lang.toUpperCase(),
                    name: data.name,
                }));

            if (editingCategory) {
                await api.put(`/products/categories/${editingCategory.id}`, {
                    slug: formData.slug,
                    translations,
                });
            } else {
                await api.post('/products/categories', {
                    slug: formData.slug,
                    translations,
                });
            }

            setShowModal(false);
            fetchCategories();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            await api.delete(`/products/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Erreur lors de la suppression');
        }
    };

    const updateTranslation = (lang: string, value: string) => {
        setFormData({
            ...formData,
            translations: {
                ...formData.translations,
                [lang]: { name: value },
            },
        });
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${locale}/admin/shop`}
                        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        ← Retour
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900">Catégories</h1>
                        <p className="text-neutral-500">Gérez les catégories de produits</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    + Nouvelle catégorie
                </button>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📁</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">Aucune catégorie</div>
                        <p className="text-neutral-500 mb-6">Créez votre première catégorie</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Créer une catégorie
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Catégorie</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Slug</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Produits</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-neutral-900">
                                            {getCategoryName(category)}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {category.translations?.length || 0} traduction(s)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                                            {category._count?.products || 0} produit(s)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Slug (URL) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    placeholder="vetements"
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    🇫🇷 Nom (Français) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations.fr.name}
                                    onChange={(e) => updateTranslation('fr', e.target.value)}
                                    placeholder="Vêtements"
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    🇬🇧 Name (English)
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations.en.name}
                                    onChange={(e) => updateTranslation('en', e.target.value)}
                                    placeholder="Clothing"
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    🇸🇦 الاسم (العربية)
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations.ar.name}
                                    onChange={(e) => updateTranslation('ar', e.target.value)}
                                    placeholder="ملابس"
                                    dir="rtl"
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Enregistrement...' : editingCategory ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
