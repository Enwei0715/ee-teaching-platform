const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking for course with slug "electronics-101"...');
    const course = await prisma.course.findUnique({
        where: { slug: 'electronics-101' },
    });

    if (course) {
        console.log('Found course:', course.title);
        console.log('Updating slug to "electronics"...');
        try {
            const updated = await prisma.course.update({
                where: { slug: 'electronics-101' },
                data: { slug: 'electronics' },
            });
            console.log('Successfully updated course slug:', updated.slug);
        } catch (error) {
            console.error('Error updating slug:', error);
        }
    } else {
        console.log('Course with slug "electronics-101" not found.');

        // Check if 'electronics' already exists
        const correctCourse = await prisma.course.findUnique({
            where: { slug: 'electronics' },
        });
        if (correctCourse) {
            console.log('Course with slug "electronics" already exists.');
        }
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
