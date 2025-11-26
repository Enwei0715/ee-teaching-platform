import prisma from "@/lib/prisma";
import { Users, BookOpen, FileText, Activity } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch real stats in parallel
    const [userCount, courseCount, projectCount, postCount] = await Promise.all([
        prisma.user.count(),
        prisma.course.count({ where: { published: true } }),
        prisma.project.count({ where: { published: true } }),
        prisma.post.count(), // Forum posts
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Users */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{userCount}</h3>
                    <p className="text-gray-400 text-sm">Total Users</p>
                </div>

                {/* Courses */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{courseCount}</h3>
                    <p className="text-gray-400 text-sm">Published Courses</p>
                </div>

                {/* Projects */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-900/30 text-emerald-400 rounded-lg">
                            <Activity size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{projectCount}</h3>
                    <p className="text-gray-400 text-sm">Published Projects</p>
                </div>

                {/* Forum Posts */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-900/30 text-purple-400 rounded-lg">
                            <FileText size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{postCount}</h3>
                    <p className="text-gray-400 text-sm">Forum Posts</p>
                </div>
            </div>

            {/* Quick Actions / Management Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link href="/admin/content" className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <FileText size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Content Management</h2>
                    </div>
                    <p className="text-gray-400">Manage footer text, links, and About Me page content.</p>
                </Link>
            </div>

            {/* System Status */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                <h2 className="text-lg font-bold text-white mb-4">System Status</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    All systems operational
                </div>
            </div>
        </div>
    );
}
