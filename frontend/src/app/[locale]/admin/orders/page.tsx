'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        slug: string;
        translations: { name: string }[];
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress?: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    createdAt: string;
    items: OrderItem[];
}

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'En attente', color: 'bg-amber-100 text-amber-700' },
    { value: 'CONFIRMED', label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
    { value: 'PROCESSING', label: 'En préparation', color: 'bg-purple-100 text-purple-700' },
    { value: 'SHIPPED', label: 'Expédiée', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'DELIVERED', label: 'Livrée', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'CANCELLED', label: 'Annulée', color: 'bg-red-100 text-red-700' },
    { value: 'REFUNDED', label: 'Remboursée', color: 'bg-gray-100 text-gray-700' },
];

export default function AdminOrdersPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'fr';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                const params: Record<string, string | number> = { page, limit: 20 };
                if (statusFilter !== 'all') params.status = statusFilter;
                
                const { data } = await api.get('/orders', { params });
                setOrders(data.data || []);
                setTotalPages(data.meta?.totalPages || 1);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [page, statusFilter]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            setUpdatingStatus(true);
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            
            setOrders(orders.map(o => 
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
            
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusInfo = (status: string) => {
        return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const stats = [
        { label: 'En attente', value: orders.filter(o => o.status === 'PENDING').length, color: 'text-amber-600' },
        { label: 'En cours', value: orders.filter(o => ['CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status)).length, color: 'text-blue-600' },
        { label: 'Livrées', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'text-emerald-600' },
        { label: 'Annulées', value: orders.filter(o => ['CANCELLED', 'REFUNDED'].includes(o.status)).length, color: 'text-red-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Commandes</h1>
                    <p className="text-neutral-500">Gérez les commandes de la boutique</p>
                </div>
                <button className="px-5 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors">
                    📥 Exporter CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
                        <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-neutral-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => { setStatusFilter('all'); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === 'all'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                >
                    Toutes
                </button>
                {ORDER_STATUSES.map((status) => (
                    <button
                        key={status.value}
                        onClick={() => { setStatusFilter(status.value); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusFilter === status.value
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                        {status.label}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Chargement...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <div className="text-lg font-medium text-neutral-900 mb-2">Aucune commande</div>
                        <p className="text-neutral-500">Les commandes apparaîtront ici</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Commande</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Client</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Total</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Statut</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Date</th>
                                        <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {orders.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        return (
                                            <tr key={order.id} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900">
                                                        #{order.orderNumber}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {order.items?.length || 0} article(s)
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900">
                                                        {order.customerName}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {order.customerEmail}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-neutral-900">
                                                        {Number(order.total).toLocaleString()} {order.currency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    >
                                                        Voir détails
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
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

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <div>
                                <h2 className="text-xl font-semibold text-neutral-900">
                                    Commande #{selectedOrder.orderNumber}
                                </h2>
                                <p className="text-sm text-neutral-500">
                                    {formatDate(selectedOrder.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Statut de la commande
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ORDER_STATUSES.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status.value)}
                                            disabled={updatingStatus || selectedOrder.status === status.value}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                                selectedOrder.status === status.value
                                                    ? status.color
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-neutral-50 rounded-xl p-4">
                                <h3 className="font-medium text-neutral-900 mb-3">Client</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-neutral-500">Nom:</span> {selectedOrder.customerName}</p>
                                    <p><span className="text-neutral-500">Email:</span> {selectedOrder.customerEmail}</p>
                                    {selectedOrder.customerPhone && (
                                        <p><span className="text-neutral-500">Tél:</span> {selectedOrder.customerPhone}</p>
                                    )}
                                    {selectedOrder.shippingAddress && (
                                        <p><span className="text-neutral-500">Adresse:</span> {selectedOrder.shippingAddress}</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-medium text-neutral-900 mb-3">Articles</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                                            <div>
                                                <div className="font-medium text-neutral-900">
                                                    {item.product?.translations?.[0]?.name || item.product?.slug}
                                                </div>
                                                <div className="text-sm text-neutral-500">
                                                    Qté: {item.quantity} × {Number(item.price).toLocaleString()} FCFA
                                                </div>
                                            </div>
                                            <div className="font-semibold text-neutral-900">
                                                {(item.quantity * Number(item.price)).toLocaleString()} FCFA
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-neutral-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Sous-total</span>
                                    <span>{Number(selectedOrder.subtotal).toLocaleString()} {selectedOrder.currency}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Livraison</span>
                                    <span>{Number(selectedOrder.shippingCost).toLocaleString()} {selectedOrder.currency}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-neutral-200">
                                    <span>Total</span>
                                    <span className="text-emerald-600">
                                        {Number(selectedOrder.total).toLocaleString()} {selectedOrder.currency}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="font-medium text-neutral-900 mb-3">Historique</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                        <span>Créée le {formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                    {selectedOrder.paidAt && (
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            <span>Payée le {formatDate(selectedOrder.paidAt)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.shippedAt && (
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                            <span>Expédiée le {formatDate(selectedOrder.shippedAt)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.deliveredAt && (
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            <span>Livrée le {formatDate(selectedOrder.deliveredAt)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.cancelledAt && (
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>Annulée le {formatDate(selectedOrder.cancelledAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-neutral-100">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
