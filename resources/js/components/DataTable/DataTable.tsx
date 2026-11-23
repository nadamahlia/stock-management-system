
import type { DataTableProps, DataTableFilter } from './types';
import DataTableFilters from './DataTableFilters';
import { useState } from 'react';
import DataTableSummary from './DataTableSummary';
import type { DataTableAggregation } from './types';
export default function DataTable<T>({
    data,
    columns,
    loading = false,
    aggregations = [],
}: DataTableProps<T>) {
    const visibleColumns = columns.filter(
        (column) => column.visible !== false,
    );

    const [filters, setFilters] = useState<DataTableFilter[]>([]);

    const filteredData = data.filter((item) => {
        return filters.every((filter) => {
         const value = (item as Record<string, unknown>)[filter.column];

            if (filter.operator === 'is_null') {
                return value === null || value === undefined || value === '';
            }

            if (filter.operator === 'is_not_null') {
                return value !== null && value !== undefined && value !== '';
            }

            const currentValue = String(value ?? '').toLowerCase();
            const searchValue = String(filter.value ?? '').toLowerCase();

            switch (filter.operator) {
                case 'contains':
                    return currentValue.includes(searchValue);

                case 'not_contains':
                    return !currentValue.includes(searchValue);

                case 'starts_with':
                    return currentValue.startsWith(searchValue);

                case 'ends_with':
                    return currentValue.endsWith(searchValue);

                default:
                    return true;
                    case 'equals':
                 return Number(value) === Number(filter.value);

                case 'not_equals':
    return Number(value) !== Number(filter.value);

                 case 'gt':
    return Number(value) > Number(filter.value);

                 case 'lt':
    return Number(value) < Number(filter.value);
            }
        });
    });

    return (
        <div style={{ overflowX: 'auto' }}>
            <DataTableFilters
                columns={columns}
                onFiltersChange={setFilters}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {visibleColumns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={visibleColumns.length}>
                                Chargement...
                            </td>
                        </tr>
                    ) : filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={visibleColumns.length}>
                                Aucun résultat.
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((item, index) => (
                            <tr key={index}>
                                {visibleColumns.map((column) => {
                                 const value = (item as Record<string, unknown>)[column.key];

                                    return (
                                        <td key={column.key}>
                                            {value == null ? '-' : String(value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <DataTableSummary
    data={filteredData}
    aggregations={aggregations}
/>
        </div>
    );
}
