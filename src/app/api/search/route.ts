import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/search';

export async function GET() {
    const index = getSearchIndex();
    return NextResponse.json(index);
}
