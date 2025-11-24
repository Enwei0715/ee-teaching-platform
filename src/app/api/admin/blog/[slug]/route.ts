import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const slug = decodeURIComponent(params.slug);

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!post) {
        return new NextResponse("Post not found", { status: 404 });
    }

    // Map to expected format { content, meta }
    const meta = {
        title: post.title,
        excerpt: post.excerpt,

        category: post.category,
        date: post.createdAt.toISOString().split('T')[0],
        author: post.author?.name || 'EE Master Team',
    };

    return NextResponse.json({ content: post.content, meta });
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { content, meta } = await request.json();
        const slug = decodeURIComponent(params.slug);

        await prisma.blogPost.update({
            where: { slug },
            data: {
                title: meta.title,
                content: content,
                excerpt: meta.excerpt,

                category: meta.category,
            }
        });

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json({ message: "Error saving post" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const slug = decodeURIComponent(params.slug);

        await prisma.blogPost.delete({
            where: { slug }
        });

        revalidatePath('/admin/blog');
        revalidatePath('/blog');

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
    }
}

export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'GET, POST, OPTIONS, DELETE',
        },
    });
}
