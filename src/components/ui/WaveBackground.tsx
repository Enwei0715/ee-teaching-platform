'use client';

import { useEffect, useRef } from 'react';

export default function WaveBackground() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        if (!vantaRef.current || vantaEffect.current) return;

        // Dynamically import Vanta and THREE
        Promise.all([
            import('vanta/dist/vanta.waves.min'),
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
                color: 0x1e293b,
                shininess: 10.00,
                waveHeight: 10.00,
                waveSpeed: 0.5,
                zoom: 0.80
            });
        }).catch(console.error);

        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return <div ref={vantaRef} className="absolute inset-0 z-0" />;
}
