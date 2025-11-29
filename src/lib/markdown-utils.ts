// Helper function to extract headers from markdown content
export function extractHeaders(markdown: string) {
    const headers: { id: string; text: string; level: number; index: number }[] = [];

    // Match H1, H2 and H3 headers
    const headerRegex = /^#{1,3}\s+(.+)$/gm;
    let match;

    while ((match = headerRegex.exec(markdown)) !== null) {
        const text = match[1].trim();
        const level = (match[0].match(/^#+/)?.[0].length || 2);
        // Generate ID same way as the TOC
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        headers.push({
            id,
            text,
            level,
            index: match.index
        });
    }

    return headers;
}

// Get section content for a specific header
export function getSectionContent(markdown: string, headers: ReturnType<typeof extractHeaders>, headerIndex: number): string {
    const header = headers[headerIndex];
    if (!header) return '';

    const startIndex = header.index;
    const nextHeader = headers[headerIndex + 1];
    const endIndex = nextHeader?.index || markdown.length;

    return markdown.substring(startIndex, endIndex);
}

// Get headers up to current position (for progress-aware quiz)
export function getReadHeaders(headers: ReturnType<typeof extractHeaders>, activeHeadingId?: string) {
    if (!activeHeadingId) return headers; // Default: all headers

    const currentIndex = headers.findIndex(h => h.id === activeHeadingId);

    // If found, return headers from start to current (inclusive)
    if (currentIndex >= 0) {
        return headers.slice(0, currentIndex + 1);
    }

    // Fallback: return all headers
    return headers;
}
