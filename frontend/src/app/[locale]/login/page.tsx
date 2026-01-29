'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/services';
import type { AxiosError } from 'axios';

export default function LoginPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            setError(t('auth.login.errors.required'));
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await authApi.login(identifier, password);

            if (response.user.role === 'ADMIN') {
                router.push(`/${locale}/admin`);
            } else {
                router.push(`/${locale}/dashboard`);
            }
        } catch (err: unknown) {
            const apiMessage = (err as AxiosError<{ message?: string }>).response?.data?.message;
            setError(apiMessage || t('auth.login.errors.invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                        {t('auth.login.title')}
                    </h1>
                    <p className="text-neutral-600">
                        {t('auth.login.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                {t('auth.login.email')}
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={t('auth.login.identifierPlaceholder')}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                {t('auth.login.password')}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-neutral-600">{t('auth.login.remember')}</span>
                            </label>
                            <Link href={`/${locale}/forgot-password`} className="text-emerald-600 hover:underline">
                                {t('auth.login.forgot')}
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-8 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? t('auth.login.loading') : t('auth.login.submit')}
                    </button>

                    <p className="text-center text-sm text-neutral-600 mt-6">
                        {t('auth.login.noAccount')}{' '}
                        <Link href={`/${locale}/register`} className="text-emerald-600 font-medium hover:underline">
                            {t('auth.login.register')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
