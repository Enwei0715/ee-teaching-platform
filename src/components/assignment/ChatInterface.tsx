"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { askQuestion, generateQuiz, ChatMessage, Quiz } from '@/lib/llm-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import QuizCard from './QuizCard';

interface ChatInterfaceProps {
    onQuizExplanation: (explanation: string) => void;
}

export default function ChatInterface({ onQuizExplanation }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, quiz]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const newMessages = [...messages, userMessage];
            const reply = await askQuestion(newMessages, 'EE Assignment Discussion');
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't answer that right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setLoading(true);
        try {
            const generatedQuiz = await generateQuiz('Op-Amp Circuits and Input Impedance');
            setQuiz(generatedQuiz);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't generate a quiz right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = (explanation: string) => {
        onQuizExplanation(explanation);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Bot size={20} className="text-indigo-600" />
                    AI Tutor
                </h2>
                <p className="text-xs text-gray-600 mt-1">Ask questions or generate a quiz to test yourself</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !quiz ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-4 mb-4">
                            <Bot size={32} className="text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to AI Tutor!</h3>
                        <p className="text-sm text-gray-600 max-w-sm mb-6">
                            Ask me anything about the assignment, or generate a quiz to test your understanding.
                        </p>
                        <button
                            onClick={handleGenerateQuiz}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles size={16} />
                            Generate Quiz
                        </button>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`text-sm p-3 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 prose prose-sm max-w-none'}`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {quiz && (
                            <QuizCard
                                quiz={quiz}
                                onVerify={handleVerify}
                                onComplete={() => setQuiz(null)}
                            />
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question about the assignment..."
                        className="flex-1 text-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
                {!quiz && messages.length > 0 && (
                    <button
                        onClick={handleGenerateQuiz}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={16} />
                        Generate Quiz
                    </button>
                )}
            </div>
        </div>
    );
}
