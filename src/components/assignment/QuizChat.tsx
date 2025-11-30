"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { askQuestion, ChatMessage } from '@/lib/llm-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizChatProps {
    context: string;
}

export default function QuizChat({ context }: QuizChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const newMessages = [...messages, userMessage];
            const reply = await askQuestion(newMessages, context);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't answer that right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskTutor = () => {
        const question = input.trim();
        const fullQuery = `I have a question about this quiz:\n\n${context}\n\nMy Question: ${question}`;

        // Dispatch event to open AI Tutor and switch to assistant tab
        const event = new CustomEvent('open-ai-tutor', {
            detail: {
                text: fullQuery,
                switchToTab: 'chat'  // Switch to assistant/chat tab
            }
        });
        window.dispatchEvent(event);

        setInput('');
    };

    return (
        <div className="mt-6 border-t border-indigo-500/20 pt-6 w-full">
            <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Bot size={16} className="text-indigo-400" />
                Ask a follow-up question
            </h4>

            <div
                ref={chatContainerRef}
                className="bg-slate-950/50 rounded-lg border border-indigo-500/20 p-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center italic">
                        Have doubts? Ask the AI tutor about this problem.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`text-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-md max-w-[90%] break-words' : 'bg-slate-800/80 border border-indigo-500/20 text-gray-200 prose prose-sm prose-invert max-w-none shadow-sm flex-1'}`}>
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
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-slate-800/80 border border-indigo-500/20 p-3 rounded-lg shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 w-full">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Why is option B incorrect?"
                    className="w-full min-h-[80px] text-sm border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 bg-slate-900/60 placeholder-gray-500 resize-y"
                    disabled={loading}
                />
                <div className="flex justify-between items-center gap-2">
                    <button
                        onClick={handleAskTutor}
                        className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
                        title="Open in main AI Tutor for more help"
                    >
                        <Bot size={14} />
                        Ask AI Tutor
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2 font-medium text-sm"
                    >
                        <span>Send</span>
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
