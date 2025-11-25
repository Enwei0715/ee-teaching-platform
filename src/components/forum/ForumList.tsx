'use client';

import Link from 'next/link';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function stripMarkdown(text: string, maxLength: number = 120): string {
    return text
        .replace(/[#*_~`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .substring(0, maxLength) + (text.length > maxLength ? '...' : '');
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: { name: string };
    _count: { comments: number };
    createdAt: string;
}

export default function ForumList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/forum/posts')
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {/* Render 4 skeleton post cards */}
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-bg-secondary border border-border-primary rounded-xl p-6 animate-pulse"
                    >
                        {/* Title skeleton */}
                        <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>

                        {/* Content lines skeleton */}
                        <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gray-800 rounded w-full"></div>
                            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                        </div>

                        {/* Footer metadata skeleton */}
                        <div className="flex items-center gap-4">
                            <div className="h-4 bg-gray-800 rounded w-24"></div>
                            <div className="h-4 bg-gray-800 rounded w-28"></div>
                            <div className="h-4 bg-gray-800 rounded w-20 ml-auto"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-bg-secondary border border-border-primary rounded-xl">
                <MessageSquare size={48} className="mx-auto mb-4 text-text-secondary/50" />
                <h3 className="text-xl font-bold text-text-primary mb-2">No discussions yet</h3>
                <p className="text-text-secondary">Be the first to start a topic!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/forum/${post.id}`}
                    className="block glass-panel rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700 p-6 mb-4"
                >
                    <h3 className="text-xl font-bold text-text-primary mb-2">{post.title}</h3>
                    <p className="text-text-secondary line-clamp-2 mb-4">{stripMarkdown(post.content, 120)}</p>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>{post.author.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                            <MessageSquare size={16} />
                            <span>{post._count.comments} comments</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
