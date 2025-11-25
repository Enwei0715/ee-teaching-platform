import HexagonalBackground from '@/components/ui/HexagonalBackground';

// ... (imports)

export default async function ProjectPage({ params }: Props) {
    // ... (data fetching)

    return (
        <div className="min-h-screen relative overflow-hidden">
            <HexagonalBackground />
            <header className="relative py-12 px-4 md:py-16 md:px-6 border-b border-border-primary overflow-hidden z-10">
                <div className="max-w-4xl mx-auto">
                    <Link href="/projects" className="inline-flex items-center text-text-secondary hover:text-accent-primary transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Projects
                    </Link>
                    <div className="flex items-center gap-6 text-sm text-text-secondary mb-6">
                        <span className="flex items-center gap-2">
                            <BarChart size={16} />
                            {project.meta.difficulty || 'All Levels'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} />
                            Weekend Build
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">{project.meta.title}</h1>
                    <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                        {project.meta.description}
                    </p>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                <div className="lg:col-span-2">

                    <div className="prose prose-invert prose-blue max-w-none">
                        <MDXContent source={mdxSource} />
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <div className="glass-panel shadow-xl rounded-lg p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                            <Wrench size={20} className="mr-2 text-accent-primary" />
                            Tools Needed
                        </h3>
                        <ul className="space-y-2 text-text-secondary text-sm mb-8">
                            {project.meta.tools && project.meta.tools.length > 0 ? (
                                project.meta.tools.map((tool: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-2"></span>
                                        {tool}
                                    </li>
                                ))
                            ) : (
                                <li className="text-text-secondary/50 italic">No tools listed</li>
                            )}
                        </ul>

                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                            <div className="w-5 h-5 mr-2 rounded border border-accent-primary flex items-center justify-center text-xs font-mono text-accent-primary">B</div>
                            Bill of Materials
                        </h3>
                        <ul className="space-y-2 text-text-secondary text-sm">
                            {project.meta.materials && project.meta.materials.length > 0 ? (
                                project.meta.materials.map((material: string, index: number) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{material}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-text-secondary/50 italic">No materials listed</li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
