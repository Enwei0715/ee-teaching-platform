'use client';

import { useEffect, useRef } from 'react';

const HexagonalBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isMounted = true;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let animationFrameId: number;
        let time = 0;

        const mouse = { x: -1000, y: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        // --- Adjusted Parameters ---
        const GRID_RADIUS = 20; // Controls density/spacing (Larger = more spaced out centers)
        const HEX_SIZE = 25;    // Controls actual shape size (Smaller = gaps between shapes)
        // ---------------------------

        const hexWidth = Math.sqrt(3) * GRID_RADIUS;
        const hexHeight = 2 * GRID_RADIUS;
        const cubics: { q: number; r: number; s: number; x: number; y: number }[] = [];

        const initGrid = () => {
            cubics.length = 0;
            const cols = Math.ceil(width / hexWidth) + 2;
            const rows = Math.ceil(height / (hexHeight * 0.75)) + 2;

            for (let i = -2; i < cols; i++) {
                for (let j = -2; j < rows; j++) {
                    let xOffset = (j % 2) * (hexWidth / 2);
                    let x = i * hexWidth + xOffset;
                    let y = j * (hexHeight * 0.75);
                    let q = i - (j - (j & 1)) / 2;
                    let r = j;
                    cubics.push({ q, r, s: -q - r, x, y });
                }
            }
        };

        const drawHexagon = (x: number, y: number, brightness: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = x + HEX_SIZE * Math.cos(angle);
                const hy = y + HEX_SIZE * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            // --- Enhanced Glow Effect ---
            // Base opacity 0.1, max brightness adds 0.5 for a strong glow
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 + brightness * 0.5})`;
            ctx.lineWidth = 1 + brightness; // Slightly thicken line on hover
            ctx.stroke();
        };

        const animate = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, width, height);
            time += 0.01;

            cubics.forEach(hex => {
                const pulse = Math.sin(hex.q * 0.1 + hex.r * 0.1 + time) * 0.5 + 0.5;

                const dx = hex.x - mouse.x;
                const dy = hex.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                // Increased radius to 300px
                const mouseGlow = Math.max(0, 1 - dist / 300);

                // Mouse glow has much stronger influence (1.2)
                const totalBrightness = Math.min(1, pulse * 0.2 + mouseGlow * 1.2);
                drawHexagon(hex.x, hex.y, totalBrightness);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initGrid();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        initGrid();
        animate();

        return () => {
            isMounted = false;
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-[#0f172a]"
        />
    );
};

export default HexagonalBackground;
