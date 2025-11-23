import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { content } = await request.json();
        const { postId } = params;

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("[COMMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
