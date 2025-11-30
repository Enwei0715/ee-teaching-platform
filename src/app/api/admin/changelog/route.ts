import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        if (!fs.existsSync(CHANGELOG_PATH)) {
            return NextResponse.json({ content: '' });
        }
        const content = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error reading changelog:', error);
        return NextResponse.json({ error: 'Failed to read changelog' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content } = await req.json();
        fs.writeFileSync(CHANGELOG_PATH, content, 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving changelog:', error);
        return NextResponse.json({ error: 'Failed to save changelog' }, { status: 500 });
    }
}
