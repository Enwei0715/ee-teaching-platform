import Link from 'next/link';

export default function Hero() {
    return (
        <section className="py-20 md:py-32 px-6 text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
                Master Electronic Engineering
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                From basic circuits to advanced FPGA design.
                A comprehensive, open-source learning platform for the next generation of engineers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/courses" className="px-8 py-3 bg-accent-primary text-white rounded-md font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto">
                    Start Learning
                </Link>
                <Link href="/projects" className="px-8 py-3 bg-bg-tertiary text-text-primary border border-border-primary rounded-md font-medium hover:bg-bg-secondary transition-colors w-full sm:w-auto">
                    View Projects
                </Link>
            </div>
        </section>
    );
}
