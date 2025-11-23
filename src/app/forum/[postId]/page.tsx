import PostDetail from '@/components/forum/PostDetail';
import { notFound } from 'next/navigation';

async function getPost(id: string) {
    // In a real app, we would fetch directly from DB here since it's a server component
    // But for consistency with API routes, we can fetch from the API or use Prisma directly
    // Using Prisma directly is better for Server Components
    // Using Prisma directly is better for Server Components
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

import { serialize } from 'next-mdx-remote/serialize';

// ...

export default async function PostPage({ params }: { params: { postId: string } }) {
    const post = await getPost(params.postId);

    if (!post) {
        notFound();
    }

    // Defensive: Wrap MDX serialization in try-catch to prevent crashes
    let mdxSource;
    try {
        mdxSource = await serialize(post.content);
    } catch (error) {
        console.error('Error serializing MDX content for forum post:', params.postId, error);
        // Return 404 if content is malformed
        notFound();
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <PostDetail post={post} mdxSource={mdxSource} />
        </div>
    );
}
