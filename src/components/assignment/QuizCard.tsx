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
        <div className="glass-heavy border-2 border-indigo-400/30 rounded-lg p-5 shadow-2xl my-4">
            <h3 className="text-xl font-bold text-text-primary mb-3">Quiz Time!</h3>

            {/* Section Focus Badge */}
            {quiz.sectionTitle && quiz.sectionTitle !== "Full Lesson" && (
                <div className="mb-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 border border-indigo-400/50 shadow-lg">
                    <span className="text-xs font-semibold text-white flex items-center">
                        🎯 專注章節：
                        <span className="inline-block ml-1">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ children }) => <span className="inline">{children}</span>,
                                }}
                            >
                                {quiz.sectionTitle}
                            </ReactMarkdown>
                        </span>
                    </span>
                </div>
            )}

            <div className="text-text-primary mb-4 prose prose-invert prose-xl max-w-none">
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
                        className={`w-full text-left px-4 py-5 rounded-md border transition-colors flex items-center ${selectedOption === index
                            ? index === quiz.correctAnswer
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : 'bg-red-500/20 border-red-400 text-red-300'
                            : selectedOption !== null && index === quiz.correctAnswer
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : 'border-white/20 hover:bg-white/5 text-text-primary hover:border-indigo-400/50'
                            }`}
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selectedOption === index
                                ? index === quiz.correctAnswer
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-red-500 border-red-500 text-white'
                                : selectedOption !== null && index === quiz.correctAnswer
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-500 text-gray-400'
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1 prose prose-invert prose-base max-w-none" style={{ lineHeight: '1.75' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        p: ({ children }) => <p className="m-0 flex items-center" style={{ verticalAlign: 'middle' }}>{children}</p>
                                    }}
                                >
                                    {option}
                                </ReactMarkdown>
                            </div>
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
