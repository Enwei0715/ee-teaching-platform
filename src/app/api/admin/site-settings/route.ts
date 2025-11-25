import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { settings } = body; // Expects { settings: { key: value, ... } }

        if (!settings) {
            return NextResponse.json({ message: "Settings data required" }, { status: 400 });
        }

        // Upsert each setting
        for (const [key, value] of Object.entries(settings)) {
            await prisma.siteSettings.upsert({
                where: { key },
                update: { value: value as string },
                create: { key, value: value as string }
            });
        }

        revalidatePath('/'); // Revalidate homepage/footer
        revalidatePath('/about'); // Revalidate about page

        return NextResponse.json({ message: "Settings updated successfully" });
    } catch (error) {
        console.error("Error updating site settings:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
