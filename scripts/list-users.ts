
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, streak: true, level: true }
    });
    console.log('Users found:');
    users.forEach(u => console.log(`${u.name} (${u.email}) - ID: ${u.id} | Streak: ${u.streak} | Level: ${u.level}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
