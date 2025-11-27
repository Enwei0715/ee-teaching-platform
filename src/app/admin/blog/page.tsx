import Link from "next/link";
import { Plus, Edit, FileText } from "lucide-react";
import { getAllBlogPosts } from "@/lib/mdx";
import DeleteButton from "../components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const posts = await getAllBlogPosts();

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Blog Management</h1>
                <Link href="/admin/blog/new" className="bg-indigo-600 text-white px-3 py-2 lg:px-4 lg:py-2 text-sm lg:text-base rounded-lg flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-indigo-700 transition-colors whitespace-nowrap">
                    <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
                    New Post
                </Link>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-800 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-300">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-300">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-300">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No blog posts found.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post: any) => (
                                    <tr key={post.slug} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-900/30 text-indigo-400 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                {post.meta.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {post.meta.category}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {post.meta.date}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/blog/${post.slug}`} className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit Post">
                                                    <Edit size={18} />
                                                </Link>
                                                <DeleteButton slug={post.slug} type="blog" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
