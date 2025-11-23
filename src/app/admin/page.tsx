import prisma from "@/lib/prisma";
import { Users, BookOpen, FileText, Activity } from "lucide-react";

export default async function AdminDashboard() {
    // Fetch stats
    const userCount = await prisma.user.count();
    // Mock counts for now until models are fully set up or populated
    const courseCount = 0;
    const postCount = await prisma.post.count();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg">
                            <Users size={24} />
                        </div>
                        <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                            <Activity size={14} /> +12%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{userCount}</h3>
                    <p className="text-gray-400 text-sm">Total Users</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Active</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{courseCount}</h3>
                    <p className="text-gray-400 text-sm">Published Courses</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-900/30 text-purple-400 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                            <Activity size={14} /> +5%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{postCount}</h3>
                    <p className="text-gray-400 text-sm">Forum Posts</p>
                </div>
            </div>

            {/* Recent Activity or other widgets can go here */}
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
