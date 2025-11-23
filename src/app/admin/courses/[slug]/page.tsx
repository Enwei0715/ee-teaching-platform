"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DeleteButton from "../../components/DeleteButton";
import MDXEditor from "@/components/ui/MDXEditor";

export default function EditCoursePage() {
    const params = useParams();
    const courseId = params.slug as string;

    const [files, setFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [content, setContent] = useState<string>("");
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/courses/${courseId}`)
            .then(res => res.json())
            .then(data => {
                setFiles(data.files || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [courseId]);

    const loadFile = async (file: string) => {
        setLoading(true);
        setSelectedFile(file);
        try {
            const res = await fetch(`/api/admin/courses/${courseId}?file=${file}`);
            const data = await res.json();
            setContent(data.content);
            setMeta(data.meta || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const saveFile = async () => {
        if (!selectedFile) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: selectedFile, content, meta }),
            });
            if (res.ok) {
                alert("Saved successfully!");
            } else {
                alert("Failed to save.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    const [showNewLessonModal, setShowNewLessonModal] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonFilename, setNewLessonFilename] = useState("");

    const handleCreateLesson = async () => {
        if (!newLessonTitle || !newLessonFilename) return;

        try {
            const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newLessonTitle, filename: newLessonFilename }),
            });

            if (res.ok) {
                const data = await res.json();
                setFiles(prev => [...prev, data.filename]);
                setShowNewLessonModal(false);
                setNewLessonTitle("");
                setNewLessonFilename("");
                loadFile(data.filename);
                alert("Lesson created successfully!");
            } else {
                const err = await res.text();
                alert(`Failed to create lesson: ${err}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error creating lesson");
        }
    };

    const handleDeleteLesson = async (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

        try {
            const res = await fetch(`/api/admin/courses/${courseId}/lessons?filename=${filename}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFiles(prev => prev.filter(f => f !== filename));
                if (selectedFile === filename) {
                    setSelectedFile(null);
                    setContent("");
                    setMeta({});
                }
                alert("Lesson deleted successfully");
            } else {
                alert("Failed to delete lesson");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting lesson");
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col relative overflow-y-auto lg:overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Edit Course: {courseId}</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewLessonModal(true)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Lesson
                    </button>
                    {selectedFile && (
                        <button
                            onClick={saveFile}
                            disabled={saving}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={20} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* File List */}
                <div className="w-full lg:w-64 bg-gray-900 rounded-xl border border-gray-800 flex flex-col max-h-[200px] lg:max-h-none lg:h-full">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="font-bold text-gray-400">Course Files</h2>
                        <span className="text-xs text-gray-500 lg:hidden">{files.length} files</span>
                    </div>
                    <div className="p-2 overflow-y-auto flex-1">
                        {files.map(file => (
                            <div
                                key={file}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${selectedFile === file ? 'bg-indigo-900/50 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <button
                                    onClick={() => loadFile(file)}
                                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                                >
                                    <FileText size={16} className="shrink-0" />
                                    <span className="truncate text-sm">{file}</span>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteLesson(file, e)}
                                    className="p-1 text-gray-500 hover:text-red-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                    title="Delete Lesson"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor & Sidebar */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                    {/* Main Content Editor */}
                    <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col min-h-[400px]">
                        {selectedFile ? (
                            <>
                                <div className="p-4 border-b border-gray-800 font-semibold text-gray-300 flex items-center gap-2">
                                    <FileText size={18} />
                                    {selectedFile}
                                </div>
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <MDXEditor
                                        value={content}
                                        onChange={setContent}
                                        className="flex-1 flex flex-col h-full"
                                        rows={20}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a file to edit
                            </div>
                        )}
                    </div>

                    {/* Sidebar Settings */}
                    {selectedFile && (
                        <div className="w-full lg:w-80 bg-gray-900 rounded-xl border border-gray-800 overflow-y-auto flex flex-col max-h-[300px] lg:max-h-none lg:h-full">
                            <div className="p-4 border-b border-gray-800 font-semibold text-gray-300">
                                Lesson Settings
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <MDXEditor
                                        value={meta.description || ''}
                                        onChange={(val) => setMeta({ ...meta, description: val })}
                                        rows={6}
                                        placeholder="Course description..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Lesson Modal */}
            {showNewLessonModal && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Lesson</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Lesson Title</label>
                                <input
                                    type="text"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Introduction to Voltage"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Filename (slug)</label>
                                <input
                                    type="text"
                                    value={newLessonFilename}
                                    onChange={(e) => setNewLessonFilename(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. intro-to-voltage"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowNewLessonModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateLesson}
                                    disabled={!newLessonTitle || !newLessonFilename}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Lesson
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
