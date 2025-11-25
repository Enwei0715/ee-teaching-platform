'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { calculateReadingTime } from '@/lib/utils';

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
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/courses/${courseId}/progress`);
                    if (response.ok) {
                        const data = await response.json();
                        setCompletedLessons(data.completedLessonIds || []);
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
                <Link
                    key={lesson.id}
                    href={`/courses/${courseId}/${lesson.id}`}
                    className="flex items-center gap-4 p-5 hover:bg-bg-tertiary transition-colors group"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-tertiary border border-border-primary group-hover:border-accent-primary/50 group-hover:bg-accent-primary/10 transition-colors shrink-0">
                        {completedLessons.includes(lesson.id) ? (
                            <CheckCircle size={20} className="text-accent-success" />
                        ) : (
                            <span className="font-mono text-sm text-text-secondary group-hover:text-accent-primary font-medium">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        )}
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

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary">
                        <PlayCircle size={20} />
                    </div>
                </Link>
            ))}
        </div>
    );
}
