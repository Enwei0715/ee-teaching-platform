'use client';
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Clock, MessageSquare, Send, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import MDXContent from '@/components/mdx/MDXContent';

interface Comment {
    id: string;
    content: string;
    author: { name: string };
    createdAt: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: { name: string };
    authorId: string;
    createdAt: string;
    comments: Comment[];
}

interface PostDetailProps {
    post: Post;
    mdxSource: MDXRemoteSerializeResult;
}

export default function PostDetail({ post, mdxSource }: PostDetailProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent }),
            });

            if (res.ok) {
                setReplyContent('');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/forum/posts/${post.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/forum');
                router.refresh();
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting post');
        } finally {
            setIsDeleting(false);
        }
    };

    const canDelete = session?.user?.role === 'ADMIN' || session?.user?.id === post.authorId;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <Link href="/forum" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors">
                    <ArrowLeft size={20} />
                    Back to Forum
                </Link>
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={20} />
                        {isDeleting ? 'Deleting...' : 'Delete Post'}
                    </button>
                )}
            </div>

            {/* Main Post */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-6 pb-6 border-b border-border-primary">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold">
                            {(post.author.name || 'A')[0].toUpperCase()}
                        </div>
                        <span>{post.author.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="prose prose-invert max-w-none text-text-secondary text-lg leading-relaxed">
                    <MDXContent source={mdxSource} />
                </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    <MessageSquare />
                    {post.comments.length} Comments
                </h2>

                {/* Comment List */}
                <div className="space-y-6">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-bg-secondary/50 border border-border-primary rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="font-bold text-text-primary">{comment.author.name}</div>
                                <div className="text-xs text-text-secondary">{new Date(comment.createdAt).toLocaleDateString()}</div>
                            </div>
                            <p className="text-text-secondary">{comment.content}</p>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Leave a Reply</h3>
                    <form onSubmit={handleReply}>
                        <textarea
                            required
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={4}
                            className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-primary resize-none mb-4"
                            placeholder="Write your comment here..."
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-accent-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Reply'}
                                {!loading && <Send size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
