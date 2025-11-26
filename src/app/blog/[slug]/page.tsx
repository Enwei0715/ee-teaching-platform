import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import { getPostBySlug, getAllBlogPosts, compileMdx } from '@/lib/mdx';
import MDXContent from '@/components/mdx/MDXContent';
import { calculateReadingTime } from '@/lib/utils';
import BlogAdminControls from '@/components/blog/BlogAdminControls';
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const post = await getPostBySlug(params.slug);
        if (!post) {
            return {
                title: 'Post Not Found | EE Master Blog',
            };
        }
        return {
            title: `${post.meta.title} | EE Master Blog`,
            description: post.meta.description,
        };
    } catch (e) {
        return {
            title: 'Post Not Found | EE Master Blog',
        };
    }
}

export async function generateStaticParams() {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: Props) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // Use cached MDX compilation
    const mdxSource = await compileMdx(post.content);

    const readingTime = calculateReadingTime(post.content);

    return (
        <article className="min-h-screen bg-bg-primary relative">
            <InteractiveDotGrid />
            {/* Hero Section */}
            <header className="glass-panel border-b border-white/10">
                <div className="max-w-3xl mx-auto px-6 py-20 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/blog" className="inline-flex items-center text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium group">
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>

                        <BlogAdminControls slug={params.slug} authorId={post.authorId || ''} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
                        <span className="flex items-center gap-2 bg-bg-tertiary px-3 py-1 rounded-full border border-border-primary text-accent-primary font-medium">
                            <Tag size={14} />
                            {post.meta.category || 'Electronics'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.meta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} />
                            {readingTime}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight tracking-tight">{post.meta.title}</h1>
                    <p className="text-xl text-text-secondary leading-relaxed">{post.meta.description}</p>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Content */}
                <div className="prose prose-invert prose-blue max-w-none prose-lg">

                    <MDXContent source={mdxSource} />
                </div>

                {/* Author Section */}
                <div className="mt-16 pt-8 border-t border-border-primary">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-bg-secondary p-8 rounded-xl border border-border-primary">
                        <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-primary shrink-0">
                            <User size={32} className="text-text-secondary" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-text-primary mb-2">Written by {post.meta.author || 'EE Master Team'}</h3>
                            <p className="text-text-secondary mb-4">
                                Passionate about making electronics engineering accessible to everyone.
                                We create in-depth tutorials and courses to help you master the fundamentals.
                            </p>
                            <button className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors">
                                <Share2 size={16} />
                                Share this article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
