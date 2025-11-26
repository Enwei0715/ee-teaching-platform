

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-slate-950 flex flex-col">
            {children}
        </div>
    );
}
