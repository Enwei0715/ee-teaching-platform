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

        // Check for touch device
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        const mouse = { x: -1000, y: -1000 };
        const ripples: { x: number; y: number; time: number }[] = [];

        const handleMouseMove = (e: MouseEvent) => {
            if (isTouchDevice) return; // Disable hover on touch devices
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
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
                if (i === 0) {
                    ctx.moveTo(hx, hy);
                } else {
                    ctx.lineTo(hx, hy);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${brightness * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = `rgba(148, 163, 184, ${brightness * 0.05})`;
            ctx.fill();
        };

        const animate = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, width, height);
            time += 0.01;

            // Update ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].time += 0.02;
                if (ripples[i].time > 1) {
                    ripples.splice(i, 1);
                }
            }

            cubics.forEach(hex => {
                const pulse = Math.sin(hex.q * 0.1 + hex.r * 0.1 + time) * 0.5 + 0.5;

                // Mouse interaction
                let interactionBrightness = 0;

                if (!isTouchDevice) {
                    const dx = hex.x - mouse.x;
                    const dy = hex.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    interactionBrightness = Math.max(0, 1 - dist / 300);
                }

                // Ripple interaction
                let rippleBrightness = 0;
                ripples.forEach(ripple => {
                    const dx = hex.x - ripple.x;
                    const dy = hex.y - ripple.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const rippleRadius = ripple.time * 500; // Expanding radius
                    const distFromRippleEdge = Math.abs(dist - rippleRadius);

                    if (distFromRippleEdge < 100) {
                        const rippleIntensity = (1 - ripple.time) * (1 - distFromRippleEdge / 100);
                        rippleBrightness = Math.max(rippleBrightness, rippleIntensity);
                    }
                });

                // Combine sources
                const totalBrightness = Math.min(1, pulse * 0.2 + interactionBrightness * 1.2 + rippleBrightness * 1.5);
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
        if (!isTouchDevice) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        // Use click for both, or touchstart for faster mobile response if needed.
        // Click is usually sufficient and avoids ghost clicks issues.
        window.addEventListener('click', handleClick as any);

        initGrid();
        animate();

        return () => {
            isMounted = false;
            window.removeEventListener('resize', handleResize);
            if (!isTouchDevice) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
            window.removeEventListener('click', handleClick as any);
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
