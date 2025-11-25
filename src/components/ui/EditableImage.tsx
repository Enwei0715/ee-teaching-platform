'use client';

import Image from 'next/image';

interface EditableImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
}

export default function EditableImage({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
}: EditableImageProps) {
    // Simplified: Just render a static image
    // Removed all edit mode functionality

    const commonProps = {
        src,
        alt,
        className,
        priority,
    };

    if (width && height) {
        return <Image {...commonProps} width={width} height={height} />;
    }

    return <img {...commonProps} />;
}
