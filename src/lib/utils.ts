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
    const wordsPerMinute = 225; // Standard for English
    const charsPerMinute = 300; // Rough estimate for CJK characters

    // Strip HTML and markdown tags
    const plainText = content
        .replace(/<[^>]*>/g, '')
        .replace(/[#*`_~\[\]()!]/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '');

    const englishWords = plainText.split(/\s+/).filter(word => /^[a-zA-Z0-9]+$/.test(word) && word.length > 0);
    const cjkChars = plainText.replace(/[\x00-\x7F]/g, '').length; // Count non-ASCII characters

    const estimatedEnglishMinutes = englishWords.length / wordsPerMinute;
    const estimatedCjkMinutes = cjkChars / charsPerMinute;

    const totalMinutes = Math.ceil(estimatedEnglishMinutes + estimatedCjkMinutes);

    return totalMinutes === 0 ? "1 min read" : `${totalMinutes} min read`;
}

export function calculateCourseTotalDuration(lessons: { content: string }[]): string {
    let totalMinutes = 0;
    const wordsPerMinute = 225;
    const charsPerMinute = 300;

    lessons.forEach(lesson => {
        const plainText = lesson.content
            .replace(/<[^>]*>/g, '')
            .replace(/[#*`_~\[\]()!]/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '');

        const englishWords = plainText.split(/\s+/).filter(word => /^[a-zA-Z0-9]+$/.test(word) && word.length > 0);
        const cjkChars = plainText.replace(/[\x00-\x7F]/g, '').length;

        const estimatedEnglishMinutes = englishWords.length / wordsPerMinute;
        const estimatedCjkMinutes = cjkChars / charsPerMinute;

        totalMinutes += (estimatedEnglishMinutes + estimatedCjkMinutes);
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.ceil(totalMinutes % 60);

    if (totalHours === 0) {
        return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
        return `${totalHours} hr${totalHours > 1 ? 's' : ''}`;
    } else {
        return `${totalHours} hr${totalHours > 1 ? 's' : ''} ${remainingMinutes} min`;
    }
}
