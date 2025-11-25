'use client';

export default function AuroraBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="aurora-gradient absolute inset-0" />
            <style jsx>{`
                @keyframes aurora {
                    0%, 100% {
                        background-position: 0% 50%, 50% 50%, 100% 50%;
                    }
                    50% {
                        background-position: 100% 50%, 50% 0%, 0% 50%;
                    }
                }

                .aurora-gradient {
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(34, 211, 238, 0.12) 0%, transparent 50%);
                    background-size: 400% 400%, 300% 300%, 350% 350%;
                    animation: aurora 20s ease-in-out infinite;
                    filter: blur(40px);
                }
            `}</style>
        </div>
    );
}
