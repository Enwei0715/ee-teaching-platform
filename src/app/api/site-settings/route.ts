import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findMany();
        const links = await prisma.footerLink.findMany({
            orderBy: { orderIndex: 'asc' }
        });

        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json({
            settings: settingsMap,
            links
        });
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
