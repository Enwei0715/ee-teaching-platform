import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addXP } from "@/lib/gamification";
import { calculateQuizXP } from "@/lib/xp";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // We could accept difficulty here if we want to vary XP
        const xpAmount = calculateQuizXP();

        // For practice quizzes, we might want to cap it or give less
        // For now, let's give the standard quiz XP (e.g. 15)

        const result = await addXP(session.user.id, xpAmount);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Quiz XP error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
