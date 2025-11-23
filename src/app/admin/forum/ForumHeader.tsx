"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

export default function ForumHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Forum Management</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
                <Plus size={18} />
                New Post
            </button>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
