'use client';

import Link from 'next/link';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { stripMarkdown } from '@/lib/utils';

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

    if (loading) return <div className="text-center py-8">Loading discussions...</div>;

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
                    className="block bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-accent-primary transition-colors"
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
