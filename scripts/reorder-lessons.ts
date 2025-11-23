import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listLessons(courseSlug: string) {
    try {
        console.log(`📚 Fetching lessons for course: "${courseSlug}"...\n`);

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            console.error(`❌ Course "${courseSlug}" not found!`);
            return;
        }

        const lessons = await prisma.lesson.findMany({
            where: { courseId: course.id },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                slug: true,
                title: true,
                order: true,
            }
        });

        console.log(`Found ${lessons.length} lessons:\n`);
        lessons.forEach((lesson, index) => {
            console.log(`  ${index + 1}. [Order: ${lesson.order}] ${lesson.title}`);
            console.log(`     Slug: ${lesson.slug}`);
            console.log(`     ID: ${lesson.id}\n`);
        });

        console.log('\n💡 To reorder lessons, use Prisma Studio:');
        console.log('   npx prisma studio');
        console.log('\n   Then navigate to Lesson model and update the "order" field for each lesson.');

    } catch (error) {
        console.error('❌ Error fetching lessons:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function autoReorderLessons(courseSlug: string, lessonSlugsInOrder: string[]) {
    try {
        console.log(`🔄 Auto-reordering lessons for course: "${courseSlug}"...\n`);

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            console.error(`❌ Course "${courseSlug}" not found!`);
            return;
        }

        for (let i = 0; i < lessonSlugsInOrder.length; i++) {
            const lessonSlug = lessonSlugsInOrder[i];
            const newOrder = i + 1;

            const updated = await prisma.lesson.updateMany({
                where: {
                    courseId: course.id,
                    slug: lessonSlug
                },
                data: { order: newOrder }
            });

            if (updated.count > 0) {
                console.log(`✅ Set "${lessonSlug}" to order ${newOrder}`);
            } else {
                console.warn(`⚠️  Lesson "${lessonSlug}" not found`);
            }
        }

        console.log('\n✅ Lesson reordering complete!');

    } catch (error) {
        console.error('❌ Error reordering lessons:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Example usage - List current lessons
listLessons('electronics');

// Uncomment and modify to auto-reorder:
// autoReorderLessons('electronics', [
//     'what-is-a-diode',
//     'diode-characteristics',
//     'types-of-diodes',
//     'applications',
// ]);
