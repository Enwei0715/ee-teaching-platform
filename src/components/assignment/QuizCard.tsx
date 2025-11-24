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
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm my-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Time!</h3>
            <div className="text-gray-800 mb-6 prose prose-lg max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
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
                                ? 'bg-green-50 border-green-500 text-green-900'
                                : 'bg-red-50 border-red-500 text-red-900'
                            : selectedOption !== null && index === quiz.correctAnswer
                                ? 'bg-green-50 border-green-500 text-green-900'
                                : 'border-gray-300 hover:bg-gray-50 text-gray-900'
                            }`}
                    >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        <div className="inline-block align-middle">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
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
                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">AI Explanation:</h4>
                    <div className="text-sm text-gray-900 prose prose-sm max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {quiz.explanation}
                        </ReactMarkdown>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 italic">
                        (Review this explanation carefully. Is it 100% correct?)
                    </p>

                    <QuizChat context={`Question: ${quiz.question}\nCorrect Answer: ${quiz.options[quiz.correctAnswer]}\nExplanation: ${quiz.explanation}`} />
                </div>
            )}
        </div>
    );
}
