'use client';

import React, { useRef, useEffect } from 'react';

interface LessonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    alt?: string;
}

export const LessonImage: React.FC<LessonImageProps> = ({ alt, className, ...props }) => {
    // We don't need complex JS resizing for most cases if we use proper CSS
    // The issue with SVGs is often that they need explicit width/height or they collapse

    return (
        <figure className="my-8 w-full flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full max-w-2xl overflow-hidden flex justify-center relative z-10">
                <img
                    alt={alt}
                    className={`w-full h-auto max-w-full object-contain mx-auto rounded-md ${className || ''}`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        minHeight: '150px' // Fallback to ensure visibility if intrinsic size is missing
                    }}
                    loading="lazy"
                    {...props}
                />
            </div>
            {alt && (
                <figcaption className="mt-3 text-center text-sm text-text-secondary italic">
                    {alt}
                </figcaption>
            )}
        </figure>
    );
};

export default LessonImage;
