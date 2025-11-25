const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findSlugs() {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: 'cmidrsi5m002fzbhy4v7kagsx' },
            include: { course: true }
        });
        console.log(`Course Slug: ${lesson.course.slug}`);
        console.log(`Lesson Slug: ${lesson.slug}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

findSlugs();
