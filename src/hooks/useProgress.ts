import { useState, useEffect } from 'react';

export interface CourseProgress {
    courseId: string;
    completedLessons: string[]; // Array of lesson IDs
    lastAccessedLessonId?: string;
    lastAccessedAt?: string;
}

export interface UserProgress {
    courses: Record<string, CourseProgress>;
}

const STORAGE_KEY = 'ee_master_progress';

export function useProgress() {
    const [progress, setProgress] = useState<UserProgress>({ courses: {} });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from LocalStorage and API on mount
    useEffect(() => {
        const loadProgress = async () => {
            // 1. Load from LocalStorage first for immediate UI
            const stored = localStorage.getItem(STORAGE_KEY);
            let localProgress: UserProgress = { courses: {} };

            if (stored) {
                try {
                    localProgress = JSON.parse(stored);
                    setProgress(localProgress);
                } catch (e) {
                    console.error('Failed to parse progress', e);
                }
            }

            // 2. Fetch from API to sync across devices
            try {
                const res = await fetch('/api/progress');
                if (res.ok) {
                    const serverProgress = await res.json();

                    // Merge server progress with local progress
                    // Server is source of truth for completion
                    setProgress(prev => {
                        const merged = { ...prev };

                        Object.keys(serverProgress.courses).forEach(courseId => {
                            const serverCourse = serverProgress.courses[courseId];
                            const localCourse = merged.courses[courseId] || {
                                courseId,
                                completedLessons: [],
                                lastAccessedLessonId: undefined,
                                lastAccessedAt: undefined
                            };

                            // Merge completed lessons (union)
                            const allCompleted = Array.from(new Set([
                                ...localCourse.completedLessons,
                                ...serverCourse.completedLessons
                            ]));

                            merged.courses[courseId] = {
                                ...localCourse,
                                completedLessons: allCompleted
                            };
                        });

                        return merged;
                    });
                }
            } catch (error) {
                console.error('Failed to fetch progress from API', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadProgress();
    }, []);

    // Save progress to LocalStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }
    }, [progress, isLoaded]);

    const markLessonComplete = async (courseId: string, lessonId: string) => {
        // Optimistic update
        setProgress(prev => {
            const courseProgress = prev.courses[courseId] || {
                courseId,
                completedLessons: [],
                lastAccessedLessonId: lessonId,
                lastAccessedAt: new Date().toISOString()
            };

            if (!courseProgress.completedLessons.includes(lessonId)) {
                return {
                    ...prev,
                    courses: {
                        ...prev.courses,
                        [courseId]: {
                            ...courseProgress,
                            completedLessons: [...courseProgress.completedLessons, lessonId],
                            lastAccessedLessonId: lessonId,
                            lastAccessedAt: new Date().toISOString()
                        }
                    }
                };
            }
            return prev;
        });

        // Sync with API
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    lessonId,
                    completed: true,
                    timeSpent: 0 // We can track time separately if needed
                }),
            });
        } catch (error) {
            console.error("Failed to sync progress:", error);
        }
    };

    const isLessonComplete = (courseId: string, lessonId: string) => {
        return progress.courses[courseId]?.completedLessons.includes(lessonId) || false;
    };

    const getCourseProgress = (courseId: string) => {
        return progress.courses[courseId] || null;
    };

    return {
        progress,
        isLoaded,
        markLessonComplete,
        isLessonComplete,
        getCourseProgress
    };
}
