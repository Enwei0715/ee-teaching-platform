'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface LessonProgressContextType {
    currentLessonId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING';
    setStatus: (status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWING') => void;
    markAsComplete: () => void;
}

const LessonProgressContext = createContext<LessonProgressContextType | undefined>(undefined);

export function LessonProgressProvider({
    children,
    initialStatus,
    lessonId
}: {
    children: React.ReactNode;
    initialStatus: any;
    lessonId: string
}) {
    const [status, setStatus] = useState(initialStatus);
    const [currentLessonId] = useState(lessonId);

    const markAsComplete = () => setStatus('COMPLETED');

    // Sync if prop updates (optional but good)
    useEffect(() => { setStatus(initialStatus) }, [initialStatus]);

    return (
        <LessonProgressContext.Provider value={{ currentLessonId, status, setStatus, markAsComplete }}>
            {children}
        </LessonProgressContext.Provider>
    );
}

export const useLessonProgress = () => {
    const context = useContext(LessonProgressContext);
    if (!context) throw new Error("useLessonProgress must be used within a Provider");
    return context;
};
