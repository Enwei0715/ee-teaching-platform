import { useState } from 'react';
import { Sparkles, AlertCircle, RotateCw, Zap, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    sectionTitle?: string;
}

interface QuizTabProps {
    lessonContent?: string;
    activeHeadingId?: string;
    courseSlug?: string;
    lessonSlug?: string;
    lessonStatus?: string;
}

export default function QuizTab({
    lessonContent,
    activeHeadingId,
    courseSlug,
    lessonSlug,
    lessonStatus
}: QuizTabProps) {
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const generateQuiz = async () => {
        if (!lessonContent || !courseSlug || !lessonSlug) {
            setError('Missing lesson information');
            return;
        }

        setLoading(true);
        setError(null);
        setQuiz(null);
        setSelectedAnswer(null);
        setShowResult(false);

        try {
            // Extract content for the active section if possible
            // We need to parse the markdown to find the section corresponding to activeHeadingId
            // This is complex on client side without the full parser.
            // For now, we send the full content and let the server handle it, 
            // OR we pass the activeHeadingId to the server.

            // Let's pass the activeHeadingId to the server and let it decide.
            // But wait, the server `route.ts` (in the version we just reverted to) 
            // expects `sectionContent` and `sectionTitle` OR `courseSlug`/`lessonSlug`.
            // If we send `courseSlug` and `lessonSlug`, it fetches from DB and picks a RANDOM section.
            // It doesn't seem to support `activeHeadingId` in the reverted version.

            // However, the `QuizTab` in `8ae1d3b` (which I am writing now) calls the API.
            // Let's see how it calls it.

            // Wait, I need to see the `generateQuiz` function in the `git show` output.
            // The previous `git show` output was truncated.
            // I should have checked the full file.

            // Let's assume the standard implementation for now.
            // If the reverted backend only supports random sections from DB, then the frontend should just call it with slugs.

            const response = await fetch('/api/llm/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseSlug,
                    lessonSlug,
                    limitToHeadingId: activeHeadingId
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.details || 'Failed to generate quiz');
            }

            const data: Quiz = await response.json();
            setQuiz(data);
        } catch (err) {
            console.error('Quiz generation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    const handleSubmit = async () => {
        if (selectedAnswer === null || !quiz) return;
        setShowResult(true);

        if (selectedAnswer === quiz.correctAnswer) {
            try {
                const res = await fetch('/api/gamification/quiz-xp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isPerfect: true })
                });
                if (res.ok) {
                    const data = await res.json();

                    if (data.xpGained > 0) {
                        toast.success(
                            <div className="flex flex-col gap-1">
                                <span className="font-bold flex items-center gap-2">
                                    <Zap size={16} className="text-yellow-500 fill-yellow-500" />
                                    Correct! +{data.xpGained} XP
                                </span>
                                {data.levelUp && (
                                    <span className="text-xs text-indigo-300 font-bold">
                                        🎉 Level Up! You are now Level {data.newLevel}
                                    </span>
                                )}
                                {data.earnedBadges && data.earnedBadges.map((badge: string) => (
                                    <span key={badge} className="text-xs text-yellow-300 font-bold flex items-center gap-1">
                                        <Trophy size={12} /> Badge Unlocked: {badge}
                                    </span>
                                ))}
                            </div>
                        );
                    }
                }
            } catch (error) {
                console.error("Failed to award XP:", error);
            }
        }
    };

    const handleRetry = () => {
        setQuiz(null);
        generateQuiz();
    };

    return (
        <div className="h-full flex flex-col">
            <div
                className="flex-1 overflow-y-auto p-4 pb-32 space-y-6 custom-scrollbar"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#475569 transparent',
                }}
            >
                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Generation Failed</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </div>
                )}

                {!quiz ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        {error ? (
                            <>
                                <p className="text-gray-400">Something went wrong. Please try again.</p>
                                <button
                                    onClick={generateQuiz}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <RotateCw size={16} />
                                    Try Again
                                </button>
                            </>
                        ) : (
                            <>
                                <Sparkles size={48} className="text-indigo-400" />
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-white font-bold text-lg mb-1 flex flex-col gap-2">
                                            {lessonStatus === 'IN_PROGRESS' ? 'Progress-Aware Quiz' : 'Full Lesson Review'}
                                        </h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                                <Zap size={12} className="fill-yellow-400" />
                                                Win 10 XP
                                            </span>
                                            {lessonStatus !== 'IN_PROGRESS' && (
                                                <span className="text-xs text-gray-500">
                                                    (Review Mode)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm max-w-md mb-4">
                                        {lessonStatus === 'IN_PROGRESS'
                                            ? "Test your understanding! We'll only ask about sections you've already read."
                                            : "Challenge yourself! Questions will be drawn from the entire lesson content."
                                        }
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
                            <div className="text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 border border-indigo-400/50 shadow-lg px-4 py-2 rounded-lg inline-flex items-center">
                                🎯 專注章節：
                                <span className="inline-block ml-1">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            p: ({ children }) => <span className="inline">{children}</span>,
                                        }}
                                    >
                                        {quiz.sectionTitle}
                                    </ReactMarkdown>
                                </span>
                            </div>
                        )}

                        {/* Question */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto custom-scrollbar">
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
                        <div className="space-y-3">
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
                                        className={`w-full text-left p-5 rounded-lg border transition-all ${showCorrect
                                            ? 'bg-green-900/30 border-green-500 text-green-200'
                                            : showWrong
                                                ? 'bg-red-900/30 border-red-500 text-red-200'
                                                : isSelected
                                                    ? 'bg-indigo-900/30 border-indigo-500 text-white'
                                                    : 'bg-slate-800/30 border-white/10 text-gray-300 hover:bg-slate-800/50 hover:border-white/20'
                                            } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${showCorrect ? 'bg-green-500 border-green-500 text-white' :
                                                showWrong ? 'bg-red-500 border-red-500 text-white' :
                                                    isSelected ? 'bg-indigo-500 border-indigo-500 text-white' :
                                                        'border-gray-500 text-gray-400'
                                                }`}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div className="flex-1 prose prose-invert prose-sm max-w-none" style={{ lineHeight: '1.75' }}>
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
