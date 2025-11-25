'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function LessonBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="lesson-particles"
            className="absolute inset-0"
            style={{ zIndex: -1 }}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "bubble",
                        },
                        resize: {
                            enable: true,
                        },
                    },
                    modes: {
                        bubble: {
                            distance: 200,
                            size: 10,
                            duration: 2,
                            opacity: 0.6,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#9ca3af",
                    },
                    links: {
                        enable: false,
                    },
                    move: {
                        direction: "none",
                        enable: false,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                        },
                        value: 150,
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: 3,
                    },
                },
                detectRetina: true,
            }}
        />
    );
}
