'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Quiz from '@/components/course/Quiz';
import { mdxComponents } from './mdx-components';

interface Props {
    source: MDXRemoteSerializeResult;
    courseId?: string;
    lessonId?: string;
}

export default function MDXContent({ source, courseId, lessonId }: Props) {
    const componentsWithContext = {
        ...mdxComponents,
        Quiz: (props: any) => (
            <Quiz
                {...props}
                courseId={courseId || props.courseId}
                lessonId={lessonId || props.lessonId}
            />
        ),
    };

    return <MDXRemote {...source} components={componentsWithContext} />;
}
