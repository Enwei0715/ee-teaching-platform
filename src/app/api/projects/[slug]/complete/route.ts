import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addXP, calculateProjectXP } from "@/lib/gamification";
import { Difficulty } from "@/lib/xp";

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Find project by slug
        const project = await prisma.project.findUnique({
            where: { slug: params.slug },
            select: { id: true, level: true }
        });

        if (!project) {
            return new NextResponse("Project not found", { status: 404 });
        }

        // Check if already completed
        const existingCompletion = await prisma.userProject.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: project.id
                }
            }
        });

        if (existingCompletion) {
            return new NextResponse("Project already completed", { status: 400 });
        }

        // Mark as completed
        await prisma.userProject.create({
            data: {
                userId: session.user.id,
                projectId: project.id
            }
        });

        // Award XP
        const xpAmount = calculateProjectXP((project.level as Difficulty) || 'Intermediate');
        const xpResult = await addXP(session.user.id, xpAmount);

        return NextResponse.json({
            success: true,
            xpGained: xpAmount,
            gamification: {
                xp: xpResult
            }
        });

    } catch (error) {
        console.error("Error completing project:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
