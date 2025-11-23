"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, FolderKanban } from "lucide-react";
import DeleteButton from "../components/DeleteButton";

interface Project {
    slug: string;
    meta: {
        title: string;
        description: string;
        level?: string;
        [key: string]: any;
    };
}

export default function ProjectListTable({ initialProjects }: { initialProjects: Project[] }) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleLevelChange = async (slug: string, newLevel: string) => {
        // Optimistic update
        setProjects(prev => prev.map(p =>
            p.slug === slug ? { ...p, meta: { ...p.meta, level: newLevel } } : p
        ));

        try {
            const res = await fetch(`/api/admin/projects/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meta: { level: newLevel } }), // Note: API expects { meta: { ... } } or just { level }? Need to check API.
            });

            if (!res.ok) {
                throw new Error("Failed to update level");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update level");
            // Revert could be implemented here by fetching again or storing previous state
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-300">Project Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-300">Description</th>
                        <th className="px-6 py-4 font-semibold text-gray-300">Level</th>
                        <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No projects found.
                            </td>
                        </tr>
                    ) : (
                        projects.map((project) => (
                            <tr key={project.slug} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-900/30 text-indigo-400 rounded-lg">
                                            <FolderKanban size={20} />
                                        </div>
                                        {project.meta.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm max-w-md truncate">
                                    {project.meta.description}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={project.meta.level || 'Beginner'}
                                        onChange={(e) => handleLevelChange(project.slug, e.target.value)}
                                        className={`px-2 py-1 text-xs font-bold rounded-full border-none outline-none cursor-pointer ${project.meta.level === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                                            project.meta.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                                                'bg-red-900/30 text-red-400'
                                            }`}
                                    >
                                        <option value="Beginner" className="bg-gray-900 text-gray-300">Beginner</option>
                                        <option value="Intermediate" className="bg-gray-900 text-gray-300">Intermediate</option>
                                        <option value="Advanced" className="bg-gray-900 text-gray-300">Advanced</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/projects/${project.slug}`} className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit Project">
                                            <Edit size={18} />
                                        </Link>
                                        <DeleteButton slug={project.slug} type="projects" />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
