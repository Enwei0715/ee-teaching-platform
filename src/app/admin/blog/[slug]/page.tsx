"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import BlogEditor from "@/components/blog/BlogEditor";

export default function EditBlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const isNew = slug === 'new';

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-4">
                <Link href="/admin/blog" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Blog List
                </Link>
            </div>
            <BlogEditor slug={slug} isNew={isNew} />
        </div>
    );
}
