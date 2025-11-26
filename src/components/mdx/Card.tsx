interface CardProps {
    title?: string;
    children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
    return (
        <div className="border border-border-primary rounded-lg overflow-hidden bg-bg-secondary">
            {title && (
                <div className="px-4 py-3 border-b border-border-primary bg-bg-tertiary">
                    <h3 className="font-semibold text-text-primary">{title}</h3>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
