'use client';
import { useEffect, useRef } from 'react';

const OscilloscopeBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isMounted = true;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let frameId: number;
        let increment = 0;

        // Configuration for waves
        const waves = [
            { amplitude: 60, frequency: 0.005, speed: 0.015, color: 'rgba(56, 189, 248, 0.15)' }, // Light Blue
            { amplitude: 40, frequency: 0.01, speed: 0.02, color: 'rgba(14, 165, 233, 0.1)' }, // Sky Blue
            { amplitude: 80, frequency: 0.003, speed: 0.01, color: 'rgba(99, 102, 241, 0.05)' }, // Indigo (Deep)
        ];

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const animate = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, width, height);
            increment += 1;

            const centerY = height * 0.6; // Move waves slightly down

            waves.forEach((wave) => {
                ctx.beginPath();

                // Create gradient for the fill
                const gradient = ctx.createLinearGradient(0, centerY - wave.amplitude, 0, height);
                gradient.addColorStop(0, wave.color);
                gradient.addColorStop(1, 'rgba(15, 23, 42, 0)'); // Fade to transparent at bottom

                ctx.fillStyle = gradient;
                ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, '0.3)'); // Slightly more opaque line

                // Start path at bottom left
                ctx.moveTo(0, height);
                ctx.lineTo(0, centerY);

                for (let x = 0; x <= width; x++) {
                    // Sine wave formula: y = amplitude * sin(frequency * x + moving_offset)
                    const y = centerY + wave.amplitude * Math.sin(x * wave.frequency + increment * wave.speed);
                    ctx.lineTo(x, y);
                }

                // Close path at bottom right
                ctx.lineTo(width, height);
                ctx.closePath();

                ctx.fill();
                // Optional: Draw the top line for better definition
                ctx.stroke();
            });

            frameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            isMounted = false;
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-[#0f172a]" // Fixed to viewport
        />
    );
};

export default OscilloscopeBackground;
