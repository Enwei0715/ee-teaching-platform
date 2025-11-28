'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
    userId?: string;
    lessonTitle: string;
}

export default function ResumeLearningTracker({ userId, lessonTitle, courseId, lessonId, initialLastElementId }: Props & { courseId?: string, lessonId?: string, initialLastElementId?: string | null }) {
    const pathname = usePathname();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Restore scroll position on mount if requested
    useEffect(() => {
        if (!userId) return;

        // Priority 1: Check URL param + initialLastElementId (from DB)
        if (window.location.search.includes('resume=true') && initialLastElementId) {
            setTimeout(() => {
                const element = document.getElementById(initialLastElementId);
                if (element) {
                    // Check if it's a heading element (more reliable for TOC)
                    const isHeading = element.tagName.match(/^H[1-6]$/);
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: isHeading ? 'start' : 'center'
                    });
                }
                // Clean URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }, 500);
            return;
        }

        // Priority 2: Local Storage (Fallback)
        const key = `resume_learning_${userId}`;
        const savedData = localStorage.getItem(key);

        if (savedData) {
            try {
                const { url, scrollY, elementId } = JSON.parse(savedData);
                // If we are on the same page as saved, restore scroll
                if (url === pathname && window.location.search.includes('resume=true')) {
                    // Small delay to ensure content is rendered
                    setTimeout(() => {
                        if (elementId) {
                            const element = document.getElementById(elementId);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            } else {
                                // Fallback to scrollY if element not found
                                window.scrollTo({ top: scrollY, behavior: 'smooth' });
                            }
                        } else {
                            window.scrollTo({ top: scrollY, behavior: 'smooth' });
                        }
                        // Remove the query param to clean URL
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                    }, 500);
                }
            } catch (e) {
                console.error("Failed to parse resume data", e);
            }
        }
    }, [userId, pathname, initialLastElementId]);

    const isMounting = useRef(true);

    // Initialize progress on mount (Create IN_PROGRESS or switch to REVIEWING)
    useEffect(() => {
        if (!userId || !courseId || !lessonId) return;

        // Only run this logic on initial mount to prevent loops
        if (isMounting.current) {
            const initProgress = async () => {
                try {
                    await fetch(`/api/courses/${courseId}/progress`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            lessonId,
                            // No lastElementId or completed flag, just "I am here" to trigger status logic
                        }),
                    });
                } catch (error) {
                    console.error("Failed to initialize progress", error);
                }
            };

            initProgress();
            isMounting.current = false;
        }
    }, [userId, courseId, lessonId]);

    // Save scroll position on scroll
    useEffect(() => {
        if (!userId) return;

        const handleScroll = () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(async () => {
                // Find the closest element to the top of the viewport with an ID
                let activeElementId = null;
                const elements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], p[id], div[id]');

                let minDistance = Infinity;

                elements.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const distance = Math.abs(rect.top - 100); // Offset a bit for navbar
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeElementId = el.id;
                    }
                });

                // Save to Local Storage (Fast, offline support)
                const data = {
                    url: pathname,
                    scrollY: window.scrollY,
                    elementId: activeElementId,
                    timestamp: Date.now(),
                    title: lessonTitle
                };
                localStorage.setItem(`resume_learning_${userId}`, JSON.stringify(data));

                // Save to Database (Sync across devices)
                if (courseId && lessonId && activeElementId) {
                    try {
                        await fetch(`/api/courses/${courseId}/progress`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                lessonId,
                                lastElementId: activeElementId,
                                // We don't mark as completed here, just tracking position
                            }),
                        });
                    } catch (error) {
                        console.error("Failed to save progress to DB", error);
                    }
                }

            }, 2000); // Debounce 2s (less frequent for DB calls)
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [userId, pathname, lessonTitle, courseId, lessonId]);

    // Hide on dashboard to avoid duplication with "Continue Learning" section
    if (pathname === '/dashboard') return null;

    return null;
}
