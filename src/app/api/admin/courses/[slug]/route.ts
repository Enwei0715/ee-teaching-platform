import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
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

    try {
        const courseId = params.slug;
        const coursePath = path.join(process.cwd(), 'src/content/courses', courseId);

        if (!fs.existsSync(coursePath)) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // If query param 'file' is present, return that file's content
        const url = new URL(request.url);
        const file = url.searchParams.get('file');

        if (file) {
            const filePath = path.join(coursePath, file);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const { content, data: meta } = matter(fileContent);
                return NextResponse.json({ content, meta });
            }
        }

        const files = fs.readdirSync(coursePath).filter(f => f.endsWith('.mdx'));
        return NextResponse.json({ files });

    } catch (error) {
        console.error("Error fetching course:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

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
        const { file, content, meta } = await request.json();
        const courseId = params.slug;
        const filePath = path.join(process.cwd(), 'src/content/courses', courseId, file);

        if (!fs.existsSync(filePath)) {
            return new NextResponse("File not found", { status: 404 });
        }

        const fileContent = matter.stringify(content, meta);
        fs.writeFileSync(filePath, fileContent, 'utf8');

        return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
        console.error("Error saving course:", error);
        return NextResponse.json({ message: "Error saving course" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const updates = await request.json();
        const courseId = params.slug;
        const coursePath = path.join(process.cwd(), 'src/content/courses', courseId);
        const courseJsonPath = path.join(coursePath, 'course.json');

        if (!fs.existsSync(coursePath)) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        let meta = {};
        if (fs.existsSync(courseJsonPath)) {
            const fileContent = fs.readFileSync(courseJsonPath, 'utf-8');
            meta = JSON.parse(fileContent);
        }

        const newMeta = { ...meta, ...updates };
        fs.writeFileSync(courseJsonPath, JSON.stringify(newMeta, null, 4), 'utf-8');

        return NextResponse.json(newMeta);
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json({ message: "Error updating course" }, { status: 500 });
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
        const coursesDir = path.join(process.cwd(), 'src/content/courses');
        const filePath = path.join(coursesDir, `${slug}.mdx`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ message: "Deleted successfully" });
        } else {
            // Try checking if it's a directory (for courses structure)
            const courseDir = path.join(coursesDir, slug);
            if (fs.existsSync(courseDir)) {
                fs.rmSync(courseDir, { recursive: true, force: true });
                return NextResponse.json({ message: "Deleted successfully" });
            }
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ message: "Error deleting course" }, { status: 500 });
    }
}
