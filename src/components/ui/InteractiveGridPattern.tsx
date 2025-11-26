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

            // Draw base grid with increased visibility
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Increased from 0.05 to 0.15
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

            // Enhanced mouse interaction
            const { x, y } = mouseRef.current;
            if (x >= 0 && y >= 0) {
                const cellX = Math.floor(x / gridSize) * gridSize;
                const cellY = Math.floor(y / gridSize) * gridSize;

                // Glow effect around mouse
                const maxDistance = 220; // Increased interaction range
                for (let gx = 0; gx <= width; gx += gridSize) {
                    for (let gy = 0; gy <= height; gy += gridSize) {
                        const dx = gx - x;
                        const dy = gy - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < maxDistance) {
                            const intensity = (maxDistance - distance) / maxDistance;
                            const alpha = intensity * 0.25; // Increased glow intensity
                            ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                            ctx.fillRect(gx, gy, gridSize, gridSize);
                        }
                    }
                }

                // Highlight cell directly under mouse with stronger effect
                ctx.fillStyle = 'rgba(99, 102, 241, 0.15)'; // Increased from 0.05
                ctx.fillRect(cellX, cellY, gridSize, gridSize);

                // Bright border for highlighted cell
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'; // Increased from 0.1 to 0.4
                ctx.lineWidth = 2;
                ctx.strokeRect(cellX, cellY, gridSize, gridSize);

                // Light up immediate neighbors more visibly
                const neighbors = [
                    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
                ];

                ctx.fillStyle = 'rgba(99, 102, 241, 0.08)'; // Increased from 0.02
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
