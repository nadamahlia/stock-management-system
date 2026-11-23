import type { DataTableAggregation } from './types';

interface DataTableSummaryProps<T> {
    data: T[];
    aggregations: DataTableAggregation[];
}

export default function DataTableSummary<T>({
    data,
    aggregations,
}: DataTableSummaryProps<T>) {
    return (
        <div>
            <h3>Résumé des données</h3>

            {aggregations.map((aggregation) => {
                const values = data.map((item) => {
                    return (item as Record<string, unknown>)[aggregation.column];
                });

                const result =
                    aggregation.type === 'sum'
                        ? values.reduce(
                              (total, value) => total + Number(value || 0),
                              0,
                          )
                        : data.length;

                return (
                    <div key={`${aggregation.column}-${aggregation.type}`}>
                        <strong>{aggregation.label || aggregation.column} :</strong>
                        {' '}
                        {result}
                    </div>
                );
            })}
        </div>
    );
}