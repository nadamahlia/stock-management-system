
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Person {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
}

interface Order {
    id: number;
    product_name: string;
    price: string | number;
    status: string;
    created_at: string;
    buyer: Person | null;
    seller: Person | null;
    product: Product | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    purchases: PaginatedOrders;
    sales: PaginatedOrders;
}

type Tab = 'purchases' | 'sales';

export default function OrdersIndex({ purchases, sales }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('purchases');

    const currentOrders =
        activeTab === 'purchases' ? purchases : sales;

    const formatPrice = (price: string | number) => {
        return `${new Intl.NumberFormat('fr-DZ', {
            maximumFractionDigits: 2,
        }).format(Number(price))} DA`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-DZ', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const statusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'completed':
                return 'Terminée';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    return (
        <>
            <Head title="Mes commandes" />

            <main
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '40px 24px',
                }}
            >
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '15px',
                        marginBottom: '30px',
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
                            Mes commandes
                        </h1>

                        <p style={{ color: '#666', marginTop: '8px' }}>
                            Retrouvez vos achats et les ventes de vos annonces.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            color: '#222',
                        }}
                    >
                        Retour au catalogue
                    </Link>
                </header>

                {/* Onglets */}
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        borderBottom: '1px solid #ddd',
                        marginBottom: '25px',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setActiveTab('purchases')}
                        style={{
                            ...tabStyle,
                            borderBottom:
                                activeTab === 'purchases'
                                    ? '3px solid #2563eb'
                                    : '3px solid transparent',
                            color:
                                activeTab === 'purchases'
                                    ? '#2563eb'
                                    : '#666',
                            fontWeight:
                                activeTab === 'purchases' ? 'bold' : 'normal',
                        }}
                    >
                        Mes achats ({purchases.total})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('sales')}
                        style={{
                            ...tabStyle,
                            borderBottom:
                                activeTab === 'sales'
                                    ? '3px solid #2563eb'
                                    : '3px solid transparent',
                            color:
                                activeTab === 'sales'
                                    ? '#2563eb'
                                    : '#666',
                            fontWeight:
                                activeTab === 'sales' ? 'bold' : 'normal',
                        }}
                    >
                        Mes ventes ({sales.total})
                    </button>
                </div>

                {/* Liste des commandes */}
                {currentOrders.data.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gap: '16px',
                        }}
                    >
                        {currentOrders.data.map((order) => (
                            <article
                                key={order.id}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '220px' }}>
                                    <h3
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {order.product_name}
                                    </h3>

                                    <p
                                        style={{
                                            color: '#666',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {activeTab === 'purchases'
                                            ? `Vendeur : ${order.seller?.name ?? 'Utilisateur indisponible'}`
                                            : `Acheteur : ${order.buyer?.name ?? 'Utilisateur indisponible'}`}
                                    </p>

                                    <p
                                        style={{
                                            color: '#888',
                                            fontSize: '13px',
                                            marginTop: '5px',
                                        }}
                                    >
                                        Commandé le {formatDate(order.created_at)}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '10px',
                                    }}
                                >
                                    <strong
                                        style={{
                                            fontSize: '18px',
                                            color: '#166534',
                                        }}
                                    >
                                        {formatPrice(order.price)}
                                    </strong>

                                    <span
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '20px',
                                            backgroundColor:
                                                order.status === 'pending'
                                                    ? '#fef3c7'
                                                    : order.status === 'completed'
                                                      ? '#dcfce7'
                                                      : '#fee2e2',
                                            color:
                                                order.status === 'pending'
                                                    ? '#92400e'
                                                    : order.status === 'completed'
                                                      ? '#166534'
                                                      : '#991b1b',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {statusLabel(order.status)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '10px',
                        }}
                    >
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {activeTab === 'purchases'
                                ? "Vous n'avez pas encore effectué d'achat."
                                : "Vous n'avez pas encore réalisé de vente."}
                        </h3>

                        <p style={{ color: '#666', margin: '12px 0 20px' }}>
                            {activeTab === 'purchases'
                                ? 'Explorez le catalogue pour découvrir les produits disponibles.'
                                : 'Vos annonces vendues apparaîtront ici.'}
                        </p>

                        {activeTab === 'purchases' && (
                            <Link
                                href="/products"
                                style={{
                                    color: '#2563eb',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                            >
                                Découvrir le catalogue
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {currentOrders.last_page > 1 && (
                    <nav
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginTop: '25px',
                        }}
                    >
                        {currentOrders.links.map((link, index) => {
                            const label = link.label
                                .replace(/&laquo;/g, '‹')
                                .replace(/&raquo;/g, '›');

                            return link.url ? (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    preserveScroll
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        textDecoration: 'none',
                                        backgroundColor: link.active
                                            ? '#2563eb'
                                            : 'white',
                                        color: link.active ? 'white' : '#222',
                                    }}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <span
                                    key={`${link.label}-${index}`}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        color: '#999',
                                    }}
                                >
                                    {label}
                                </span>
                            );
                        })}
                    </nav>
                )}
            </main>
        </>
    );
}

const tabStyle = {
    padding: '13px 16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
};
