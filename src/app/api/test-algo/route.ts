import { NextResponse } from 'next/server';
import { parseSections } from '@/lib/ai/quiz-algorithm';
import { generateSectionId } from '@/lib/content-utils';

export async function POST(req: Request) {
    try {
        const { lessonContent, targetHeadingText } = await req.json();

        if (!lessonContent) {
            return NextResponse.json({ error: "lessonContent is required" }, { status: 400 });
        }

        // 1. Run the parser (Backend Logic)
        const sections = parseSections(lessonContent);

        // 2. Simulate Frontend ID Generation (Frontend Logic)
        // This simulates what TableOfContents.tsx does now
        const frontendTargetId = generateSectionId(targetHeadingText || '');

        // 3. Find Match
        // The backend parser uses generateSectionId internally for section.id
        const matchIndex = sections.findIndex(s => s.id === frontendTargetId);

        // 4. Return Verbose Debug Info
        return NextResponse.json({
            status: matchIndex !== -1 ? "MATCH_FOUND" : "MATCH_FAILED",
            debug_info: {
                received_heading_text: targetHeadingText,
                generated_frontend_id: frontendTargetId,
                found_index: matchIndex,
                total_sections: sections.length
            },
            backend_parsed_sections: sections.map((s, i) => ({
                index: i,
                original_title: s.title,
                generated_id: s.id,
                is_match: s.id === frontendTargetId
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
