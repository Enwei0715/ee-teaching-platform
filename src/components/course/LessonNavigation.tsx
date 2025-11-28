'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
    id: string;
    title: string;
}

interface LessonNavigationProps {
    courseId: string;
    currentLessonId: string;
    prevLesson: Lesson | null;
    nextLesson: Lesson | null;
}

export default function LessonNavigation({
    courseId,
    currentLessonId,
    prevLesson,
    nextLesson,
}: LessonNavigationProps) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNext = async (e: React.MouseEvent, nextUrl: string) => {
        e.preventDefault();
        if (isNavigating) return;
        setIsNavigating(true);

        try {
            // Mark current lesson as completed
            await fetch(`/api/courses/${courseId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: currentLessonId,
                    completed: true
                }),
            });

            // Navigate to next lesson
            router.push(nextUrl);
            router.refresh();
        } catch (error) {
            console.error('Failed to mark lesson as complete:', error);
            // Navigate anyway
            router.push(nextUrl);
        }
    };

    return (
        <div className="flex justify-between items-center pt-8 border-t border-border-primary">
            {prevLesson ? (
                <Link
                    href={`/courses/${courseId}/${prevLesson.id}`}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <div>
                        <div className="text-xs text-text-secondary/50 uppercase tracking-wider">Previous</div>
                        <div className="font-medium">{prevLesson.title}</div>
                    </div>
                </Link>
            ) : (
                <div></div>
            )}

            {nextLesson ? (
                <a
                    href={`/courses/${courseId}/${nextLesson.id}`}
                    onClick={(e) => handleNext(e, `/courses/${courseId}/${nextLesson.id}`)}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-right group cursor-pointer"
                >
                    <div>
                        <div className="text-xs text-text-secondary/50 uppercase tracking-wider">Next</div>
                        <div className="font-medium">{nextLesson.title}</div>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
            ) : (
                <a
                    href={`/courses/${courseId}`}
                    onClick={(e) => handleNext(e, `/courses/${courseId}`)}
                    className="flex items-center gap-2 text-accent-success hover:text-green-400 transition-colors text-right group cursor-pointer"
                >
                    <div>
                        <div className="text-xs text-accent-success/70 uppercase tracking-wider">Completed</div>
                        <div className="font-medium">End Course</div>
                    </div>
                    <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                </a>
            )}
        </div>
    );
}
