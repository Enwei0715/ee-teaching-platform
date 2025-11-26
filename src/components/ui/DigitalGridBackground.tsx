"use client";

import { useEffect, useRef } from "react";

export default function DigitalGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Grid configuration
        const gridSize = 40;
        const gridColor = "rgba(255, 255, 255, 0.03)";

        // Pulse configuration
        interface Pulse {
            x: number;
            y: number;
            direction: 'x' | 'y';
            speed: number;
            length: number;
            color: string;
            life: number;
        }

        const pulses: Pulse[] = [];
        const maxPulses = 15;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const drawGrid = () => {
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        const createPulse = () => {
            if (pulses.length >= maxPulses) return;

            const isHorizontal = Math.random() > 0.5;
            const startX = Math.floor(Math.random() * (width / gridSize)) * gridSize;
            const startY = Math.floor(Math.random() * (height / gridSize)) * gridSize;

            pulses.push({
                x: startX,
                y: startY,
                direction: isHorizontal ? 'x' : 'y',
                speed: (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1),
                length: Math.random() * 100 + 50,
                color: `rgba(0, 150, 255, ${Math.random() * 0.3 + 0.1})`, // Cyan/Blue
                life: 100
            });
        };

        const drawPulses = () => {
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];

                ctx.strokeStyle = p.color;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0, 150, 255, 0.5)";

                ctx.beginPath();
                if (p.direction === 'x') {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.length * (p.speed > 0 ? -1 : 1), p.y);
                    p.x += p.speed;
                } else {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length * (p.speed > 0 ? -1 : 1));
                    p.y += p.speed;
                }
                ctx.stroke();

                ctx.shadowBlur = 0;

                // Remove if out of bounds or dead
                if (
                    p.x < -100 || p.x > width + 100 ||
                    p.y < -100 || p.y > height + 100
                ) {
                    pulses.splice(i, 1);
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            drawGrid();

            if (Math.random() < 0.05) createPulse();
            drawPulses();

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }}
        />
    );
}
