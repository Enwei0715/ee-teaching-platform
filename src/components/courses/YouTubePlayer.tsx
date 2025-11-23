"use client";

interface YouTubePlayerProps {
    url: string;
}

export default function YouTubePlayer({ url }: YouTubePlayerProps) {
    // Defensive: validate URL exists and is a string
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return null; // Silently fail for empty/invalid URLs
    }

    // Extract video ID from URL - supports all YouTube formats
    const getVideoId = (inputUrl: string) => {
        try {
            // Enhanced regex to support watch, youtu.be, and embed URLs with query params
            const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = inputUrl.match(regExp);

            // Defensive: verify match exists and has valid length
            if (!match || !match[1] || match[1].length !== 11) {
                return null;
            }

            return match[1];
        } catch (error) {
            // Catch any regex errors
            console.error('YouTubePlayer: Error parsing URL', error);
            return null;
        }
    };

    const videoId = getVideoId(url);

    // Return null instead of rendering invalid content
    if (!videoId) {
        console.warn(`YouTubePlayer: Invalid YouTube URL provided: ${url}`);
        return null;
    }

    return (
        <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-lg my-8 border border-gray-800 bg-gray-900">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
}
