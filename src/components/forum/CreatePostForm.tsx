'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function CreatePostForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/forum/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (res.ok) {
                setTitle('');
                setContent('');
                setIsOpen(false);
                router.refresh();
                window.location.reload();
            } else {
                const data = await res.json();
                alert(`Failed to post: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-accent-primary text-white font-bold py-3 rounded-lg hover:bg-accent-primary/90 transition-colors"
            >
                Start a New Discussion
            </button>
        );
    }

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-text-primary mb-4">Create New Post</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:border-accent-primary"
                        placeholder="What's on your mind?"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                        placeholder="Describe your question or topic... (Markdown supported)"
                    />
                    <div className="text-xs text-text-secondary mt-2 flex gap-4">
                        <span>**Bold**</span>
                        <span>*Italic*</span>
                        <span>[Link](url)</span>
                        <span>![Image](url)</span>
                        <span>{'<YouTube url="..." />'}</span>
                    </div>
                </div>
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Discussion'}
                        {!loading && <Send size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
