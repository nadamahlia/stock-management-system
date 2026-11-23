import DataTable from '../components/DataTable/DataTable';

import type { DataTableColumn, DataTableAggregation,
} from '../components/DataTable/types';
export default function DataTableTest() {
    return (
          <div style={{ padding: '30px' }}>
            <h1>Test du DataTable</h1>

            <DataTable<Product>
                data={products}
                columns={columns}
                aggregations={aggregations}
            />
        </div>
    );
}
interface Product {
    id: number;
    name: string;
    price: number | null;
    status: string;
}

const columns: DataTableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Produit', type: 'text' },
    { key: 'price', label: 'Prix', type: 'number' },
    { key: 'status', label: 'Statut', type: 'text' },
];
const aggregations: DataTableAggregation[] = [
    {
        column: 'price',
        type: 'sum',
        label: 'Somme des prix',
    },
    {
        column: 'id',
        type: 'count',
        label: 'Nombre de produits',
    },
];
const products: Product[] = [
    { id: 1, name: 'iPhone 13', price: 120000, status: 'Disponible' },
    { id: 2, name: 'Samsung S24', price: 150000, status: 'Vendu' },
    { id: 3, name: 'Xiaomi Redmi', price: 65000, status: 'Disponible' },
    { id: 4, name: 'Dell Laptop', price: null, status: 'Disponible'},
];