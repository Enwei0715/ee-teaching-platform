import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogPost() {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug: 'test' },
            include: { author: true }
        });

        console.log('Blog Post:', JSON.stringify(post, null, 2));

        if (post) {
            console.log('\n=== Post Details ===');
            console.log('Slug:', post.slug);
            console.log('Title:', post.title);
            console.log('Published:', post.published);
            console.log('Author ID:', post.authorId);
            console.log('Author:', post.author);
        } else {
            console.log('\n❌ Blog post with slug "test" not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBlogPost();
