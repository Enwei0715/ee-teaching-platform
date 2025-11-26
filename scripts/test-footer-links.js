
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const links = await prisma.footerLink.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        console.log('Total links found:', links.length);
        links.forEach(l => console.log(`${l.label} (${l.category}) - Order: ${l.orderIndex}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
