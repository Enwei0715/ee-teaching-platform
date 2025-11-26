"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HotkeysProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [chord, setChord] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isTyping = (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA" || (document.activeElement as HTMLElement)?.isContentEditable);

            // Global shortcuts (even when typing for some, or with modifiers)
            // Ctrl + K or Cmd + K: Focus Search / Open Search
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                const searchInput = document.getElementById("search-input");
                if (searchInput) {
                    searchInput.focus();
                } else {
                    window.dispatchEvent(new CustomEvent("open-search"));
                }
                setChord(null);
                return;
            }



            // Ctrl + Enter or Cmd + Enter: Trigger Submit
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("trigger-submit"));
                setChord(null);
                return;
            }

            // Esc: Close Modals
            if (e.key === "Escape") {
                window.dispatchEvent(new CustomEvent("close-modals"));
                setChord(null);
                return;
            }

            // Shortcuts that should NOT trigger when typing in an input/textarea
            if (!isTyping) {
                // ? : Toggle Shortcuts Help
                if (e.key === "?") {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("toggle-shortcuts-help"));
                    setChord(null);
                    return;
                }

                // Navigation Chords (G then ...)
                if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    setChord("g");
                    setTimeout(() => setChord(null), 1000);
                    return;
                }

                if (chord === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    if (e.key === "h") {
                        router.push("/");
                    } else if (e.key === "d") {
                        router.push("/dashboard");
                    } else if (e.key === "c") {
                        router.push("/courses");
                    } else if (e.key === "p") {
                        router.push("/projects");
                    } else if (e.key === "b") {
                        router.push("/blog");
                    } else if (e.key === "f") {
                        router.push("/forum");
                    }
                    setChord(null);
                    return;
                }

                // Lesson Navigation (Arrows or J/K)
                if (!e.metaKey && !e.ctrlKey && !e.altKey) {
                    if (e.key === "k" || e.key === "ArrowRight") {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent("nav-next-lesson"));
                        setChord(null);
                        return;
                    } else if (e.key === "j" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent("nav-prev-lesson"));
                        setChord(null);
                        return;
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [chord, router]);

    return <>{children}</>;
}
