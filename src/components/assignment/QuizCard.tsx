"use client";

import React, { useState } from 'react';
import { Quiz } from '@/lib/llm-service';
import QuizChat from './QuizChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface QuizCardProps {
    quiz: Quiz;
    onVerify: (explanation: string) => void;
    onComplete?: () => void;
}

export default function QuizCard({ quiz, onVerify, onComplete }: QuizCardProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelect = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);
        setShowExplanation(true);
        onVerify(quiz.explanation);

        if (index === quiz.correctAnswer && onComplete) {
            onComplete();
        }
    };

    return (
        <div className="glass-panel border border-white/10 rounded-lg p-6 shadow-lg my-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Quiz Time!</h3>

            {/* Section Focus Badge */}
            {quiz.sectionTitle && quiz.sectionTitle !== "Full Lesson" && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30">
                    <span className="text-xs font-medium text-indigo-300">
                        📍 Focusing on: {quiz.sectionTitle}
                    </span>
                </div>
            )}

            <div className="text-text-primary mb-6 prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {quiz.question}
                </ReactMarkdown>
            </div>

            <div className="space-y-3">
                {quiz.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${selectedOption === index
                            ? index === quiz.correctAnswer
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : 'bg-red-500/20 border-red-400 text-red-300'
                            : selectedOption !== null && index === quiz.correctAnswer
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : 'border-white/20 hover:bg-white/5 text-text-primary hover:border-indigo-400/50'
                            }`}
                    >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        <div className="inline-block align-middle">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ children }) => <span className="m-0">{children}</span>
                                }}
                            >
                                {option}
                            </ReactMarkdown>
                        </div>
                    </button>
                ))}
            </div>

            {showExplanation && (
                <div className="mt-6 p-4 glass-panel border border-indigo-500/30 rounded-lg shadow-inner bg-slate-900/40">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        AI Explanation:
                    </h4>
                    <div className="text-sm text-gray-200 prose prose-sm prose-invert max-w-none leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {quiz.explanation}
                        </ReactMarkdown>
                    </div>
                    <p className="text-xs text-indigo-400/80 mt-3 italic border-t border-indigo-500/20 pt-2">
                        (Review this explanation carefully. Is it 100% correct?)
                    </p>

                    <QuizChat context={`Question: ${quiz.question}\nCorrect Answer: ${quiz.options[quiz.correctAnswer]}\nExplanation: ${quiz.explanation}`} />
                </div>
            )}
        </div>
    );
}
