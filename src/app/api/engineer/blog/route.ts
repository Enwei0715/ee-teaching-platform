import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// Helper to check if user is engineer or admin
const isAuthorized = (session: any) => {
    if (!session || !session.user) return false;
    const isEngineer =
        session.user.occupation?.toLowerCase().includes('engineer') ||
        session.user.occupation?.toLowerCase().includes('engineering') ||
        session.user.major?.toLowerCase().includes('engineer') ||
        session.user.major?.toLowerCase().includes('engineering');

    // @ts-ignore
    const isAdmin = session.user.role === 'ADMIN';
    return isEngineer || isAdmin;
};

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: { author: true }
        });

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership (unless admin)
        // @ts-ignore
        if (session.user.role !== 'ADMIN' && post.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
        }

        const meta = {
            title: post.title,
            excerpt: post.excerpt,
            image: post.image,
            category: post.category,
            date: post.createdAt.toISOString().split('T')[0],
            author: post.author.name,
        };

        return NextResponse.json({ content: post.content, meta });
    }

    return new NextResponse("Missing slug", { status: 400 });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta, slug } = await request.json();

        if (!slug) {
            // Auto-generate slug if not provided
            const generatedSlug = slugify(meta.title);

            const newPost = await prisma.blogPost.create({
                data: {
                    slug: generatedSlug,
                    title: meta.title,
                    content: content || "",
                    excerpt: meta.excerpt,
                    image: meta.image,
                    category: meta.category,
                    published: true,
                    authorId: session!.user!.id,
                }
            });

            revalidatePath('/admin/blog');
            revalidatePath('/blog');

            return NextResponse.json({ message: "Created successfully", slug: newPost.slug });
        }

        const existingPost = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (existingPost) {
            return NextResponse.json({ message: "Post with this slug already exists" }, { status: 409 });
        }

        const newPost = await prisma.blogPost.create({
            data: {
                slug,
                title: meta.title,
                content: content || "",
                excerpt: meta.excerpt,
                image: meta.image,
                category: meta.category,
                published: true,
                authorId: session!.user!.id,
            }
        });

        revalidatePath('/admin/blog');
        revalidatePath('/blog');

        return NextResponse.json({ message: "Created successfully", slug: newPost.slug });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Error creating post" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta, slug } = await request.json();

        if (!slug) return NextResponse.json({ message: "Slug is required" }, { status: 400 });

        const existingPost = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (!existingPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership
        // @ts-ignore
        if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
        }

        await prisma.blogPost.update({
            where: { slug },
            data: {
                title: meta.title,
                content: content,
                excerpt: meta.excerpt,
                image: meta.image,
                category: meta.category,
            }
        });

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });

    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Error updating post" }, { status: 500 });
    }
}
