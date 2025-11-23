import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

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

        // Reconstruct file content with frontmatter
        const newMeta = {
            ...meta,
            author: meta?.author || session.user.name || 'EE Master Team',
            date: meta?.date || new Date().toISOString().split('T')[0],
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
