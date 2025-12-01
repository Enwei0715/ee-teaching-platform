import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addXP, updateStreak, calculateLessonXP, calculateQuizXP, checkBadges, seedBadges } from "@/lib/gamification";
import { generateCertificate } from "@/lib/certificates";

export async function GET(
    request: Request,
    { params }: { params: { courseId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ completedLessonIds: [] });
    }

    try {
        // Resolve courseId slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: params.courseId },
            select: { id: true }
        });

        if (!course) {
            return NextResponse.json({ completedLessonIds: [] });
        }

        // Get all progress for this user in this course
        const userProgress = await prisma.userProgress.findMany({
            where: {
                userId: session.user.id,
                courseId: course.id,
            },
            include: {
                lesson: {
                    select: { slug: true }
                }
            }
        });

        // Create a map of lessonSlug -> status
        const progressMap: Record<string, string> = {};
        userProgress.forEach(p => {
            progressMap[p.lesson.slug] = p.status;
        });

        return NextResponse.json({
            progressMap,
            // Keep legacy field for backward compatibility if needed, or remove if safe
            completedLessonIds: userProgress.filter(p => p.status === 'COMPLETED').map(p => p.lesson.slug)
        });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        return NextResponse.json({ progressMap: {}, completedLessonIds: [] });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { courseId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { lessonId, lastElementId, timeSpent, completed, status } = body;

        if (!lessonId) {
            return new NextResponse("Missing lessonId", { status: 400 });
        }

        // Resolve courseId slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: params.courseId },
            select: { id: true }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Resolve lessonId slug to UUID
        const lesson = await prisma.lesson.findUnique({
            where: {
                courseId_slug: {
                    courseId: course.id,
                    slug: lessonId
                }
            },
            select: { id: true }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        // Check existing progress
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id
                }
            }
        });

        let newStatus = existingProgress?.status || 'IN_PROGRESS';

        // Gamification: Update Streak
        const streakResult = await updateStreak(session.user.id);

        let xpResult = null;
        let isPractice = false;
        let xpGained = 0;

        // Gamification: Award XP
        if (completed) {
            newStatus = 'COMPLETED'; // Ensure status is updated
            const wasAlreadyCompleted = existingProgress?.status === 'COMPLETED' || existingProgress?.status === 'REVIEWING';

            // Calculate Base XP
            let baseXP = 0;
            if (body.source === 'quiz') {
                // Quiz XP
                baseXP = calculateQuizXP('Intermediate');
            } else {
                // Lesson XP
                const lessonContent = await prisma.lesson.findUnique({
                    where: { id: lesson.id },
                    select: { content: true }
                });
                baseXP = calculateLessonXP({
                    contentLength: lessonContent?.content?.length || 0,
                    difficulty: 'Intermediate'
                });
            }

            // Apply Logic: Full XP for first time, 1/10th for repeat/review
            if (!wasAlreadyCompleted) {
                xpGained = baseXP;
            } else {
                // 1/10th XP for review/repeat
                xpGained = Math.max(1, Math.round(baseXP / 10));
                isPractice = true;
            }

            if (xpGained > 0) {
                xpResult = await addXP(session.user.id, xpGained);
            }
        }

        let progress;
        if (existingProgress) {
            progress = await prisma.userProgress.update({
                where: { id: existingProgress.id },
                data: {
                    lastElementId: lastElementId || undefined,
                    timeSpent: timeSpent ? { increment: timeSpent } : undefined,
                    status: newStatus
                }
            });
        } else {
            progress = await prisma.userProgress.create({
                data: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id,
                    lastElementId: lastElementId || null,
                    timeSpent: timeSpent || 0,
                    status: newStatus
                }
            });
        }

        // Check Badges & Certificates
        const earnedBadges: string[] = [];
        let certificate = null;
        let isNewCertificate = false;

        if (completed) {
            // Ensure badges exist
            await seedBadges();

            // Check Lesson Badges
            const lessonBadges = await checkBadges(session.user.id, { type: 'LESSON_COMPLETE' });
            earnedBadges.push(...lessonBadges);

            // Check Certificate
            const certResult = await generateCertificate(session.user.id, course.id);
            if (certResult) {
                certificate = certResult.certificate;
                isNewCertificate = certResult.isNew;

                if (certResult.isNew) {
                    // Award Course Completion Bonus
                    const bonusXP = 100;
                    const bonusResult = await addXP(session.user.id, bonusXP);
                    xpGained += bonusXP;

                    // Merge bonus result if level up happened
                    if (bonusResult?.levelUp) {
                        xpResult = bonusResult; // Keep the latest state
                    }
                }
            }
        }

        // Always check streak badges if streak is sufficient, to catch missed badges
        if ((streakResult?.streak || 0) >= 7) {
            const streakBadges = await checkBadges(session.user.id, { type: 'STREAK_UPDATE' });
            earnedBadges.push(...streakBadges);
        }

        if (xpResult?.levelUp) {
            const levelBadges = await checkBadges(session.user.id, { type: 'LEVEL_UP' });
            earnedBadges.push(...levelBadges);
        }

        return NextResponse.json({
            ...progress,
            gamification: {
                streak: streakResult?.streak || 0,
                streakUpdated: streakResult?.updated || false,
                xpGained,
                isPractice,
                xp: xpResult,
                earnedBadges,
                certificate,
                courseCompleted: !!certificate && isNewCertificate
            }
        });
    } catch (error) {
        console.error("Error updating course progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
