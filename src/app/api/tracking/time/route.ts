import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { courseId, lessonId, seconds } = await request.json();

        if (!courseId || !lessonId || !seconds) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Upsert user progress to update timeSpent
        await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId,
                    lessonId,
                },
            },
            update: {
                timeSpent: { increment: seconds },
            },
            create: {
                userId: session.user.id,
                courseId,
                lessonId,
                completed: false,
                timeSpent: seconds,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking time:", error);
        return new NextResponse("Error tracking time", { status: 500 });
    }
}
