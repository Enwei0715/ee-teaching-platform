export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
