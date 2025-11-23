import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Helper to check if user is engineer or admin
const isAuthorized = (session: any) => {
    if (!session || !session.user) return false;
    const isEngineer = session.user.occupation?.toLowerCase().includes('engineer') || session.user.occupation?.toLowerCase().includes('engineering');
    // @ts-ignore
    const isAdmin = session.user.role === 'ADMIN';
    return isEngineer || isAdmin;
};

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    const slug = params.slug;

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            excerpt: true,
            image: true,
            videoUrl: true,
            category: true,
            published: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check ownership (unless admin)
    // @ts-ignore
    if (session.user.role !== 'ADMIN' && post.authorId !== session.user.id) {
        return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
    }

    // Format response to match expected structure
    const response = {
        content: post.content,
        meta: {
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            image: post.image,
            videoUrl: post.videoUrl,
            author: post.author.name,
            date: post.createdAt.toISOString().split('T')[0],
            published: post.published
        }
    };

    return NextResponse.json(response);
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta } = await request.json();
        const slug = params.slug;

        // Find existing post
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug },
            select: { id: true, authorId: true }
        });

        if (!existingPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership
        // @ts-ignore
        if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
        }

        // Update post
        await prisma.blogPost.update({
            where: { slug },
            data: {
                title: meta.title,
                content: content || "",
                excerpt: meta.excerpt,
                category: meta.category,
                image: meta.image,

                published: meta.published ?? false,
            }
        });

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });

    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Error updating post" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const slug = params.slug;

        // Find existing post
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug },
            select: { id: true, authorId: true }
        });

        if (!existingPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership
        // @ts-ignore
        if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You can only delete your own posts", { status: 403 });
        }

        // Delete post
        await prisma.blogPost.delete({
            where: { slug }
        });

        revalidatePath('/blog');

        return NextResponse.json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
    }
}
