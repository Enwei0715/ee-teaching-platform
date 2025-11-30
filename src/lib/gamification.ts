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

    if (lastLogin) {
        const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Check if same day (ignoring time)
        const isSameDay = now.toDateString() === lastLogin.toDateString();

        if (isSameDay) {
            // Already logged in today, do nothing to streak
            return { streak: newStreak, updated: false };
        } else if (diffDays <= 2) {
            // Consecutive day (allow some buffer for timezone/late night)
            // Ideally check if yesterday. 
            // Simple check: if not same day and diff is small.
            // Better: Check if yesterday.
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLogin.toDateString() === yesterday.toDateString()) {
                newStreak += 1;
            } else {
                // Missed a day? 
                // If diffDays is 1 (meaning strictly yesterday), streak++.
                // If diffDays > 1, reset.
                // Actually diffDays calculation above is rough.
                // Let's stick to date string comparison.
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    // Refined logic for "Yesterday"
    if (lastLogin) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last = new Date(lastLogin);
        last.setHours(0, 0, 0, 0);

        const diff = (today.getTime() - last.getTime()) / (1000 * 3600 * 24);

        if (diff === 0) {
            // Same day
            newStreak = user.streak;
        } else if (diff === 1) {
            // Yesterday
            newStreak = user.streak + 1;
        } else {
            // Missed days
            newStreak = 1;
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            lastLoginDate: now,
            streak: newStreak
        }
    });

    return { streak: newStreak, updated: true };
}

export async function checkBadges(userId: string) {
    // This would be called after specific events
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
