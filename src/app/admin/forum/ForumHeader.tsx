"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

export default function ForumHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Forum Management</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-3 py-2 lg:px-4 lg:py-2 text-sm lg:text-base rounded-lg flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
                <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
                New Post
            </button>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
