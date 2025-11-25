'use client';

import { Edit2 } from 'lucide-react';
import { useEditMode } from '@/context/EditModeContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LessonEditButtonProps {
    courseSlug: string;
    lessonSlug: string;
}

export default function LessonEditButton({ courseSlug, lessonSlug }: LessonEditButtonProps) {
    const { isEditMode } = useEditMode();
    const { data: session } = useSession();
    const router = useRouter();

    if (!isEditMode || session?.user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                // Redirect to course editor and open the specific lesson file
                router.push(`/admin/courses/${courseSlug}?file=${lessonSlug}`);
            }}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors flex items-center gap-2"
            title="Edit this lesson"
        >
            <Edit2 size={16} />
            <span className="text-sm font-medium">Edit Lesson</span>
        </button>
    );
}
