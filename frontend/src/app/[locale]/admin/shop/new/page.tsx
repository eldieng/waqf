'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { productsApi } from '@/lib/services';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

interface Category {
    id: string;
    slug: string;
    translations: { language: string; name: string }[];
}

export default function NewProductPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        slug: '',
        price: '',
        comparePrice: '',
        stock: '0',
        isActive: true,
        isFeatured: false,
        images: [''],
        categoryIds: [] as string[],
        translations: {
            fr: { name: '', description: '', metaTitle: '', metaDesc: '' },
            en: { name: '', description: '', metaTitle: '', metaDesc: '' },
            ar: { name: '', description: '', metaTitle: '', metaDesc: '' },
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productsApi.getCategories();
                setCategories(data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.slug) {
            setError('Le slug (URL) est obligatoire');
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError('Le prix est obligatoire et doit être supérieur à 0');
            return;
        }

        if (!formData.translations.fr.name) {
            setError('Le nom en français est obligatoire');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const translations = Object.entries(formData.translations)
                .filter(([, data]) => data.name)
                .map(([lang, data]) => ({
                    language: lang.toUpperCase(),
                    name: data.name,
                    description: data.description || null,
                    metaTitle: data.metaTitle || null,
                    metaDesc: data.metaDesc || null,
                }));

            const images = formData.images.filter(img => img.trim() !== '');

            await api.post('/products', {
                slug: formData.slug,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                stock: parseInt(formData.stock) || 0,
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
                images,
                categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
                translations,
            });

            router.push(`/${locale}/admin/shop`);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
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

    const toggleCategory = (categoryId: string) => {
        const newCategoryIds = formData.categoryIds.includes(categoryId)
            ? formData.categoryIds.filter(id => id !== categoryId)
            : [...formData.categoryIds, categoryId];
        setFormData({ ...formData, categoryIds: newCategoryIds });
    };

    const getCategoryName = (cat: Category) => {
        const trans = cat.translations?.find(t => t.language === locale.toUpperCase())
            || cat.translations?.[0];
        return trans?.name || cat.slug;
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/${locale}/admin/shop`}
                    className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    ← Retour
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Nouveau produit</h1>
                    <p className="text-neutral-500">Ajouter un produit au catalogue</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
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
                                placeholder="mon-produit"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Prix (FCFA) *
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="5000"
                                min="0"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Prix barré (FCFA)
                            </label>
                            <input
                                type="number"
                                value={formData.comparePrice}
                                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                placeholder="7000"
                                min="0"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Ancien prix affiché barré</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                min="0"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-neutral-300 text-emerald-600"
                                />
                                <span className="text-sm text-neutral-700">Actif (visible)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded border-neutral-300 text-emerald-600"
                                />
                                <span className="text-sm text-neutral-700">⭐ Produit vedette</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            Catégories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        formData.categoryIds.includes(cat.id)
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    {getCategoryName(cat)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Images */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Images
                    </h2>
                    <CloudinaryUpload
                        value={formData.images.filter(img => img.trim() !== '')}
                        onChange={(urls) => setFormData({ ...formData, images: urls.length > 0 ? urls : [''] })}
                        maxFiles={5}
                        folder="waqf/products"
                    />
                </div>

                {/* Translations */}
                {(['fr', 'en', 'ar'] as const).map((lang) => (
                    <div key={lang} className="bg-white rounded-2xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                            {lang === 'fr' && '🇫🇷 Français'}
                            {lang === 'en' && '🇬🇧 English'}
                            {lang === 'ar' && '🇸🇦 العربية'}
                            {lang === 'fr' && <span className="text-red-500 text-sm">*</span>}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Nom du produit {lang === 'fr' && '*'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.translations[lang].name}
                                    onChange={(e) => updateTranslation(lang, 'name', e.target.value)}
                                    placeholder={lang === 'fr' ? 'T-shirt Waqf' : ''}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.translations[lang].description}
                                    onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            {/* SEO Fields */}
                            <div className="pt-4 border-t border-neutral-100">
                                <h3 className="text-sm font-medium text-neutral-500 mb-4">🔍 Référencement (SEO)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.translations[lang].metaTitle}
                                            onChange={(e) => updateTranslation(lang, 'metaTitle', e.target.value)}
                                            placeholder="Titre pour les moteurs de recherche (60 caractères max)"
                                            maxLength={60}
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {formData.translations[lang].metaTitle.length}/60 caractères
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Meta Description
                                        </label>
                                        <textarea
                                            value={formData.translations[lang].metaDesc}
                                            onChange={(e) => updateTranslation(lang, 'metaDesc', e.target.value)}
                                            placeholder="Description pour les moteurs de recherche (160 caractères max)"
                                            maxLength={160}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {formData.translations[lang].metaDesc.length}/160 caractères
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer le produit'}
                    </button>
                    <Link
                        href={`/${locale}/admin/shop`}
                        className="px-8 py-3 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors"
                    >
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
}
