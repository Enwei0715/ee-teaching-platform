'use client';

import Link from 'next/link';
import { PenTool } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DeletePostButton from '@/components/blog/DeletePostButton';

interface BlogAdminControlsProps {
    slug: string;
    authorId: string;
}

export default function BlogAdminControls({ slug, authorId }: BlogAdminControlsProps) {
    const { data: session } = useSession();

    // Check if user is author or admin
    // @ts-ignore
    const isAuthor = session?.user?.id === authorId;
    // @ts-ignore
    const isAdmin = session?.user?.role === 'ADMIN';
    const canDelete = isAuthor || isAdmin;

    if (!canDelete) return null;

    return (
        <div className="flex items-center gap-3">
            <Link
                href={`/engineer/blog/${slug}`}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
            >
                <PenTool size={16} />
                Edit Post
            </Link>
            <DeletePostButton slug={slug} />
        </div>
    );
}
