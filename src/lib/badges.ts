import prisma from "@/lib/prisma";

export const BADGE_DEFINITIONS = [
    {
        slug: 'first-step',
        name: 'First Step',
        description: 'Completed your first lesson',
        icon: 'Footprints',
        condition: 'Complete 1 lesson'
    },
    {
        slug: 'quiz-whiz',
        name: 'Quiz Whiz',
        description: 'Scored perfectly on a quiz',
        icon: 'Zap',
        condition: 'Get a perfect score on a quiz'
    },
    {
        slug: 'streak-week',
        name: 'Streak Week',
        description: 'Maintained a 7-day streak',
        icon: 'Flame',
        condition: 'Reach a 7-day streak'
    },
    {
        slug: 'scholar',
        name: 'Scholar',
        description: 'Reached Level 5',
        icon: 'GraduationCap',
        condition: 'Reach Level 5'
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
        // Check if already earned
        if (user.badges.some(ub => ub.badgeId === slug)) return; // Note: badgeId in UserBadge is actually the ID, not slug. We need to handle this.

        // Actually, we need to look up the badge by slug first
        const badge = await prisma.badge.findUnique({ where: { slug } });
        if (!badge) return; // Badge definition doesn't exist in DB yet

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
            await prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
            earnedBadges.push(badge.name);
        }
    };

    // Check conditions based on event
    if (event.type === 'LESSON_COMPLETE') {
        const completedCount = user.progress.filter(p => p.status === 'COMPLETED').length;
        if (completedCount >= 1) await awardBadge('first-step');
    }

    if (event.type === 'STREAK_UPDATE') {
        if (user.streak >= 7) await awardBadge('streak-week');
    }

    if (event.type === 'LEVEL_UP') {
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
