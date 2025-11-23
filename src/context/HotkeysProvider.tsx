"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HotkeysProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + K or Cmd + K: Focus Search
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                const searchInput = document.getElementById("search-input"); // Assuming search input has this ID
                if (searchInput) {
                    searchInput.focus();
                } else {
                    // Fallback if search input is not found, maybe dispatch a custom event
                    window.dispatchEvent(new CustomEvent("open-search"));
                }
            }

            // Ctrl + S or Cmd + S: Trigger Save
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("trigger-save"));
            }

            // G then H: Go Home
            // G then D: Go Dashboard
            // We need to track 'g' press state, but for simplicity let's use a simpler approach or a library.
            // Since we are implementing raw, let's skip complex sequences for now or implement a simple state.
            // Let's stick to simple modifiers for now as per requirement "G then H" might conflict with typing.
            // However, the requirement is specific. Let's try to implement it safely (only when not typing).

            const isTyping = (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA" || (document.activeElement as HTMLElement)?.isContentEditable);

            if (!isTyping) {
                if (e.key === "g") {
                    // Set a temporary flag or listener for the next key
                    const handleNextKey = (nextEvent: KeyboardEvent) => {
                        if (nextEvent.key === "h") {
                            router.push("/");
                        } else if (nextEvent.key === "d") {
                            router.push("/dashboard");
                        }
                        document.removeEventListener("keydown", handleNextKey);
                    };
                    document.addEventListener("keydown", handleNextKey, { once: true });
                }
            }

            // Esc: Close Modals
            if (e.key === "Escape") {
                window.dispatchEvent(new CustomEvent("close-modals"));
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return <>{children}</>;
}
