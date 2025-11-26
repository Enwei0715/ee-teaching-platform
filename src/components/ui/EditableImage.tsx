'use client';

import Image from 'next/image';

interface EditableImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    mode?: 'static' | 'entity';
    apiEndpoint?: string;
    fieldName?: string;
    contentKey?: string;
}

export default function EditableImage({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    mode,
    apiEndpoint,
    fieldName,
    contentKey,
}: EditableImageProps) {
    // Simplified: Just render a static image
    // Removed all edit mode functionality

    const commonProps = {
        src,
        alt,
        className,
        priority,
    };

    const { priority: _priority, ...imgProps } = commonProps;

    if (width && height) {
        return <Image {...commonProps} width={width} height={height} />;
    }

    return <img {...imgProps} />;
}
