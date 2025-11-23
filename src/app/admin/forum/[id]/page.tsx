import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ForumPostEditor from "@/components/admin/ForumPostEditor";
import { updatePost } from "./actions";

export default async function EditForumPostPage({ params }: { params: { id: string } }) {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        notFound();
    }

    return <ForumPostEditor post={post} action={updatePost} />;
}
