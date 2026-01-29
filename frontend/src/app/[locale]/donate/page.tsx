'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { donationsApi, projectsApi, Project } from '@/lib/services';
import type { AxiosError } from 'axios';

const AMOUNTS = [5000, 10000, 25000, 50000, 100000];
const PAYMENT_METHODS = [
    { id: 'WAVE', name: 'Wave', icon: '📱' },
    { id: 'ORANGE_MONEY', name: 'Orange Money', icon: '🟠' },
    { id: 'FREE_MONEY', name: 'Free Money', icon: '🔵' },
    { id: 'CARD', name: 'Carte bancaire', icon: '💳' },
];

function DonateForm() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const searchParams = useSearchParams();
    const projectId = searchParams.get('project');

    const [project, setProject] = useState<Project | null>(null);
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState(10000);
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('WAVE');
    const [donorInfo, setDonorInfo] = useState({
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        isAnonymous: false,
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currency = t('common.currency');

    useEffect(() => {
        if (projectId) {
            projectsApi.getById(projectId).then(setProject).catch(console.error);
        }
    }, [projectId]);

    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    const getProjectTitle = (p: Project) => {
        const trans = p.translations?.find((tr) => tr.language === locale.toUpperCase());
        return trans?.title || p.translations?.[0]?.title || t('news.untitled');
    };

    const handleSubmit = async () => {
        if (finalAmount < 100) {
            setError(t('donate.errors.minAmount', { amount: 100, currency }));
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await donationsApi.create({
                amount: finalAmount,
                paymentMethod,
                projectId: projectId || undefined,
                ...donorInfo,
            });

            // Redirect to payment provider
            if (response.paymentData?.checkoutUrl) {
                window.location.href = response.paymentData.checkoutUrl;
            }
        } catch (err: unknown) {
            const apiMessage = (err as AxiosError<{ message?: string }>).response?.data?.message;
            setError(apiMessage || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
                        {t('donate.title')}
                    </h1>
                    <p className="text-neutral-600">
                        {project
                            ? t('donate.forProject', { title: getProjectTitle(project) })
                            : t('donate.subtitle')}
                    </p>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-neutral-100 text-neutral-400'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && <div className="w-12 h-0.5 bg-neutral-200" />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Amount */}
                {step === 1 && (
                    <div className="card p-8">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                            {t('donate.chooseAmount')}
                        </h2>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {AMOUNTS.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => {
                                        setAmount(a);
                                        setCustomAmount('');
                                    }}
                                    className={`py-4 rounded-xl font-medium transition-all ${amount === a && !customAmount
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                        }`}
                                >
                                    {a.toLocaleString()} {currency}
                                </button>
                            ))}
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                {t('donate.amount.custom')}
                            </label>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder={t('donate.amount.placeholder')}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none"
                            />
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            {t('donate.actions.continueWithAmount', {
                                amount: finalAmount.toLocaleString(),
                                currency,
                            })}
                        </button>
                    </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                    <div className="card p-8">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                            {t('donate.choosePayment')}
                        </h2>

                        <div className="space-y-3 mb-8">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    <span className="text-2xl">{method.icon}</span>
                                    <span className="font-medium text-neutral-900">{method.name}</span>
                                    {paymentMethod === method.id && (
                                        <span className="ml-auto text-emerald-600">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                            >
                                {t('common.back')}
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                            >
                                {t('donate.actions.continue')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Info */}
                {step === 3 && (
                    <div className="card p-8">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                            {t('donate.yourInfo')}
                        </h2>

                        <div className="space-y-4 mb-6">
                            <input
                                type="text"
                                placeholder={t('donate.info.name')}
                                value={donorInfo.donorName}
                                onChange={(e) => setDonorInfo({ ...donorInfo, donorName: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                            <input
                                type="email"
                                placeholder={t('donate.info.email')}
                                value={donorInfo.donorEmail}
                                onChange={(e) => setDonorInfo({ ...donorInfo, donorEmail: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                            <input
                                type="tel"
                                placeholder={t('donate.info.phone')}
                                value={donorInfo.donorPhone}
                                onChange={(e) => setDonorInfo({ ...donorInfo, donorPhone: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                            <textarea
                                placeholder={t('donate.info.message')}
                                value={donorInfo.message}
                                onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                            />
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={donorInfo.isAnonymous}
                                    onChange={(e) => setDonorInfo({ ...donorInfo, isAnonymous: e.target.checked })}
                                    className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-neutral-600">{t('donate.info.anonymous')}</span>
                            </label>
                        </div>

                        {/* Summary */}
                        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-neutral-600">{t('donate.summary.amount')}</span>
                                <span className="font-medium">{finalAmount.toLocaleString()} {currency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t('donate.summary.payment')}</span>
                                <span className="font-medium">
                                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-4 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                            >
                                {t('common.back')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {loading
                                    ? t('donate.actions.processing')
                                    : t('donate.actions.pay', { amount: finalAmount.toLocaleString(), currency })}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DonatePage() {
    const t = useTranslations();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>}>
            <DonateForm />
        </Suspense>
    );
}
