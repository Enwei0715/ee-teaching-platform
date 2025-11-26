import Link from 'next/link';
import EditableText from './EditableText';
import ParticleBackground from './ParticleBackground';

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Particle Network Background */}
            <ParticleBackground />

            {/* Content - positioned above particles */}
            <div className="relative z-10 py-20 md:py-32 px-6 text-center max-w-5xl mx-auto">
                <EditableText
                    contentKey="home_hero_title"
                    defaultText="Master Electronic Engineering"
                    tag="h1"
                    className="text-4xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight"
                />
                <EditableText
                    contentKey="home_hero_description"
                    defaultText="From basic circuits to advanced FPGA design. A comprehensive, open-source learning platform for the next generation of engineers."
                    tag="p"
                    className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
                    multiline
                />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/courses" className="px-8 py-3 bg-accent-primary text-white rounded-md font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105 w-full sm:w-auto">
                        Start Learning
                    </Link>
                    <Link href="/projects" className="px-8 py-3 bg-bg-tertiary text-text-primary border border-border-primary rounded-md font-medium hover:bg-bg-secondary transition-all duration-200 hover:scale-105 w-full sm:w-auto">
                        View Projects
                    </Link>
                </div>
            </div>

            {/* Glowing Bottom Border for Hero */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-70"></div>
        </section>
    );
}
