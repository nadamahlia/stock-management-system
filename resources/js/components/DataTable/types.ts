
export type ColumnType = 'text' | 'number' | 'date' | 'boolean';

export type FilterOperator =
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'is_null'
    | 'is_not_null'
    | 'equals'
    | 'not_equals'
    | 'gt'
    | 'lt';

export interface DataTableColumn {
    key: string;
    label: string;
    type: ColumnType;
    filterable?: boolean;
    sortable?: boolean;
    visible?: boolean;
}

export interface DataTableFilter {
    column: string;
    operator: FilterOperator;
    value?: string | number | boolean;
}

export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn[];
    loading?: boolean;
}
