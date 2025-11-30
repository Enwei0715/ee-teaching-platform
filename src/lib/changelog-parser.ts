import fs from 'fs';
import path from 'path';

export interface ChangelogItem {
    title: string;
    description: string;
}

export interface ChangelogCategory {
    title: string;
    items: ChangelogItem[];
}

export interface ChangelogEntry {
    version: string;
    title: string;
    date: string;
    categories: ChangelogCategory[];
}

export async function getChangelog(): Promise<ChangelogEntry[]> {
    const filePath = path.join(process.cwd(), 'CHANGELOG.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const entries: ChangelogEntry[] = [];
    const lines = fileContent.split('\n');

    let currentEntry: ChangelogEntry | null = null;
    let currentCategory: ChangelogCategory | null = null;

    const versionRegex = /^## v(\S+) - (.+) \((.+)\)/;
    const categoryRegex = /^[-*] \*\*(.+)\*\*:/;
    const itemRegex = /^\s+[-*] (\*\*(.+)\*\*: )?(.+)/;

    for (const line of lines) {
        const versionMatch = line.match(versionRegex);
        if (versionMatch) {
            if (currentEntry) {
                if (currentCategory) {
                    currentEntry.categories.push(currentCategory);
                    currentCategory = null;
                }
                entries.push(currentEntry);
            }

            currentEntry = {
                version: versionMatch[1],
                title: versionMatch[2],
                date: versionMatch[3],
                categories: []
            };
            continue;
        }

        if (!currentEntry) continue;

        const categoryMatch = line.match(categoryRegex);
        if (categoryMatch) {
            if (currentCategory) {
                currentEntry.categories.push(currentCategory);
            }
            currentCategory = {
                title: categoryMatch[1],
                items: []
            };
            continue;
        }

        const itemMatch = line.match(itemRegex);
        if (itemMatch && currentCategory) {
            // itemMatch[2] is the bold title (optional), itemMatch[3] is the description
            const title = itemMatch[2] || '';
            const description = itemMatch[3];

            currentCategory.items.push({
                title,
                description
            });
        }
    }

    // Push the last one
    if (currentEntry) {
        if (currentCategory) {
            currentEntry.categories.push(currentCategory);
        }
        entries.push(currentEntry);
    }

    return entries;
}
