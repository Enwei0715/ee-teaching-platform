import Link from 'next/link';
import { Calendar, User, Plus } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/mdx';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function BlogPage() {
    const blogPosts = getAllBlogPosts();
    const session = await getServerSession(authOptions);

    const isEngineer = session?.user?.occupation?.toLowerCase().includes('engineer') || session?.user?.occupation?.toLowerCase().includes('engineering');
    // @ts-ignore
    const isAdmin = session?.user?.role === 'ADMIN';
    const canCreatePost = isEngineer || isAdmin;

    return (
        <main className="min-h-screen py-12 px-6 bg-bg-primary">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center relative">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">Engineering Blog</h1>
                    <p className="text-text-secondary text-lg mb-6">
                        Tutorials, guides, and insights from the world of electronics.
                    </p>

                    {canCreatePost && (
                        <div className="flex justify-center">
                            <Link
                                href="/engineer/blog/new"
                                className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={18} />
                                Create Blog Post
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {blogPosts.map((post: any) => (
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
                                {post.meta.excerpt}
                            </p>

                            <Link href={`/blog/${post.slug}`} className="text-accent-primary font-medium hover:underline">
                                Read more →
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
