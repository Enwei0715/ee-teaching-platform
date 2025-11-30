"use client";

import { useState } from 'react';
import { CheckCircle, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
    projectSlug: string;
    initialCompleted: boolean;
}

export default function ProjectCompletionButton({ projectSlug, initialCompleted }: Props) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleComplete = async () => {
        if (completed || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectSlug}/complete`, {
                method: 'POST',
            });

            if (!res.ok) {
                if (res.status === 401) {
                    toast.error("Please sign in to complete projects");
                    return;
                }
                throw new Error('Failed to complete project');
            }

            const data = await res.json();
            setCompleted(true);

            toast.success(
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Project Completed!</span>
                    <span className="flex items-center gap-1 text-sm">
                        <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                        You earned {data.xpGained} XP
                    </span>
                </div>
            );

            router.refresh(); // Refresh to update server state if needed
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <button
                disabled
                className="w-full flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 py-3 rounded-lg font-semibold cursor-default"
            >
                <CheckCircle size={20} />
                Completed
            </button>
        );
    }

    return (
        <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-accent-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <CheckCircle size={20} />
            )}
            Mark as Completed
        </button>
    );
}
