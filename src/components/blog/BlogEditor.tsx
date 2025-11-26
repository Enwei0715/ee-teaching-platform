"use client";

import { useState, useEffect } from "react";
import { Save, FileText, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import MDXEditor from "@/components/ui/MDXEditor";
import TagInput from "@/components/ui/TagInput";

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
                    // Force full reload to ensure list is updated
                    window.location.href = finalRedirectUrl;
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
                    // Force full reload to ensure fresh data
                    window.location.href = redirectUrl.replace('{slug}', slug);
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
        <div className="max-w-6xl mx-auto">
            <div className="glass-heavy rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {isNew ? "Create New Post" : "Edit Post"}
                        </h1>
                        <p className="text-gray-400 mt-1 text-sm">
                            {isNew ? "Drafting a new article for the engineering blog." : `Editing: ${slug}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveFile}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Publish Post"}
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Enter post title..."
                                value={meta.title || ''}
                                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-700 text-3xl font-bold text-white py-2 focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-gray-600"
                            />
                        </div>

                        {/* Editor Container */}
                        <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden min-h-[600px] flex flex-col">
                            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                <FileText size={14} />
                                Markdown Content
                            </div>
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    Loading content...
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex items-center justify-center text-red-400">
                                    Error: {error}
                                </div>
                            ) : (
                                <div className="flex-1 relative">
                                    <MDXEditor
                                        value={content}
                                        onChange={setContent}
                                        className="absolute inset-0"
                                        rows={25}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-950/50 rounded-xl border border-white/10 p-6 space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Settings size={18} className="text-indigo-400" />
                                Post Settings
                            </h3>

                            {/* Slug (Read-only for now or auto-generated) */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                <div className="text-gray-400 text-sm font-mono bg-black/20 p-2 rounded border border-white/5 truncate">
                                    {slug || (meta.title ? meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'auto-generated-slug')}
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Publish Date</label>
                                <input
                                    type="date"
                                    value={meta.date || ''}
                                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <TagInput
                                    label="Categories"
                                    value={Array.isArray(meta.category) ? meta.category : (meta.category ? [meta.category] : [])}
                                    onChange={(val) => setMeta({ ...meta, category: val })}
                                    placeholder="Add category..."
                                />
                            </div>

                            {/* Description/Excerpt */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Excerpt</label>
                                <textarea
                                    value={meta.description || ''}
                                    onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                                    placeholder="Brief summary for SEO and cards..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
