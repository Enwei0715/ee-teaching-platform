const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying database access...');

    try {
        console.log('Fetching BlogPosts...');
        const posts = await prisma.blogPost.findMany({
            take: 1,
        });
        console.log('Successfully fetched', posts.length, 'blog posts.');
        if (posts.length > 0) {
            console.log('Sample post keys:', Object.keys(posts[0]));
        }
    } catch (error) {
        console.error('Error fetching BlogPosts:', error);
    }

    try {
        console.log('Fetching Projects...');
        const projects = await prisma.project.findMany({
            take: 1,
        });
        console.log('Successfully fetched', projects.length, 'projects.');
        if (projects.length > 0) {
            console.log('Sample project keys:', Object.keys(projects[0]));
        }
    } catch (error) {
        console.error('Error fetching Projects:', error);
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
