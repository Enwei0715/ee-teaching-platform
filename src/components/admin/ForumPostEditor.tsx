"use client";

import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MDXEditor from "@/components/ui/MDXEditor";

interface ForumPostEditorProps {
    post: {
        id: string;
        title: string;
        content: string | null;
        published: boolean;
    };
    action: (id: string, formData: FormData) => Promise<void>;
}

export default function ForumPostEditor({ post, action }: ForumPostEditorProps) {
    const [content, setContent] = useState(post.content || "");

    // Create a bound action that includes the ID
    const updatePostWithId = action.bind(null, post.id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/forum" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Forum Post</h1>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-8">
                <form action={updatePostWithId} className="space-y-6">
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
                        <div className="min-h-[400px] border border-gray-800 rounded-lg overflow-hidden">
                            <MDXEditor
                                value={content}
                                onChange={setContent}
                                rows={15}
                                className="h-full"
                            />
                        </div>
                        {/* Hidden input to pass content to server action */}
                        <input type="hidden" name="content" value={content} />
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
