
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = 'cmibm47bc000073pno5ma3dgl'; // Lorry

async function awardBadge(userId: string, slug: string) {
    const badge = await prisma.badge.findUnique({ where: { slug } });
    if (!badge) {
        console.error(`Badge ${slug} not found!`);
        return;
    }

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
        console.log(`✅ Awarded '${badge.name}' to user.`);
    } else {
        console.log(`ℹ️ User already has '${badge.name}'.`);
    }
}

async function main() {
    console.log(`Fixing badges for user ${USER_ID}...`);

    // Check Streak
    const user = await prisma.user.findUnique({ where: { id: USER_ID }, include: { progress: true } });
    if (!user) throw new Error("User not found");

    console.log(`User Stats - Streak: ${user.streak}, Level: ${user.level}`);

    if (user.streak >= 7) {
        await awardBadge(USER_ID, 'streak-week');
    }

    if (user.level >= 5) {
        await awardBadge(USER_ID, 'scholar');
    }

    const completedLessons = user.progress.filter(p => p.status === 'COMPLETED').length;
    if (completedLessons >= 1) {
        await awardBadge(USER_ID, 'first-step');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
