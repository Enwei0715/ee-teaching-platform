import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trophy, Clock, Activity, PlayCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { getAllCourses, getCourseStructure } from "@/lib/mdx";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    // Fetch user data including streak
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { streak: true }
    });

    // Fetch user progress
    const progress = await prisma.userProgress.findMany({
        where: { userId: session.user.id },
    });

    // Get all courses
    const allCourses = getAllCourses();

    // Calculate detailed course progress
    const courseProgressMap = new Map();
    const courseNextLessonMap = new Map();
    const courseLastAccessedMap = new Map();

    for (const course of allCourses) {
        const lessons = await getCourseStructure(course.id);
        const totalLessons = lessons.length;
        const lessonIds = new Set(lessons.map(l => l.id));

        const courseProgress = progress.filter((p: any) => p.courseId === course.id);
        const courseLessonsCompleted = courseProgress.filter((p: any) => p.completed && lessonIds.has(p.lessonId)).length;

        const percentage = totalLessons > 0 ? Math.min(100, Math.round((courseLessonsCompleted / totalLessons) * 100)) : 0;

        // Find the most recent access time for this course
        if (courseProgress.length > 0) {
            const lastAccessed = courseProgress.reduce((latest: Date, current: any) => {
                return new Date(current.updatedAt) > new Date(latest) ? current.updatedAt : latest;
            }, courseProgress[0].updatedAt);
            courseLastAccessedMap.set(course.id, new Date(lastAccessed));
        }

        courseProgressMap.set(course.id, { percentage, completed: courseLessonsCompleted, total: totalLessons });

        // Find next lesson
        let nextLesson = null;
        for (const lesson of lessons) {
            const isCompleted = courseProgress.some((p: any) => p.lessonId === lesson.id && p.completed);
            if (!isCompleted) {
                nextLesson = { ...lesson, slug: lesson.id };
                break;
            }
        }
        if (nextLesson) {
            courseNextLessonMap.set(course.id, nextLesson);
        }
    }

    // Stats Calculations
    const completedLessons = progress.filter((p: any) => p.completed).length;

    // Courses in progress: > 0% and < 100%
    const coursesInProgressCount = allCourses.filter(course => {
        const prog = courseProgressMap.get(course.id);
        return prog && prog.percentage > 0 && prog.percentage < 100;
    }).length;

    // Calculate total time spent (in hours)
    const totalSeconds = progress.reduce((acc: number, curr: any) => acc + (curr.timeSpent || 0), 0);
    // Estimate 15 mins (900s) per completed lesson if timeSpent is 0
    const estimatedSeconds = completedLessons * 900;
    // Use the larger of recorded time or estimate
    const finalSeconds = Math.max(totalSeconds, estimatedSeconds);
    const hoursLearned = (finalSeconds / 3600).toFixed(1);

    const streak = user?.streak || 0;

    // Filter and Sort Active Courses
    const activeCourses = allCourses
        .filter(course => {
            const prog = courseProgressMap.get(course.id);
            return prog && prog.percentage > 0 && prog.percentage < 100;
        })
        .sort((a, b) => {
            const dateA = courseLastAccessedMap.get(a.id) || new Date(0);
            const dateB = courseLastAccessedMap.get(b.id) || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

    // Recommended Courses (Not started yet)
    const recommendedCourses = allCourses
        .filter(course => {
            const prog = courseProgressMap.get(course.id);
            return !prog || prog.percentage === 0;
        })
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome back, {session.user.name}!</h1>
                    <p className="text-gray-400 mt-2">Here's an overview of your learning progress.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-lg">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Courses in Progress</p>
                                <h3 className="text-2xl font-bold text-white">{coursesInProgressCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-900/30 text-green-400 rounded-lg">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Lessons Completed</p>
                                <h3 className="text-2xl font-bold text-white">{completedLessons}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Hours Learned</p>
                                <h3 className="text-2xl font-bold text-white">{hoursLearned}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-lg">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Current Streak</p>
                                <h3 className="text-2xl font-bold text-white">{streak} Day{streak !== 1 ? 's' : ''}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Recommended */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                            {activeCourses.length > 0 ? (
                                activeCourses.map(course => {
                                    const progressData = courseProgressMap.get(course.id);
                                    const nextLesson = courseNextLessonMap.get(course.id);

                                    return (
                                        <Link key={course.id} href={nextLesson ? `/courses/${course.slug}/${nextLesson.slug}` : `/courses/${course.slug}`} className="block p-6 border-b border-gray-800 hover:bg-gray-800 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.level === 'Beginner' ? 'text-green-300 bg-green-900/30' : course.level === 'Intermediate' ? 'text-amber-300 bg-amber-900/30' : 'text-red-300 bg-red-900/30'}`}>
                                                    {course.level}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4">
                                                {nextLesson ? `Next: ${nextLesson.title}` : 'Course Completed!'}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>{progressData.completed} / {progressData.total} Lessons</span>
                                                <span>{progressData.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progressData.percentage}%` }}></div>
                                            </div>
                                            <div className="flex items-center text-sm text-indigo-400 font-medium">
                                                <PlayCircle size={16} className="mr-2" /> {nextLesson ? 'Continue Lesson' : 'Review Course'}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 mb-4">You haven't started any courses yet.</p>
                                    <Link href="/courses" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Recommended for You</h2>
                        <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                            <div className="space-y-4">
                                {recommendedCourses.map(course => (
                                    <Link key={course.id} href={`/courses/${course.slug}`} className="flex gap-3 group cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                            <BookOpen size={20} className="text-gray-500 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{course.title}</h4>
                                            <p className="text-xs text-gray-400 line-clamp-1">{course.description}</p>
                                        </div>
                                    </Link>
                                ))}
                                {recommendedCourses.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">You've started all available courses!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
