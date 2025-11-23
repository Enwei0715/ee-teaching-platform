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

    const progress = await prisma.userProgress.findMany({
        where: { userId: user.id },
    });

    console.log(`User: ${user.name} (${user.id})`);
    console.log(`Total Progress Records: ${progress.length}`);
    console.log(`Completed Lessons: ${progress.filter(p => p.completed).length}`);
    console.log(JSON.stringify(progress, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
