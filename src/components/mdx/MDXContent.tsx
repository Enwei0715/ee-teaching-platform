'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdxComponents } from './mdx-components';

interface Props {
    source: MDXRemoteSerializeResult;
    courseId?: string;
    lessonId?: string;
}

export default function MDXContent({ source, courseId, lessonId }: Props) {
    const componentsWithContext = {
        ...mdxComponents,
        Quiz: () => null, // Legacy component placeholder to prevent crashes
    };

    return <MDXRemote {...source} components={componentsWithContext} />;
}
