'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronRight, ChevronDown, PanelLeftClose, PanelLeftOpen, CheckCircle2, Circle, Lock, PlayCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusIcon } from '@/components/course/StatusIcon';
import { useLessonProgress } from '@/context/LessonProgressContext';

interface Lesson {
    id: string;
    title: string;
    order: number;
}

interface Props {
    courseId: string;
    lessons: Lesson[];
    category?: string;
    courseTitle?: string;
}

export default function CourseSidebar({ courseId, lessons, category = "Courses", courseTitle = "Course" }: Props) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [progressMap, setProgressMap] = useState<Record<string, string>>({});
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Context for real-time updates
    const { currentLessonId, status: currentLessonStatus } = useLessonProgress();

    useEffect(() => {
        console.log("sidebar render", { currentLessonId, currentLessonStatus });
    }, [currentLessonId, currentLessonStatus]);

    // Load collapsed state from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedState = localStorage.getItem('course-sidebar-collapsed');
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
    }, []);

    // Toggle function with localStorage persistence
    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('course-sidebar-collapsed', JSON.stringify(newState));
    };

    // Keyboard shortcut: Ctrl+B (or Cmd+B on Mac)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isCollapsed]); // Include isCollapsed in deps for toggleSidebar closure

    // Fetch progress directly from DB to ensure sync with Course Curriculum
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
        }

        fetchProgress();
    }, [session, courseId]);

    const completedCount = lessons.filter(l => {
        // Check if this lesson is the current one being viewed
        if (l.id === currentLessonId) {
            return currentLessonStatus === 'COMPLETED' || currentLessonStatus === 'REVIEWING';
        }
        return progressMap[l.id] === 'COMPLETED' || progressMap[l.id] === 'REVIEWING';
    }).length;

    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Reusable Sidebar Header with Breadcrumbs
    const SidebarHeader = () => (
        <div className="p-4 border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
            <nav className="flex items-center text-xs text-gray-400 space-x-1 mb-2">
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span>/</span>
                <Link href={`/courses/${courseId}`} className="hover:text-white transition-colors truncate max-w-[200px]">
                    {courseTitle}
                </Link>
            </nav>
            <h2 className="text-base font-bold text-white leading-tight">
                {courseTitle}
            </h2>
        </div>
    );

    // Reusable Sidebar Content (Lesson List)
    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Progress Bar Section */}
            <div className="p-6 border-b border-border-primary glass-ghost">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-text-primary text-lg tracking-tight">Course Content</h2>

                    {/* Close Button (Mobile) or Collapse Button (Desktop) */}
                    {isMobile ? (
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-tertiary"
                        >
                            <X size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-tertiary"
                            title="Hide sidebar (Focus Mode) • Ctrl+B"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    )}
                </div>

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

                        // Use real-time status for current lesson, fallback to fetched map for others
                        const displayStatus = (lesson.id === currentLessonId) ? currentLessonStatus : progressMap[lesson.id];

                        return (
                            <li key={lesson.id}>
                                <Link
                                    href={`/courses/${courseId}/${lesson.id}`}
                                    onClick={() => isMobile && setIsMobileOpen(false)}
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
                                        <StatusIcon
                                            status={displayStatus}
                                            index={index}
                                            className="w-4 h-4"
                                        />
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
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex flex-col glass-heavy border-r border-gray-800/80 h-[calc(100vh-5rem)] sticky top-20 self-start rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-72 opacity-100"
            )}>
                <SidebarHeader />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Floating Button */}
            {!isMobileOpen && (
                <button
                    className="lg:hidden fixed bottom-6 left-6 z-50 p-3 glass-heavy rounded-full text-white shadow-2xl hover:bg-blue-600 transition-all"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="Open Menu"
                >
                    <PanelLeftOpen size={24} />
                </button>
            )}

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-[35] flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 z-[35]"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <aside className="fixed top-16 bottom-0 left-0 w-[85vw] max-w-xs glass-heavy border-r border-white/10 overflow-y-auto animate-in slide-in-from-left duration-300 shadow-2xl z-[40]">
                        <SidebarHeader />
                        <SidebarContent isMobile={true} />
                    </aside>
                </div>
            )}

            {/* Desktop Floating Reopen Button (when collapsed) */}
            {isMounted && isCollapsed && (
                <button
                    onClick={toggleSidebar}
                    className="fixed left-4 top-24 z-50 p-3 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-full shadow-lg hover:shadow-accent-primary/50 transition-all transform hover:scale-110 animate-in slide-in-from-left duration-300 hidden lg:block"
                    title="Show sidebar • Ctrl+B"
                >
                    <PanelLeftOpen size={20} />
                </button>
            )}
        </>
    );
}
