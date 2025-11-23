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

    const projectId = params.slug;
    const projectsDir = path.join(process.cwd(), 'src/content/projects');
    const filePath = path.join(projectsDir, `${projectId}.mdx`);

    if (!fs.existsSync(filePath)) {
        return new NextResponse("Project not found", { status: 404 });
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
        const slug = params.slug;

        const projectsDir = path.join(process.cwd(), 'src/content/projects');
        const filePath = path.join(projectsDir, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Read existing file to preserve content/meta if not provided
        const existingFileContent = fs.readFileSync(filePath, 'utf-8');
        const { content: existingContent, data: existingMeta } = matter(existingFileContent);

        const newContent = content !== undefined ? content : existingContent;
        const newMeta = meta ? { ...existingMeta, ...meta } : existingMeta;

        // Reconstruct file content with frontmatter
        const fileContent = matter.stringify(newContent, newMeta);

        fs.writeFileSync(filePath, fileContent);

        // Revalidate paths
        const { revalidatePath } = await import("next/cache");
        revalidatePath('/admin/projects');
        revalidatePath('/projects');
        revalidatePath(`/projects/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
        console.error("Error saving project:", error);
        return NextResponse.json({ message: "Error saving project" }, { status: 500 });
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
        const slug = params.slug;
        const projectsDir = path.join(process.cwd(), 'src/content/projects');
        const filePath = path.join(projectsDir, `${slug}.mdx`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            // Revalidate paths
            const { revalidatePath } = await import("next/cache");
            revalidatePath('/admin/projects');
            revalidatePath('/projects');

            return NextResponse.json({ message: "Deleted successfully" });
        } else {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
    }
}
