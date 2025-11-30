
export interface XPConfig {
    baseXP: number;
    perChunkXP: number;
    characterChunkSize: number;
    maxBonus: number;
}

export const XP_CONFIG: XPConfig = {
    baseXP: 50,
    perChunkXP: 10,
    characterChunkSize: 500,
    maxBonus: 100
};

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

const difficultyMultipliers: Record<Difficulty, number> = {
    'Beginner': 1,
    'Intermediate': 1.2,
    'Advanced': 1.5,
    'Expert': 2
};

export function calculatePotentialXP(contentLength: number, difficulty: Difficulty = 'Intermediate'): number {
    const { baseXP, characterChunkSize, perChunkXP, maxBonus } = XP_CONFIG;

    // Calculate length bonus
    const chunks = Math.floor(contentLength / characterChunkSize);
    const lengthBonus = Math.min(chunks * perChunkXP, maxBonus);

    // Apply difficulty multiplier
    const multiplier = difficultyMultipliers[difficulty];

    return Math.round((baseXP + lengthBonus) * multiplier);
}

export function calculateQuizXP(difficulty: Difficulty = 'Intermediate'): number {
    // Fixed base XP for quizzes, independent of lesson length
    const baseQuizXP = 15;
    const multiplier = difficultyMultipliers[difficulty];
    return Math.round(baseQuizXP * multiplier);
}
