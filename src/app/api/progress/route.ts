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
        const { courseId, lessonId, completed, timeSpent } = await request.json();

        if (!courseId || !lessonId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId,
                    lessonId,
                },
            },
            update: {
                completed: completed ?? true,
                timeSpent: { increment: timeSpent || 0 },
            },
            create: {
                userId: session.user.id,
                courseId,
                lessonId,
                completed: completed ?? true,
                timeSpent: timeSpent || 0,
            },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Error updating progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
