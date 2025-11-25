import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
    request: Request,
    { params }: { params: { courseId: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { courseId } = params;

        // Prevent updating sensitive fields if necessary, but for now allow flexible updates
        // Filter out undefined/null values to avoid overwriting with null if not intended
        const updateData = Object.fromEntries(
            Object.entries(body).filter(([_, v]) => v !== undefined && v !== null)
        );

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: updateData,
        });

        // Revalidate course pages
        revalidatePath('/courses');
        revalidatePath(`/courses/${updatedCourse.slug}`);

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.error("Error updating course:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
