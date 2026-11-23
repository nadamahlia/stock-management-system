
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
    const filters: DataTableFilter[] = Object.keys(operators)
        .filter((key) => operators[key] !== '')
        .map((key) => ({
            column: key,
            operator: operators[key] as DataTableFilter['operator'],
            ...(
                ['is_null', 'is_not_null'].includes(operators[key])
                    ? {}
                    : { value: values[key] ?? '' }
            ),
        }));

    onFiltersChange(filters);
};
    const filterableColumns = columns.filter(
        (column) => column.filterable !== false,
    );

    return (
        <div>
            <h3>Filtres</h3>

            {filterableColumns.map((column) => (
                <div key={column.key}>
                    <label>{column.label}</label>
                   <select
    value={selectedOperators[column.key] || ''}
   onChange={(e) => {
    const operator = e.target.value;

    const newOperators = {
        ...selectedOperators,
        [column.key]: operator,
    };

    setSelectedOperators(newOperators);
    updateFilters(newOperators, filterValues);
}}
>
   <option value="">Choisir un opérateur</option>

{column.type === 'text' ? (
    <>
        <option value="contains">Contient</option>
        <option value="not_contains">Ne contient pas</option>
        <option value="starts_with">Commence par</option>
        <option value="ends_with">Se termine par</option>
        <option value="is_null">Est vide</option>
        <option value="is_not_null">N'est pas vide</option>
    </>
) : column.type === 'number' ? (
    <>
        <option value="equals">Égal à</option>
        <option value="not_equals">Différent de</option>
        <option value="gt">Supérieur à</option>
        <option value="lt">Inférieur à</option>
        <option value="is_null">Est vide</option>
        <option value="is_not_null">N'est pas vide</option>
    </>
) : null}
</select>
{selectedOperators[column.key] &&
    !['is_null', 'is_not_null'].includes(selectedOperators[column.key]) && (
        <input
            type="text"
            placeholder="Saisir une valeur..."
            value={filterValues[column.key] || ''}
onChange={(e) => {
    const value = e.target.value;

    const newValues = {
        ...filterValues,
        [column.key]: value,
    };

    setFilterValues(newValues);
    updateFilters(selectedOperators, newValues);
}}
        />
    )}
   
                </div>
            ))}
        </div>
    );
}