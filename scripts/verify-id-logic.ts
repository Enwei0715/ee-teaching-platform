import { generateSectionId } from '../src/lib/content-utils';

const testCases = [
    { input: "1. Introduction", expected: "1-introduction" },
    { input: "1.1 Concept", expected: "1-1-concept" },
    { input: "1.2.3 Deep Dive", expected: "1-2-3-deep-dive" },
    { input: "Section 1: Basics", expected: "section-1-basics" },
    { input: "一、導論", expected: "一-導論" }, // Chinese handling
    { input: "1.1  Double Space", expected: "1-1-double-space" },
    { input: "End.", expected: "end" } // Trailing dot
];

console.log("--- Verifying ID Generation Logic ---");
let errors = 0;

testCases.forEach(({ input, expected }) => {
    const actual = generateSectionId(input);
    if (actual !== expected) {
        console.error(`[FAIL] Input: "${input}"`);
        console.error(`       Expected: "${expected}"`);
        console.error(`       Actual:   "${actual}"`);
        errors++;
    } else {
        console.log(`[PASS] "${input}" -> "${actual}"`);
    }
});

if (errors === 0) {
    console.log("\n✅ All tests passed!");
} else {
    console.error(`\n❌ ${errors} tests failed.`);
    process.exit(1);
}
