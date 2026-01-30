'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { contactsApi } = await import('@/lib/services');
            await contactsApi.submit({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject || undefined,
                message: formData.message,
            });
            setSent(true);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert(t('contact.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-neutral-900 mb-4">{t('contact.title')}</h1>
                    <p className="text-lg text-neutral-600">{t('contact.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-neutral-50 rounded-2xl p-6">
                            <div className="text-2xl mb-3">📍</div>
                            <h3 className="font-semibold text-neutral-900 mb-2">
                                {t('contact.info.address')}
                            </h3>
                            <p className="text-neutral-600">
                                Liberté 6<br />
                                Dakar, Sénégal
                            </p>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-6">
                            <div className="text-2xl mb-3">📧</div>
                            <h3 className="font-semibold text-neutral-900 mb-2">
                                {t('contact.info.email')}
                            </h3>
                            <a href="mailto:contact@waqfald.com" className="text-emerald-600 hover:underline">
                                contact@waqfald.com
                            </a>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-6">
                            <div className="text-2xl mb-3">📞</div>
                            <h3 className="font-semibold text-neutral-900 mb-2">
                                {t('contact.info.phone')}
                            </h3>
                            <a href="tel:+221775281313" className="text-emerald-600 hover:underline">
                                +221 77 528 13 13
                            </a>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        {sent ? (
                            <div className="bg-emerald-50 rounded-2xl p-8 text-center">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-xl font-semibold text-emerald-700 mb-2">
                                    {t('contact.success')}
                                </h3>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                                >
                                    {t('contact.actions.sendAnother')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={t('contact.form.name')}
                                        required
                                        className="px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={t('contact.form.email')}
                                        required
                                        className="px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder={t('contact.form.phone')}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder={t('contact.form.subject')}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder={t('contact.form.message')}
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? t('contact.form.loading') : t('contact.form.submit')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
