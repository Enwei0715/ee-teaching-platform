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

        // Since courses and lessons are MDX files (not in Prisma),
        // we use the URL slugs directly as IDs in UserProgress
        await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: courseId,   // Use course slug as ID
                    lessonId: lessonId,   // Use lesson slug as ID
                },
            },
            update: {
                completed: true,
            },
            create: {
                userId: session.user.id,
                courseId: courseId,       // Use course slug as ID
                lessonId: lessonId,       // Use lesson slug as ID
                completed: true,
                timeSpent: 0, // Will be updated by TimeTracker
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
