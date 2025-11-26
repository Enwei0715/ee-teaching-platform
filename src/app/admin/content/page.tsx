'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FooterLink {
    id: string;
    category: string;
    label: string;
    url: string;
    orderIndex: number;
}

export default function ContentManagementPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'general' | 'about' | 'links'>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data
    const [footerDescription, setFooterDescription] = useState('');
    const [aboutContent, setAboutContent] = useState('');
    const [links, setLinks] = useState<FooterLink[]>([]);

    // Link Form
    const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
    const [newLink, setNewLink] = useState({ category: 'resources', label: '', url: '', orderIndex: 0 });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/site-settings', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch settings');
            const data = await res.json();

            if (data.settings) {
                // Use defaults if DB is empty, matching the public pages
                const defaultFooter = "An open-source platform dedicated to teaching electronic engineering.\nFrom basic circuits to advanced FPGA design.";
                const defaultAbout = `
# Our Mission

At EE Master, our mission is simple: **Demystifying Electronics for Everyone.**

We believe that hardware engineering shouldn't be hidden behind expensive tools or impenetrable theory. Whether you're a student just starting out or a professional looking to sharpen your skills, we're here to help you understand the "why" and "how" behind every circuit.

# What We Offer

*   **Interactive Courses:** Dive deep into MDX-based curriculum covering everything from Diode fundamentals to BJT amplifiers and beyond.
*   **Real-World Projects:** Don't just read about it—build it. Our project-based learning approach focuses on real-world circuit design and simulation.
*   **Community Forum:** Join a growing community of engineers. Ask questions, share your knowledge, and collaborate on the next big thing.
`;
                setFooterDescription(data.settings.footer_description || defaultFooter);
                setAboutContent(data.settings.about_us_content || defaultAbout);
            }
            if (data.links) {
                setLinks(data.links);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await fetch('/api/admin/site-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: {
                        footer_description: footerDescription,
                        about_us_content: aboutContent
                    }
                })
            });
            router.refresh(); // Refresh server components (Footer)
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveLink = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = !!editingLink;
        const endpoint = '/api/admin/footer-links';
        const method = isEdit ? 'PUT' : 'POST';
        const body = isEdit ? editingLink : newLink;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchData();
                router.refresh();
                setEditingLink(null);
                setNewLink({ category: 'resources', label: '', url: '', orderIndex: 0 });
            }
        } catch (error) {
            console.error('Failed to save link', error);
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/admin/footer-links?id=${id}`, { method: 'DELETE' });
            await fetchData();
            router.refresh();
        } catch (error) {
            console.error('Failed to delete link', error);
        }
    };

    const DEFAULT_LINKS = [
        { category: 'resources', label: 'Courses', url: '/courses', orderIndex: 0 },
        { category: 'resources', label: 'Blog', url: '/blog', orderIndex: 1 },
        { category: 'resources', label: 'Projects', url: '/projects', orderIndex: 2 },
        { category: 'resources', label: 'Forum', url: '/forum', orderIndex: 3 },
        { category: 'community', label: 'GitHub', url: 'https://github.com/Enwei0715/ee-teaching-platform', orderIndex: 0 },
        { category: 'community', label: 'About Us', url: '/about', orderIndex: 1 },
    ];

    const handleInitializeDefaults = async () => {
        if (!confirm('This will seed the database with default links. Continue?')) return;
        setLoading(true);
        try {
            for (const link of DEFAULT_LINKS) {
                await fetch('/api/admin/footer-links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(link)
                });
            }
            await fetchData();
            alert('Default links initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize defaults', error);
            alert('Failed to initialize defaults');
        } finally {
            setLoading(false);
        }
    };

    const moveLink = async (index: number, direction: 'up' | 'down') => {
        const newLinks = [...links];
        if (direction === 'up' && index > 0) {
            [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
        } else if (direction === 'down' && index < newLinks.length - 1) {
            [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
        }

        // Update order indices locally first
        const updatedLinks = newLinks.map((link, idx) => ({ ...link, orderIndex: idx }));
        setLinks(updatedLinks);

        // Save new order to server
        // Ideally batch update, but for now loop update (simple)
        for (const link of updatedLinks) {
            await fetch('/api/admin/footer-links', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(link)
            });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Content Management</h1>
                <Link href="/admin" className="text-gray-400 hover:text-white">Back to Dashboard</Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-800">
                {['general', 'about', 'links'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab
                            ? 'text-indigo-500 border-b-2 border-indigo-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab === 'links' ? 'Footer Links' : tab === 'about' ? 'About Us' : 'General'}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Footer Settings</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Footer Description</label>
                        <textarea
                            value={footerDescription}
                            onChange={(e) => setFooterDescription(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white h-32"
                            placeholder="Enter the text displayed in the footer..."
                        />
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">About Us Content</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Content (Markdown supported)</label>
                        <textarea
                            value={aboutContent}
                            onChange={(e) => setAboutContent(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white h-[500px] font-mono"
                            placeholder="# About Us\n\nWrite your content here..."
                        />
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add/Edit Form */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingLink ? 'Edit Link' : 'Add New Link'}
                        </h2>
                        <form onSubmit={handleSaveLink} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select
                                    value={editingLink ? editingLink.category : newLink.category}
                                    onChange={(e) => editingLink
                                        ? setEditingLink({ ...editingLink, category: e.target.value })
                                        : setNewLink({ ...newLink, category: e.target.value })
                                    }
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white"
                                >
                                    <option value="resources">Resources</option>
                                    <option value="community">Community</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={editingLink ? editingLink.label : newLink.label}
                                    onChange={(e) => editingLink
                                        ? setEditingLink({ ...editingLink, label: e.target.value })
                                        : setNewLink({ ...newLink, label: e.target.value })
                                    }
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={editingLink ? editingLink.url : newLink.url}
                                    onChange={(e) => editingLink
                                        ? setEditingLink({ ...editingLink, url: e.target.value })
                                        : setNewLink({ ...newLink, url: e.target.value })
                                    }
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                                    {editingLink ? 'Update Link' : 'Add Link'}
                                </button>
                                {editingLink && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingLink(null)}
                                        className="px-4 bg-gray-700 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4">Existing Links</h2>
                        <div className="space-y-4">
                            {links.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">No links found in database.</p>
                                    <button
                                        onClick={handleInitializeDefaults}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        Initialize Default Links
                                    </button>
                                </div>
                            )}
                            {['resources', 'community'].map(category => (
                                <div key={category}>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{category}</h3>
                                    <div className="space-y-2">
                                        {links.filter(l => l.category === category).map((link, idx) => (
                                            <div key={link.id} className="flex items-center justify-between bg-gray-950 p-3 rounded border border-gray-800">
                                                <div>
                                                    <div className="font-medium text-white">{link.label}</div>
                                                    <div className="text-xs text-gray-500">{link.url}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setEditingLink(link)} className="text-blue-400 hover:text-blue-300"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteLink(link.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
