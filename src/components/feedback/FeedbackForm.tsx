'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Camera, Loader2, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FeedbackFormProps {
    onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'other';

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
    const [type, setType] = useState<FeedbackType>('bug');
    const [message, setMessage] = useState('');
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCapture = async () => {
        setIsCapturing(true);
        try {
            const canvas = await html2canvas(document.body, {
                x: window.scrollX,
                y: window.scrollY,
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: 0,
                scrollY: 0,
                useCORS: true,
                ignoreElements: (element) => element.id === 'feedback-widget'
            });
            const image = canvas.toDataURL('image/png');
            setScreenshot(image);
        } catch (error) {
            console.error('Screenshot failed:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    message,
                    screenshot,
                    pageUrl: window.location.href
                }),
            });

            if (!res.ok) throw new Error('Failed to submit');

            toast.success('Thanks for your feedback!');
            onClose();
        } catch (error) {
            console.error('Feedback error:', error);
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-white font-semibold">Send Feedback</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Type Selection */}
                <div className="flex gap-2">
                    {(['bug', 'feature', 'other'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize border",
                                type === t
                                    ? "bg-blue-600 border-blue-500 text-white"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Message */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the issue or idea..."
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    required
                />

                {/* Screenshot Preview */}
                {screenshot ? (
                    <div className="relative group rounded-lg overflow-hidden border border-white/10">
                        <img src={screenshot} alt="Screenshot" className="w-full h-auto object-cover" />
                        <button
                            type="button"
                            onClick={() => setScreenshot(null)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleCapture}
                        disabled={isCapturing}
                        className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
                    >
                        {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                        <span>Capture Screenshot</span>
                    </button>
                )}
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !message.trim()}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>Submit Feedback</span>
                </button>
            </div>
        </div>
    );
};
