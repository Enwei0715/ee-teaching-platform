import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
    const postsDir = path.join(process.cwd(), 'src/content/blog');
    const filePath = path.join(postsDir, `${slug}.mdx`);

    console.log(`[Admin Blog GET] Slug: ${slug}, Path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`[Admin Blog GET] File not found: ${filePath}`);
        return new NextResponse("Post not found", { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { content, data: meta } = matter(fileContent);

    return NextResponse.json({ content, meta });
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

        const postsDir = path.join(process.cwd(), 'src/content/blog');
        const filePath = path.join(postsDir, `${slug}.mdx`);

        console.log(`[Admin Blog PATCH] Saving to: ${filePath}`);

        const fileContent = matter.stringify(content, meta);

        fs.writeFileSync(filePath, fileContent);

        // Revalidate paths
        const { revalidatePath } = await import("next/cache");
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
        const postsDir = path.join(process.cwd(), 'src/content/blog');
        const filePath = path.join(postsDir, `${slug}.mdx`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            // Revalidate paths
            const { revalidatePath } = await import("next/cache");
            revalidatePath('/admin/blog');
            revalidatePath('/blog');

            return NextResponse.json({ message: "Deleted successfully" });
        } else {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
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
