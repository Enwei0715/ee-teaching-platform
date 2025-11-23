"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
    slug: string;
}

export default function DeletePostButton({ slug }: DeletePostButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/engineer/blog/${slug}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/blog");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete post");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium disabled:opacity-50"
        >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Post"}
        </button>
    );
}
