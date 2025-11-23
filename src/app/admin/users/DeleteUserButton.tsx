"use client";

import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ userId }: { userId: string }) {
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert("User deleted successfully");
                window.location.reload();
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
            title="Delete User"
        >
            <Trash2 size={18} />
        </button>
    );
}
