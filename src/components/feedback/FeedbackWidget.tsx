'use client';
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FeedbackForm } from './FeedbackForm';

export default function FeedbackWidget({ hideTrigger = false }: { hideTrigger?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-feedback', handleOpen);
        return () => window.removeEventListener('open-feedback', handleOpen);
    }, []);

    const pathname = usePathname();
    const isLessonPage = pathname?.startsWith('/courses/') && pathname?.split('/').length > 3;

    return (
        <div id="feedback-widget" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="origin-bottom-right"
                    >
                        <FeedbackForm onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-full shadow-lg backdrop-blur-md border border-white/10 transition-all ${isOpen
                    ? 'bg-red-500/80 hover:bg-red-600/80 text-white rotate-45'
                    : 'bg-blue-600/80 hover:bg-blue-700/80 text-white'
                    } ${isLessonPage ? 'hidden' : ''} ${hideTrigger ? 'md:hidden' : ''}`}
            >
                <MessageSquarePlus size={24} />
            </motion.button>
        </div>
    );
}
