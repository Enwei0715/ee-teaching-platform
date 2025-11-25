import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check admin auth
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return false;
    }
    return true;
}

export async function GET() {
    if (!await checkAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const links = await prisma.footerLink.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        return NextResponse.json(links);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await checkAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { category, label, url, orderIndex } = await request.json();
        const link = await prisma.footerLink.create({
            data: { category, label, url, orderIndex: orderIndex || 0 }
        });
        revalidatePath('/');
        return NextResponse.json(link);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await checkAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id, category, label, url, orderIndex } = await request.json();
        const link = await prisma.footerLink.update({
            where: { id },
            data: { category, label, url, orderIndex }
        });
        revalidatePath('/');
        return NextResponse.json(link);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await checkAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return new NextResponse("ID required", { status: 400 });

        await prisma.footerLink.delete({ where: { id } });
        revalidatePath('/');
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
