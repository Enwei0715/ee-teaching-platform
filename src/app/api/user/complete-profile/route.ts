import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { occupation, major } = await req.json();

        if (!occupation || !major) {
            return NextResponse.json(
                { message: "Missing occupation or major" },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                occupation,
                major,
            },
        });

        return NextResponse.json(
            { message: "Profile updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
