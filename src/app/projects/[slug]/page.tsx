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
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import HexagonalBackground from '@/components/ui/HexagonalBackground';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProjectCompletionButton from '@/components/project/ProjectCompletionButton';

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

    // Check completion status
    const session = await getServerSession(authOptions);
    let isCompleted = false;

    if (session?.user?.id) {
        // We need to find the project ID first since MDX doesn't have it directly
        // But wait, our API uses slug to find ID. 
        // Ideally we should fetch the project from DB to get ID if we want to check userProject table.
        // Or we can rely on the API to handle the check, but for initial state we need to know.

        // Let's fetch the project from DB by slug to get its ID
        const dbProject = await prisma.project.findUnique({
            where: { slug: params.slug },
            select: { id: true }
        });

        if (dbProject) {
            const userProject = await prisma.userProject.findUnique({
                where: {
                    userId_projectId: {
                        userId: session.user.id,
                        projectId: dbProject.id
                    }
                }
            });
            isCompleted = !!userProject;
        }
    }

    // Defensive: Wrap MDX serialization in try-catch to prevent crashes
    let mdxSource;

    // Preprocess: Convert LaTeX parentheses syntax to dollar signs for MDX compatibility
    let processedContent = project.content
        .replace(/\\\(/g, '$')      // \( -> $
        .replace(/\\\)/g, '$')      // \) -> $
        .replace(/\\\[/g, '$$\n')   // \[ -> $$
        .replace(/\\\]/g, '\n$$');  // \] -> $$

    try {
        mdxSource = await serialize(processedContent, {
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    remarkBreaks,
                    [remarkMath, { singleDollarTextMath: true }]
                ],
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
        <div className="min-h-screen bg-transparent flex flex-col relative">
            <HexagonalBackground />

            {/* Project Header */}
            <div className="glass-panel border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 relative z-10">
                    <Link
                        href="/projects"
                        className="inline-flex items-center text-accent-primary hover:text-accent-secondary transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                        {project.meta.title}
                    </h1>

                    <p className="text-lg text-text-secondary mb-6">
                        {project.meta.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        <div className="flex items-center">
                            <BarChart size={18} className="mr-2 text-accent-primary" />
                            <span className="font-semibold">{project.meta.level || 'All Levels'}</span>
                        </div>
                        {project.meta.duration && (
                            <div className="flex items-center">
                                <Clock size={18} className="mr-2 text-accent-primary" />
                                <span>{project.meta.duration}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                <div className="lg:col-span-2">
                    <div className="prose prose-invert prose-blue max-w-none">
                        <MDXContent source={mdxSource} />
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <div className="glass-panel shadow-xl rounded-lg p-6 sticky top-8">
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
                        <ul className="space-y-2 text-text-secondary text-sm mb-8">
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

                        {/* Completion Button */}
                        <div className="pt-6 border-t border-white/10">
                            <ProjectCompletionButton
                                projectSlug={project.slug}
                                initialCompleted={isCompleted}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
