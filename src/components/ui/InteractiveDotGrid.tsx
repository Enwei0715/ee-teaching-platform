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

        const GRID_SPACING = 45;
        const BASE_RADIUS = 3;
        let dots: { x: number; y: number; baseOpacity: number }[] = [];
        let animationFrameId: number;
        let mouseX = -1000;
        let mouseY = -1000;

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
                        baseOpacity: 0.1
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

            dots.forEach(dot => {
                const dx = mouseX - dot.x;
                const dy = mouseY - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                let opacity = dot.baseOpacity;
                let scale = 1;

                if (distance < maxDistance) {
                    const factor = (maxDistance - distance) / maxDistance;
                    opacity = dot.baseOpacity + factor * 0.5;
                    scale = 1 + factor * 1.5;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, BASE_RADIUS * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 149, 237, ${opacity})`; // CornflowerBlue
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            isMounted = false;
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </div>
    );
}
