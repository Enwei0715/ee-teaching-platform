import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const root = process.cwd();

export type Post = {
    slug: string;
    meta: {
        title: string;
        date: string;
        excerpt: string;
        author?: string;
        category?: string;
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
        tags?: string[];
        components?: string[];
        level?: string;
        difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
        [key: string]: any;
    };
    content: string;
};

export const getPostBySlug = (slug: string): Post => {
    const realSlug = slug.replace(/\.mdx$/, '');
    const filePath = path.join(root, 'src/content/blog', `${realSlug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
        slug: realSlug,
        meta: data as Post['meta'],
        content,
    };
};

export const getAllBlogPosts = (): Post[] => {
    const postsDirectory = path.join(root, 'src/content/blog');

    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const files = fs.readdirSync(postsDirectory);
    const posts = files
        .filter(file => file.endsWith('.mdx'))
        .map((file) => getPostBySlug(file));

    return posts.sort((a, b) => (new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()));
};

export const getBlogPost = (slug: string) => {
    return getPostBySlug(slug);
};

export const getCourseLesson = (courseId: string, lessonId: string): CourseLesson => {
    const realLessonId = lessonId.replace(/\.mdx$/, '');
    const filePath = path.join(root, 'src/content/courses', courseId, `${realLessonId}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
        courseId,
        lessonId: realLessonId,
        meta: data as CourseLesson['meta'],
        content,
    };
};

export const getCourseStructure = (courseId: string) => {
    const coursePath = path.join(root, 'src/content/courses', courseId);
    if (!fs.existsSync(coursePath)) return [];

    const files = fs.readdirSync(coursePath);
    const lessons = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
            const content = fs.readFileSync(path.join(coursePath, file), 'utf8');
            const { data } = matter(content);
            return {
                id: file.replace(/\.mdx$/, ''),
                title: data.title,
                order: data.order || 999,
            };
        })
        .sort((a, b) => a.order - b.order);

    return lessons;
};

export const getProjectBySlug = (slug: string): Project => {
    const realSlug = slug.replace(/\.mdx$/, '');
    const filePath = path.join(root, 'src/content/projects', `${realSlug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
        slug: realSlug,
        meta: data as Project['meta'],
        content,
    };
};

export const getAllProjects = (): Project[] => {
    const projectsDirectory = path.join(root, 'src/content/projects');
    if (!fs.existsSync(projectsDirectory)) return [];

    const files = fs.readdirSync(projectsDirectory);

    const projects = files
        .filter(file => file.endsWith('.mdx'))
        .map((file) => getProjectBySlug(file));
    return projects;
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
    };
    modules?: number;
};

export const getAllCourses = (): Course[] => {
    const coursesDir = path.join(root, 'src/content/courses');

    // Helper to count MDX files in a directory
    const countLessons = (dir: string) => {
        if (!fs.existsSync(dir)) return 0;
        return fs.readdirSync(dir).filter(file => file.endsWith('.mdx')).length;
    };

    const courses: Course[] = [
        {
            id: 'circuit-theory',
            title: 'Circuit Theory',
            description: 'Master the fundamentals of electrical circuits, from Ohm\'s law to complex network analysis.',
            level: 'Beginner',
            slug: 'circuit-theory',
            meta: {
                title: 'Circuit Theory',
                description: 'Master the fundamentals of electrical circuits, from Ohm\'s law to complex network analysis.',
                level: 'Beginner',
            },
            modules: countLessons(path.join(coursesDir, 'circuit-theory')),
        },
        {
            id: 'electronics',
            title: 'Analog Electronics',
            description: 'Dive into semiconductor physics, diodes, transistors, and amplifier design.',
            level: 'Intermediate',
            slug: 'electronics',
            meta: {
                title: 'Analog Electronics',
                description: 'Dive into semiconductor physics, diodes, transistors, and amplifier design.',
                level: 'Intermediate',
            },
            modules: countLessons(path.join(coursesDir, 'electronics')),
        },
        {
            id: 'digital-logic',
            title: 'Digital Logic Design',
            description: 'Understand boolean algebra, logic gates, and sequential circuits.',
            level: 'Beginner',
            slug: 'digital-logic',
            meta: {
                title: 'Digital Logic Design',
                description: 'Understand boolean algebra, logic gates, and sequential circuits.',
                level: 'Beginner',
            },
            modules: countLessons(path.join(coursesDir, 'digital-logic')),
        },
        {
            id: 'microcontrollers',
            title: 'Microcontrollers',
            description: 'Learn how to program and interface with microcontrollers like Arduino and STM32.',
            level: 'Intermediate',
            slug: 'microcontrollers',
            meta: {
                title: 'Microcontrollers',
                description: 'Learn how to program and interface with microcontrollers like Arduino and STM32.',
                level: 'Intermediate',
            },
            modules: countLessons(path.join(coursesDir, 'microcontrollers')),
        },
        {
            id: 'signals-systems',
            title: 'Signals & Systems',
            description: 'Analyze continuous and discrete-time signals and systems using Fourier and Laplace transforms.',
            level: 'Advanced',
            slug: 'signals-systems',
            meta: {
                title: 'Signals & Systems',
                description: 'Analyze continuous and discrete-time signals and systems using Fourier and Laplace transforms.',
                level: 'Advanced',
            },
            modules: countLessons(path.join(coursesDir, 'signals-systems')),
        },
    ];

    return courses.filter(course => fs.existsSync(path.join(coursesDir, course.id)));
};
