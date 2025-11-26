import PostDetail from '@/components/forum/PostDetail';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid';

async function getPost(id: string) {
    const prisma = require('@/lib/prisma').default;

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: { name: true },
            },
            comments: {
                include: {
                    author: {
                        select: { name: true },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    return post;
}

export default async function PostPage({ params }: { params: { postId: string } }) {
    const post = await getPost(params.postId);

    if (!post) {
        notFound();
    }

    // Defensive: Wrap MDX serialization in try-catch to prevent crashes
    let mdxSource = null;
    let serializationError = false;
    let autoFormatted = false;

    try {
        mdxSource = await serialize(post.content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkBreaks],
            },
        });
    } catch (error) {
        console.error('Error serializing MDX content for forum post:', params.postId, error);

        // Retry Strategy: Attempt to wrap content in a code block
        try {
            console.log('Attempting auto-format recovery...');
            const escapedContent = "```text\n" + post.content + "\n```";
            mdxSource = await serialize(escapedContent, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                },
            });
            autoFormatted = true;
        } catch (retryError) {
            console.error('Auto-format recovery failed:', retryError);
            serializationError = true;
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary relative">
            <InteractiveDotGrid />
            <PostDetail
                post={post}
                mdxSource={mdxSource}
                serializationError={serializationError}
                autoFormatted={autoFormatted}
                rawContent={post.content}
            />
        </div>
    );
}
