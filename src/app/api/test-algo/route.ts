import { NextResponse } from 'next/server';
import { parseSections, scopeSections, scoreSections } from '@/lib/ai/quiz-algorithm';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { markdown, currentHeadingId } = body;

        if (!markdown) {
            return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
        }

        console.log("--- Test Algo Start ---");

        // Phase 1: Parse
        const sections = parseSections(markdown);

        // Phase 2: Scope
        const scopedSections = scopeSections(sections, currentHeadingId || null);

        // Phase 3: Score
        const scoredSections = scoreSections(scopedSections);

        console.log("--- Test Algo End ---");

        return NextResponse.json({
            originalCount: sections.length,
            scopedCount: scopedSections.length,
            sections: sections.map(s => ({ id: s.id, title: s.title })),
            scopedSections: scopedSections.map(s => ({ id: s.id, title: s.title })),
            scoredSections: scoredSections.map(s => ({
                id: s.id,
                title: s.title,
                score: s.score,
                reasons: s.reasons
            })),
            logs: "Check server console for detailed logs"
        });

    } catch (error) {
        console.error("Test Algo Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
