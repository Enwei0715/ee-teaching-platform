'use client';

import { useEffect, useRef } from 'react';

export default function NetBackground() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        if (!vantaRef.current || vantaEffect.current) return;

        // Dynamically import Vanta and THREE
        Promise.all([
            import('vanta/dist/vanta.net.min'),
            import('three')
        ]).then(([VANTA, THREE]) => {
            vantaEffect.current = (VANTA as any).default({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x3b82f6,
                backgroundColor: 0x0f172a,
                points: 15.00,
                maxDistance: 25.00,
                spacing: 18.00,
                showDots: true
            });
        }).catch(console.error);

        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={vantaRef}
            className="fixed top-0 left-0 w-screen h-screen"
            style={{ zIndex: -1 }}
        />
    );
}
