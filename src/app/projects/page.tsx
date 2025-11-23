import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Wrench, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Projects | EE Master',
    description: 'Hands-on electronics projects for all skill levels.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Hero Section */}
            <div className="bg-indigo-950 text-white py-24 px-6 relative overflow-hidden border-b border-indigo-900/50">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                        Build. Learn. <span className="text-indigo-400">Innovate.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed mb-10">
                        Hands-on electronics projects to take you from theory to reality.
                        Start building your portfolio today.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="#all-projects" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
                            Explore Projects
                        </Link>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div id="all-projects" className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-white">All Projects</h2>
                    <div className="text-sm text-gray-400">{projects.length} projects available</div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800 shadow-sm">
                        <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Wrench size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                        <p className="text-gray-400">Check back soon for new tutorials!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/projects/${project.slug}`}
                                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full hover:border-indigo-500/50"
                            >
                                <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden border-b border-gray-800">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>

                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Wrench size={64} className="text-gray-700 group-hover:text-indigo-500/50 group-hover:scale-110 transition-all duration-500 relative z-0" />
                                    )}

                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-white/5 ${project.level === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                                            project.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                                                'bg-red-900/30 text-red-400'
                                            }`}>
                                            {project.level || 'All Levels'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center text-indigo-400 text-sm font-bold mt-auto pt-4 border-t border-gray-800">
                                        Start Building <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div >
                )}
            </div >
        </div >
    );
}
