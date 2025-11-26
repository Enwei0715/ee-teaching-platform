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
            { amplitude: 50, frequency: 0.01, speed: 0.02, color: 'rgba(56, 189, 248, 0.1)' }, // Light Blue
            { amplitude: 30, frequency: 0.02, speed: 0.03, color: 'rgba(14, 165, 233, 0.08)' }, // Sky Blue
            { amplitude: 70, frequency: 0.005, speed: 0.01, color: 'rgba(99, 102, 241, 0.05)' }, // Indigo (Deep)
        ];

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const animate = () => {
            if (!isMounted) return;
            // Create a trail effect or clear completely
            ctx.clearRect(0, 0, width, height);
            increment += 1;

            const centerY = height / 2;

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.strokeStyle = wave.color;
                ctx.lineWidth = 2;

                for (let x = 0; x < width; x++) {
                    // Sine wave formula: y = amplitude * sin(frequency * x + moving_offset)
                    const y = centerY + wave.amplitude * Math.sin(x * wave.frequency + increment * wave.speed);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
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
