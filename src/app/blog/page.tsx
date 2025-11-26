'use client';

import Link from 'next/link';
import { Calendar, User, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid';

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
            <div className="py-12 px-6 bg-bg-primary">
                <div className="max-w-4xl mx-auto">
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
        <div className="flex-1 flex flex-col bg-transparent relative z-0 overflow-hidden">
            <InteractiveDotGrid />
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:px-6 md:pt-12 md:pb-6 flex flex-col relative z-10">
                <div className="mb-12 text-center relative">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Engineering Blog</h1>
                    <p className="text-text-secondary text-lg mb-6">
                        Tutorials, guides, and insights from the world of electronics.
                    </p>

                    {canCreatePost && (
                        <div className="flex justify-center">
                            <Link
                                href="/blog/new"
                                className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                            >
                                <Plus size={18} />
                                Create Blog Post
                            </Link>
                        </div>
                    )}
                </div>

                {blogPosts.length > 0 ? (
                    <div className="space-y-8">
                        {blogPosts.map((post) => (
                            <article key={post.slug} className="glass-panel shadow-xl rounded-lg p-8 hover:border-accent-primary transition-colors">
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
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[400px] border-2 border-dashed border-border-primary rounded-xl bg-bg-secondary/30">
                        <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mb-4">
                            <Plus className="text-text-secondary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">No posts published yet</h3>
                        <p className="text-text-secondary max-w-md">
                            Check back later for engineering insights, tutorials, and guides.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
