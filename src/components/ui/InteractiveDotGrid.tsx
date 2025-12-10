'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveDotGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isMounted = true;

        // Check for touch device
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        const GRID_SPACING = 45;
        const BASE_RADIUS = 3;
        let dots: { x: number; y: number; baseOpacity: number }[] = [];
        let animationFrameId: number;
        let mouseX = -1000;
        let mouseY = -1000;
        const ripples: { x: number; y: number; time: number }[] = [];

        // Function to regenerate grid based on current dimensions
        const initGrid = (width: number, height: number) => {
            dots = [];
            // Calculate columns and rows based on fixed spacing
            // Add extra buffer to ensure coverage
            const cols = Math.ceil(width / GRID_SPACING) + 1;
            const rows = Math.ceil(height / GRID_SPACING) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({
                        x: i * GRID_SPACING,
                        y: j * GRID_SPACING,
                        baseOpacity: 0.05
                    });
                }
            }
        };

        // Resize Observer to handle dynamic content height
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // Update canvas internal resolution to match display size
                canvas.width = width;
                canvas.height = height;
                // Regenerate dots to fill the new space without stretching
                initGrid(width, height);
            }
        });

        resizeObserver.observe(container);

        const animate = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].time += 0.06;
                if (ripples[i].time > 1) {
                    ripples.splice(i, 1);
                }
            }

            const maxDistance = 200; // Increased interaction range

            // First pass: Draw connections between nearby dots
            dots.forEach((dot, i) => {
                dots.forEach((otherDot, j) => {
                    if (i >= j) return; // Avoid duplicate lines

                    const dx = dot.x - otherDot.x;
                    const dy = dot.y - otherDot.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) { // Connect nearby dots
                        const opacity = (100 - distance) / 100 * 0.08;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(otherDot.x, otherDot.y);
                        ctx.stroke();
                    }
                });
            });

            // Second pass: Draw dots with enhanced effects
            dots.forEach(dot => {
                let opacity = dot.baseOpacity;
                let scale = 1;
                let hue = 0; // Color shift

                // Mouse Interaction
                if (!isTouchDevice) {
                    const dx = mouseX - dot.x;
                    const dy = mouseY - dot.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const factor = (maxDistance - distance) / maxDistance;
                        opacity = Math.min(0.8, dot.baseOpacity + factor * 0.6);
                        scale = 1 + factor * 1.5;
                        hue = factor * 180; // Blue to purple gradient

                        // Draw connection line to mouse
                        if (distance < 120) {
                            ctx.strokeStyle = `rgba(99, 102, 241, ${factor * 0.25})`;
                            ctx.lineWidth = factor * 2;
                            ctx.beginPath();
                            ctx.moveTo(dot.x, dot.y);
                            ctx.lineTo(mouseX, mouseY);
                            ctx.stroke();
                        }
                    }
                }

                // Ripple Interaction
                ripples.forEach(ripple => {
                    const dx = dot.x - ripple.x;
                    const dy = dot.y - ripple.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const rippleRadius = ripple.time * 400;
                    const distFromRippleEdge = Math.abs(dist - rippleRadius);

                    if (distFromRippleEdge < 80) {
                        const rippleFactor = (1 - ripple.time) * (1 - distFromRippleEdge / 80);
                        opacity = Math.max(opacity, Math.min(0.8, dot.baseOpacity + rippleFactor * 0.6));
                        scale = Math.max(scale, 1 + rippleFactor * 1.5);
                        hue = Math.max(hue, rippleFactor * 180);
                    }
                });

                const finalRadius = BASE_RADIUS * scale;

                // Outer glow when scaled
                if (scale > 1.2) {
                    const glowGradient = ctx.createRadialGradient(
                        dot.x, dot.y, 0,
                        dot.x, dot.y, finalRadius * 3
                    );
                    glowGradient.addColorStop(0, `hsla(${220 + hue}, 100%, 65%, ${opacity * 0.3})`);
                    glowGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, finalRadius * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Main dot with gradient
                const dotGradient = ctx.createRadialGradient(
                    dot.x, dot.y, 0,
                    dot.x, dot.y, finalRadius
                );
                dotGradient.addColorStop(0, `hsla(${220 + hue}, 100%, 75%, ${opacity})`);
                dotGradient.addColorStop(1, `hsla(${220 + hue}, 100%, 60%, ${opacity * 0.7})`);

                ctx.fillStyle = dotGradient;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, finalRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            if (isTouchDevice) return;
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleClick = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            let clientX, clientY;

            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            ripples.push({
                x: clientX - rect.left,
                y: clientY - rect.top,
                time: 0
            });
        };

        if (!isTouchDevice) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        window.addEventListener('click', handleClick as any);

        return () => {
            isMounted = false;
            resizeObserver.disconnect();
            if (!isTouchDevice) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
            window.removeEventListener('click', handleClick as any);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </div>
    );
}
