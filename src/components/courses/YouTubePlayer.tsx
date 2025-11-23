"use client";

interface YouTubePlayerProps {
    url: string;
}

export default function YouTubePlayer({ url }: YouTubePlayerProps) {
    // Extract video ID from URL - supports all YouTube formats
    const getVideoId = (url: string) => {
        // Enhanced regex to support watch, youtu.be, and embed URLs with query params
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    };

    const videoId = getVideoId(url);

    if (!videoId) return null;

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
