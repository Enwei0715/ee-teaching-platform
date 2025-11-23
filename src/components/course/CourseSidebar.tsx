'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/hooks/useProgress';

interface Lesson {
    id: string;
    title: string;
    order: number;
}

interface Props {
    courseId: string;
    lessons: Lesson[];
}

export default function CourseSidebar({ courseId, lessons }: Props) {
    const pathname = usePathname();
    const { isLessonComplete, getCourseProgress } = useProgress();

    const progress = getCourseProgress(courseId);
    const completedCount = lessons.filter(l => isLessonComplete(courseId, l.id)).length;
    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <aside className="hidden lg:block w-72 bg-bg-secondary border-r border-border-primary h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
            <div className="p-6 border-b border-border-primary bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="font-bold text-text-primary text-lg tracking-tight">Course Content</h2>
                <div className="mt-4 w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-accent-primary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-text-secondary font-medium">{progressPercentage}% Completed</p>
                    <p className="text-xs text-text-secondary">{completedCount}/{totalLessons} Lessons</p>
                </div>
            </div>

            <nav className="p-4 pb-20">
                <ul className="space-y-1">
                    {lessons.map((lesson, index) => {
                        const isActive = pathname === `/courses/${courseId}/${lesson.id}`;
                        const isCompleted = isLessonComplete(courseId, lesson.id);

                        return (
                            <li key={lesson.id}>
                                <Link
                                    href={`/courses/${courseId}/${lesson.id}`}
                                    className={cn(
                                        "flex items-start gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-accent-primary/10 text-accent-primary font-medium"
                                            : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-primary rounded-r-full" />
                                    )}

                                    <div className={cn("mt-0.5 shrink-0 transition-colors", isActive ? "text-accent-primary" : "text-text-secondary/30 group-hover:text-text-secondary/70")}>
                                        {isCompleted ? (
                                            <CheckCircle size={16} className="text-accent-success fill-accent-success/10" />
                                        ) : isActive ? (
                                            <Circle size={16} className="fill-accent-primary/20" />
                                        ) : (
                                            <Circle size={16} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <span className={cn("line-clamp-2 leading-snug", isActive && "text-accent-primary")}>
                                            {lesson.title}
                                        </span>
                                        {isActive && <p className="text-[10px] opacity-70 mt-1 font-normal">Current Lesson</p>}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
