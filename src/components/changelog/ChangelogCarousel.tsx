'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChangelogEntry } from '@/lib/changelog-parser';
import { ChangelogCard } from './ChangelogCard';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface ChangelogCarouselProps {
    entries: ChangelogEntry[];
}

export const ChangelogCarousel: React.FC<ChangelogCarouselProps> = ({ entries }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle Resize for RWD
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isMobile) {
                if (e.key === 'ArrowUp') {
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                } else if (e.key === 'ArrowDown') {
                    setActiveIndex((prev) => Math.min(entries.length - 1, prev + 1));
                }
            } else {
                if (e.key === 'ArrowLeft') {
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                } else if (e.key === 'ArrowRight') {
                    setActiveIndex((prev) => Math.min(entries.length - 1, prev + 1));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [entries.length, isMobile]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const threshold = 50;
        const offset = isMobile ? info.offset.y : info.offset.x;

        if (offset > threshold && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        } else if (offset < -threshold && activeIndex < entries.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const getCardStyle = (index: number) => {
        const distance = index - activeIndex;
        const absDistance = Math.abs(distance);

        // Only show 2 cards on each side (5 total)
        if (absDistance > 2) return { display: 'none' };

        const isActive = distance === 0;
        const scale = isActive ? 1 : 1 - absDistance * 0.1;
        const opacity = isActive ? 1 : 0.7 - absDistance * 0.15;
        const zIndex = 10 - absDistance;

        let x = '0%';
        let y = '0%';
        let rotateX = '0deg';
        let rotateY = '0deg';

        if (isMobile) {
            // Vertical Layout
            y = `${distance * 55}%`;
            rotateX = `${distance * 25}deg`; // Rotate along X axis for vertical stack
        } else {
            // Horizontal Layout
            x = `${distance * 55}%`;
            rotateY = `${distance * -25}deg`;
        }

        return {
            scale,
            opacity,
            zIndex,
            x,
            y,
            rotateX,
            rotateY,
        };
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
            {/* Navigation Buttons */}
            <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className={`absolute z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed transition-all ${isMobile ? 'top-4 left-1/2 -translate-x-1/2 rotate-0' : 'left-4 md:left-12 top-1/2 -translate-y-1/2'
                    }`}
            >
                {isMobile ? <ChevronUp className="w-8 h-8 text-white" /> : <ChevronLeft className="w-8 h-8 text-white" />}
            </button>

            <button
                onClick={() => setActiveIndex(Math.min(entries.length - 1, activeIndex + 1))}
                disabled={activeIndex === entries.length - 1}
                className={`absolute z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed transition-all ${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2 rotate-0' : 'right-4 md:right-12 top-1/2 -translate-y-1/2'
                    }`}
            >
                {isMobile ? <ChevronDown className="w-8 h-8 text-white" /> : <ChevronRight className="w-8 h-8 text-white" />}
            </button>

            {/* Carousel Container */}
            <div
                ref={containerRef}
                className="relative w-full max-w-4xl h-full flex items-center justify-center"
                style={{ perspective: '1000px' }}
            >
                {entries.map((entry, index) => {
                    const style = getCardStyle(index);
                    if (style.display === 'none') return null;

                    return (
                        <motion.div
                            key={entry.version}
                            className={`absolute cursor-grab active:cursor-grabbing ${isMobile ? 'w-[85%] h-[400px]' : 'w-[90%] md:w-[600px] h-[500px]'
                                }`}
                            initial={false}
                            animate={{
                                scale: style.scale,
                                opacity: style.opacity,
                                zIndex: style.zIndex,
                                x: style.x,
                                y: style.y,
                                rotateX: style.rotateX,
                                rotateY: style.rotateY,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            drag={isMobile ? "y" : "x"}
                            dragConstraints={isMobile ? { top: 0, bottom: 0 } : { left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={handleDragEnd}
                            whileTap={{ cursor: "grabbing" }}
                        >
                            <ChangelogCard entry={entry} isActive={index === activeIndex} />
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Dots (Hidden on mobile to save space, or moved) */}
            {!isMobile && (
                <div className="absolute bottom-4 flex gap-2 z-20">
                    {entries.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-blue-500 w-6' : 'bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
