'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface TimeTrackerProps {
    courseId: string;
    lessonId: string;
}

export default function TimeTracker({ courseId, lessonId }: TimeTrackerProps) {
    const { data: session } = useSession();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const accumulatedTimeRef = useRef(0);
    const lastSyncTimeRef = useRef(Date.now());

    useEffect(() => {
        if (!session?.user) return;

        const syncTime = async (seconds: number) => {
            if (seconds <= 0) return;

            try {
                await fetch('/api/tracking/time', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId,
                        lessonId,
                        seconds,
                    }),
                });
            } catch (error) {
                console.error('Failed to sync time:', error);
            }
        };

        // Sync every 30 seconds
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const secondsSinceLastSync = Math.floor((now - lastSyncTimeRef.current) / 1000);

            if (secondsSinceLastSync > 0) {
                syncTime(secondsSinceLastSync);
                lastSyncTimeRef.current = now;
            }
        }, 30000);

        // Handle visibility change to pause/resume or sync
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Sync when hiding
                const now = Date.now();
                const secondsSinceLastSync = Math.floor((now - lastSyncTimeRef.current) / 1000);
                syncTime(secondsSinceLastSync);
                lastSyncTimeRef.current = now;
            } else {
                // Reset timer when showing
                lastSyncTimeRef.current = Date.now();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup: sync remaining time
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            const now = Date.now();
            const secondsSinceLastSync = Math.floor((now - lastSyncTimeRef.current) / 1000);

            if (secondsSinceLastSync > 0) {
                // Use sendBeacon for reliability on unload if possible, otherwise fetch
                // Note: sendBeacon sends POST with text/plain by default or Blob, JSON needs Blob
                const blob = new Blob([JSON.stringify({ courseId, lessonId, seconds: secondsSinceLastSync })], { type: 'application/json' });
                navigator.sendBeacon('/api/tracking/time', blob);
            }
        };
    }, [courseId, lessonId, session]);

    return null; // Invisible component
}
