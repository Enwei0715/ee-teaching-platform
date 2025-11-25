import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    try {
        if (key) {
            const content = await prisma.siteContent.findUnique({
                where: { key }
            });
            return NextResponse.json(content || { content: null });
        } else {
            const allContent = await prisma.siteContent.findMany();
            return NextResponse.json(allContent);
        }
    } catch (error) {
        console.error("Error fetching site content:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { key, content } = body;

        if (!key || content === undefined) {
            return NextResponse.json({ message: "Key and content required" }, { status: 400 });
        }

        const updated = await prisma.siteContent.upsert({
            where: { key },
            update: { content },
            create: { key, content }
        });

        revalidatePath('/');

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating site content:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
