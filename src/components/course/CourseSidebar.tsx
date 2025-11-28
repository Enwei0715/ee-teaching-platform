'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, Circle, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const { data: session } = useSession();
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Fetch progress directly from DB to ensure sync with Course Curriculum
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
        }

        fetchProgress();
    }, [session, courseId]);

    const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <>
            <aside className={cn(
                "hidden lg:block glass-heavy border-r border-gray-800/80 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-72 opacity-100"
            )}>
                <div className="p-6 border-b border-border-primary glass-ghost sticky top-0 z-10 relative">
                    <h2 className="font-bold text-text-primary text-lg tracking-tight">Course Content</h2>

                    {/* Collapse Button */}
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-tertiary"
                        title="Hide sidebar (Focus Mode)"
                    >
                        <PanelLeftClose size={18} />
                    </button>

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
                            const isCompleted = completedLessons.includes(lesson.id);

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

            {/* Floating Reopen Button (when collapsed) */}
            {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="fixed left-4 top-24 z-50 p-3 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-full shadow-lg hover:shadow-accent-primary/50 transition-all transform hover:scale-110 animate-in slide-in-from-left duration-300"
                    title="Show sidebar"
                >
                    <PanelLeftOpen size={20} />
                </button>
            )}
        </>
    );
}
