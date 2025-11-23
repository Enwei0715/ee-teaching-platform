import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { filename, title } = await request.json();
        const courseId = params.slug;

        if (!filename || !title) {
            return new NextResponse("Missing filename or title", { status: 400 });
        }

        // Sanitize filename
        const safeFilename = filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase() + '.mdx';
        const coursesDir = path.join(process.cwd(), 'src/content/courses', courseId);
        const filePath = path.join(coursesDir, safeFilename);

        if (fs.existsSync(filePath)) {
            return new NextResponse("File already exists", { status: 409 });
        }

        const content = `---
title: '${title}'
order: 99
---

# ${title}

Start writing your lesson content here...
`;

        fs.writeFileSync(filePath, content, 'utf-8');

        revalidatePath(`/admin/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}`);

        return NextResponse.json({
            message: "Lesson created successfully",
            filename: safeFilename
        });
    } catch (error) {
        console.error("Error creating lesson:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
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
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const courseId = params.slug;

        if (!filename) {
            return new NextResponse("Missing filename", { status: 400 });
        }

        const coursesDir = path.join(process.cwd(), 'src/content/courses', courseId);
        const filePath = path.join(coursesDir, filename);

        if (!fs.existsSync(filePath)) {
            return new NextResponse("File not found", { status: 404 });
        }

        fs.unlinkSync(filePath);

        revalidatePath(`/admin/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}`);

        return NextResponse.json({ message: "Lesson deleted successfully" });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
