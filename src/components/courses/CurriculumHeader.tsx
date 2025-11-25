'use client';

import { Settings } from 'lucide-react';
import { useEditMode } from '@/context/EditModeContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CurriculumHeaderProps {
    courseSlug: string;
}

export default function CurriculumHeader({ courseSlug }: CurriculumHeaderProps) {
    const { isEditMode } = useEditMode();
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span>Course Curriculum</span>
            </h2>

            {isEditMode && session?.user?.role === 'ADMIN' && (
                <Link
                    href={`/admin/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                    <Settings size={14} />
                    <span>Manage Curriculum</span>
                </Link>
            )}
        </div>
    );
}
