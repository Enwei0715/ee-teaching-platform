"use client";

import { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogEditorProps {
    slug: string;
    initialContent?: string;
    initialMeta?: any;
    isNew: boolean;
    baseApiUrl?: string; // Allow overriding the API URL (e.g. for engineer vs admin)
    redirectUrl?: string;
}

export default function BlogEditor({ slug, initialContent = "", initialMeta = {}, isNew, baseApiUrl = "/api/admin/blog", redirectUrl = "/admin/blog" }: BlogEditorProps) {
    const router = useRouter();
    const [content, setContent] = useState<string>(initialContent);
    const [meta, setMeta] = useState<any>(initialMeta);
    const [loading, setLoading] = useState(!isNew && !initialContent);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNew || initialContent) {
            return;
        }

        fetch(`${baseApiUrl}/${slug}`)
            .then(async res => {
                if (!res.ok) throw new Error(`Failed to load: ${res.status} ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                setContent(data.content);
                setMeta(data.meta || {});
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [slug, isNew, initialContent, baseApiUrl]);

    const saveFile = async () => {
        if (!meta.title) {
            alert("Title is required");
            return;
        }

        setSaving(true);
        try {
            if (isNew) {
                // Create new post
                const newSlug = meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                const res = await fetch(baseApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, meta, slug: newSlug }),
                });

                if (res.ok) {
                    const data = await res.json();
                    const finalRedirectUrl = redirectUrl.replace('{slug}', data.slug || newSlug);
                    router.refresh();
                    router.push(finalRedirectUrl);
                } else {
                    const error = await res.json();
                    alert(`Failed to create: ${error.message}`);
                }
            } else {
                // Update existing post
                const res = await fetch(`${baseApiUrl}/${slug}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, meta }),
                });

                if (res.ok) {
                    router.refresh();
                    router.push(redirectUrl.replace('{slug}', slug));
                } else {
                    alert("Failed to save.");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? "New Post" : `Edit Post: ${slug}`}
                </h1>
                <button
                    onClick={saveFile}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
                {/* Main Content Editor */}
                <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-800 font-semibold text-gray-300 flex items-center gap-2">
                        <FileText size={18} />
                        Main Content (MDX)
                    </div>
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Loading...
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center text-red-500">
                            Error: {error}
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full bg-gray-950 p-6 text-gray-300 font-mono outline-none resize-none"
                            spellCheck={false}
                        />
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="lg:col-span-1 bg-gray-900 rounded-xl border border-gray-800 overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-gray-800 font-semibold text-gray-300">
                        Sidebar Settings
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={meta.title || ''}
                                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <input
                                type="text"
                                list="categories"
                                value={meta.category || ''}
                                onChange={(e) => setMeta({ ...meta, category: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Select or type..."
                            />
                            <datalist id="categories">
                                <option value="Tutorial" />
                                <option value="News" />
                                <option value="Project" />
                                <option value="Career" />
                            </datalist>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                            <input
                                type="date"
                                value={meta.date || ''}
                                onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea
                                value={meta.description || ''}
                                onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                                className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg p-3 text-gray-300 text-sm font-mono outline-none focus:border-indigo-500 resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
