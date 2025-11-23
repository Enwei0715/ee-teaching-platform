import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '')          // Trim - from end of text
        + '-' + Math.random().toString(36).substring(2, 7); // Add random suffix for uniqueness
}

export function calculateReadingTime(content: string): string {
    const wordsPerMinute = 225;

    // Strip HTML and markdown tags for more accurate word count
    const plainText = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[#*`_~\[\]()]/g, '') // Remove markdown formatting chars
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image syntax
        .replace(/\[.*?\]\(.*?\)/g, ''); // Remove link syntax

    // Count words (split by whitespace and filter empty strings)
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

    // Calculate minutes
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    // Return formatted string
    return minutes === 0 ? "1 min read" : `${minutes} min read`;
}
