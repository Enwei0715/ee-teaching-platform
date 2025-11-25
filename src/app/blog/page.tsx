'use client';

import Link from 'next/link';
import { Calendar, User, Plus, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BlogPost {
    slug: string;
    meta: {
        title: string;
        description: string;
        category: string;
        date: string;
        author: string;
    };
}

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [canCreatePost, setCanCreatePost] = useState(false);

    useEffect(() => {
        // Fetch blog posts
        fetch('/api/blog')
            .then(res => res.json())
            .then(data => {
                setBlogPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Check permissions
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(session => {
                const isEngineer = session?.user?.major?.toLowerCase().includes('engineer') ||
                    session?.user?.major?.toLowerCase().includes('engineering');
                setCanCreatePost(session?.user?.role === 'ADMIN' || isEngineer);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex-1 py-12 px-6 bg-bg-primary flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    {/* Header skeleton */}
                    <div className="mb-12 text-center">
                        <div className="h-10 bg-gray-800 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-800 rounded w-96 mx-auto mb-6 animate-pulse"></div>
                        <div className="h-10 bg-blue-900/50 rounded w-48 mx-auto animate-pulse"></div>
                    </div>

                    {/* Post skeletons */}
                    <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-bg-secondary border border-border-primary rounded-lg p-8 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-4 bg-gray-800 rounded w-20"></div>
                                    <div className="h-4 bg-gray-800 rounded w-24"></div>
                                    <div className="h-4 bg-gray-800 rounded w-28"></div>
                                </div>
                                <div className="h-8 bg-gray-800 rounded w-3/4 mb-3"></div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                                </div>
                                <div className="h-4 bg-gray-800 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 py-12 px-6 bg-bg-primary flex flex-col">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">Engineering Blog</h1>
                    <p className="text-text-secondary text-lg mb-6">
                        Tutorials, guides, and insights from the world of electronics.
                    </p>

                    {canCreatePost && blogPosts.length > 0 && (
                        <div className="flex justify-center">
                            <Link
                                href="/blog/new"
                                className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={18} />
                                Create Blog Post
                            </Link>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {blogPosts.length > 0 ? (
                    <div className="space-y-8">
                        {blogPosts.map((post) => (
                            <article key={post.slug} className="bg-bg-secondary border border-border-primary rounded-lg p-8 hover:border-accent-primary transition-colors">
                                <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                                    <span className="text-accent-primary font-medium">{post.meta.category}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <time>{post.meta.date}</time>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{post.meta.author}</span>
                                    </div>
                                </div>

                                <Link href={`/blog/${post.slug}`}>
                                    <h2 className="text-2xl font-bold text-text-primary mb-3 hover:text-accent-primary transition-colors">
                                        {post.meta.title}
                                    </h2>
                                </Link>

                                <p className="text-text-secondary leading-relaxed mb-6">
                                    {post.meta.description}
                                </p>

                                <Link href={`/blog/${post.slug}`} className="text-accent-primary font-medium hover:underline">
                                    Read more →
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[400px]">
                        <FileText size={64} className="text-gray-700 mb-6 opacity-50" />
                        <h3 className="text-2xl font-semibold text-gray-300 mb-2">No posts published yet</h3>
                        <p className="text-gray-500 text-lg mb-6">Check back later for engineering insights and tutorials.</p>
                        {canCreatePost && (
                            <Link
                                href="/blog/new"
                                className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={18} />
                                Write the first post
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
