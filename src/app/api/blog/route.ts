import { NextResponse } from 'next/server';
import { getBlogPostList } from '@/lib/mdx';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const posts = await getBlogPostList();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
