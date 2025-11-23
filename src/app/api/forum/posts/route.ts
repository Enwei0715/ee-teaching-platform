import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: {
                    select: { name: true, email: true },
                },
                _count: {
                    select: { comments: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        console.log("Forum POST: Unauthorized. Session:", session);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content } = await req.json();
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });

        if (!user) {
            console.log("Forum POST: User not found in DB. Email:", session.user.email);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: user.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error creating post" }, { status: 500 });
    }
}
