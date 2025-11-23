"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectPage() {
    const params = useParams();
    const projectId = params.slug as string;
    const router = useRouter();
    const isNew = projectId === 'new';

    const [content, setContent] = useState<string>("");
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isNew) {
            return;
        }

        fetch(`/api/admin/projects/${projectId}`)
            .then(res => res.json())
            .then(data => {
                setContent(data.content);
                setMeta(data.meta || {});
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [projectId, isNew]);

    const saveFile = async () => {
        if (!meta.title) {
            alert("Title is required");
            return;
        }

        if (isNew && !meta.slug) {
            alert("Slug is required");
            return;
        }

        setSaving(true);
        try {
            // Remove features from meta as it's no longer used
            const sanitizedMeta = { ...meta, features: [] };

            if (isNew) {
                // Create new project
                const slug = meta.slug;
                const res = await fetch(`/api/admin/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, meta: sanitizedMeta, slug }),
                });

                if (res.ok) {
                    const data = await res.json();
                    router.refresh();
                    router.push(`/admin/projects`);
                } else {
                    const error = await res.json();
                    alert(`Failed to create: ${error.message}`);
                }
            } else {
                // Update existing project
                const res = await fetch(`/api/admin/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, meta: sanitizedMeta }),
                });

                if (res.ok) {
                    router.refresh();
                    router.push(`/admin/projects`);
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

    const handleArrayChange = (field: string, value: string) => {
        setMeta({ ...meta, [field]: value.split('\n').filter(line => line.trim() !== '') });
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/projects" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        {isNew ? "New Project" : `Edit Project: ${projectId}`}
                    </h1>
                </div>
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
                        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
                    ) : (
                        <>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="flex-1 w-full bg-gray-950 p-6 text-gray-300 font-mono outline-none resize-none"
                                spellCheck={false}
                            />
                            <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 text-xs text-gray-500 flex gap-4">
                                <span>**Bold**</span>
                                <span>*Italic*</span>
                                <span>[Link](url)</span>
                                <span>![Image](url)</span>
                                <span>{'<YouTube url="..." />'}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="lg:col-span-1 bg-gray-900 rounded-xl border border-gray-800 overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-gray-800 font-semibold text-gray-300">
                        Sidebar Settings
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={meta.title || ''}
                                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Slug <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={meta.slug || ''}
                                onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="diode-rectifier"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                URL-friendly ID (e.g., diode-rectifier)
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea
                                value={meta.description || ''}
                                onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                            />
                        </div>

                        {/* Video URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Video URL</label>
                            <input
                                type="text"
                                value={meta.videoUrl || ''}
                                onChange={(e) => setMeta({ ...meta, videoUrl: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (one per line)</label>
                            <textarea
                                value={(meta.technologies || []).join('\n')}
                                onChange={(e) => handleArrayChange('technologies', e.target.value)}
                                className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg p-3 text-gray-300 text-sm font-mono outline-none focus:border-indigo-500 resize-none"
                                placeholder="React&#10;TypeScript"
                            />
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
