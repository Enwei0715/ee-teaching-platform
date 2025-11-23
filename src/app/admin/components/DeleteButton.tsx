"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ slug, type = 'projects' }: { slug: string, type?: 'projects' | 'courses' | 'blog' }) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/${type}/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
        >
            <Trash2 size={18} />
        </button>
    );
}
