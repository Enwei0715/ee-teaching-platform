"use client";

import React, { useState } from 'react';
import { Sparkles, RotateCw } from 'lucide-react';
import { extractHeaders, getReadHeaders, getSectionContent } from '@/lib/markdown-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizTabProps {
    lessonContent?: string;
    activeHeadingId?: string;
    courseSlug?: string;
    lessonSlug?: string;
}

interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    sectionTitle?: string;
}

export default function QuizTab({ lessonContent, activeHeadingId, courseSlug, lessonSlug }: QuizTabProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateQuiz = async () => {
        if (!lessonContent || !courseSlug || !lessonSlug) {
            setError('Missing lesson information');
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedAnswer(null);
        setShowResult(false);

        try {
            // Extract headers and determine read scope
            const headers = extractHeaders(lessonContent);
            const readHeaders = getReadHeaders(headers, activeHeadingId);

            if (readHeaders.length === 0) {
                setError('No content available to quiz on yet');
                setLoading(false);
                return;
            }

            // Randomly select a header from read content
            const randomIndex = Math.floor(Math.random() * readHeaders.length);
            const selectedHeader = readHeaders[randomIndex];
            const sectionContent = getSectionContent(lessonContent, headers, headers.indexOf(selectedHeader));

            // Call quiz API with specific section
            const response = await fetch('/api/llm/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseSlug,
                    lessonSlug,
                    sectionContent,
                    sectionTitle: selectedHeader.text
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate quiz');
            }

            const data: Quiz = await response.json();
            setQuiz(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (!showResult) {
            setSelectedAnswer(index);
        }
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            setShowResult(true);
        }
    };

    const handleRetry = () => {
        setQuiz(null);
        setSelectedAnswer(null);
        setShowResult(false);
        setError(null);
    };

    return (
        <div className="flex-1 relative min-h-0 bg-transparent">
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
                {!quiz ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                        {error ? (
                            <>
                                <div className="text-red-400 text-sm mb-2">{error}</div>
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <RotateCw size={18} />
                                    Try Again
                                </button>
                            </>
                        ) : (
                            <>
                                <Sparkles size={48} className="text-indigo-400" />
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-2">Progress-Aware Quiz</h3>
                                    <p className="text-gray-400 text-sm max-w-md">
                                        Test your understanding! We'll only ask about sections you've already read.
                                    </p>
                                </div>
                                <button
                                    onClick={generateQuiz}
                                    disabled={loading}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            Generate Quiz
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Section Info */}
                        {quiz.sectionTitle && (
                            <div className="text-xs text-indigo-400 bg-indigo-900/30 px-3 py-1.5 rounded-lg inline-block">
                                📖 Topic: {quiz.sectionTitle}
                            </div>
                        )}

                        {/* Question */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {quiz.question}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            {quiz.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === quiz.correctAnswer;
                                const showCorrect = showResult && isCorrect;
                                const showWrong = showResult && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={showResult}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${showCorrect
                                                ? 'bg-green-900/30 border-green-500 text-green-200'
                                                : showWrong
                                                    ? 'bg-red-900/30 border-red-500 text-red-200'
                                                    : isSelected
                                                        ? 'bg-indigo-900/30 border-indigo-500 text-white'
                                                        : 'bg-slate-800/30 border-white/10 text-gray-300 hover:bg-slate-800/50 hover:border-white/20'
                                            } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${showCorrect ? 'bg-green-500 border-green-500 text-white' :
                                                    showWrong ? 'bg-red-500 border-red-500 text-white' :
                                                        isSelected ? 'bg-indigo-500 border-indigo-500 text-white' :
                                                            'border-gray-500'
                                                }`}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div className="flex-1 prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm, remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                >
                                                    {option}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        {!showResult ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null}
                                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <>
                                {/* Explanation */}
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                                    <h4 className="text-blue-300 font-bold text-sm mb-2">💡 Explanation</h4>
                                    <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {quiz.explanation}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* New Question Button */}
                                <button
                                    onClick={handleRetry}
                                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <RotateCw size={18} />
                                    New Question
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
