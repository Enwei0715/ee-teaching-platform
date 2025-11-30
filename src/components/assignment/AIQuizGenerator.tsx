"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { generateQuiz, Quiz } from '@/lib/llm-service';
import QuizCard from './QuizCard';
import { useLessonProgress } from '@/context/LessonProgressContext';
import { calculateQuizXP } from '@/lib/xp';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Zap, Trophy } from 'lucide-react';

interface AIQuizGeneratorProps {
    courseId: string;
    lessonId: string;
    topic: string;
    context: string;
}

export default function AIQuizGenerator({ courseId, lessonId, topic, context }: AIQuizGeneratorProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { markAsComplete } = useLessonProgress();
    const containerRef = useRef<HTMLDivElement>(null);

    const potentialXP = calculateQuizXP();

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const newQuiz = await generateQuiz(courseId, lessonId);
            setQuiz(newQuiz);
        } catch (err) {
            setError("Failed to generate quiz. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Scroll to question when quiz is generated or loading starts
    useEffect(() => {
        if (loading || (quiz && !loading)) {
            // Use setTimeout to ensure DOM update finishes and override default browser scroll
            setTimeout(() => {
                containerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }, [quiz, loading]);

    const handleVerify = (explanation: string) => {
        // Placeholder for future verification logic
        console.log("Verified:", explanation);
    };

    const handleComplete = async () => {
        // Mark lesson as complete with 'quiz' source
        console.log("🏆 [AIQuizGenerator] Quiz Completed! Awarding XP...");
        const result = await markAsComplete('quiz');

        if (result?.gamification?.xpGained > 0) {
            // Trigger Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#EAB308', '#A855F7', '#3B82F6']
            });

            toast.success(
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Quiz Completed!</span>
                    <span className="flex items-center gap-1 text-sm">
                        <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                        You earned {result.gamification.xpGained} XP
                    </span>
                </div>
            );
        } else {
            toast.success('Quiz Completed!', {
                icon: <Trophy size={18} className="text-yellow-500" />,
            });
        }
    };

    return (
        <div ref={containerRef}>
            {!quiz ? (
                <div className="flex flex-col justify-center flex-1 items-center text-center p-4">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Generate AI Quiz
                            </>
                        )}
                    </button>
                    <p className="text-gray-500 mt-4 max-w-sm">
                        Ready to check your understanding? Generate a personalized quiz based on this lesson using AI.
                        <br />
                        <span className="text-yellow-500 font-medium text-sm mt-2 inline-block">Complete this to earn +{potentialXP} XP!</span>
                    </p>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 h-full min-h-[300px]">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-indigo-600 font-medium">Generating new question...</p>
                        </div>
                    ) : (
                        <>
                            <QuizCard quiz={quiz} onVerify={handleVerify} onComplete={handleComplete} />
                            <div className="text-center mt-6">
                                <button
                                    onClick={handleGenerate}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 mx-auto"
                                >
                                    <Sparkles size={16} />
                                    Generate Another Question
                                </button>
                                {quiz.model && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        Generated by {quiz.model}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-center text-red-500 mt-4 text-sm">{error}</p>
            )}
        </div>
    );
}
