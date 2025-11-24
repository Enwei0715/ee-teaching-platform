
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting cleanup of orphaned UserProgress records...');

    // 1. Get all valid Course IDs
    const courses = await prisma.course.findMany({ select: { id: true } });
    const validCourseIds = new Set(courses.map(c => c.id));
    console.log(`Found ${validCourseIds.size} valid courses.`);

    // 2. Get all valid Lesson IDs
    const lessons = await prisma.lesson.findMany({ select: { id: true } });
    const validLessonIds = new Set(lessons.map(l => l.id));
    console.log(`Found ${validLessonIds.size} valid lessons.`);

    // 3. Delete orphaned records
    const allProgress = await prisma.userProgress.findMany();
    console.log(`Checking ${allProgress.length} progress records...`);

    let deletedCount = 0;
    for (const p of allProgress) {
        const isCourseValid = validCourseIds.has(p.courseId);
        const isLessonValid = validLessonIds.has(p.lessonId);

        if (!isCourseValid || !isLessonValid) {
            console.log(`Deleting orphan: ID=${p.id}, Course=${p.courseId} (${isCourseValid ? 'OK' : 'MISSING'}), Lesson=${p.lessonId} (${isLessonValid ? 'OK' : 'MISSING'})`);
            await prisma.userProgress.delete({ where: { id: p.id } });
            deletedCount++;
        }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} orphaned records.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
