import React from 'react';

interface LessonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    alt?: string;
}

export const LessonImage: React.FC<LessonImageProps> = ({ alt, className, ...props }) => {
    return (
        <figure className="my-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 inline-block max-w-full overflow-hidden">
                <img
                    alt={alt}
                    className={`max-w-full h-auto mx-auto rounded-md ${className || ''}`}
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
