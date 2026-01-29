'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'Waqf And Liggeyal Daara',
        siteEmail: 'contact@waqf-daara.org',
        sitePhone: '+221 77 000 00 00',
        currency: 'XOF',
        minDonation: 1000,
        allowAnonymousDonations: true,
        enableNewsletter: true,
        maintenanceMode: false,
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-neutral-900">Paramètres</h1>
                <p className="text-neutral-500">Configuration générale de la plateforme</p>
            </div>

            <div className="space-y-6">
                {/* General */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">Général</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Nom du site
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email de contact
                                </label>
                                <input
                                    type="email"
                                    value={settings.siteEmail}
                                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={settings.sitePhone}
                                    onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">Dons</h2>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Devise
                                </label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                >
                                    <option value="XOF">FCFA (XOF)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="USD">Dollar (USD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Don minimum
                                </label>
                                <input
                                    type="number"
                                    value={settings.minDonation}
                                    onChange={(e) => setSettings({ ...settings, minDonation: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.allowAnonymousDonations}
                                onChange={(e) => setSettings({ ...settings, allowAnonymousDonations: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600"
                            />
                            <span className="text-neutral-700">Autoriser les dons anonymes</span>
                        </label>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-6">Options</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableNewsletter}
                                onChange={(e) => setSettings({ ...settings, enableNewsletter: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600"
                            />
                            <span className="text-neutral-700">Activer la newsletter</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-emerald-600"
                            />
                            <span className="text-neutral-700">Mode maintenance</span>
                        </label>
                    </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        className={`px-8 py-3 font-semibold rounded-xl transition-colors ${saved
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                    >
                        {saved ? '✓ Enregistré' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
