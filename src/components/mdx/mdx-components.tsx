import YouTubePlayer from "@/components/courses/YouTubePlayer";
import { Callout } from './Callout';
import TextMask from '@/components/ui/TextMask';
import LessonImage from './LessonImage';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CodeBlock from './CodeBlock';
import { Tabs, Tab } from './Tabs';
import { Accordion } from './Accordion';
import { Badge } from './Badge';
import { Highlight } from './Highlight';
import { Terminal } from './Terminal';
import { Grid } from './Grid';
import { Card } from './Card';
import { Diff } from './Diff';

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);

export const mdxComponents = {
    h1: (props: any) => <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-text-primary tracking-tight" {...props} />,
    h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-text-primary tracking-tight border-b border-border-primary pb-2" {...props} />,
    h3: (props: any) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-text-primary" {...props} />,
    h4: (props: any) => <h4 className="text-lg font-bold mt-6 mb-3 text-text-primary" {...props} />,
    p: (props: any) => <p className="mb-6 leading-7 text-text-secondary text-lg" {...props} />,
    ul: (props: any) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-text-secondary text-lg" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-text-secondary text-lg" {...props} />,
    li: (props: any) => <li className="pl-1" {...props} />,
    a: (props: any) => {
        const { href, ...rest } = props;

        // Fix for MDX links without protocol
        let fixedHref = href;
        if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('/') && !href.startsWith('#')) {
            // Assume it's an external link and add https://
            fixedHref = `https://${href}`;
        }

        // Check if it's an external link
        const isExternalLink = fixedHref && (fixedHref.startsWith('http://') || fixedHref.startsWith('https://'));

        return (
            <a
                href={fixedHref}
                className="text-accent-primary hover:text-accent-primary/80 underline decoration-2 underline-offset-2 transition-colors"
                {...(isExternalLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...rest}
            />
        );
    },
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-accent-primary pl-6 italic my-8 text-text-secondary bg-bg-secondary py-4 pr-4 rounded-r-lg" {...props} />
    ),
    hr: (props: any) => <hr className="my-12 border-border-primary" {...props} />,
    table: (props: any) => <div className="overflow-x-auto my-8"><table className="min-w-full divide-y divide-border-primary text-left text-sm" {...props} /></div>,
    th: (props: any) => <th className="bg-bg-secondary p-4 font-semibold text-text-primary" {...props} />,
    td: (props: any) => <td className="p-4 border-t border-border-primary text-text-secondary" {...props} />,
    img: LessonImage,
    YouTube: YouTubePlayer,
    code: (props: any) => {
        const { className, children } = props;
        const match = /language-(\w+)/.exec(className || '');
        return match ? (
            <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
        ) : (
            <code className="bg-bg-tertiary text-accent-primary px-1.5 py-0.5 rounded-md font-mono text-sm border border-border-primary" {...props}>
                {children}
            </code>
        );
    },
    pre: (props: any) => <div {...props} />,
    Callout,
    TextMask,
    CodeBlock,
    Tabs,
    Tab,
    Accordion,
    Badge,
    Highlight,
    Terminal,
    Grid,
    Card,
    Diff,
};
