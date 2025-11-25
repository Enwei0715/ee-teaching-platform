import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const slug = params.slug;

    const project = await prisma.project.findUnique({
        where: { slug }
    });

    if (!project) {
        return new NextResponse("Project not found", { status: 404 });
    }

    const meta = {
        title: project.title,
        description: project.description,
        image: project.image,

        level: project.level,
        tools: project.tools,
        materials: project.materials,
        technologies: project.technologies,
        features: project.features,
        // Map technologies to tags for compatibility if needed
        tags: project.technologies,
    };

    return NextResponse.json({ content: project.content, meta });
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { content, meta } = body;
        const slug = params.slug;

        // Handle both nested meta and flat updates (from EditableText)
        const title = meta?.title || body.title;
        const description = meta?.description || body.description;
        const image = meta?.image || body.image;
        const level = meta?.level || body.level;
        const tools = meta?.tools || body.tools;
        const materials = meta?.materials || body.materials;
        const technologies = meta?.technologies || body.technologies;
        const features = meta?.features || body.features;

        await prisma.project.update({
            where: { slug },
            data: {
                title: title,
                description: description,
                content: content,
                image: image,

                level: level,
                tools: tools,
                materials: materials,
                technologies: technologies,
                features: features,
            }
        });

        revalidatePath('/admin/projects');
        revalidatePath('/projects');
        revalidatePath(`/projects/${slug}`);

        return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
        console.error("Error saving project:", error);
        return NextResponse.json({ message: "Error saving project" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const slug = params.slug;

        await prisma.project.delete({
            where: { slug }
        });

        revalidatePath('/admin/projects');
        revalidatePath('/projects');

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
    }
}
