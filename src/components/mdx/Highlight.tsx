interface HighlightProps {
    children: React.ReactNode;
    color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
}

const highlightStyles = {
    yellow: 'bg-yellow-300/30 text-yellow-200',
    blue: 'bg-blue-300/30 text-blue-200',
    green: 'bg-green-300/30 text-green-200',
    red: 'bg-red-300/30 text-red-200',
    purple: 'bg-purple-300/30 text-purple-200',
};

export function Highlight({ children, color = 'yellow' }: HighlightProps) {
    return (
        <mark className={`px-1 py-0.5 rounded ${highlightStyles[color]}`}>
            {children}
        </mark>
    );
}
