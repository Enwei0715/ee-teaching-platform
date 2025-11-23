import { checkAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { LayoutDashboard, BookOpen, FileText, Users, Settings, LogOut, FolderKanban, MessageSquare } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkAdmin();

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-950 border-r border-gray-800 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="text-indigo-500" />
                        EE Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <BookOpen size={20} />
                        Courses
                    </Link>
                    <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <FolderKanban size={20} />
                        Projects
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <FileText size={20} />
                        Blog
                    </Link>
                    <Link href="/admin/forum" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <MessageSquare size={20} />
                        Forum
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors">
                        <Users size={20} />
                        Users
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
