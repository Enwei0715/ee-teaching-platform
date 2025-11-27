'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
    data: Record<string, any>[];
    sortable?: boolean;
}

export function DataTable({ data, sortable = false }: DataTableProps) {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    if (!data || data.length === 0) {
        return (
            <div className="my-8 p-4 bg-bg-secondary rounded-lg border border-border-primary">
                <p className="text-text-secondary text-sm">No data to display</p>
            </div>
        );
    }

    // Get column headers from the first row
    const columns = Object.keys(data[0]);

    // Sort data if sortable
    const sortedData = useMemo(() => {
        if (!sortColumn) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Handle null/undefined
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            // Compare values
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection]);

    const handleSort = (column: string) => {
        if (!sortable) return;

        if (sortColumn === column) {
            // Toggle direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New column
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (!sortable) return null;

        if (sortColumn !== column) {
            return <ArrowUpDown size={14} className="text-text-secondary/50" />;
        }

        return sortDirection === 'asc' ? (
            <ArrowUp size={14} className="text-accent-primary" />
        ) : (
            <ArrowDown size={14} className="text-accent-primary" />
        );
    };

    return (
        <div className="my-8 rounded-lg border border-border-primary shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-primary">
                    <thead className="bg-bg-secondary">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    onClick={() => handleSort(column)}
                                    className={`px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-bg-tertiary/50 select-none' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column}</span>
                                        {getSortIcon(column)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-bg-primary divide-y divide-border-primary">
                        {sortedData.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-bg-secondary/50 transition-colors">
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="px-6 py-4 text-sm text-text-secondary whitespace-pre-wrap"
                                    >
                                        {row[column] ?? '—'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
