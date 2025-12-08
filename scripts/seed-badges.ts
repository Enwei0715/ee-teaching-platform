
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BADGE_DEFINITIONS = [
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

async function main() {
    console.log('🌱 Seeding Badges...');
    for (const def of BADGE_DEFINITIONS) {
        console.log(`Processing ${def.slug}...`);
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
    console.log('✅ Badges seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
