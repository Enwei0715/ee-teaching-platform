import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany({
        include: { author: true }
    });
    console.log('Posts found:', posts.length);
    posts.forEach(p => console.log(`- ${p.title} by ${p.author.name}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
