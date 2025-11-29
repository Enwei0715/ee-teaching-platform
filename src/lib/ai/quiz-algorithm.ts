
export interface Section {
    id: string;
    title: string;
    content: string;
    index: number;
}

export interface ScoredSection extends Section {
    score: number;
    reasons: string[];
}

// Deterministic slugify (no random suffix)
function generateId(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Phase 1: Parsing
 * Splits markdown content into sections based on H2 (##) and H3 (###) headers.
 */
export function parseSections(markdown: string): Section[] {
    const lines = markdown.split('\n');
    const sections: Section[] = [];
    let currentSection: Partial<Section> | null = null;
    let buffer: string[] = [];
    let sectionIndex = 0;

    console.log("[Parser] Starting parse...");

    lines.forEach((line, index) => {
        // Match headers (H2 or H3)
        const headerMatch = line.match(/^(#{2,3})\s+(.+)$/);

        if (headerMatch) {
            // Save previous section if exists
            if (currentSection) {
                const content = buffer.join('\n').trim();
                if (content.length > 0) {
                    sections.push({
                        id: currentSection.id!,
                        title: currentSection.title!,
                        content: content,
                        index: currentSection.index!
                    });
                }
            }

            // Start new section
            const title = headerMatch[2].trim();
            const id = generateId(title);

            currentSection = {
                id: id,
                title: title,
                index: sectionIndex++
            };
            buffer = [];
        } else {
            if (currentSection) {
                buffer.push(line);
            }
        }
    });

    // Push last section
    if (currentSection && (currentSection as Partial<Section>).id && buffer.length > 0) {
        sections.push({
            id: (currentSection as Partial<Section>).id!,
            title: (currentSection as Partial<Section>).title!,
            content: buffer.join('\n').trim(),
            index: (currentSection as Partial<Section>).index!
        });
    }

    console.log(`[Parser] Found ${sections.length} sections:`, sections.map(s => s.title));
    return sections;
}

/**
 * Phase 2: Scoping
 * Filters sections based on the user's current reading progress (currentHeadingId).
 * If currentHeadingId is null, returns ALL sections (Review Mode).
 * If provided, returns sections up to (and including) the current heading.
 */
export function scopeSections(sections: Section[], currentHeadingId: string | null): Section[] {
    console.log(`[Scoper] Scoping for ID: "${currentHeadingId}"`);

    if (!currentHeadingId) {
        console.log("[Scoper] No current ID provided. Returning ALL sections (Review Mode).");
        return sections;
    }

    // Find the index of the section that matches the currentHeadingId
    // Since currentHeadingId might have a random suffix (from frontend slugify),
    // and our section.id is deterministic (no suffix), we check if currentHeadingId STARTS WITH section.id
    const foundIndex = sections.findIndex(s => {
        // Exact match (unlikely if suffix exists) OR Prefix match
        // We add a hyphen to ensure we don't match "intro" with "introduction"
        // e.g. "introduction-abc" starts with "introduction" -> Match
        // "intro-abc" starts with "intro" -> Match
        return s.id === currentHeadingId || currentHeadingId.startsWith(s.id + '-');
    });

    if (foundIndex === -1) {
        console.warn(`[Scoper] Warning: Current heading ID "${currentHeadingId}" not found in sections. Returning ALL sections.`);
        return sections;
    }

    // Slice from 0 to foundIndex + 1 (to include the current section)
    const slicedSections = sections.slice(0, foundIndex + 1);

    console.log(`[Scoper] Current ID: "${currentHeadingId}", Found at index: ${foundIndex} (Matched: "${sections[foundIndex].title}"), Cutting at index: ${foundIndex + 1}`);
    console.log(`[Scoper] Original count: ${sections.length}, Scoped count: ${slicedSections.length}`);
    console.log(`[Scoper] Included sections:`, slicedSections.map(s => s.title));

    return slicedSections;
}

/**
 * Phase 3: Scoring
 * Rates sections based on quality to avoid "fluff" content.
 */
export function calculateScore(section: Section): ScoredSection {
    const { title, content } = section;
    const reasons: string[] = [];
    let score = 0;

    // 1. Instant Disqualification (Blocklist)
    const blocklist = ['Intro', 'Summary', 'Reference', 'Conclusion', '前言', '結語', '參考資料', 'Setup', 'Installation'];
    if (blocklist.some(term => title.toLowerCase().includes(term.toLowerCase()))) {
        console.log(`[Scorer] "${title}": Blocklisted title. Score = 0.`);
        return { ...section, score: 0, reasons: ['Blocked by title keyword'] };
    }

    // 2. Clean Text
    // Remove code blocks, images, and links to measure meaningful text density
    const cleanedText = content
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
        .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

    // 3. Length Check
    if (cleanedText.length < 150) {
        console.log(`[Scorer] "${title}": Too short (${cleanedText.length} chars). Score = 0.`);
        return { ...section, score: 0, reasons: [`Too short (${cleanedText.length} < 150)`] };
    }

    // 4. Base Score
    score += cleanedText.length;
    reasons.push(`Base: ${cleanedText.length} chars`);

    // 5. Bonus Keywords
    const keywords = ['because', 'means', 'example', 'therefore', '原理', '定義', '因此', '相比'];
    let bonus = 0;
    keywords.forEach(word => {
        if (cleanedText.toLowerCase().includes(word.toLowerCase())) {
            bonus += 50;
        }
    });

    if (bonus > 0) {
        score += bonus;
        reasons.push(`Bonus: +${bonus} (keywords)`);
    }

    console.log(`[Scorer] "${title}": Base=${cleanedText.length} + Bonus=${bonus} = ${score}`);

    return { ...section, score, reasons };
}

export function scoreSections(sections: Section[]): ScoredSection[] {
    console.log("[Scorer] Starting scoring...");
    return sections.map(calculateScore);
}

/**
 * Phase 4: Selection
 * Selects the best section from the scored sections.
 * Strategy:
 * 1. Filter sections with score >= 50.
 * 2. If no sections pass, fallback to the single highest-scoring section.
 * 3. Sort filtered sections by score descending.
 * 4. Take the top 30% (candidate pool).
 * 5. Randomly select one from the pool.
 */
export function selectBestSection(scoredSections: ScoredSection[]): ScoredSection | null {
    if (scoredSections.length === 0) return null;

    // 1. Filter by minimum score
    let candidates = scoredSections.filter(s => s.score >= 50);

    // 2. Fallback if no candidates
    if (candidates.length === 0) {
        console.log("[Selector] No sections passed minimum score. Falling back to highest scoring section.");
        // Sort by score descending
        const sorted = [...scoredSections].sort((a, b) => b.score - a.score);
        return sorted[0];
    }

    // 3. Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    // 4. Take top 30%
    const poolSize = Math.ceil(candidates.length * 0.3);
    const pool = candidates.slice(0, poolSize);

    console.log(`[Selector] Pool Size: ${pool.length} (Top 30% of ${candidates.length} candidates)`);
    pool.forEach(s => console.log(`  - [${s.score}] ${s.title}`));

    // 5. Random Selection
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    console.log(`[Selector] Selected: "${selected.title}" (Score: ${selected.score})`);
    return selected;
}
