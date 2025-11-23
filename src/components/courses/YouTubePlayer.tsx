"use client";

interface YouTubePlayerProps {
    url: string;
}

export default function YouTubePlayer({ url }: YouTubePlayerProps) {
    // Extract video ID from URL
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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
