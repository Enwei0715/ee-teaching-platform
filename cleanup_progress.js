const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { name: 'Lorry' }
    });

    if (!user) {
        console.log('User Lorry not found');
        return;
    }

    // Stale lesson IDs to remove
    const staleLessonIds = ['01-introduction', '02-ohms-law'];

    const result = await prisma.userProgress.deleteMany({
        where: {
            userId: user.id,
            lessonId: {
                in: staleLessonIds
            }
        }
    });

    console.log(`Deleted ${result.count} stale progress records.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
