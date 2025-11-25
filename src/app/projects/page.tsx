'use client';

import Link from 'next/link';
import { Wrench, ArrowRight, Edit2 } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEditMode } from '@/context/EditModeContext';
import CircuitBackground from '@/components/ui/CircuitBackground';


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


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col">
                {/* Hero Section Skeleton */}
                <div className="bg-indigo-950 text-white py-24 px-6 relative overflow-hidden border-b border-indigo-900/50">
                    <CircuitBackground />
                    <div className="max-w-7xl mx-auto relative z-10 text-center animate-pulse">
                        <div className="h-14 bg-gray-800 rounded w-2/3 mx-auto mb-6"></div>
                        <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto mb-10"></div>
                    </div>
                </div>

                {/* Projects Grid Skeleton */}
                <div className="flex-1 py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden h-[380px] animate-pulse">
                                    {/* Image Placeholder */}
                                    <div className="w-full h-48 bg-gray-800"></div>
                                    {/* Content Placeholder */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-6 w-6 bg-gray-800 rounded"></div>
                                            <div className="h-5 bg-gray-800 rounded w-24"></div>
                                        </div>
                                        <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                                        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                                        <div className="h-9 bg-gray-800 rounded w-full mt-4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            {/* Hero Section */}
            <div className="bg-indigo-950 text-white py-24 px-6 relative overflow-hidden border-b border-indigo-900/50">
                <CircuitBackground />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 z-0"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <EditableText
                        tag="h1"
                        defaultText="Build. Learn. Innovate."
                        mode="static"
                        contentKey="projects_title"
                        className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white"
                    />
                    <EditableText
                        tag="p"
                        defaultText="Hands-on electronics projects to take you from theory to reality. Start building your portfolio today."
                        mode="static"
                        contentKey="projects_subtitle"
                        className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed mb-10"
                        multiline
                    />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full relative"
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
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-white/5 ${project.level === 'Beginner' ? 'bg-green-600 text-white' :
                                            project.level === 'Intermediate' ? 'bg-amber-600 text-white' :
                                                'bg-red-600 text-white'
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
