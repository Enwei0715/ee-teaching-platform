import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const formattedCourses = courses.map(course => ({
            slug: course.slug,
            meta: {
                title: course.title,
                description: course.description,
                level: course.level,
            }
        }));

        return NextResponse.json(formattedCourses);
    } catch (error) {
        console.error("Error listing courses:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { meta, slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ message: "Slug is required" }, { status: 400 });
        }

        const existingCourse = await prisma.course.findUnique({
            where: { slug }
        });

        if (existingCourse) {
            return NextResponse.json({ message: "Course with this slug already exists" }, { status: 409 });
        }

        const newCourse = await prisma.course.create({
            data: {
                slug,
                title: meta.title,
                description: meta.description,
                level: meta.level || 'Beginner',
                image: meta.image,
                published: true,
            }
        });

        revalidatePath('/admin/courses');
        revalidatePath('/courses');

        return NextResponse.json({ message: "Created successfully", slug: newCourse.slug });
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json({ message: "Error creating course" }, { status: 500 });
    }
}
