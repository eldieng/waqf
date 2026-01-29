'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const { items, updateQuantity, removeItem, total, clearCart } = useCart();

    const currency = t('common.currency');
    const shippingCost = 2000;

    if (items.length === 0) {
        return (
            <div className="min-h-screen py-16">
                <div className="container max-w-2xl text-center">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                        {t('shop.cart.empty')}
                    </h1>
                    <p className="text-neutral-600 mb-8">
                        {t('shop.subtitle')}
                    </p>
                    <Link
                        href={`/${locale}/shop`}
                        className="inline-flex px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700"
                    >
                        {t('shop.cart.backToShop')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                <h1 className="text-2xl font-semibold text-neutral-900 mb-8">
                    {t('shop.cart.title')}
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="card p-4 flex gap-4">
                                <div className="w-20 h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                                    🛍️
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-neutral-900">{item.name}</h3>
                                    {item.size && (
                                        <p className="text-sm text-neutral-500">
                                            {t('shop.cart.size')}: {item.size}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 bg-neutral-100 rounded-lg text-sm font-medium"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 bg-neutral-100 rounded-lg text-sm font-medium"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-emerald-600">
                                        {(item.price * item.quantity).toLocaleString()} {currency}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm text-red-500 hover:underline mt-2"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-neutral-500 hover:text-neutral-700"
                        >
                            {t('shop.cart.clear')}
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="card p-6 h-fit">
                        <h2 className="font-semibold text-neutral-900 mb-4">{t('shop.cart.summary')}</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t('shop.cart.subtotal')}</span>
                                <span className="font-medium">{total.toLocaleString()} {currency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t('shop.cart.shipping')}</span>
                                <span className="font-medium">{shippingCost.toLocaleString()} {currency}</span>
                            </div>
                            <div className="border-t border-neutral-100 pt-3 flex justify-between">
                                <span className="font-semibold text-neutral-900">{t('shop.cart.total')}</span>
                                <span className="font-bold text-emerald-600">
                                    {(total + shippingCost).toLocaleString()} {currency}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/${locale}/shop/checkout`}
                            className="block w-full py-4 bg-emerald-600 text-white text-center font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            {t('shop.cart.checkout')}
                        </Link>

                        <p className="text-xs text-neutral-500 text-center mt-4">
                            {t('shop.cart.footerNote')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
