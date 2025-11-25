'use client';
import { useEffect, useRef } from 'react';

const InteractiveDotGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initial size setup
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);

        // Config
        const GRID_SPACING = 45; // Fixed constant spacing
        const baseRadius = 1.2;
        const maxRadius = 4.5; // Bubble effect size
        const mouse = { x: -1000, y: -1000 };

        // Grid generation
        let dots: { x: number; y: number; r: number }[] = [];
        const initDots = () => {
            dots = [];
            const cols = Math.floor(width / GRID_SPACING);
            const rows = Math.floor(height / GRID_SPACING);
            const startX = (width - (cols * GRID_SPACING)) / 2;
            const startY = (height - (rows * GRID_SPACING)) / 2;

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    dots.push({
                        x: startX + i * GRID_SPACING,
                        y: startY + j * GRID_SPACING,
                        r: baseRadius
                    });
                }
            }
        };
        initDots();

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        // Handle resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
            initDots();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Animation loop
        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            dots.forEach(dot => {
                // Calculate distance
                const dx = mouse.x - dot.x;
                const dy = mouse.y - dot.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Interaction logic (Magnify)
                const triggerDist = 120;
                if (dist < triggerDist) {
                    const scale = 1 + (triggerDist - dist) / triggerDist; // 1 to 2x scale
                    const targetR = baseRadius * scale * (maxRadius / baseRadius);
                    dot.r += (targetR - dot.r) * 0.1; // Ease in
                } else {
                    dot.r += (baseRadius - dot.r) * 0.1; // Ease out
                }

                // Draw
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 200, ${0.15 + (dot.r - baseRadius) / 10})`;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default InteractiveDotGrid;
