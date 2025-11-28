'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface ResumeCardProps {
    courseTitle: string;
    lessonTitle: string;
    resumeLink: string;
}

export default function ResumeCard({ courseTitle, lessonTitle, resumeLink }: ResumeCardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg hover:shadow-indigo-600/10 transition-all">
            {/* Icon */}
            <div className="p-3 bg-indigo-600/20 backdrop-blur-sm rounded-xl text-indigo-400 flex-shrink-0">
                <BookOpen size={28} />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-1">
                    Continue Learning
                </p>
                <h3 className="text-white font-bold text-lg mb-0.5 truncate">
                    {courseTitle}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                    {lessonTitle}
                </p>
            </div>

            {/* Resume Button */}
            <Link
                href={resumeLink}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex-shrink-0"
            >
                Resume
                <ArrowRight size={18} />
            </Link>
        </div>
    );
}
