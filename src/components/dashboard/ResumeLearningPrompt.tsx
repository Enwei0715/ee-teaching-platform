'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, X, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ResumeLearningPrompt() {
    const { data: session } = useSession();
    const [savedState, setSavedState] = useState<{ url: string; title: string; timestamp: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!session?.user?.id) return;

        const key = `resume_learning_${session.user.id}`;
        const data = localStorage.getItem(key);

        if (data) {
            try {
                const parsed = JSON.parse(data);
                // Only show if saved within last 30 days? Or just always.
                // Let's just show it.
                setSavedState(parsed);
                setIsVisible(true);
            } catch (e) {
                console.error("Failed to parse resume data", e);
            }
        }
    }, [session]);

    const handleResume = () => {
        if (savedState) {
            router.push(`${savedState.url}?resume=true`);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        if (session?.user?.id) {
            localStorage.removeItem(`resume_learning_${session.user.id}`);
        }
    };

    if (!isVisible || !savedState) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500 w-full max-w-md px-4">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl rounded-2xl p-4 flex items-center gap-4 ring-1 ring-indigo-500/20">
                <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                    <BookOpen size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-0.5">Resume Learning</p>
                    <h4 className="text-white font-bold truncate text-sm">{savedState.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pick up exactly where you left off</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDismiss}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Dismiss"
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={handleResume}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Resume
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
