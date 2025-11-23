"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "on";

    await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            published,
        },
    });

    redirect("/admin/forum");
}
