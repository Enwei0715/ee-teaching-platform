'use client';

import Link from 'next/link';
import { Wrench, ArrowRight, Edit2, CheckCircle } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEditMode } from '@/context/EditModeContext';
import HexagonalBackground from '@/components/ui/HexagonalBackground';


export default function ProjectsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { isEditMode } = useEditMode();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-transparent flex flex-col flex-1 relative">
            <HexagonalBackground />
            {/* Hero Section */}
            <div className="bg-indigo-950/30 backdrop-blur-sm text-white py-12 px-4 md:py-24 md:px-6 relative overflow-hidden border-b border-indigo-900/30">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <EditableText
                        tag="h1"
                        defaultText="Build. Learn. Innovate."
                        mode="static"
                        contentKey="projects_title"
                        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white"
                    />
                    <EditableText
                        tag="p"
                        defaultText="Hands-on electronics projects to take you from theory to reality. Start building your portfolio today."
                        mode="static"
                        contentKey="projects_subtitle"
                        className="text-lg md:text-xl lg:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed mb-10"
                        multiline
                    />
                    <div className="flex justify-center gap-4">
                        <Link href="#all-projects" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-900/20">
                            Explore Projects
                        </Link>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div id="all-projects" className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-white">All Projects</h2>
                    <div className="text-sm text-gray-400">{projects.length} projects available</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group glass-panel rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700 flex flex-col h-full relative"
                        >
                            {/* Edit Shortcut Icon (Admin Edit Mode Only) */}
                            {isEditMode && session?.user?.role === 'ADMIN' && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/admin/projects/${project.slug}`);
                                    }}
                                    className="absolute top-4 left-4 p-2 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500 z-20"
                                    title="Edit this project"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}

                            <Link href={`/projects/${project.slug}`} className="contents">
                                <div className="h-56 glass-ghost flex items-center justify-center relative overflow-hidden border-b border-gray-800">
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

                                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-white/5 ${project.level === 'Beginner' ? 'bg-green-600 text-white' :
                                            project.level === 'Intermediate' ? 'bg-amber-600 text-white' :
                                                'bg-red-600 text-white'
                                            }`}>
                                            {project.level || 'All Levels'}
                                        </span>
                                        {project.isCompleted && (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-green-400/30 bg-green-500/20 text-green-400 flex items-center gap-1 backdrop-blur-md">
                                                <CheckCircle size={12} /> Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center text-indigo-400 text-sm font-bold mt-auto pt-4 border-t border-gray-800 group-hover:scale-105 transition-transform duration-200 origin-left">
                                        Start Building <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Wrench size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No projects available yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
