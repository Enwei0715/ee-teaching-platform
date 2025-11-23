import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Helper to check if user is engineer or admin
const isAuthorized = (session: any) => {
    if (!session || !session.user) return false;
    const isEngineer = session.user.occupation?.toLowerCase().includes('engineer') || session.user.occupation?.toLowerCase().includes('engineering');
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
        // Fetch single post
        const postsDir = path.join(process.cwd(), 'src/content/blog');
        const filePath = path.join(postsDir, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { content, data: meta } = matter(fileContent);

        // Check ownership (unless admin)
        // @ts-ignore
        if (session.user.role !== 'ADMIN' && meta.author !== session.user.name) {
            return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
        }

        return NextResponse.json({ content, meta });
    }

    return new NextResponse("Missing slug", { status: 400 });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta, slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ message: "Slug is required" }, { status: 400 });
        }

        const postsDir = path.join(process.cwd(), 'src/content/blog');
        const filePath = path.join(postsDir, `${slug}.mdx`);

        if (fs.existsSync(filePath)) {
            return NextResponse.json({ message: "Post with this slug already exists" }, { status: 409 });
        }

        // Force the author to be the current user
        const newMeta = {
            ...meta,
            author: session!.user!.name,
            date: meta.date || new Date().toISOString().split('T')[0],
        };

        const fileContent = matter.stringify(content || "", newMeta);

        fs.writeFileSync(filePath, fileContent);

        revalidatePath('/admin/blog');
        revalidatePath('/blog');

        return NextResponse.json({ message: "Created successfully", slug });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Error creating post" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta, slug } = await request.json(); // Expect slug in body for PATCH if not in URL, or handle via URL param in dynamic route. 
        // But here we are in a static route handler for /api/engineer/blog. 
        // Let's assume the client sends the slug in the body or we use a dynamic route.
        // Actually, for consistency with the Admin API, we should probably use a dynamic route /api/engineer/blog/[slug].
        // However, the user asked to "copy the logic". The Admin API uses /api/admin/blog/[slug] for PATCH.
        // Let's stick to this file for now and expect 'slug' in the body, OR we can create [slug]/route.ts.
        // Given the previous pattern, let's create a dynamic route for cleaner REST design.
        // BUT, to keep it simple and contained as requested ("Update Engineer Blog API"), I'll handle it here if possible, 
        // OR better, I will create the [slug] route as it's cleaner.

        // WAIT, I am editing `src/app/api/engineer/blog/route.ts`. 
        // If I want to support PATCH /api/engineer/blog/[slug], I need a new file.
        // If I support PATCH /api/engineer/blog, I need slug in body.

        if (!slug) return NextResponse.json({ message: "Slug is required" }, { status: 400 });

        const postsDir = path.join(process.cwd(), 'src/content/blog');
        const filePath = path.join(postsDir, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership
        const existingFileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: existingMeta } = matter(existingFileContent);

        // @ts-ignore
        if (session.user.role !== 'ADMIN' && existingMeta.author !== session.user.name) {
            return new NextResponse("Forbidden: You can only edit your own posts", { status: 403 });
        }

        const newMeta = { ...existingMeta, ...meta };
        const fileContent = matter.stringify(content || "", newMeta);

        fs.writeFileSync(filePath, fileContent);

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });

    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Error updating post" }, { status: 500 });
    }
}
