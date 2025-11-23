import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function renameCourseSlug(oldSlug: string, newSlug: string) {
    try {
        console.log(`🔍 Finding course with slug: "${oldSlug}"...`);

        const course = await prisma.course.findUnique({
            where: { slug: oldSlug },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        });

        if (!course) {
            console.error(`❌ Course with slug "${oldSlug}" not found!`);
            return;
        }

        console.log(`✅ Found course: "${course.title}"`);
        console.log(`   Lessons: ${course._count.lessons}`);

        // Check if new slug already exists
        const existing = await prisma.course.findUnique({
            where: { slug: newSlug }
        });

        if (existing) {
            console.error(`❌ A course with slug "${newSlug}" already exists!`);
            return;
        }

        // Update the slug
        console.log(`\n🔄 Renaming slug: "${oldSlug}" → "${newSlug}"...`);

        const updated = await prisma.course.update({
            where: { slug: oldSlug },
            data: { slug: newSlug }
        });

        console.log(`✅ Successfully renamed course slug!`);
        console.log(`   New URL: /courses/${newSlug}`);
        console.log(`   All ${course._count.lessons} lessons will now use the new course slug in their URLs`);

    } catch (error) {
        console.error('❌ Error renaming course:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute: Rename electronics-101 to electronics
renameCourseSlug('electronics-101', 'electronics');
