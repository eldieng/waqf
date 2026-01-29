'use client';

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/services';
import api from '@/lib/api';

interface User {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    _count?: { donations: number };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'USER',
        isActive: true,
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await usersApi.getAll({ search: searchQuery || undefined, page, limit: 20 });
                setUsers(response.data || []);
                setTotalPages(response.meta?.totalPages || 1);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [searchQuery, page]);

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role,
            isActive: user.isActive,
        });
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;
        try {
            setSaving(true);
            await api.put(`/users/${editingUser.id}`, editForm);
            setUsers(users.map(u => 
                u.id === editingUser.id 
                    ? { ...u, ...editForm }
                    : u
            ));
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const toggleUserStatus = async (user: User) => {
        try {
            await api.put(`/users/${user.id}`, { isActive: !user.isActive });
            setUsers(users.map(u => 
                u.id === user.id ? { ...u, isActive: !u.isActive } : u
            ));
        } catch (error) {
            console.error('Error toggling user status:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    const getUserName = (user: User) => {
        if (user.firstName || user.lastName) {
            return `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        return user.email || user.phone || 'Utilisateur';
    };

    const roleColors: Record<string, string> = {
        ADMIN: 'bg-purple-100 text-purple-700',
        USER: 'bg-gray-100 text-gray-700',
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Utilisateurs</h1>
                    <p className="text-neutral-500">Gérez les utilisateurs de la plateforme</p>
                </div>
                <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                    + Ajouter un utilisateur
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un utilisateur..."
                    className="w-full max-w-md px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">👥</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">Aucun utilisateur</div>
                        <p className="text-neutral-500">Les utilisateurs apparaîtront ici</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Utilisateur</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Rôle</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Statut</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Date inscription</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-medium">
                                                    {getUserName(user)[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900">{getUserName(user)}</div>
                                                    <div className="text-sm text-neutral-500">{user.email || user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-sm ${user.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                    title={user.isActive ? 'Désactiver' : 'Activer'}
                                                >
                                                    {user.isActive ? '⏸️' : '▶️'}
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                                                    title="Modifier"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
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

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                Modifier l&apos;utilisateur
                            </h2>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Rôle
                                </label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none"
                                >
                                    <option value="USER">Utilisateur</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.isActive}
                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-neutral-700">Compte actif</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-neutral-100">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-6 py-2.5 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSaveUser}
                                disabled={saving}
                                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
