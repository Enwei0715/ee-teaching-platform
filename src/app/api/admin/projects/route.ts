import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { content, meta, slug } = await request.json();

        if (!slug) {
            // Auto-generate slug if not provided
            const generatedSlug = slugify(meta.title);

            const newProject = await prisma.project.create({
                data: {
                    slug: generatedSlug,
                    title: meta.title,
                    description: meta.description,
                    content: content || "",
                    image: meta.image,
                    level: meta.level,
                    published: true,
                    tools: meta.tools || [],
                    materials: meta.materials || [],
                    technologies: meta.technologies || [],
                    features: meta.features || [],
                }
            });

            revalidatePath('/admin/projects');
            revalidatePath('/projects');

            return NextResponse.json({ message: "Created successfully", slug: newProject.slug });
        }

        const existingProject = await prisma.project.findUnique({
            where: { slug }
        });

        if (existingProject) {
            return NextResponse.json({ message: "Project with this slug already exists" }, { status: 409 });
        }

        const newProject = await prisma.project.create({
            data: {
                slug,
                title: meta.title,
                description: meta.description,
                content: content || "",
                image: meta.image,
                level: meta.level,
                published: true,
                tools: meta.tools || [],
                materials: meta.materials || [],
                technologies: meta.technologies || [],
                features: meta.features || [],
            }
        });

        revalidatePath('/admin/projects');
        revalidatePath('/projects');

        return NextResponse.json({ message: "Created successfully", slug: newProject.slug });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: "Error creating project" }, { status: 500 });
    }
}
