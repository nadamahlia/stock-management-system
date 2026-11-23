
import { useState } from 'react';
import type { DataTableColumn, DataTableFilter } from './types';

interface DataTableFiltersProps {
    columns: DataTableColumn[];
    onFiltersChange: (filters: DataTableFilter[]) => void;
}

export default function DataTableFilters({
    columns,
    onFiltersChange,
}: DataTableFiltersProps) {
    const [selectedOperators, setSelectedOperators] = useState<
        Record<string, string>
    >({});
    const [filterValues, setFilterValues] = useState<
        Record<string, string>
    >({});

    const updateFilters = (
        operators: Record<string, string>,
        values: Record<string, string>,
    ) => {
        const filters: DataTableFilter[] = Object.entries(operators)
            .filter(([_, operator]) => operator !== '')
            .map(([column, operator]) => ({
                column,
                operator: operator as DataTableFilter['operator'],
                ...(
                    ['is_null', 'is_not_null'].includes(operator)
                        ? {}
                        : { value: values[column] ?? '' }
                ),
            }));

        onFiltersChange(filters);
    };

    return (
        <>
            {columns.map((column) => (
                <th
                    key={column.key}
                    style={{
                        padding: '10px',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        minWidth: '130px',
                    }}
                >
                    {column.filterable === false ? null : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <select
                                value={selectedOperators[column.key] || ''}
                                onChange={(e) => {
                                    const newOperators = {
                                        ...selectedOperators,
                                        [column.key]: e.target.value,
                                    };

                                    setSelectedOperators(newOperators);
                                    updateFilters(newOperators, filterValues);
                                }}
                                style={filterControlStyle}
                            >
                                <option value="">Operator</option>

                                {column.type === 'text' ? (
                                    <>
                                        <option value="contains">Contains</option>
                                        <option value="not_contains">Does not contain</option>
                                        <option value="starts_with">Starts with</option>
                                        <option value="ends_with">Ends with</option>
                                        <option value="is_null">Is empty</option>
                                        <option value="is_not_null">Is not empty</option>
                                    </>
                                ) : column.type === 'number' ? (
                                    <>
                                        <option value="equals">Equals</option>
                                        <option value="not_equals">Not equal</option>
                                        <option value="gt">Greater than</option>
                                        <option value="lt">Less than</option>
                                        <option value="is_null">Is empty</option>
                                        <option value="is_not_null">Is not empty</option>
                                    </>
                                ) : null}
                            </select>

                            {selectedOperators[column.key] &&
                                !['is_null', 'is_not_null'].includes(
                                    selectedOperators[column.key],
                                ) && (
                                    <input
                                        type="text"
                                        placeholder="Filter..."
                                        value={filterValues[column.key] || ''}
                                        onChange={(e) => {
                                            const newValues = {
                                                ...filterValues,
                                                [column.key]: e.target.value,
                                            };

                                            setFilterValues(newValues);
                                            updateFilters(selectedOperators, newValues);
                                        }}
                                        style={filterControlStyle}
                                    />
                                )}
                        </div>
                    )}
                </th>
            ))}
        </>
    );
}

const filterControlStyle = {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#fff',
    fontSize: '12px',
    color: '#334155',
};
