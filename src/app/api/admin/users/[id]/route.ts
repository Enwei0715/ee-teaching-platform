import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.user.delete({
            where: {
                id: params.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        console.log("Admin User Update Data:", data);
        const { name, email, role, major, occupation } = data;

        const user = await prisma.user.update({
            where: {
                id: params.id,
            },
            data: {
                name,
                email,
                role,
                major,
                occupation,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}
