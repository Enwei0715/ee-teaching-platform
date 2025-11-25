'use client';

export default function CircuitBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="circuit-pattern" />
            <style jsx>{`
                @keyframes pulse-glow {
                    0%, 100% {
                        opacity: 0.3;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                }

                @keyframes scan {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: 100% 100%;
                    }
                }

                .circuit-pattern {
                    position: absolute;
                    inset: 0;
                    background-color: #0f172a;
                    background-image: 
                        linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px);
                    background-size: 50px 50px;
                }

                .circuit-pattern::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
                        radial-gradient(circle at 40% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 40%);
                    animation: pulse-glow 8s ease-in-out infinite alternate;
                }

                .circuit-pattern::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        135deg,
                        rgba(59, 130, 246, 0.1) 0%,
                        transparent 30%,
                        transparent 70%,
                        rgba(139, 92, 246, 0.1) 100%
                    );
                    background-size: 200% 200%;
                    animation: scan 12s linear infinite;
                }
            `}</style>
        </div>
    );
}
