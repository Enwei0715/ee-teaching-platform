'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
    questions: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
        order: number;
    }>;
}

export default function Quiz({ questions }: QuizProps) {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
    const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

    if (!questions || questions.length === 0) return null;

    const handleAnswer = (questionId: string, answerIndex: number) => {
        if (submitted[questionId]) return; // Don't allow changing after submit
        setAnswers({ ...answers, [questionId]: answerIndex });
    };

    const handleSubmit = (questionId: string) => {
        setSubmitted({ ...submitted, [questionId]: true });
        setShowExplanation({ ...showExplanation, [questionId]: true });
    };

    return (
        <div className="my-12 space-y-8">
            <div className="border-t border-gray-800 pt-8">
                <h2 className="text-2xl font-bold text-white mb-2">📝 Practice Questions</h2>
                <p className="text-gray-400 mb-6">
                    Test your understanding of this lesson with these questions.
                </p>
            </div>

            {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isSubmitted = submitted[q.id];
                const isCorrect = isSubmitted && answers[q.id] === q.correctAnswer;

                return (
                    <div key={q.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                            </span>
                            <h3 className="text-lg font-medium text-white flex-1">
                                {q.question}
                            </h3>
                        </div>

                        <div className="space-y-3 ml-11">
                            {q.options.map((option, optionIdx) => {
                                const isSelected = answers[q.id] === optionIdx;
                                const isThisCorrect = optionIdx === q.correctAnswer;

                                let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";

                                if (!isSubmitted) {
                                    buttonClass += isSelected
                                        ? "bg-indigo-900/30 border-indigo-500 text-white"
                                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-750";
                                } else {
                                    if (isThisCorrect) {
                                        buttonClass += "bg-green-900/20 border-green-500 text-green-300";
                                    } else if (isSelected && !isThisCorrect) {
                                        buttonClass += "bg-red-900/20 border-red-500 text-red-300";
                                    } else {
                                        buttonClass += "bg-gray-800 border-gray-700 text-gray-400";
                                    }
                                }

                                return (
                                    <button
                                        key={optionIdx}
                                        onClick={() => handleAnswer(q.id, optionIdx)}
                                        disabled={isSubmitted}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {isSubmitted && (
                                                <>
                                                    {isThisCorrect && <CheckCircle size={20} className="text-green-400" />}
                                                    {isSelected && !isThisCorrect && <XCircle size={20} className="text-red-400" />}
                                                </>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {!isSubmitted && isAnswered && (
                            <button
                                onClick={() => handleSubmit(q.id)}
                                className="mt-4 ml-11 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Submit Answer
                            </button>
                        )}

                        {isSubmitted && (
                            <div className={`mt-4 ml-11 p-4 rounded-lg border ${isCorrect ? 'bg-green-900/10 border-green-800' : 'bg-red-900/10 border-red-800'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle size={20} className="text-green-400" />
                                            <span className="font-semibold text-green-300">Correct!</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={20} className="text-red-400" />
                                            <span className="font-semibold text-red-300">Incorrect</span>
                                        </>
                                    )}
                                </div>
                                {q.explanation && (
                                    <p className="text-gray-300 text-sm">{q.explanation}</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
