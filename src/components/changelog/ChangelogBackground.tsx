'use client';

import React, { useEffect, useRef } from 'react';

export default function ChangelogBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // Star/Particle System
        const stars: { x: number; y: number; z: number; size: number }[] = [];
        const numStars = 200;
        const speed = 2;
        // No initial population - spawn gradually

        let animationFrameId: number;

        let lastSpawnTime = 0;
        const spawnInterval = 50; // Spawn 1 star every 50ms (20 stars/sec)

        const draw = () => {
            // Dark fade for trail effect
            ctx.fillStyle = 'rgba(5, 10, 20, 0.3)';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const now = Date.now();

            // Gradual Spawn Logic (Time-based)
            if (stars.length < numStars && now - lastSpawnTime > spawnInterval) {
                stars.push({
                    x: Math.random() * width - width / 2,
                    y: Math.random() * height - height / 2,
                    z: width + Math.random() * 100, // Spawn far away
                    size: Math.random() * 2
                });
                lastSpawnTime = now;
            }

            stars.forEach((star) => {
                // Move star closer
                star.z -= speed;

                // Reset if passed viewer
                if (star.z <= 0) {
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                    star.z = width + Math.random() * 200; // Random offset to prevent "walls"
                }

                // Project 3D to 2D
                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    // Depth of Field & Fade (Optimized: No ctx.filter)
                    const normalizedZ = star.z / width;
                    const size = Math.max(0.5, (1 - normalizedZ) * 3); // Min size 0.5
                    const alpha = Math.pow(Math.max(0, 1 - normalizedZ), 2); // Steeper fade for depth

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
                    // Removed ctx.filter for performance
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw grid lines at bottom
            ctx.strokeStyle = 'rgba(50, 100, 200, 0.1)';
            ctx.lineWidth = 1;

            const time = Date.now() * 0.0005;
            const horizonY = height * 0.7;

            // Moving horizontal lines
            for (let i = 0; i < 10; i++) {
                const y = (time + i / 10) % 1; // 0 to 1
                // Exponential spacing for perspective
                const perspectiveY = horizonY + Math.pow(y, 3) * (height - horizonY);

                ctx.beginPath();
                ctx.moveTo(0, perspectiveY);
                ctx.lineTo(width, perspectiveY);
                ctx.stroke();
            }

            // Vertical perspective lines
            for (let i = -10; i <= 10; i++) {
                const x = cx + i * 100;
                ctx.beginPath();
                ctx.moveTo(cx, horizonY); // Vanishing point
                ctx.lineTo(x * 4, height); // Spread out
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 bg-[#050a14]"
            style={{ pointerEvents: 'none' }}
        />
    );
}
