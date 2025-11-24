import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: { courseId: string; lessonId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId, lessonId } = params;

        // Resolve course slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: courseId },
            select: { id: true }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Resolve lesson slug to UUID
        const lesson = await prisma.lesson.findFirst({
            where: {
                courseId: course.id,
                slug: lessonId
            },
            select: { id: true }
        });

        if (!lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id,
                },
            },
            update: {
                completed: true,
            },
            create: {
                userId: session.user.id,
                courseId: course.id,
                lessonId: lesson.id,
                completed: true,
                timeSpent: 0,
            },
        });

        return NextResponse.json({ message: 'Lesson marked as completed' });
    } catch (error) {
        console.error('Error marking lesson as completed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
