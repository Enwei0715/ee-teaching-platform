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

        // Parse body to check for perfect score
        // Default to not perfect if body is empty or invalid
        let isPerfect = false;
        try {
            const body = await req.json();
            if (body.isPerfect) isPerfect = true;
        } catch (e) {
            // Body might be empty if just calling for XP
        }

        // We could accept difficulty here if we want to vary XP
        const xpAmount = calculateQuizXP();

        const result = await addXP(session.user.id, xpAmount);

        // Check for Quiz Whiz badge
        if (isPerfect) {
            const { checkBadges } = await import("@/lib/badges");
            const earnedBadges = await checkBadges(session.user.id, {
                type: 'QUIZ_COMPLETE',
                data: { isCorrect: true }
            });

            // Add earned badges to result
            if (earnedBadges.length > 0) {
                (result as any).earnedBadges = earnedBadges;
            }
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Quiz XP error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
