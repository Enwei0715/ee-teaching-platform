"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { askQuestion } from '@/lib/llm-service';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm your AI Tutor. I can help you understand this lesson better. Ask me anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isExpanded]);

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

    // Prevent horizontal swipe on mobile
    useEffect(() => {
        if (!isOpen) return;

        const preventDefault = (e: Event) => {
            // Prevent horizontal swipe gestures
            e.stopPropagation();
        };

        const chatWindow = document.querySelector('.ai-tutor-window');
        if (chatWindow) {
            chatWindow.addEventListener('touchstart', preventDefault, { passive: false });
            return () => chatWindow.removeEventListener('touchstart', preventDefault);
        }
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

            // Build context string
            let contextStr = "General context: The user is asking questions about electronics engineering.";
            if (lessonTitle || lessonContent) {
                contextStr = `The user is currently reading the lesson: "${lessonTitle || 'N/A'}".`;
                if (lessonContent) {
                    // Provide a summary of content (first 1500 chars)
                    const contentSummary = lessonContent.substring(0, 1500);
                    contextStr += `\n\nHere is the content of the lesson:\n${contentSummary}${lessonContent.length > 1500 ? '...' : ''}`;
                }
            }

            const reply = await askQuestion(chatHistory, contextStr, lessonContext);

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

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className={`ai-tutor-window bg-slate-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right touch-none 
                    ${isExpanded
                        ? 'fixed inset-4 bottom-24 z-[60] md:absolute md:inset-auto md:bottom-16 md:right-0 md:w-[600px] md:h-[700px]'
                        : 'fixed bottom-24 left-4 right-4 h-[60vh] z-[60] md:absolute md:inset-auto md:bottom-16 md:right-0 md:w-96 md:h-[500px]'
                    }`}>
                    {/* Header */}
                    <div className="bg-slate-900/50 border-b border-white/10 p-4 flex justify-between items-center text-white">
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
                                className="p-1 hover:bg-white/20 rounded transition-colors"
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

                    {/* Messages */}
                    {/* Messages */}
                    <div className="flex-1 relative min-h-0 bg-transparent">
                        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth">
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
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 bg-slate-800 border-transparent text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
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
        </div>
    );
}
