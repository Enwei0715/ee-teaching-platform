import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { ArrowLeft, Wrench, Clock, BarChart } from 'lucide-react';
import { getProjectBySlug, getAllProjects } from '@/lib/mdx';
import MDXContent from '@/components/mdx/MDXContent';
import YouTubePlayer from '@/components/courses/YouTubePlayer';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const project = await getProjectBySlug(params.slug);
        if (!project) {
            return {
                title: 'Project Not Found | EE Master',
            };
        }
        return {
            title: `${project.meta.title} | EE Master Projects`,
            description: project.meta.description,
        };
    } catch (e) {
        return {
            title: 'Project Not Found | EE Master',
        };
    }
}

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: Props) {
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    // Defensive: Wrap MDX serialization in try-catch to prevent crashes
    let mdxSource;
    try {
        mdxSource = await serialize(project.content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeKatex],
            },
        });
    } catch (error) {
        console.error('Error serializing MDX content for project:', params.slug, error);
        // Fallback: Try to render with basic formatting
        try {
            mdxSource = await serialize(`> **Warning:** Content preview unavailable due to formatting errors.\n\n${project.content.replace(/`/g, '\\`')}`);
        } catch (retryError) {
            mdxSource = await serialize('Content unavailable.');
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <header className="py-16 px-6 bg-bg-secondary border-b border-border-primary">
                <div className="max-w-4xl mx-auto">
                    <Link href="/projects" className="inline-flex items-center text-text-secondary hover:text-accent-primary transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Projects
                    </Link>
                    <div className="flex items-center gap-6 text-sm text-text-secondary mb-6">
                        <span className="flex items-center gap-2">
                            <BarChart size={16} />
                            {project.meta.difficulty || 'All Levels'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} />
                            Weekend Build
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">{project.meta.title}</h1>
                    <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                        {project.meta.description}
                    </p>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">

                    <div className="prose prose-invert prose-blue max-w-none">
                        <MDXContent source={mdxSource} />
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                            <Wrench size={20} className="mr-2 text-accent-primary" />
                            Tools Needed
                        </h3>
                        <ul className="space-y-2 text-text-secondary text-sm mb-8">
                            {project.meta.tools && project.meta.tools.length > 0 ? (
                                project.meta.tools.map((tool: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-2"></span>
                                        {tool}
                                    </li>
                                ))
                            ) : (
                                <li className="text-text-secondary/50 italic">No tools listed</li>
                            )}
                        </ul>

                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                            <div className="w-5 h-5 mr-2 rounded border border-accent-primary flex items-center justify-center text-xs font-mono text-accent-primary">B</div>
                            Bill of Materials
                        </h3>
                        <ul className="space-y-2 text-text-secondary text-sm">
                            {project.meta.materials && project.meta.materials.length > 0 ? (
                                project.meta.materials.map((material: string, index: number) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{material}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-text-secondary/50 italic">No materials listed</li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
