import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkBadges } from "@/lib/badges";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const earnedBadges: string[] = [];

        // Check all badge types
        const lessonBadges = await checkBadges(userId, { type: 'LESSON_COMPLETE' });
        const streakBadges = await checkBadges(userId, { type: 'STREAK_UPDATE' });
        const levelBadges = await checkBadges(userId, { type: 'LEVEL_UP' });

        // Note: Quiz Whiz is hard to check retroactively unless we store quiz history.
        // For now, we only sync state-based badges.

        earnedBadges.push(...lessonBadges, ...streakBadges, ...levelBadges);

        return NextResponse.json({ earnedBadges }, { status: 200 });
    } catch (error) {
        console.error("Badge sync error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
