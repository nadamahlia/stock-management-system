import { Head, Link, router } from '@inertiajs/react';
import { Fragment,useEffect, useState } from 'react';
import DataTableFilters from '@/components/DataTable/DataTableFilters';
import type { DataTableColumn, DataTableFilter } from '@/components/DataTable/types';
interface Family {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    family_id: number;
    image_link: string | null;
    user_id: number | null;
    price: number | string | null;
    description: string | null;
    status: 'available' | 'sold';
    family: Family | null;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    products: PaginatedProducts;
    authUser: AuthUser;
}

export default function Index({ products, authUser }: Props) {
    const productFilterColumns: DataTableColumn[] = [
    { key: 'name', label: 'Produit', type: 'text' },
    { key: 'family_id', label: 'Famille', type: 'number' },
    { key: 'image_link', label: 'Image', type: 'text', filterable: false },
    { key: 'price', label: 'Prix', type: 'number' },
    { key: 'status', label: 'Statut', type: 'text' },
    { key: 'actions', label: 'Actions', type: 'text', filterable: false },
];
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [detailsProductId, setDetailsProductId] = useState<number | null>(
        null,);
    const [search, setSearch] = useState('');
    const [advancedFilters, setAdvancedFilters] = useState<DataTableFilter[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [showSelectionDetails, setShowSelectionDetails] = useState(false);
    const selectedProducts = products.data.filter((product) =>
        selectedProductIds.includes(product.id),
    );
    useEffect(() => {
    const timeout = setTimeout(() => {
        router.get(
            '/products',
            {
                name: search,
     filters: JSON.stringify(advancedFilters),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, 500);

    return () => clearTimeout(timeout);
}, [search, advancedFilters]);


    const canCreate = ['admin', 'user'].includes(authUser.role);

    const canManage = (product: Product) =>
        authUser.role === 'admin' ||
        (authUser.role === 'user' && product.user_id === authUser.id);

    const formatPrice = (price: Product['price']) => {
        if (price === null || price === '') {
            return 'Prix non renseigné';
        }

        const value = Number(price);

        if (!Number.isFinite(value)) {
            return 'Prix non renseigné';
        }

        return `${new Intl.NumberFormat('fr-DZ', {
            maximumFractionDigits: 2,
        }).format(value)} DA`;
    };

    const deleteProduct = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
            router.delete(`/products/${id}`);
            setOpenMenuId(null);
        }
    };

    const logout = () => {
        router.post('/logout');
    };

    const fieldLabel = (status: Product['status']) =>
        status === 'sold' ? 'Vendu' : 'Disponible';

    return (
        <>
            <Head title="Catalogue des produits" />

            <main
                style={{
                    padding: '40px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginBottom: '30px',
                    }}
                >
                    <div>
                        <h1 style={{ marginBottom: '8px' }}>
                            Catalogue des produits
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            Connecté en tant que {authUser.name}
                        </p>
                    </div>

                   <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
    {canCreate && (
        <Link
            href="/products/create"
            style={primaryButtonStyle}
        >
            + Déposer une annonce
        </Link>
    )}

    <Link
        href="/orders"
        style={secondaryButtonStyle}
    >
        Mes commandes
    </Link>

    <button
        type="button"
        onClick={logout}
        style={secondaryButtonStyle}
    >
        Déconnexion
    </button>
</div>
                    
                </header>

                <div style={{ overflowX: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un produit..."
        style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '15px',
        }}
    />
</div>
{selectedProductIds.length > 0 && (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '12px',
            padding: '12px 16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            color: '#1d4ed8',
            fontSize: '14px',
            fontWeight: 500,
        }}
    >
        <span>
            {selectedProductIds.length} produit(s) sélectionné(s)
        </span>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
                type="button"
                onClick={() => setShowSelectionDetails((visible) => !visible)}
                style={{
                    padding: '8px 12px',
                    border: '1px solid #2563eb',
                    borderRadius: '6px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                }}
            >
                {showSelectionDetails ? 'Masquer la sélection' : 'Voir la sélection'}
            </button>

            <button
                type="button"
                onClick={() => {
                    setSelectedProductIds([]);
                    setShowSelectionDetails(false);
                }}
                style={{
                    padding: '8px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#1d4ed8',
                    cursor: 'pointer',
                    fontWeight: 600,
                }}
            >
                Tout désélectionner
            </button>
        </div>
    </div>
)}
{showSelectionDetails && (
    <section
        aria-label="Détails des produits sélectionnés"
        style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
        }}
    >
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
            }}
        >
            <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                    Produits sélectionnés
                </h2>
                <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '13px' }}>
                    Détails des produits sélectionnés sur cette page
                </p>
            </div>
            <button
                type="button"
                onClick={() => setShowSelectionDetails(false)}
                style={{ ...secondaryButtonStyle, padding: '7px 11px' }}
            >
                Fermer
            </button>
        </div>

        {selectedProducts.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b' }}>
                Aucun produit sélectionné n'est présent sur cette page.
            </p>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {selectedProducts.map((product) => (
                    <article
                        key={product.id}
                        style={{
                            padding: '14px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: '#f8fafc',
                            minWidth: 0,
                        }}
                    >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                            {product.image_link ? (
                                <img
                                    src={product.image_link}
                                    alt={product.name}
                                    width="58"
                                    height="58"
                                    style={{ objectFit: 'cover', borderRadius: '7px', flexShrink: 0 }}
                                />
                            ) : (
                                <div style={{ width: '58px', height: '58px', borderRadius: '7px', backgroundColor: '#e2e8f0', display: 'grid', placeItems: 'center', color: '#64748b', fontSize: '11px', flexShrink: 0 }}>
                                    Pas d'image
                                </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                                <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#0f172a', overflowWrap: 'anywhere' }}>
                                    {product.name}
                                </h3>
                                <span style={{ color: '#64748b', fontSize: '12px' }}>
                                    {product.family?.name ?? 'Sans famille'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '9px', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Prix</span>
                            <strong style={{ color: '#0f172a', textAlign: 'right' }}>{formatPrice(product.price)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Statut</span>
                            <strong style={{ color: product.status === 'sold' ? '#b91c1c' : '#15803d' }}>
                                {fieldLabel(product.status)}
                            </strong>
                        </div>
                        <p style={{ margin: 0, paddingTop: '10px', borderTop: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                            {product.description?.trim() || 'Aucune description fournie.'}
                        </p>
                    </article>
                ))}
            </div>
        )}
    </section>
)}
<table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: 'white',
                        }}
                    >
                        <thead>
   <tr>
    <th style={thStyle}>
        <input
            type="checkbox"
            checked={
                products.data.length > 0 &&
                products.data.every((product) =>
                    selectedProductIds.includes(product.id),
                )
            }
            onChange={(e) => {
                if (e.target.checked) {
                    setSelectedProductIds(
                        products.data.map((product) => product.id),
                    );
                } else {
                    setSelectedProductIds([]);
                }
            }}
        />
    </th>
    <th style={thStyle}>Produit</th>
    <th style={thStyle}>Famille</th>
    <th style={thStyle}>Image</th>
    <th style={thStyle}>Prix</th>
    <th style={thStyle}>Statut</th>
    <th style={thStyle}>Actions</th>
</tr>
    <tr>
        <DataTableFilters
            columns={productFilterColumns}
            onFiltersChange={setAdvancedFilters}
        />
    </tr>
</thead>

                        <tbody>
    {products.data.map((product) => (
        <Fragment key={product.id}>
            <tr>
                {/* Selection checkbox */}
                <td style={tdStyle}>
                    <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedProductIds((previous) => [
                                    ...previous,
                                    product.id,
                                ]);
                            } else {
                                setSelectedProductIds((previous) =>
                                    previous.filter((id) => id !== product.id),
                                );
                            }
                        }}
                    />
                </td>

                <td style={tdStyle}>
                    <strong>{product.name}</strong>
                </td>

                                        <td style={tdStyle}>
                                            {product.family?.name ??
                                                'Sans famille'}
                                        </td>

                                        <td style={tdStyle}>
                                            {product.image_link ? (
                                                <img
                                                    src={product.image_link}
                                                    alt={product.name}
                                                    width="90"
                                                    height="65"
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    style={{ color: '#777' }}
                                                >
                                                    Pas de photo
                                                </span>
                                            )}
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {formatPrice(product.price)}
                                        </td>

                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    ...statusStyle,
                                                    backgroundColor:
                                                        product.status === 'sold'
                                                            ? '#fee2e2'
                                                            : '#dcfce7',
                                                    color:
                                                        product.status === 'sold'
                                                            ? '#991b1b'
                                                            : '#166534',
                                                }}
                                            >
                                                {fieldLabel(product.status)}
                                            </span>
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                position: 'relative',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                aria-expanded={
                                                    openMenuId === product.id
                                                }
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId ===
                                                            product.id
                                                            ? null
                                                            : product.id,
                                                    )
                                                }
                                                style={secondaryButtonStyle}
                                            >
                                                ⋮ Menu
                                            </button>

                                            {openMenuId === product.id && (
                                                <div style={menuStyle}>
                                                    <button
                                                        type="button"
                                                        style={menuItemStyle}
                                                        onClick={() => {
                                                            setDetailsProductId(
                                                                detailsProductId ===
                                                                    product.id
                                                                    ? null
                                                                    : product.id,
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                    >
                                                        Afficher les détails
                                                    </button>

                                                    {canManage(product) && (
                                                        <>
                                                            <Link
                                                                href={`/products/${product.id}/edit`}
                                                                style={
                                                                    menuLinkStyle
                                                                }
                                                            >
                                                                Modifier
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                style={{
                                                                    ...menuItemStyle,
                                                                    color: '#b91c1c',
                                                                }}
                                                                onClick={() =>
                                                                    deleteProduct(
                                                                        product.id,
                                                                    )
                                                                }
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    {detailsProductId === product.id && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                style={{
                                                    ...tdStyle,
                                                    backgroundColor: '#f8fafc',
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        marginTop: 0,
                                                    }}
                                                >
                                                    Détails de l'annonce
                                                </h3>

                                                <p>
                                                    <strong>Produit :</strong>{' '}
                                                    {product.name}
                                                </p>

                                                <p>
                                                    <strong>Famille :</strong>{' '}
                                                    {product.family?.name ??
                                                        'Sans famille'}
                                                </p>

                                                <p>
                                                    <strong>Prix :</strong>{' '}
                                                    {formatPrice(product.price)}
                                                </p>

                                                <p>
                                                    <strong>Statut :</strong>{' '}
                                                    {fieldLabel(product.status)}
                                                </p>

                                                <p>
                                                    <strong>Description :</strong>
                                                </p>

                                                <p
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                    }}
                                                >
                                                    {product.description?.trim() ||
                                                        'Aucune description fournie.'}
                                                </p>

                                                {authUser.role === 'admin' && (
                                                    <p
                                                        style={{
                                                            color: '#666',
                                                            fontSize: '13px',
                                                        }}
                                                    >
                                                        Identifiant interne :
                                                        {' '}{product.id}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}

                            {products.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        style={{
                                            ...tdStyle,
                                            textAlign: 'center',
                                        }}
                                    >
                                        Aucune annonce pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div
    style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '20px',
    }}
>
    <p style={{ color: '#666', fontSize: '14px' }}>
        Affichage de {products.from ?? 0} à {products.to ?? 0} sur{' '}
        {products.total} produits
    </p>

    <nav
        aria-label="Pagination"
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
        }}
    >
        {products.links.map((link, index) => {
            const label = link.label
                .replace(/&laquo;/g, '‹')
                .replace(/&raquo;/g, '›');

            const buttonStyle = {
                display: 'inline-block',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                textDecoration: 'none',
                backgroundColor: link.active ? '#2563eb' : '#fff',
                color: link.active ? '#fff' : '#222',
                opacity: link.url ? 1 : 0.5,
            };

            return link.url ? (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url}
                    preserveScroll
                    style={buttonStyle}
                >
                    {label}
                </Link>
            ) : (
                <span
                    key={`${link.label}-${index}`}
                    style={buttonStyle}
                >
                    {label}
                </span>
            );
        })}
    </nav>
</div>
            </main>
        </>
    );
}

const thStyle = {
    textAlign: 'left' as const,
    padding: '14px 12px',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8fafc',
    whiteSpace: 'nowrap' as const,
};

const tdStyle = {
    padding: '15px 12px',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'middle' as const,
};

const primaryButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
};

const secondaryButtonStyle = {
    padding: '10px 14px',
    backgroundColor: 'white',
    color: '#222',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
};

const statusStyle = {
    padding: '5px 9px',
    borderRadius: '20px',
    fontSize: '13px',
    whiteSpace: 'nowrap' as const,
};

const menuStyle = {
    position: 'absolute' as const,
    top: '55px',
    right: '10px',
    zIndex: 10,
    minWidth: '180px',
    padding: '6px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
};

const menuItemStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    textAlign: 'left' as const,
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    color: '#222',
};

const menuLinkStyle = {
    display: 'block',
    padding: '10px',
    color: '#222',
    textDecoration: 'none',
};