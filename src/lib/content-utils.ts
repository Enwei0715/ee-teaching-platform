/**
 * Generates a standardized ID from a section title.
 * This ensures consistency between Frontend (TOC) and Backend (Quiz Parser).
 */
export function generateSectionId(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/\./g, '-')      // Replace dots with dashes
        .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with dashes
        .replace(/[^\w\-\u4e00-\u9fa5]/g, '') // Remove all non-word chars (except dashes and Chinese characters)
        .replace(/-+/g, '-')      // Collapse multiple dashes
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}
