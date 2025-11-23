import prisma from '@/lib/prisma';

export type Post = {
    slug: string;
    meta: {
        title: string;
        date: string;
        excerpt: string;
        author?: string;
        category?: string;
        image?: string;
        [key: string]: any;
    };
    content: string;
};

export type CourseLesson = {
    courseId: string;
    lessonId: string;
    meta: {
        title: string;
        order: number;
        [key: string]: any;
    };
    content: string;
};

export type Project = {
    slug: string;
    meta: {
        title: string;
        description: string;
        image?: string;
        tags?: string[]; // Kept for compatibility, mapped from technologies/tools
        tools?: string[];
        materials?: string[];
        technologies?: string[];
        features?: string[];
        level?: string;
        difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
        [key: string]: any;
    };
    content: string;
};

export type Course = {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    slug: string;
    meta: {
        title: string;
        description: string;
        level: 'Beginner' | 'Intermediate' | 'Advanced';
        image?: string;
    };
    modules?: number;
    duration?: string;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!post) return null;

    return {
        slug: post.slug,
        meta: {
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: post.excerpt || '',
            author: post.author.name || 'EE Master Team',
            category: post.category || 'General',
            image: post.image || undefined,
        },
        content: post.content,
    };
};

export const getAllBlogPosts = async (): Promise<Post[]> => {
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    });

    return posts.map(post => ({
        slug: post.slug,
        meta: {
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: post.excerpt || '',
            author: post.author.name || 'EE Master Team',
            category: post.category || 'General',
            image: post.image || undefined,
        },
        content: post.content,
    }));
};

export const getBlogPost = (slug: string) => {
    return getPostBySlug(slug);
};

export const getCourseLesson = async (courseSlug: string, lessonSlug: string): Promise<CourseLesson | null> => {
    const course = await prisma.course.findUnique({
        where: { slug: courseSlug }
    });

    if (!course) return null;

    const lesson = await prisma.lesson.findFirst({
        where: {
            courseId: course.id,
            slug: lessonSlug,
        }
    });

    if (!lesson) return null;

    return {
        courseId: courseSlug,
        lessonId: lesson.slug,
        meta: {
            title: lesson.title,
            order: lesson.order,
        },
        content: lesson.content,
    };
};

export const getCourseStructure = async (courseSlug: string) => {
    const course = await prisma.course.findUnique({
        where: { slug: courseSlug }
    });

    if (!course) return [];

    const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        select: {
            slug: true,
            title: true,
            order: true,
        }
    });

    return lessons.map(lesson => ({
        id: lesson.slug,
        title: lesson.title,
        order: lesson.order,
    }));
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    const project = await prisma.project.findUnique({
        where: { slug },
    });

    if (!project) return null;

    return {
        slug: project.slug,
        meta: {
            title: project.title,
            description: project.description,
            image: project.image || undefined,
            level: project.level || 'Beginner',
            difficulty: (project.level as any) || 'Beginner',
            tools: project.tools,
            materials: project.materials,
            technologies: project.technologies,
            features: project.features,
            tags: project.technologies, // Map technologies to tags for compatibility
        },
        content: project.content,
    };
};

export const getAllProjects = async (): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return projects.map(project => ({
        slug: project.slug,
        meta: {
            title: project.title,
            description: project.description,
            image: project.image || undefined,
            level: project.level || 'Beginner',
            difficulty: (project.level as any) || 'Beginner',
            tools: project.tools,
            materials: project.materials,
            technologies: project.technologies,
            features: project.features,
            tags: project.technologies,
        },
        content: project.content,
    }));
};

export const getAllCourses = async (): Promise<Course[]> => {
    const courses = await prisma.course.findMany({
        where: { published: true },
        include: {
            _count: {
                select: { lessons: true }
            }
        }
    });

    return courses.map(course => ({
        id: course.slug, // Using slug as ID for routing compatibility
        title: course.title,
        description: course.description,
        level: (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        slug: course.slug,
        meta: {
            title: course.title,
            description: course.description,
            level: (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
            image: course.image || undefined,
        },
        modules: course._count.lessons,
        duration: course.duration || undefined,
    }));
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { lessons: true }
            }
        }
    });

    if (!course) return null;

    return {
        id: course.slug,
        title: course.title,
        description: course.description,
        level: (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        slug: course.slug,
        meta: {
            title: course.title,
            description: course.description,
            level: (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
            image: course.image || undefined,
        },
        modules: course._count.lessons,
        duration: course.duration || undefined,
    };
};

