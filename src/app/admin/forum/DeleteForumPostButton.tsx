"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteForumPostButton({ postId }: { postId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/forum/posts/${postId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert("Post deleted successfully");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Post"
        >
            <Trash2 size={18} />
        </button>
    );
}
