import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const { type, message, screenshot, pageUrl } = await req.json();

        if (!message) {
            return NextResponse.json(
                { message: "Message is required" },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                type,
                message,
                screenshot,
                pageUrl,
                userId: session?.user?.id || null,
                userAgent: req.headers.get("user-agent") || null,
            },
        });

        return NextResponse.json(
            { message: "Feedback submitted successfully", id: feedback.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Feedback submission error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
