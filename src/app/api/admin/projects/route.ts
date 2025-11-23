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

        const projectsDir = path.join(process.cwd(), 'src/content/projects');
        const filePath = path.join(projectsDir, `${slug}.mdx`);

        if (fs.existsSync(filePath)) {
            return NextResponse.json({ message: "Project with this slug already exists" }, { status: 409 });
        }

        // Reconstruct file content with frontmatter
        const fileContent = matter.stringify(content || "", meta || {});

        fs.writeFileSync(filePath, fileContent);

        revalidatePath('/admin/projects');
        revalidatePath('/projects');

        return NextResponse.json({ message: "Created successfully", slug });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: "Error creating project" }, { status: 500 });
    }
}
