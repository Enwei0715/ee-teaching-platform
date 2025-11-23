import { NextResponse } from "next/server";
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

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    const slug = params.slug;
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

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { content, meta } = await request.json();
        const slug = params.slug;

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

        return NextResponse.json({ message: "Saved successfully" });

    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Error updating post" }, { status: 500 });
    }
}
