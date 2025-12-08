"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Edit, ExternalLink } from "lucide-react";
import DeleteButton from "../components/DeleteButton";

interface Course {
    slug: string;
    meta: {
        title: string;
        description: string;
        level: string;
        [key: string]: any;
    };
}

export default function CourseListTable({ initialCourses }: { initialCourses: Course[] }) {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>(initialCourses);

    useEffect(() => {
        setCourses(initialCourses);
    }, [initialCourses]);

    const handleLevelChange = async (slug: string, newLevel: string) => {
        // Optimistic update
        setCourses(prev => prev.map(c =>
            c.slug === slug ? { ...c, meta: { ...c.meta, level: newLevel } } : c
        ));

        try {
            const res = await fetch(`/api/admin/courses/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level: newLevel }),
            });

            if (!res.ok) {
                throw new Error("Failed to update level");
            }
            router.refresh(); // Refresh server data
        } catch (error) {
            console.error(error);
            alert("Failed to update level");
        }
    };

    const handlePublishToggle = async (slug: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        // Optimistic update
        setCourses(prev => prev.map(c =>
            c.slug === slug ? { ...c, meta: { ...c.meta, published: newStatus } } : c
        ));

        try {
            const res = await fetch(`/api/admin/courses/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: newStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update published status");
            }
            router.refresh(); // Refresh server data
        } catch (error) {
            console.error(error);
            alert("Failed to update published status");
            setCourses(prev => prev.map(c =>
                c.slug === slug ? { ...c, meta: { ...c.meta, published: currentStatus } } : c
            ));
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-300">Course Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Level</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Description</th>
                            <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No courses found.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.slug} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-900/50 text-indigo-400 rounded-lg">
                                                <BookOpen size={18} />
                                            </div>
                                            {course.meta.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handlePublishToggle(course.slug, course.meta.published)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${course.meta.published
                                                ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                }`}
                                        >
                                            {course.meta.published ? "Published" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={course.meta.level || 'Beginner'}
                                            onChange={(e) => handleLevelChange(course.slug, e.target.value)}
                                            className={`px-2 py-1 text-xs font-bold rounded-full border-none outline-none cursor-pointer ${course.meta.level === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                                                course.meta.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                                                    'bg-red-900/30 text-red-400'
                                                }`}
                                        >
                                            <option value="Beginner" className="bg-gray-900 text-gray-300">Beginner</option>
                                            <option value="Intermediate" className="bg-gray-900 text-gray-300">Intermediate</option>
                                            <option value="Advanced" className="bg-gray-900 text-gray-300">Advanced</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm max-w-[300px] truncate" title={course.meta.description}>
                                        {course.meta.description || "No description"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 items-center">
                                            <Link href={`/courses/${course.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-300 rounded-lg transition-colors" title="View Live">
                                                <ExternalLink size={18} />
                                            </Link>
                                            <Link href={`/admin/courses/${course.slug}`} className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit Course Content">
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteButton slug={course.slug} type="courses" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
