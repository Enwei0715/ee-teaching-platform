'use client';

import { ReactNode } from 'react';

interface ColumnProps {
    children: ReactNode;
}

export function Column({ children }: ColumnProps) {
    return (
        <div className="flex-1 min-w-0">
            {children}
        </div>
    );
}

interface ColumnsProps {
    children: ReactNode;
}

export function Columns({ children }: ColumnsProps) {
    return (
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    );
}
