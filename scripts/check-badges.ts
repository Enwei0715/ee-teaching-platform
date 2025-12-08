
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Badge Definitions...');
    const badges = await prisma.badge.findMany();
    console.log(`Found ${badges.length} badges:`);
    badges.forEach(b => console.log(` - ${b.slug}: ${b.name} (${b.id})`));

    if (badges.length === 0) {
        console.error('❌ No badges found! Seeding seems to have failed.');
    }

    console.log('\n🔍 Checking User Badges...');
    const userBadges = await prisma.userBadge.findMany({
        include: {
            user: { select: { email: true, name: true } },
            badge: { select: { slug: true, name: true } }
        }
    });
    console.log(`Found ${userBadges.length} awarded badges:`);
    userBadges.forEach(ub => {
        console.log(` - User: ${ub.user.email || ub.user.name} | Badge: ${ub.badge.name} (${ub.badge.slug})`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
