import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // Optional: Check if user is admin. 
        // For now, assuming anyone with access to this endpoint (via admin page middleware) is authorized.
        // Or strictly check for admin role if you have it implemented in session.
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { status } = await req.json();
        const { id } = params;

        if (!['OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'].includes(status)) {
            return NextResponse.json(
                { message: "Invalid status" },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Feedback update error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
