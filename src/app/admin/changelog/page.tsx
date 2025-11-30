'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, History } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminChangelogPage() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchChangelog();
    }, []);

    const fetchChangelog = async () => {
        try {
            const res = await fetch('/api/admin/changelog');
            if (!res.ok) throw new Error('Failed to fetch changelog');
            const data = await res.json();
            setContent(data.content);
        } catch (error) {
            toast.error('Failed to load changelog');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/changelog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Failed to save changelog');
            toast.success('Changelog updated successfully');
        } catch (error) {
            toast.error('Failed to save changes');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <History className="text-indigo-500" />
                        Changelog Editor
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Edit the CHANGELOG.md file directly. Supports Markdown.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-gray-900/80">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Markdown Editor</span>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[70vh] bg-transparent text-gray-200 p-6 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                    spellCheck={false}
                    placeholder="# Changelog..."
                />
            </div>
        </div>
    );
}
