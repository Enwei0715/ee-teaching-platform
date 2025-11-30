import { NextResponse } from 'next/server';
import { parseSections, scopeSections } from '@/lib/ai/quiz-algorithm';
import { generateSectionId } from '@/lib/content-utils';

export async function GET() {
    const mockMarkdown = `
# Course Title

## 1. Introduction
Content for intro.

## 1.1 Concept A
Content for concept A.

## 1.2 Concept B
Content for concept B.

### 1.2.1 Detail B1
Deep dive.
`;

    const sections = parseSections(mockMarkdown);

    // Test Scoping
    const targetId = "1-2-concept-b"; // Expected ID for "1.2 Concept B"
    const scoped = scopeSections(sections, targetId);

    return NextResponse.json({
        generatedIds: sections.map(s => ({ title: s.title, id: s.id })),
        targetId,
        scopedCount: scoped.length,
        scopedSections: scoped.map(s => s.title),
        manualTest: {
            "1.1 Test": generateSectionId("1.1 Test"),
            "Section 1": generateSectionId("Section 1"),
            "1.2.3 Deep Dive": generateSectionId("1.2.3 Deep Dive")
        }
    });
}
