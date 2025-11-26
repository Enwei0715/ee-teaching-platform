"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BlogEditor from "@/components/blog/BlogEditor";
import DigitalGridBackground from "@/components/ui/DigitalGridBackground";

export default function NewBlogPostPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect if not logged in
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <p className="text-text-secondary">Loading...</p>
            </div>
        );
    }

    if (!session) {
        router.push("/auth/signin");
        return null;
    }

    // Check if user has permission (Admin or Engineer)
    const isEngineer = session?.user?.major?.toLowerCase().includes('engineer') ||
        session?.user?.major?.toLowerCase().includes('engineering');

    if (session?.user?.role !== 'ADMIN' && !isEngineer) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
                    <p className="text-text-secondary mb-6">You need to be an Engineer or Admin to create blog posts.</p>
                    <Link href="/blog" className="text-accent-primary hover:underline">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative">
            <DigitalGridBackground />
            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
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
