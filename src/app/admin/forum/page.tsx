import prisma from "@/lib/prisma";
import Link from "next/link";
import { Edit } from "lucide-react";
import DeleteForumPostButton from "@/app/admin/forum/DeleteForumPostButton";
import ForumHeader from "./ForumHeader";

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <ForumHeader />

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-300">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Author</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post: any) => (
                                <tr key={post.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            {post.author.image && (
                                                <img src={post.author.image} alt={post.author.name || ""} className="w-6 h-6 rounded-full" />
                                            )}
                                            {post.author.name || "Unknown"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${post.published ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/forum/${post.id}`} className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteForumPostButton postId={post.id} />
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
