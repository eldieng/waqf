'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { productsApi } from '@/lib/services';
import { useCart } from '@/lib/cart-context';

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
    translations: ProductTranslation[];
}

export default function ProductDetailPage() {
    const t = useTranslations();
    const routeParams = useParams();
    const locale = (routeParams.locale as string) || 'fr';
    const slug = routeParams.slug as string;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    
    const { addItem } = useCart();
    const router = useRouter();
    const currency = t('common.currency');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productsApi.getBySlug(slug, locale.toUpperCase());
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug, locale]);

    const getTranslation = () => {
        if (!product) return { name: 'Produit', description: 'Produit non trouvé' };
        const trans = product.translations?.find(t => t.language === locale.toUpperCase()) || product.translations?.[0];
        return trans || { name: product.slug, description: '' };
    };

    const trans = getTranslation();
    const inStock = product ? product.stock > 0 : false;
    const price = product ? Number(product.price) : 0;

    const handleAddToCart = () => {
        if (!product) return;
        
        const trans = getTranslation();
        addItem({
            id: product.id,
            name: trans.name,
            price: Number(product.price),
            quantity: quantity,
        });
        
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            router.push(`/${locale}/shop/cart`);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛍️</div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Produit non trouvé</h1>
                    <Link href={`/${locale}/shop`} className="text-emerald-600 hover:underline">
                        ← Retour à la boutique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-5xl">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link href={`/${locale}/shop`} className="text-sm text-neutral-500 hover:text-neutral-900">
                        ← {t('shop.product.backToShop')}
                    </Link>
                </nav>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="h-96 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        {product.images?.[0] ? (
                            <img 
                                src={product.images[0]} 
                                alt={trans.name} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-8xl">🛍️</span>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">
                            {trans.name}
                        </h1>

                        <div className="text-3xl font-bold text-emerald-600 mb-6">
                            {price.toLocaleString()} {currency}
                        </div>

                        <p className="text-neutral-600 mb-8">
                            {trans.description || 'Aucune description disponible'}
                        </p>

                        {/* Stock info */}
                        <div className="mb-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {inStock ? `${product.stock} en stock` : 'Rupture de stock'}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">
                                {t('shop.product.quantity')}
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-neutral-100 rounded-lg text-lg font-medium hover:bg-neutral-200"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 bg-neutral-100 rounded-lg text-lg font-medium hover:bg-neutral-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            className={`w-full py-4 font-semibold rounded-xl transition-colors ${addedToCart
                                    ? 'bg-emerald-600 text-white'
                                    : inStock
                                        ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                                        : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            {addedToCart
                                ? t('shop.product.addedToCart')
                                : inStock
                                    ? t('shop.product.addToCartWithTotal', {
                                          total: (price * quantity).toLocaleString(),
                                          currency,
                                      })
                                    : t('shop.product.outOfStock')}
                        </button>

                        {/* Info */}
                        <div className="mt-8 p-4 bg-emerald-50 rounded-xl">
                            <p className="text-sm text-emerald-700">
                                💚 {t('shop.cart.footerNote').trim()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
