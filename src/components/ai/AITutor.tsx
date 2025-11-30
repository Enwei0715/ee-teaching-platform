"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Send, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { askQuestion } from '@/lib/llm-service';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import QuizTab from './QuizTab';

interface LessonContext {
    courseTitle: string;
    lessonTitle: string;
    content: string;
}

interface AITutorProps {
    lessonTitle?: string;
    lessonContent?: string;
    lessonContext?: LessonContext;
    activeHeadingId?: string;  // For progress-aware quiz
    courseSlug?: string;
    lessonSlug?: string;
    lessonStatus?: string; // Add lessonStatus prop
}

export default function AITutor({ lessonTitle, lessonContent, lessonContext, activeHeadingId, courseSlug, lessonSlug, lessonStatus }: AITutorProps = {}) {
    console.log("AITutor Rendered. Context:", lessonContext ? "YES" : "NO", lessonContext?.lessonTitle);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm your AI Tutor. I can help you understand this lesson better. Ask me anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Debug: Log active heading
    useEffect(() => {
        if (activeHeadingId) {
            const element = document.getElementById(activeHeadingId);
            const text = element?.innerText || "Element not found";
            console.log(`[AITutor] Active Heading: "${activeHeadingId}"`, { text });
        }
    }, [activeHeadingId]);

    // Listen for "Ask AI" button from TextSelectionToolbar
    useEffect(() => {
        const handleOpen = (e: any) => {
            setIsOpen(true);
            // If event has detail with text, populate input
            if (e?.detail?.text) {
                setInput(e.detail.text);
            }
        };
        window.addEventListener('open-ai-tutor', handleOpen);
        return () => window.removeEventListener('open-ai-tutor', handleOpen);
    }, []);

    // Strict body scroll lock on mobile (prevents background shift when keyboard appears)
    useEffect(() => {
        // Only apply on mobile when open
        if (!isOpen || window.innerWidth >= 768) {
            return;
        }

        // 1. Capture current scroll position
        const scrollY = window.scrollY;

        // 2. Freeze body using position:fixed with offset
        // This completely detaches the page from scrolling
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        // 3. Cleanup - restore scroll position
        return () => {
            const bodyTop = document.body.style.top;

            // Reset all styles
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';

            // Restore original scroll position
            window.scrollTo(0, parseInt(bodyTop || '0') * -1);
        };
    }, [isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        const newUserMsg: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: userMessage };

        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setLoading(true);

        try {
            const chatHistory = [...messages, newUserMsg].map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }));

            const reply = await askQuestion(chatHistory, lessonContext);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: reply
            }]);
        } catch (error) {
            console.error("Failed to get AI response:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting to the server right now. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow default behavior for Shift+Enter (newline)
                return;
            } else {
                // Send message on Enter
                e.preventDefault();
                handleSend(e as any);
            }
        }
    };

    if (!mounted) return null;

    if (!session) {
        return createPortal(
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => window.location.href = '/auth/signin'}
                    className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-gray-800 text-white hover:bg-gray-700 transition-all transform hover:scale-105"
                    title="Login to use AI Tutor"
                >
                    <Bot size={24} />
                </button>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[200]">
            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`ai-tutor-window bg-slate-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right touch-none 
                    ${isExpanded
                        ? 'fixed inset-4 bottom-24 z-[100] md:absolute md:inset-auto md:bottom-16 md:right-0 w-[95vw] md:w-[600px] h-[70vh] md:h-[700px]'
                        : 'fixed bottom-4 right-4 z-[100] md:absolute md:inset-auto md:bottom-16 md:right-0 w-[95vw] md:w-[450px] max-w-[calc(100vw-1rem)] h-[70dvh] md:h-[600px] md:max-h-[85vh]'
                    }`}>
                    {/* Header */}
                    <div className="bg-slate-900/50 border-b border-white/10 px-4 pt-4 flex justify-between items-start text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/10 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AI Tutor</h3>
                                <p className="text-xs text-gray-400">Always here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="hidden md:block p-1 hover:bg-white/20 rounded transition-colors"
                                title={isExpanded ? "Minimize" : "Expand"}
                            >
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-slate-900/30 border-b border-white/5 px-4 py-2 flex gap-2">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'chat'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Assistant
                        </button>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'quiz'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Quiz
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'chat' ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 relative min-h-0 bg-transparent">
                                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 pb-20 space-y-4 scroll-smooth overscroll-contain custom-scrollbar">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-none break-words [overflow-wrap:anywhere]'
                                                    : 'bg-slate-800 border border-white/10 text-gray-100 rounded-bl-none shadow-sm prose prose-invert prose-sm max-w-none'
                                                    }`}
                                            >
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
                                        <div className="flex justify-start">
                                            <div className="bg-slate-800 border border-white/10 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-3 bg-slate-900/50 border-t border-white/10">
                                <div className="flex gap-2 items-end">
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a question... (Shift+Enter for new line)"
                                        className="flex-1 bg-slate-800 border-transparent text-white placeholder-gray-400 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none min-h-[80px] max-h-[120px] custom-scrollbar"
                                        disabled={loading}
                                        rows={3}
                                        style={{ height: 'auto' }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        className="shrink-0 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <QuizTab
                            lessonContent={lessonContent}
                            // Only pass activeHeadingId if lesson is IN_PROGRESS
                            activeHeadingId={lessonStatus === 'IN_PROGRESS' ? activeHeadingId : undefined}
                            courseSlug={courseSlug}
                            lessonSlug={lessonSlug}
                        />
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all transform hover:scale-105 ${isOpen
                    ? 'bg-gray-800 text-white rotate-90'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>,
        document.body
    );
}
