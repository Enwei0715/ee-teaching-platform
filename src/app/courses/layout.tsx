import ParticleBackground from "@/components/ui/ParticleBackground";

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
