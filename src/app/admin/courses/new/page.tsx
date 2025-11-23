"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        description: '',
        level: 'Beginner',
        image: ''
    });

    const handleSave = async () => {
        if (!formData.slug || !formData.title || !formData.description) {
            alert("Slug, Title, and Description are required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: formData.slug,
                    meta: {
                        title: formData.title,
                        description: formData.description,
                        level: formData.level,
                        image: formData.image || undefined
                    }
                }),
            });

            if (res.ok) {
                const data = await res.json();
                router.refresh();
                router.push(`/admin/courses/${data.slug}`);
            } else {
                const error = await res.json();
                alert(`Failed to create: ${error.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error creating course");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Create New Course</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={20} />
                    {saving ? 'Creating...' : 'Create Course'}
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Electronics 101"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Slug <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="electronics-101"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            URL-friendly ID (e.g., electronics-101)
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                            placeholder="A comprehensive introduction to electronics..."
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Level <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Image URL
                        </label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="https://example.com/course-cover.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional: URL to the course cover image
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
