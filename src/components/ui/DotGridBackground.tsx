'use client';

import { useEffect, useRef, useState } from 'react';

export default function DotGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        // Drawing
        const spacing = 30;
        let animationFrame: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    const dx = mouseRef.current.x - x;
                    const dy = mouseRef.current.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;

                    let opacity = 0.3;
                    let size = 1;

                    if (distance < maxDistance) {
                        const influence = 1 - (distance / maxDistance);
                        opacity = 0.3 + (influence * 0.7);
                        size = 1 + (influence * 2);
                    }

                    ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [mounted]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 w-full h-full opacity-40"
            style={{ pointerEvents: 'none' }}
        />
    );
}
