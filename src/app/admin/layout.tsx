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
        <div className="min-h-screen bg-black flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800 text-white flex flex-col shrink-0">
                <div className="p-4 lg:p-6 border-b border-gray-800 flex items-center justify-between lg:block">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="text-indigo-500" />
                        EE Admin
                    </h1>
                </div>

                <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-x-auto flex lg:block">
                    <Link href="/admin" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <LayoutDashboard size={20} />
                        <span className="hidden lg:inline">Dashboard</span>
                    </Link>
                    <Link href="/admin/courses" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <BookOpen size={20} />
                        <span className="hidden lg:inline">Courses</span>
                    </Link>
                    <Link href="/admin/projects" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <FolderKanban size={20} />
                        <span className="hidden lg:inline">Projects</span>
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <FileText size={20} />
                        <span className="hidden lg:inline">Blog</span>
                    </Link>
                    <Link href="/admin/forum" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <MessageSquare size={20} />
                        <span className="hidden lg:inline">Forum</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors whitespace-nowrap">
                        <Users size={20} />
                        <span className="hidden lg:inline">Users</span>
                    </Link>
                </nav>

                <div className="p-2 lg:p-4 border-t border-gray-800 hidden lg:block">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black h-[calc(100dvh-60px)] lg:h-screen">
                <div className="p-4 lg:p-8 pb-40">
                    {children}
                </div>
            </main>
        </div>
    );
}
