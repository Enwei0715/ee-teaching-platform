import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
    title: string;
    description: string;
    slug: string;
    date: string;
    tags: string[];
}

export default function BlogCard({ title, description, slug, date, tags }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className="group flex flex-col h-full glass-panel rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700"
        >
            <div className="p-6 flex-1 flex flex-col">
                <span className="text-sm text-gray-400 mb-2">{date}</span>
                <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-accent-primary transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {description}
                </p>
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-800/50 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-accent-primary flex items-center gap-1 group-hover:underline">
                        Read more <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
