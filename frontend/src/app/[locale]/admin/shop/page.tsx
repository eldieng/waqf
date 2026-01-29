'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productsApi } from '@/lib/services';

interface ProductTranslation {
    language: string;
    name: string;
    description?: string;
}

interface Product {
    id: string;
    slug: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    translations: ProductTranslation[];
    categories?: { category: { id: string; translations: { name: string }[] } }[];
}

export default function AdminShopPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const isActive = filter === 'all' ? undefined : filter === 'active';
                const response = await productsApi.getAll({
                    search: searchQuery || undefined,
                    isActive,
                    page,
                    limit: 20,
                });
                setProducts(response.data || []);
                setTotalPages(response.meta?.totalPages || 1);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery, page, filter]);

    const getProductName = (product: Product) => {
        const trans = product.translations?.find(t => t.language === locale.toUpperCase()) 
            || product.translations?.[0];
        return trans?.name || 'Sans nom';
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-700' };
        if (stock <= 5) return { label: 'Stock faible', color: 'bg-amber-100 text-amber-700' };
        return { label: 'En stock', color: 'bg-emerald-100 text-emerald-700' };
    };

    const stats = [
        { label: 'Total produits', value: products.length, color: 'text-neutral-900' },
        { label: 'En stock', value: products.filter(p => p.stock > 0).length, color: 'text-emerald-600' },
        { label: 'Rupture', value: products.filter(p => p.stock === 0).length, color: 'text-red-600' },
        { label: 'Inactifs', value: products.filter(p => !p.isActive).length, color: 'text-amber-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Boutique</h1>
                    <p className="text-neutral-500">Gérez vos produits et votre catalogue</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/${locale}/admin/shop/categories`}
                        className="px-5 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                        📁 Catégories
                    </Link>
                    <Link
                        href={`/${locale}/admin/shop/new`}
                        className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        + Nouveau produit
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
                        <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-neutral-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    placeholder="Rechercher un produit..."
                    className="flex-1 min-w-[200px] max-w-md px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                />
                <div className="flex gap-2">
                    {(['all', 'active', 'inactive'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === f
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                        >
                            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Inactifs'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">🛍️</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">Aucun produit</div>
                        <p className="text-neutral-500 mb-6">Ajoutez votre premier produit pour commencer</p>
                        <Link
                            href={`/${locale}/admin/shop/new`}
                            className="inline-flex px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Créer un produit
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Produit</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Prix</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Stock</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Statut</th>
                                        <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {products.map((product) => {
                                        const stockStatus = getStockStatus(product.stock);
                                        return (
                                            <tr key={product.id} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                            {product.images?.[0] ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={getProductName(product)}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-2xl">📦</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-neutral-900">
                                                                {getProductName(product)}
                                                            </div>
                                                            <div className="text-xs text-neutral-500">{product.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-neutral-900">
                                                        {Number(product.price).toLocaleString()} FCFA
                                                    </div>
                                                    {product.comparePrice && (
                                                        <div className="text-xs text-neutral-400 line-through">
                                                            {Number(product.comparePrice).toLocaleString()} FCFA
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-neutral-900">{product.stock}</span>
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                            {stockStatus.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                        product.isActive
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-neutral-100 text-neutral-600'
                                                    }`}>
                                                        {product.isActive ? 'Actif' : 'Inactif'}
                                                    </span>
                                                    {product.isFeatured && (
                                                        <span className="ml-2 inline-flex px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                            ⭐ Vedette
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/${locale}/admin/shop/${product.id}/edit`}
                                                            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            ✏️
                                                        </Link>
                                                        <Link
                                                            href={`/${locale}/shop/${product.slug}`}
                                                            target="_blank"
                                                            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                                                            title="Voir"
                                                        >
                                                            👁️
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

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
