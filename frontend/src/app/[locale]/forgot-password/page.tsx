'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '@/lib/services';
import type { AxiosError } from 'axios';

export default function ForgotPasswordPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await usersApi.forgotPassword(identifier);
            setSent(true);
        } catch (err: unknown) {
            console.error('Error:', err);
            const apiMessage = (err as AxiosError<{ message?: string }>).response?.data?.message;
            setError(apiMessage || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href={`/${locale}`} className="inline-block mb-6">
                        <span className="text-4xl">🕌</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        {t('auth.forgot.title')}
                    </h1>
                    <p className="text-neutral-600">
                        {t('auth.forgot.description')}
                    </p>
                </div>

                {sent ? (
                    <div className="card p-8 text-center">
                        <div className="text-5xl mb-4">📧</div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                            {t('auth.forgot.emailSentTitle')}
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            {t('auth.forgot.success')}
                        </p>
                        <Link
                            href={`/${locale}/login`}
                            className="inline-flex px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            {t('auth.forgot.backToLogin')}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                {t('auth.forgot.identifierLabel')}
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={t('auth.forgot.identifierPlaceholder')}
                                required
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? t('auth.forgot.sending') : t('auth.forgot.submit')}
                        </button>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/login`}
                                className="text-sm text-emerald-600 hover:underline"
                            >
                                ← {t('auth.forgot.backToLogin')}
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
