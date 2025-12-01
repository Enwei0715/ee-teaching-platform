import prisma from "@/lib/prisma";
import { nanoid } from 'nanoid';

export async function generateCertificate(userId: string, courseId: string) {
    // Check if certificate already exists
    const existing = await prisma.certificate.findFirst({
        where: {
            userId,
            courseId
        }
    });

    if (existing) return { certificate: existing, isNew: false };

    // Verify course completion
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { lessons: true }
    });

    if (!course) throw new Error("Course not found");

    const progress = await prisma.userProgress.findMany({
        where: {
            userId,
            courseId,
            status: 'COMPLETED' // Only count completed lessons
        }
    });

    // Check if all published lessons are completed
    const publishedLessons = course.lessons.filter(l => l.published);
    const isComplete = publishedLessons.every(l => progress.some(p => p.lessonId === l.id));

    if (!isComplete) return null;

    // Generate Certificate
    const certificate = await prisma.certificate.create({
        data: {
            userId,
            courseId,
            code: nanoid(10).toUpperCase()
        }
    });

    return { certificate, isNew: true };
}
