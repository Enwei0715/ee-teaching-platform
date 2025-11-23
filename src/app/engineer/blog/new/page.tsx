"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BlogEditor from "@/components/blog/BlogEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EngineerNewBlogPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        const isEngineer = session?.user?.occupation?.toLowerCase().includes('engineer') || session?.user?.occupation?.toLowerCase().includes('engineering');
        const isAdmin = session?.user?.role === 'ADMIN';

        if (!session || (!isEngineer && !isAdmin)) {
            router.push('/');
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-6">
            <div className="max-w-7xl mx-auto h-[calc(100vh-150px)] flex flex-col">
                <div className="mb-4">
                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Back to Blog
                    </Link>
                </div>
                <BlogEditor
                    slug="new"
                    isNew={true}
                    baseApiUrl="/api/engineer/blog"
                    redirectUrl="/blog/{slug}"
                />
            </div>
        </div>
    );
}
