import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
