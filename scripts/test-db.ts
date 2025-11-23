import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected.');

        const email = 'test-script@example.com';
        const password = 'password123';

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed.');

        console.log('Creating user...');
        const user = await prisma.user.create({
            data: {
                email,
                name: 'Test Script User',
                password: hashedPassword,
            },
        });
        console.log('User created:', user);

        console.log('Cleaning up...');
        await prisma.user.delete({ where: { id: user.id } });
        console.log('User deleted.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
