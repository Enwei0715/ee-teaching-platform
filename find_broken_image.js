const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findLesson() {
    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                content: {
                    contains: '半導體晶格中電子–電洞對的產生與復合示意圖'
                }
            },
            include: {
                course: true
            }
        });

        console.log(`Found ${lessons.length} lessons.`);
        lessons.forEach(l => {
            console.log(`Lesson ID: ${l.id}`);
            console.log(`Title: ${l.title}`);
            console.log(`Course: ${l.course.title}`);
            console.log('--- Content Snippet ---');
            // Extract the image tag part
            const regex = /!\[半導體晶格中電子–電洞對的產生與復合示意圖\]\((.*?)\)/;
            const match = l.content.match(regex);
            if (match) {
                console.log(`Image URL: ${match[1]}`);
            } else {
                console.log('Could not extract image URL with regex.');
                // Print context around the string
                const index = l.content.indexOf('半導體晶格中電子–電洞對的產生與復合示意圖');
                console.log(l.content.substring(index - 50, index + 100));
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

findLesson();
