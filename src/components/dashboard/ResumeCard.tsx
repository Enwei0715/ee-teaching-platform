'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight, X } from 'lucide-react';

interface ResumeCardProps {
    courseTitle: string;
    lessonTitle: string;
    resumeLink: string;
    status?: string;
    courseId?: string;
    lessonId?: string;
    onDismiss?: () => void;
}

export default function ResumeCard({ courseTitle, lessonTitle, resumeLink, status, courseId, lessonId, onDismiss }: ResumeCardProps) {
    const handleDismiss = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onDismiss) {
            onDismiss();
            return;
        }

        if (courseId && lessonId) {
            try {
                await fetch(`/api/courses/${courseId}/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lessonId,
                        completed: true // Force completion
                    }),
                });
                // Force a page refresh to update the list
                window.location.reload();
            } catch (error) {
                console.error("Failed to dismiss lesson", error);
            }
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center items-start gap-6 hover:shadow-lg hover:shadow-indigo-600/10 transition-all group relative">
            {/* Dismiss Button (Top Right) */}
            {status === 'REVIEWING' && (
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20 z-10"
                    title="Mark as Done (Dismiss)"
                >
                    <X size={16} />
                </button>
            )}

            {/* Top Section: Icon & Text */}
            <div className="flex items-start gap-4 w-full md:flex-1">
                {/* Icon */}
                <div className="p-3 bg-indigo-600/20 backdrop-blur-sm rounded-xl text-indigo-400 flex-shrink-0 mt-1">
                    <BookOpen size={28} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider">
                            Continue Learning
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg leading-tight">
                            {courseTitle}
                        </h3>
                        {/* Status Badge */}
                        {status === 'REVIEWING' ? (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 font-bold uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                                Reviewing
                            </span>
                        ) : (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 font-bold uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                                In Progress
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">
                        {lessonTitle}
                    </p>
                </div>
            </div>

            {/* Bottom Section: Actions */}
            <div className="w-full md:w-auto flex justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                <Link
                    href={resumeLink}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 w-full md:w-auto whitespace-nowrap"
                >
                    Resume
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
