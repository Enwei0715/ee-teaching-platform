"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Plus, Trash2, Edit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DeleteButton from "../../components/DeleteButton";
import MDXEditor from "@/components/ui/MDXEditor";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.slug as string;

    const [files, setFiles] = useState<{ filename: string; order: number }[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [content, setContent] = useState<string>("");
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'settings' | 'quiz'>('editor');

    // Quiz State
    const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
    const [tempQuestion, setTempQuestion] = useState<{
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }>({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
    });

    const saveQuestion = () => {
        const newQuestions = [...(meta.questions || [])];

        if (editingQuestion === -1) {
            newQuestions.push(tempQuestion);
        } else if (editingQuestion !== null) {
            newQuestions[editingQuestion] = tempQuestion;
        }

        setMeta({ ...meta, questions: newQuestions });
        setEditingQuestion(null);
    };

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
        setActiveTab('editor'); // Switch to editor tab when loading a file
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
                // Check if slug changed
                if (meta.slug && meta.slug !== selectedFile.replace(/\.mdx$/, '')) {
                    const newFilename = `${meta.slug}.mdx`;
                    setSelectedFile(newFilename);
                    // Update URL without reloading page
                    // window.history.replaceState(null, '', `?file=${newFilename}`);
                }

                router.refresh();
                // Refresh file list to update order if changed
                const listRes = await fetch(`/api/admin/courses/${courseId}`);
                const listData = await listRes.json();
                setFiles(listData.files || []);
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
                // Refresh list to get correct order
                const listRes = await fetch(`/api/admin/courses/${courseId}`);
                const listData = await listRes.json();
                setFiles(listData.files || []);

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
                setFiles(prev => prev.filter(f => f.filename !== filename));
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

    // Edit Course Details Modal
    const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
    const [courseDetails, setCourseDetails] = useState({
        title: '',
        slug: '',
        description: '',
        level: 'Beginner',
        image: '',
        published: false
    });

    useEffect(() => {
        if (showEditDetailsModal) {
            // Fetch course details when modal opens
            fetch(`/api/admin/courses/${courseId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.course) {
                        setCourseDetails({
                            title: data.course.title,
                            slug: data.course.slug,
                            description: data.course.description,
                            level: data.course.level,
                            image: data.course.image || '',
                            published: data.course.published || false
                        });
                    }
                })
                .catch(console.error);
        }
    }, [showEditDetailsModal, courseId]);

    const handleUpdateCourse = async () => {
        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseDetails),
            });

            if (res.ok) {
                const data = await res.json();
                setShowEditDetailsModal(false);

                // If slug changed, redirect to new URL
                if (courseDetails.slug !== courseId) {
                    window.location.href = `/admin/courses/${courseDetails.slug}`;
                } else {
                    router.refresh();
                }
            } else {
                const error = await res.json();
                alert(`Failed to update: ${error.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error updating course");
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col relative h-auto min-h-screen pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white break-all">Edit Course: {courseId}</h1>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button
                        onClick={() => setShowEditDetailsModal(true)}
                        className="bg-gray-800 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium lg:font-bold flex items-center gap-1.5 lg:gap-2 hover:bg-gray-700 transition-colors"
                    >
                        Edit Details
                    </button>
                    <button
                        onClick={() => setShowNewLessonModal(true)}
                        className="bg-gray-800 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium lg:font-bold flex items-center gap-1.5 lg:gap-2 hover:bg-gray-700 transition-colors"
                    >
                        <Plus size={16} className="lg:w-5 lg:h-5" />
                        Add Lesson
                    </button>
                    {selectedFile && (
                        <button
                            onClick={saveFile}
                            disabled={saving}
                            className="bg-indigo-600 text-white px-4 py-1.5 lg:px-6 lg:py-2 rounded-lg text-sm lg:text-base font-medium lg:font-bold flex items-center gap-1.5 lg:gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} className="lg:w-5 lg:h-5" />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-6">
                {/* File List */}
                <div className="w-full lg:w-64 glass-panel flex flex-col h-auto">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="font-bold text-gray-400">Course Files</h2>
                        <span className="text-xs text-gray-500 lg:hidden">{files.length} files</span>
                    </div>
                    <div className="p-2 flex-1">
                        {files.map(file => (
                            <div
                                key={file.filename}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${selectedFile === file.filename ? 'bg-indigo-900/50 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <button
                                    onClick={() => loadFile(file.filename)}
                                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                                >
                                    <FileText size={16} className="shrink-0" />
                                    <span className="truncate text-sm">
                                        {file.order ? `${file.order}. ` : ''}{file.filename}
                                    </span>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteLesson(file.filename, e)}
                                    className="p-1 text-gray-500 hover:text-red-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                    title="Delete Lesson"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor with Tabs */}
                <div className="flex-1 glass-panel flex flex-col min-h-[50vh] lg:min-h-[400px]">
                    {selectedFile ? (
                        <>
                            <div className="p-4 border-b border-gray-800 font-semibold text-gray-300 flex items-center gap-2">
                                <FileText size={18} />
                                {selectedFile}
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-800 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`px-3 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-medium transition-colors relative whitespace-nowrap ${activeTab === 'editor'
                                        ? 'text-indigo-400 bg-indigo-500/10'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                >
                                    Edit Content
                                    {activeTab === 'editor' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('quiz')}
                                    className={`px-3 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-medium transition-colors relative whitespace-nowrap ${activeTab === 'quiz'
                                        ? 'text-indigo-400 bg-indigo-500/10'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                >
                                    Quiz Questions
                                    {activeTab === 'quiz' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`px-3 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-medium transition-colors relative whitespace-nowrap ${activeTab === 'settings'
                                        ? 'text-indigo-400 bg-indigo-500/10'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                >
                                    Lesson Settings
                                    {activeTab === 'settings' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                                    )}
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {activeTab === 'editor' && (
                                    <MDXEditor
                                        value={content}
                                        onChange={setContent}
                                        className="flex-1 flex flex-col h-full"
                                        rows={20}
                                    />
                                )}

                                {activeTab === 'quiz' && (
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                                            <div className="text-sm text-gray-400">
                                                {meta.questions?.length || 0} Questions defined
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setTempQuestion({
                                                        question: "",
                                                        options: ["", "", "", ""],
                                                        correctAnswer: 0,
                                                        explanation: ""
                                                    });
                                                    setEditingQuestion(-1); // -1 for new
                                                }}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
                                            >
                                                <Plus size={14} /> Add Question
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {(!meta.questions || meta.questions.length === 0) ? (
                                                <div className="text-center py-12 text-gray-500">
                                                    <p className="mb-2">No manual questions defined.</p>
                                                    <p className="text-xs">The AI will generate questions automatically unless you add them here.</p>
                                                </div>
                                            ) : (
                                                meta.questions.map((q: any, idx: number) => (
                                                    <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                                                        <div className="flex justify-between gap-4 mb-2">
                                                            <h4 className="font-semibold text-white text-sm">Q{idx + 1}: {q.question}</h4>
                                                            <div className="flex gap-1 shrink-0">
                                                                <button
                                                                    onClick={() => {
                                                                        setTempQuestion({ ...q });
                                                                        setEditingQuestion(idx);
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-indigo-400 rounded hover:bg-gray-800"
                                                                >
                                                                    <Edit size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm("Delete this question?")) {
                                                                            const newQuestions = [...meta.questions];
                                                                            newQuestions.splice(idx, 1);
                                                                            setMeta({ ...meta, questions: newQuestions });
                                                                        }
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-800"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                                                            {q.options.map((opt: string, optIdx: number) => (
                                                                <div key={optIdx} className={`px-2 py-1 rounded flex items-center gap-2 ${optIdx === q.correctAnswer ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-gray-950 text-gray-500'}`}>
                                                                    <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {q.explanation && (
                                                            <div className="text-xs text-gray-500 border-t border-gray-800 pt-2 mt-2">
                                                                <span className="font-semibold text-gray-400">Explanation:</span> {q.explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="p-8 space-y-6 overflow-y-auto">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={meta.title || ''}
                                                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                                placeholder="Lesson title..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
                                            <input
                                                type="text"
                                                value={meta.slug || ''}
                                                onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                                placeholder="lesson-slug"
                                            />
                                            <p className="text-xs text-yellow-500/70 mt-2">Changing this changes the URL.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Order</label>
                                            <input
                                                type="number"
                                                value={meta.order || ''}
                                                onChange={(e) => setMeta({ ...meta, order: parseInt(e.target.value) })}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                                placeholder="1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                            <MDXEditor
                                                value={meta.description || ''}
                                                onChange={(val) => setMeta({ ...meta, description: val })}
                                                rows={8}
                                                placeholder="Course description..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[200px]">
                            Select a file to edit
                        </div>
                    )}
                </div>
            </div>

            {/* Modals placed outside main layout */}

            {/* New Lesson Modal */}
            {showNewLessonModal && (
                <div className="absolute inset-0 glass-heavy flex items-center justify-center z-50">
                    <div className="glass-panel p-6 w-full max-w-md shadow-xl">
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

            {/* Question Editor Modal */}
            {editingQuestion !== null && (
                <div className="fixed inset-0 glass-heavy flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingQuestion === -1 ? "Add New Question" : "Edit Question"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Question</label>
                                <input
                                    type="text"
                                    value={tempQuestion.question}
                                    onChange={(e) => setTempQuestion(prev => ({ ...prev, question: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter question text..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">Options</label>
                                {tempQuestion.options.map((opt: string, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 text-sm font-bold shrink-0">
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...tempQuestion.options];
                                                newOptions[idx] = e.target.value;
                                                setTempQuestion(prev => ({ ...prev, options: newOptions }));
                                            }}
                                            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                            placeholder={`Option ${idx + 1}...`}
                                        />
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={tempQuestion.correctAnswer === idx}
                                            onChange={() => setTempQuestion(prev => ({ ...prev, correctAnswer: idx }))}
                                            className="w-4 h-4 mt-3 accent-indigo-500 cursor-pointer"
                                            title="Mark as correct answer"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Explanation</label>
                                <textarea
                                    value={tempQuestion.explanation}
                                    onChange={(e) => setTempQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                                    placeholder="Explain why this answer is correct..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => setEditingQuestion(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveQuestion}
                                    disabled={!tempQuestion.question || tempQuestion.options.some((o: string) => !o)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                >
                                    {editingQuestion === -1 ? "Add Question" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Course Details Modal */}
            {showEditDetailsModal && (
                <div className="fixed inset-0 glass-heavy flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-6">Edit Course Details</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={courseDetails.title}
                                    onChange={(e) => setCourseDetails({ ...courseDetails, title: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                <label className="text-sm font-medium text-gray-300">Visibility Status</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={courseDetails.published}
                                        onChange={(e) => setCourseDetails({ ...courseDetails, published: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-300">
                                        {courseDetails.published ? 'Published (Visible)' : 'Hidden (Draft)'}
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={courseDetails.slug}
                                    onChange={(e) => setCourseDetails({ ...courseDetails, slug: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                                <p className="text-xs text-yellow-500 mt-1">Warning: Changing the slug will change the course URL.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={courseDetails.description}
                                    onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
                                <select
                                    value={courseDetails.level}
                                    onChange={(e) => setCourseDetails({ ...courseDetails, level: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Logo (Image URL or Emoji)</label>
                                <input
                                    type="text"
                                    value={courseDetails.image || ''}
                                    onChange={(e) => setCourseDetails({ ...courseDetails, image: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. https://example.com/logo.png or ⚡"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setShowEditDetailsModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateCourse}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
