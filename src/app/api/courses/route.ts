import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
