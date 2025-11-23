'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    courseId: string;
    nextLessonId?: string;
    prevLessonId?: string;
}

export default function LessonNavigationListener({ courseId, nextLessonId, prevLessonId }: Props) {
    const router = useRouter();

    useEffect(() => {
        const handleNextLesson = () => {
            if (nextLessonId) {
                router.push(`/courses/${courseId}/${nextLessonId}`);
            }
        };

        const handlePrevLesson = () => {
            if (prevLessonId) {
                router.push(`/courses/${courseId}/${prevLessonId}`);
            }
        };

        window.addEventListener('nav-next-lesson', handleNextLesson);
        window.addEventListener('nav-prev-lesson', handlePrevLesson);

        return () => {
            window.removeEventListener('nav-next-lesson', handleNextLesson);
            window.removeEventListener('nav-prev-lesson', handlePrevLesson);
        };
    }, [courseId, nextLessonId, prevLessonId, router]);

    return null; // This component doesn't render anything visible
}
