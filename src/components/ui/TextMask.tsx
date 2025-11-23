"use client";

import { useState } from "react";

interface TextMaskProps {
    children: React.ReactNode;
    initiallyVisible?: boolean;
}

export default function TextMask({ children, initiallyVisible = false }: TextMaskProps) {
    const [isVisible, setIsVisible] = useState(initiallyVisible);

    return (
        <span
            onClick={() => setIsVisible(!isVisible)}
            className={`
                cursor-pointer transition-all duration-300 rounded px-1
                ${isVisible ? 'bg-transparent' : 'bg-gray-200 dark:bg-gray-700 text-transparent select-none hover:bg-gray-300 dark:hover:bg-gray-600'}
            `}
            title={isVisible ? "Click to hide" : "Click to reveal"}
        >
            {children}
        </span>
    );
}
