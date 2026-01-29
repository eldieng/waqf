'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { contentsApi } from '@/lib/services';

interface ContentTranslation {
    language: string;
    title: string;
    body?: string;
    excerpt?: string;
}

interface Content {
    id: string;
    slug: string;
    type: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    translations?: ContentTranslation[];
}

const contentTypes = [
    { id: 'all', label: 'Tous', icon: '📋' },
    { id: 'ARTICLE', label: 'Articles', icon: '📰' },
    { id: 'EVENT', label: 'Événements', icon: '📅' },
    { id: 'PAGE', label: 'Pages', icon: '📄' },
    { id: 'FAQ', label: 'FAQ', icon: '❓' },
];

export default function AdminContentPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                const typeParam = selectedType === 'all' ? undefined : selectedType;
                const response = await contentsApi.getAll({ type: typeParam, limit: 50 });
                setContents(response.data || response || []);
            } catch (error) {
                console.error('Error fetching contents:', error);
                setContents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchContents();
    }, [selectedType]);

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;
        try {
            await contentsApi.delete(id);
            setContents(contents.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const getTitle = (content: Content) => {
        const trans = content.translations?.find(t => t.language === locale.toUpperCase()) || content.translations?.[0];
        return trans?.title || content.slug;
    };

    const getTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            'ARTICLE': 'Article',
            'EVENT': 'Événement',
            'PAGE': 'Page',
            'FAQ': 'FAQ',
        };
        return typeMap[type] || type;
    };

    const getTypeCounts = () => {
        const counts: Record<string, number> = { all: contents.length };
        contents.forEach(c => {
            counts[c.type] = (counts[c.type] || 0) + 1;
        });
        return counts;
    };

    const filteredContents = contents.filter(content => {
        if (!search) return true;
        const title = getTitle(content).toLowerCase();
        return title.includes(search.toLowerCase()) || content.slug.includes(search.toLowerCase());
    });

    const typeCounts = getTypeCounts();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Contenu</h1>
                    <p className="text-neutral-500">Gérez le contenu de votre site</p>
                </div>
                <Link 
                    href={`/${locale}/admin/content/new`}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    + Nouveau contenu
                </Link>
            </div>

            {/* Content Types Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {contentTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${selectedType === type.id
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-neutral-200 bg-white hover:border-emerald-300'
                            }`}
                    >
                        <span className="text-2xl mb-2 block">{type.icon}</span>
                        <div className="font-semibold text-neutral-900">{type.label}</div>
                        <div className="text-sm text-neutral-500">{typeCounts[type.id] || 0} éléments</div>
                    </button>
                ))}
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-900">
                        {selectedType === 'all' ? 'Tout le contenu' : contentTypes.find(t => t.id === selectedType)?.label}
                    </h2>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:border-emerald-500 outline-none"
                    />
                </div>

                {loading ? (
                    <div className="p-12 text-center text-neutral-500">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        Chargement...
                    </div>
                ) : filteredContents.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                        <div className="text-4xl mb-4">📭</div>
                        <p>Aucun contenu trouvé</p>
                        <Link 
                            href={`/${locale}/admin/content/new`}
                            className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            Créer un contenu
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-500">Titre</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-500">Type</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-500">Statut</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-500">Dernière modification</th>
                                <th className="text-right px-6 py-3 text-sm font-medium text-neutral-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredContents.map((content) => (
                                <tr key={content.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-neutral-900">{getTitle(content)}</div>
                                        <div className="text-xs text-neutral-400">{content.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">{getTypeLabel(content.type)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                            content.isPublished 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {content.isPublished ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {new Date(content.updatedAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link 
                                                href={`/${locale}/admin/content/${content.id}/edit`}
                                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </Link>
                                            <Link 
                                                href={`/${locale}/news`}
                                                target="_blank"
                                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                                                title="Voir"
                                            >
                                                👁️
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(content.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
