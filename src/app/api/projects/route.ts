import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        const projects = await prisma.project.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        });

        if (session?.user?.id) {
            const completedProjects = await prisma.userProject.findMany({
                where: { userId: session.user.id },
                select: { projectId: true }
            });

            const completedSet = new Set(completedProjects.map(p => p.projectId));

            const projectsWithStatus = projects.map(project => ({
                ...project,
                isCompleted: completedSet.has(project.id)
            }));

            return NextResponse.json(projectsWithStatus);
        }

        return NextResponse.json(projects.map(p => ({ ...p, isCompleted: false })));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
