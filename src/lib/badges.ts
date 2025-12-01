import prisma from "@/lib/prisma";

export const BADGE_DEFINITIONS = [
    {
        slug: 'first-step',
        name: 'First Step',
        description: 'Completed your first lesson',
        icon: 'Footprints',
        condition: 'Complete 1 lesson',
        tier: 'Bronze'
    },
    {
        slug: 'quiz-whiz',
        name: 'Quiz Whiz',
        description: 'Scored perfectly on a quiz',
        icon: 'Zap',
        condition: 'Get a perfect score on a quiz',
        tier: 'Silver'
    },
    {
        slug: 'streak-week',
        name: 'Streak Week',
        description: 'Maintained a 7-day streak',
        icon: 'Flame',
        condition: 'Reach a 7-day streak',
        tier: 'Gold'
    },
    {
        slug: 'scholar',
        name: 'Scholar',
        description: 'Reached Level 5',
        icon: 'GraduationCap',
        condition: 'Reach Level 5',
        tier: 'Silver'
    }
];

export async function checkBadges(userId: string, event: { type: 'LESSON_COMPLETE' | 'QUIZ_COMPLETE' | 'STREAK_UPDATE' | 'LEVEL_UP', data?: any }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            badges: true,
            progress: true
        }
    });

    if (!user) return [];

    const earnedBadges: string[] = [];

    // Helper to award badge
    const awardBadge = async (slug: string) => {
        console.log(`🏅 [Badges] Attempting to award badge: ${slug}`);

        // Check if already earned (FIXED: Check against loaded badges properly if possible, but for now rely on DB)
        // The previous check `user.badges.some(ub => ub.badgeId === slug)` was wrong (UUID vs Slug).
        // We will rely on the DB check below for correctness.

        // Lookup badge by slug
        const badge = await prisma.badge.findUnique({ where: { slug } });
        if (!badge) {
            console.error(`❌ [Badges] Badge definition not found for slug: ${slug}`);
            return;
        }

        // Check if user has it
        const hasBadge = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id
                }
            }
        });

        if (!hasBadge) {
            console.log(`🎉 [Badges] Awarding new badge: ${slug} to user ${userId}`);
            await prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
            earnedBadges.push(badge.name);
        } else {
            console.log(`ℹ️ [Badges] User already has badge: ${slug}`);
        }
    };

    console.log(`🔍 [Badges] Checking badges for event: ${event.type} (User Level: ${user.level}, Streak: ${user.streak})`);

    // Check conditions based on event
    if (event.type === 'LESSON_COMPLETE') {
        const completedCount = user.progress.filter(p => p.status === 'COMPLETED').length;
        console.log(`📊 [Badges] Completed lessons count: ${completedCount}`);
        if (completedCount >= 1) await awardBadge('first-step');
    }

    if (event.type === 'STREAK_UPDATE') {
        console.log(`🔥 [Badges] Checking streak: ${user.streak}`);
        if (user.streak >= 7) await awardBadge('streak-week');
    }

    if (event.type === 'LEVEL_UP') {
        console.log(`📈 [Badges] Checking level: ${user.level}`);
        if (user.level >= 5) await awardBadge('scholar');
    }

    // Quiz Whiz logic might need more data passed in event
    if (event.type === 'QUIZ_COMPLETE') {
        // Assuming data contains 'isCorrect' or similar
        if (event.data?.isCorrect) await awardBadge('quiz-whiz');
    }

    return earnedBadges;
}

export async function seedBadges() {
    for (const def of BADGE_DEFINITIONS) {
        await prisma.badge.upsert({
            where: { slug: def.slug },
            update: {
                name: def.name,
                description: def.description,
                icon: def.icon,
                condition: def.condition
            },
            create: {
                slug: def.slug,
                name: def.name,
                description: def.description,
                icon: def.icon,
                condition: def.condition
            }
        });
    }
}
