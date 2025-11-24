import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

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

                    category: meta.category,
                    published: true, // Default to published for now, or use meta.published
                    authorId: session.user.id,
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

                category: meta.category,
                published: true, // Default to published for now, or use meta.published
                authorId: session.user.id,
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
