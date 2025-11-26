'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveGridPattern() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1, y: -1 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const gridSize = 40;
        let frameId: number;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1, y: -1 };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const drawGrid = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw base grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();

            for (let x = 0; x <= width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }

            for (let y = 0; y <= height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Highlight cell under mouse
            const { x, y } = mouseRef.current;
            if (x >= 0 && y >= 0) {
                const cellX = Math.floor(x / gridSize) * gridSize;
                const cellY = Math.floor(y / gridSize) * gridSize;

                ctx.fillStyle = 'rgba(99, 102, 241, 0.15)'; // Indigo highlight
                ctx.fillRect(cellX, cellY, gridSize, gridSize);

                // Optional: Add a subtle glow/border to the highlighted cell
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.strokeRect(cellX, cellY, gridSize, gridSize);

                // Optional: Light up neighbors slightly
                const neighbors = [
                    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
                ];

                ctx.fillStyle = 'rgba(99, 102, 241, 0.05)';
                neighbors.forEach(({ dx, dy }) => {
                    ctx.fillRect(cellX + dx * gridSize, cellY + dy * gridSize, gridSize, gridSize);
                });
            }

            frameId = requestAnimationFrame(drawGrid);
        };

        drawGrid();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
