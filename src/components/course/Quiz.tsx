'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
    explanation?: string;
}

interface QuizProps {
    courseId: string;
    lessonId: string;
    // Support for multiple questions
    questions?: Question[];
    // Support for single question (legacy/MDX direct usage)
    question?: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
}

export default function Quiz({ courseId, lessonId, questions: propQuestions, question, options, correctAnswer, explanation }: QuizProps) {
    // Normalize props into a single questions array
    const questions: Question[] = propQuestions || (question && options ? [{
        id: 1,
        text: question,
        options: options,
        correctAnswer: typeof correctAnswer === 'string' ? options.indexOf(correctAnswer) : (correctAnswer || 0),
        explanation: explanation
    }] : []);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const { markLessonComplete, isLessonComplete } = useProgress();

    if (questions.length === 0) {
        return <div className="p-4 text-red-500">Error: No questions provided for this quiz.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const isAlreadyComplete = isLessonComplete(courseId, lessonId);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            if (score + (isCorrect ? 0 : 0) >= questions.length * 0.7) { // Pass if 70% correct
                markLessonComplete(courseId, lessonId);
            }
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const passed = score >= questions.length * 0.7;
        return (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center my-8">
                <div className="mb-6 flex justify-center">
                    {passed ? (
                        <div className="w-20 h-20 bg-accent-success/10 rounded-full flex items-center justify-center text-accent-success">
                            <CheckCircle size={48} />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-accent-error/10 rounded-full flex items-center justify-center text-accent-error">
                            <XCircle size={48} />
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {passed ? 'Quiz Completed!' : 'Keep Practicing'}
                </h3>
                <p className="text-text-secondary mb-6">
                    You scored {score} out of {questions.length}
                </p>

                {passed ? (
                    <div className="p-4 bg-accent-success/10 border border-accent-success/20 rounded-lg text-accent-success mb-6">
                        Lesson Marked as Complete!
                    </div>
                ) : (
                    <button
                        onClick={handleRetry}
                        className="bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                        Retry Quiz
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden my-8">
            <div className="bg-bg-tertiary px-6 py-4 border-b border-border-primary flex justify-between items-center">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <HelpCircle size={20} className="text-accent-primary" />
                    Knowledge Check
                </h3>
                <span className="text-sm text-text-secondary">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
            </div>

            <div className="p-6">
                <h4 className="text-lg font-medium text-text-primary mb-6">
                    {currentQuestion.text}
                </h4>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let optionClass = "w-full text-left p-4 rounded-lg border border-border-primary transition-all ";

                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswer) {
                                optionClass += "bg-accent-success/10 border-accent-success text-accent-success";
                            } else if (index === selectedOption) {
                                optionClass += "bg-accent-error/10 border-accent-error text-accent-error";
                            } else {
                                optionClass += "opacity-50";
                            }
                        } else {
                            optionClass += "hover:bg-bg-tertiary hover:border-accent-primary/50 text-text-secondary";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                disabled={isAnswered}
                                className={optionClass}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isAnswered && index === currentQuestion.correctAnswer && (
                                        <CheckCircle size={20} />
                                    )}
                                    {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                        <XCircle size={20} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 pt-6 border-t border-border-primary animate-in fade-in slide-in-from-top-4">
                        <div className="mb-4">
                            <p className="font-medium text-text-primary mb-1">
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </p>
                            <p className="text-text-secondary text-sm">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                        <button
                            onClick={handleNext}
                            className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
