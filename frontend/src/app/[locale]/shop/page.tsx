'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/services';
import { useCart } from '@/lib/cart-context';

interface Product {
    id: string;
    slug: string;
    price: number;
    stock: number;
    images: string[];
    isActive: boolean;
    translations: Array<{
        language: string;
        name: string;
        description?: string;
    }>;
    categories?: Array<{
        category: {
            id: string;
            translations: Array<{ language: string; name: string }>;
        };
    }>;
}

interface Category {
    id: string;
    translations: Array<{ language: string; name: string }>;
}

export default function ShopPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productsApi.getAll({ lang: locale.toUpperCase(), isActive: true }),
                    productsApi.getCategories(locale.toUpperCase()),
                ]);
                setProducts(productsRes.data || []);
                setCategories(categoriesRes || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [locale]);

    const getProductName = (product: Product) => {
        const trans = product.translations?.find(t => t.language === locale.toUpperCase());
        return trans?.name || product.translations?.[0]?.name || 'Produit';
    };

    const getCategoryName = (category: Category) => {
        const trans = category.translations?.find(t => t.language === locale.toUpperCase());
        return trans?.name || category.translations?.[0]?.name || 'Catégorie';
    };

    const filteredProducts = selectedCategory
        ? products.filter(p => p.categories?.some(c => c.category.id === selectedCategory))
        : products;

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                <div className="container relative z-10 text-center">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                        🛍️ {t('shop.cart.footerNote').trim()}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{t('shop.title')}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        {t('shop.subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-12">
                {/* Categories */}
                <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === null
                            ? 'btn-primary'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {t('shop.filter.all')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.id
                                ? 'btn-primary'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {getCategoryName(cat)}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-neutral-500">{t('common.loading')}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-6">🛍️</div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                            {t('shop.empty.title')}
                        </h2>
                        <p className="text-neutral-600">
                            {t('shop.empty.description')}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/${locale}/shop/${product.slug}`}
                                className="card card-hover overflow-hidden group"
                            >
                                <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={getProductName(product)} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-7xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                            🛍️
                                        </span>
                                    )}
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                            <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
                                                {t('shop.product.outOfStock')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                        {product.categories?.[0]?.category?.translations?.[0]?.name || t('shop.product.unknown')}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-4 group-hover:text-emerald-600 transition-colors">
                                        {getProductName(product)}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            {product.price.toLocaleString()} <span className="text-sm">{t('common.currency')}</span>
                                        </span>
                                        {product.stock > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    addItem({
                                                        id: product.id,
                                                        name: getProductName(product),
                                                        price: product.price,
                                                        quantity: 1,
                                                    });
                                                }}
                                                className="btn-secondary py-2 px-4 text-sm"
                                            >
                                                {t('shop.addToCart')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Info Banner */}
                <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 text-center border border-emerald-100">
                    <div className="text-5xl mb-4">💚</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {t('shop.infoBanner.title')}
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('shop.infoBanner.description')}
                    </p>
                </div>
            </div>
        </div>
    );
}
