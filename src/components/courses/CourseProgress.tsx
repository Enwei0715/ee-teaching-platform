'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Edit2, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { calculateReadingTime } from '@/lib/utils';
import { useEditMode } from '@/context/EditModeContext';
import { StatusIcon } from '@/components/course/StatusIcon';
import { calculatePotentialXP } from '@/lib/xp';

interface Lesson {
    id: string;
    title: string;
    content: string;
    description?: string;
    descriptionNode?: React.ReactNode;
}

interface CourseProgressProps {
    courseId: string;
    lessons: Lesson[];
}

export default function CourseProgress({ courseId, lessons }: CourseProgressProps) {
    const { data: session } = useSession();
    const { isEditMode } = useEditMode();
    const router = useRouter();
    const [progressMap, setProgressMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/courses/${courseId}/progress`);
                    if (response.ok) {
                        const data = await response.json();
                        setProgressMap(data.progressMap || {});
                    }
                } catch (error) {
                    console.error('Failed to fetch progress:', error);
                }
            }
            setIsLoading(false);
        }

        fetchProgress();
    }, [session, courseId]);

    if (lessons.length === 0) {
        return (
            <div className="p-8 text-center text-text-secondary">
                No lessons available yet.
            </div>
        );
    }

    return (
        <div className="divide-y divide-border-primary">
            {lessons.map((lesson, index) => (
                <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-5 hover:bg-bg-tertiary transition-colors group relative"
                >
                    <Link
                        href={`/courses/${courseId}/${lesson.id}`}
                        className="flex items-center gap-4 flex-1 min-w-0"
                    >
                        <div className="flex items-center justify-center w-10 h-10 shrink-0">
                            <StatusIcon
                                status={progressMap[lesson.id]}
                                index={index}
                                className="w-8 h-8"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-text-primary font-medium group-hover:text-accent-primary transition-colors truncate">
                                {lesson.title}
                            </h3>
                            <div className="text-xs text-text-secondary mt-1 prose prose-invert prose-sm max-w-none [&>p]:text-xs [&>p]:m-0 [&>p]:leading-normal">
                                {lesson.descriptionNode ? (
                                    lesson.descriptionNode
                                ) : (
                                    lesson.description || calculateReadingTime(lesson.content)
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded border whitespace-nowrap ${(progressMap[lesson.id] === 'COMPLETED' || progressMap[lesson.id] === 'REVIEWING')
                                    ? 'text-blue-400/80 bg-blue-500/10 border-blue-500/20'
                                    : 'text-yellow-500/80 bg-yellow-500/10 border-yellow-500/20'
                                }`}>
                                +{
                                    (progressMap[lesson.id] === 'COMPLETED' || progressMap[lesson.id] === 'REVIEWING')
                                        ? Math.max(1, Math.round(calculatePotentialXP(lesson.content.length) / 10))
                                        : calculatePotentialXP(lesson.content.length)
                                } XP
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary">
                                <PlayCircle size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* Edit Shortcut Icon (Admin Edit Mode Only) */}
                    {isEditMode && session?.user?.role === 'ADMIN' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/admin/courses/${courseId}?file=${lesson.id}`);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit this lesson"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
