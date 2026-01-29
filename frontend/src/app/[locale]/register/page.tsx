'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/services';
import type { AxiosError } from 'axios';

export default function RegisterPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email && !formData.phone) {
            setError(t('auth.register.errors.emailOrPhoneRequired'));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.errors.passwordMismatch'));
            return;
        }

        if (formData.password.length < 8) {
            setError(t('auth.register.errors.passwordMinLength'));
            return;
        }

        try {
            setLoading(true);
            setError('');
            await authApi.register({
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                password: formData.password,
                firstName: formData.firstName || undefined,
                lastName: formData.lastName || undefined,
            });
            router.push(`/${locale}/dashboard`);
        } catch (err: unknown) {
            const apiMessage = (err as AxiosError<{ message?: string }>).response?.data?.message;
            setError(apiMessage || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-neutral-600">
                        {t('auth.register.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={t('auth.register.firstName')}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder={t('auth.register.lastName')}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('auth.register.email')}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                        />

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t('auth.register.phone')}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                        />

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t('auth.register.password')}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t('auth.register.confirmPassword')}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-6 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? t('auth.register.loading') : t('auth.register.submit')}
                    </button>

                    <p className="text-center text-sm text-neutral-600 mt-6">
                        {t('auth.register.hasAccount')}{' '}
                        <Link href={`/${locale}/login`} className="text-emerald-600 font-medium hover:underline">
                            {t('auth.register.login')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
