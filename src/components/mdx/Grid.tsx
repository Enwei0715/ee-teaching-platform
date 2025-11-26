interface GridProps {
    children: React.ReactNode;
    cols?: 2 | 3 | 4;
}

export function Grid({ children, cols = 2 }: GridProps) {
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[cols]} gap-4 my-6`}>
            {children}
        </div>
    );
}
