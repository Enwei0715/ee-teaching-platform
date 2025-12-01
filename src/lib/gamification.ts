import prisma from "@/lib/prisma";

export const LEVELS = {
    1: 0,
    2: 100,
    3: 300,
    4: 600,
    5: 1000,
    6: 1500,
    7: 2100,
    8: 2800,
    9: 3600,
    10: 4500,
    // Formula: Level L requires roughly 100 * (L-1)^2 / 2 or similar curve
};

export async function addXP(userId: string, amount: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true }
    });

    if (!user) return null;

    const newXP = user.xp + amount;
    // Simple level formula: Level = floor(sqrt(XP / 100)) + 1
    // Example: 0 XP = L1, 100 XP = L2, 400 XP = L3, 900 XP = L4
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    const levelUp = newLevel > user.level;

    await prisma.user.update({
        where: { id: userId },
        data: {
            xp: newXP,
            level: newLevel
        }
    });

    return {
        newXP,
        newLevel,
        levelUp,
        xpGained: amount
    };
}

export async function updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastLoginDate: true, streak: true }
    });

    if (!user) return null;

    const now = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    let newStreak = user.streak;
    let shouldUpdate = false;

    if (lastLogin) {
        // Normalize dates to midnight (UTC) to compare "days"
        // We use UTC to avoid timezone complexity on the server side for now
        // Ideally, we'd use the user's local timezone, but that requires storing it.
        const today = new Date(now);
        today.setUTCHours(0, 0, 0, 0);

        const last = new Date(lastLogin);
        last.setUTCHours(0, 0, 0, 0);

        const diffTime = today.getTime() - last.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already logged in today (UTC), keep streak
            shouldUpdate = true; // Update lastLoginDate time
        } else if (diffDays === 1) {
            // Logged in yesterday (UTC), increment streak
            newStreak += 1;
            shouldUpdate = true;
        } else {
            // Missed a day or more, reset streak
            newStreak = 1;
            shouldUpdate = true;
        }
    } else {
        // First login ever
        newStreak = 1;
        shouldUpdate = true;
    }

    if (shouldUpdate) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                lastLoginDate: now,
                streak: newStreak
            }
        });
    }

    return { streak: newStreak, updated: shouldUpdate };
}

import { checkBadges as checkBadgesLib } from './badges';

export async function checkBadges(userId: string, event: any) {
    return await checkBadgesLib(userId, event);
}

import { calculatePotentialXP, calculateQuizXP as calcQuizXP, Difficulty } from './xp';

export function calculateLessonXP(options: { contentLength?: number; difficulty?: Difficulty } = {}): number {
    const { contentLength = 0, difficulty = 'Intermediate' } = options;
    return calculatePotentialXP(contentLength, difficulty);
}

export function calculateQuizXP(difficulty: Difficulty = 'Intermediate'): number {
    return calcQuizXP(difficulty);
}

export function calculateProjectXP(difficulty: Difficulty = 'Intermediate'): number {
    const baseXP = 100;
    const multipliers: Record<Difficulty, number> = {
        'Beginner': 1,
        'Intermediate': 1.5,
        'Advanced': 2,
        'Expert': 2.5
    };
    const multiplier = multipliers[difficulty] || 1.5;
    return Math.round(baseXP * multiplier);
}
export function getLevelProgress(totalXP: number) {
    const currentLevel = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const nextLevel = currentLevel + 1;

    const xpForCurrentLevel = 100 * Math.pow(currentLevel - 1, 2);
    const xpForNextLevel = 100 * Math.pow(nextLevel - 1, 2);

    const xpInCurrentLevel = totalXP - xpForCurrentLevel;
    const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

    return {
        currentLevel,
        nextLevel,
        xpInCurrentLevel,
        xpRequiredForNextLevel,
        progressPercent,
        totalXP
    };
}
