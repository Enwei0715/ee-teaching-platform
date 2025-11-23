import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditForumPostPage({ params }: { params: { id: string } }) {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        notFound();
    }

    async function updatePost(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const published = formData.get("published") === "on";

        await prisma.post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                published,
            },
        });

        redirect("/admin/forum");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/forum" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Forum Post</h1>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-8">
                <form action={updatePost} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={post.title}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                            Content (Markdown)
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            defaultValue={post.content || ""}
                            rows={15}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            name="published"
                            defaultChecked={post.published}
                            className="w-5 h-5 rounded border-gray-800 bg-gray-950 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-gray-400">
                            Published
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
