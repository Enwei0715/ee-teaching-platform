'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';

export default function BadgeSyncer() {
    useEffect(() => {
        const syncBadges = async () => {
            try {
                const res = await fetch('/api/gamification/sync-badges', { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.earnedBadges && data.earnedBadges.length > 0) {
                        data.earnedBadges.forEach((badgeName: string) => {
                            toast.success(
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold flex items-center gap-2">
                                        <Trophy size={16} className="text-yellow-500" />
                                        Badge Unlocked: {badgeName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        You've met the requirements!
                                    </span>
                                </div>
                            );
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to sync badges:', error);
            }
        };

        syncBadges();
    }, []);

    return null;
}
