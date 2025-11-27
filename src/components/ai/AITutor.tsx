"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { askQuestion } from '@/lib/llm-service';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Rnd } from 'react-rnd';

interface LessonContext {
    courseTitle: string;
    lessonTitle: string;
    content: string;
}

interface AITutorProps {
    lessonTitle?: string;
    lessonContent?: string;
    lessonContext?: LessonContext;
}

export default function AITutor({ lessonTitle, lessonContent, lessonContext }: AITutorProps = {}) {
    console.log("AITutor Rendered. Context:", lessonContext ? "YES" : "NO", lessonContext?.lessonTitle);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm your AI Tutor. I can help you understand this lesson better. Ask me anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    // Moved up to avoid conditional hook execution error
    const [rndDefaults, setRndDefaults] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

    useEffect(() => {
        // Initialize Rnd position on client side only
        // Align with bottom-right button (right-6 = 24px, button height ~56px)
        const width = 380;
        const height = 500;
        const rightMargin = 24;
        const bottomMargin = 90; // 24px margin + 56px button + 10px gap

        setRndDefaults({
            x: window.innerWidth - width - rightMargin,
            y: window.innerHeight - height - bottomMargin,
            width,
            height,
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isExpanded]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleOpen = (e?: any) => {
            setIsOpen(true);
            // If event has detail with text, populate input
            if (e?.detail?.text) {
                setInput(e.detail.text);
            }
        };
        window.addEventListener('open-ai-tutor', handleOpen);
        return () => window.removeEventListener('open-ai-tutor', handleOpen);
    }, []);

    // Prevent horizontal swipe on mobile and lock body scroll
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = 'unset';
            return;
        }

        // Only lock scroll on mobile
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }

        const preventDefault = (e: Event) => {
            // Prevent horizontal swipe gestures
            e.stopPropagation();
        };

        const chatWindow = document.querySelector('.ai-tutor-window');
        if (chatWindow && isMobile) {
            chatWindow.addEventListener('touchstart', preventDefault, { passive: false });
            return () => {
                chatWindow.removeEventListener('touchstart', preventDefault);
                document.body.style.overflow = 'unset';
            };
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isMobile]);

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

            // Use lessonContext directly - the API will use the full lesson content
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

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        // Stop global listeners from seeing this event
        e.nativeEvent.stopImmediatePropagation();

        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Manual newline insertion
                e.preventDefault();
                const textarea = e.currentTarget;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                const newValue = value.substring(0, start) + "\n" + value.substring(end);
                setInput(newValue);

                // Restore cursor position after state update
                requestAnimationFrame(() => {
                    if (textareaRef.current) {
                        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
                        // Trigger auto-resize
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
                    }
                });
            } else {
                // Send message
                e.preventDefault();
                handleSend(e as any);
            }
        }
    };

    if (!session) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => window.location.href = '/auth/signin'}
                    className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-gray-800 text-white hover:bg-gray-700 transition-all transform hover:scale-105"
                    title="Login to use AI Tutor"
                >
                    <Bot size={24} />
                </button>
            </div>
        );
    }

    const renderChatContent = () => (
        <div className={`ai-tutor-window bg-slate-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col w-full h-full ${isMobile ? 'animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right' : ''}`}>
            {/* Header */}
            <div className={`ai-tutor-header bg-slate-900/50 border-b border-white/10 p-4 flex justify-between items-center text-white ${!isMobile ? 'cursor-move' : ''}`}>
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
                    {isMobile && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title={isExpanded ? "Minimize" : "Expand"}
                        >
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 relative min-h-0 bg-transparent">
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth custom-scrollbar">
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
                        placeholder="Ask a question... (Shift+Enter for new line)"
                        className="flex-1 bg-slate-800 border-transparent text-white placeholder-gray-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none min-h-[44px] max-h-[120px] custom-scrollbar"
                        disabled={loading}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        style={{ height: 'auto', minHeight: '44px' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                            }}
                    style={{ zIndex: 60, position: 'fixed' }}
                        >
                    {renderChatContent()}
                </Rnd>
                )
                )
            )}

                <div className="fixed bottom-6 right-6 z-50">
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
                </div>
            </>
            );
}
