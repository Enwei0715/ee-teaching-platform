'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface LessonProgressContextType {
    currentLessonId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING';
    setStatus: (status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING') => void;
    markAsComplete: () => void;
    startLesson: () => void;
    enterReviewMode: () => void;
}

const LessonProgressContext = createContext<LessonProgressContextType | undefined>(undefined);

export function LessonProgressProvider({
    children,
    initialStatus,
    lessonId,
    courseId
}: {
    children: React.ReactNode;
    initialStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING';
    lessonId: string;
    courseId: string;
}) {
    // Initialize state with optimistic transitions
    const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING'>(() => {
        if (initialStatus === 'NOT_STARTED') return 'IN_PROGRESS';
        if (initialStatus === 'COMPLETED') return 'REVIEWING';
        return initialStatus;
    });
    const [currentLessonId] = useState(lessonId);

    const updateStatus = async (newStatus: 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING', completed = false) => {
        try {
            // Optimistic update
            setStatus(newStatus);
            console.log(`🔄 [Context] Status updated to: ${newStatus}`);

            await fetch(`/api/courses/${courseId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: currentLessonId,
                    status: newStatus,
                    completed
                })
            });
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const startLesson = () => updateStatus('IN_PROGRESS');

    const markAsComplete = () => {
        if (status !== 'COMPLETED' && status !== 'REVIEWING') {
            console.log("✅ [Context] Marking as complete...");
            updateStatus('COMPLETED', true);
        }
    };

    const enterReviewMode = () => {
        if (status === 'COMPLETED') {
            console.log("📝 [Context] Entering review mode...");
            updateStatus('REVIEWING');
        }
    };

    // Trigger API save for initial optimistic transitions
    useEffect(() => {
        if (initialStatus === 'NOT_STARTED') {
            console.log("🚀 [Context] Auto-starting lesson (API sync)...");
            updateStatus('IN_PROGRESS');
        } else if (initialStatus === 'COMPLETED') {
            console.log("📝 [Context] Auto-entering review mode (API sync)...");
            updateStatus('REVIEWING');
        }
    }, []); // Run once on mount

    // Sync if prop updates (optional but good)
    useEffect(() => {
        if (initialStatus !== status && initialStatus !== 'NOT_STARTED' && initialStatus !== 'COMPLETED') {
            // Only sync if it's a "real" update from outside, avoiding conflict with our optimistic logic
            // Actually, usually we don't want to overwrite local state with prop unless it changed significantly
            // For now, let's trust local state logic primarily.
        }
    }, [initialStatus]);

    useEffect(() => {
        console.log("📊 [Context] Current Status:", status);
    }, [status]);

    return (
        <LessonProgressContext.Provider value={{ currentLessonId, status, setStatus, markAsComplete, startLesson, enterReviewMode }}>
            {children}
        </LessonProgressContext.Provider>
    );
}

export const useLessonProgress = () => {
    const context = useContext(LessonProgressContext);
    if (!context) throw new Error("useLessonProgress must be used within a Provider");
    return context;
};
