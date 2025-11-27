'use client';

import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface ExerciseProps {
    challenge: string;
    solution: string;
}

export function Exercise({ challenge, solution }: ExerciseProps) {
    const [showSolution, setShowSolution] = useState(false);

    return (
        <div className="my-8 border border-accent-primary/30 rounded-lg overflow-hidden bg-bg-secondary/50">
            {/* Challenge Section */}
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle size={18} className="text-accent-primary" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-text-primary text-lg mb-3">練習題</h4>
                        <p className="text-text-secondary leading-relaxed">{challenge}</p>
                    </div>
                </div>
            </div>

            {/* Solution Toggle */}
            <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Lightbulb size={18} className="text-accent-success" />
                    <span className="font-semibold text-text-primary">
                        {showSolution ? '隱藏解答' : '顯示解答'}
                    </span>
                </div>
                {showSolution ? (
                    <ChevronUp size={20} className="text-text-secondary" />
                ) : (
                    <ChevronDown size={20} className="text-text-secondary" />
                )}
            </button>

            {/* Solution Content */}
            {showSolution && (
                <div className="px-6 pb-6 pt-2 bg-accent-success/5 border-t border-border-primary">
                    <p className="text-text-secondary leading-relaxed">{solution}</p>
                </div>
            )}
        </div>
    );
}
