"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { askQuestion } from '@/lib/llm-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function AITutorPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm your dedicated AI Tutor. I'm here to help you master Electronic Engineering. What would you like to learn today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

            const reply = await askQuestion(chatHistory, "General context: The user is in a dedicated AI Tutor session for learning electronics engineering.");

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">AI Personal Tutor</h1>
                        <p className="text-sm text-gray-500">Your 24/7 learning companion</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-indigo-600 text-white'
                                        }`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div
                                        className={`p-4 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-none prose prose-sm max-w-none'
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
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything about electronics..."
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                            >
                                <Send size={18} />
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
