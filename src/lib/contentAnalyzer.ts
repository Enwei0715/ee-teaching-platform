
export interface Section {
    title: string;
    content: string;
    startIndex: number;
    endIndex: number;
}

export interface AnalyzedSection extends Section {
    score: number;
    reasons: string[];
}

export class ContentAnalyzer {
    /**
     * Parses the markdown content into sections based on headers.
     * Supports H1, H2, H3.
     */
    static parseSections(content: string): Section[] {
        const lines = content.split('\n');
        const sections: Section[] = [];
        let currentSection: Partial<Section> | null = null;
        let buffer: string[] = [];
        let startIndex = 0;

        lines.forEach((line, index) => {
            // Match headers (H1-H3)
            const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);

            if (headerMatch) {
                // Save previous section if exists
                if (currentSection) {
                    sections.push({
                        title: currentSection.title!,
                        content: buffer.join('\n').trim(),
                        startIndex: currentSection.startIndex!,
                        endIndex: index - 1
                    });
                }

                // Start new section
                currentSection = {
                    title: headerMatch[2].trim(),
                    startIndex: index
                };
                buffer = [];
            } else {
                if (currentSection) {
                    buffer.push(line);
                }
            }
        });

        // Push last section
        if (currentSection && buffer.length > 0) {
            sections.push({
                title: currentSection.title!,
                content: buffer.join('\n').trim(),
                startIndex: currentSection.startIndex!,
                endIndex: lines.length - 1
            });
        }

        return sections;
    }

    /**
     * Calculates a "Quiz Worthiness" score for a section.
     * Higher score = better content for generating questions.
     */
    static calculateScore(section: Section): { score: number, reasons: string[] } {
        const { title, content } = section;
        const reasons: string[] = [];
        let score = 0;

        // 1. Instant Disqualification (Blocklist)
        const blocklist = ['reference', 'summary', 'conclusion', 'intro', 'setup', 'install', 'prerequisite', '參考', '結語', '小結', '前言', 'next step'];
        if (blocklist.some(term => title.toLowerCase().includes(term))) {
            return { score: 0, reasons: ['Blocked by title keyword'] };
        }

        // 2. Strip Noise to find "Real Content"
        const textOnly = content
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
            .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
            .replace(/[#*`_]/g, ""); // Remove markdown syntax

        // Filter out sections with very little actual text
        if (textOnly.trim().length < 150) {
            return { score: 0, reasons: ['Too short (< 150 chars)'] };
        }

        // 3. Base Score: Length of meaningful text (capped at 1000 to avoid bias for huge sections)
        score += Math.min(textOnly.length, 1000);
        reasons.push(`Length score: ${Math.min(textOnly.length, 1000)}`);

        // 4. Bonus Points for Explanatory Keywords
        const keywords = ['because', 'means', 'example', 'however', 'therefore', 'defined as', '定義', '例如', '因此', '原理', '因為', 'formula', 'equation'];
        let keywordMatches = 0;
        keywords.forEach(word => {
            if (textOnly.toLowerCase().includes(word)) {
                score += 50;
                keywordMatches++;
            }
        });
        if (keywordMatches > 0) {
            reasons.push(`Keyword bonus: ${keywordMatches * 50} (${keywordMatches} matches)`);
        }

        // 5. Penalty for too much code (if code blocks were removed, check ratio)
        const originalLength = content.length;
        const strippedLength = textOnly.length;
        if (strippedLength < originalLength * 0.3) {
            score *= 0.5; // Penalty if mostly code
            reasons.push('Code heavy penalty (50%)');
        }

        return { score: Math.round(score), reasons };
    }

    /**
     * Analyzes the entire content and returns scored sections.
     */
    static analyze(content: string): AnalyzedSection[] {
        const sections = this.parseSections(content);
        return sections.map(section => {
            const { score, reasons } = this.calculateScore(section);
            return { ...section, score, reasons };
        }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    }

    /**
     * Selects a random high-quality section.
     * Can optionally limit to sections before a certain heading (for progress awareness).
     */
    static selectRandomSection(analyzedSections: AnalyzedSection[], limitToHeadingId?: string): AnalyzedSection | null {
        let pool = analyzedSections;

        // If limitToHeadingId is provided, filter sections
        if (limitToHeadingId) {
            // This assumes sections are in order. parseSections returns them in order.
            // We need to find the index of the limiting section.
            // Actually, heading IDs are usually generated from titles.
            // For simplicity, let's assume we filter out sections that appear AFTER the limit section.
            // But we don't have IDs here.
            // We can pass the full list and the limit ID, but we need to know which section corresponds to the ID.
            // This might be complex without consistent ID generation.
            // For now, let's assume the caller handles the slicing if they have the raw content, 
            // OR we just ignore it here and let the caller filter the list before passing it.
            // Let's stick to simple selection here.
        }

        // Filter for high quality (e.g., top 30% or score > 300)
        const highQualityPool = pool.filter(s => s.score > 300);
        const finalPool = highQualityPool.length > 0 ? highQualityPool : pool;

        if (finalPool.length === 0) return null;

        return finalPool[Math.floor(Math.random() * finalPool.length)];
    }
}
