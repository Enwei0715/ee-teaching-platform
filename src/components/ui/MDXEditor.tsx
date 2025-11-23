'use client';

import { useRef } from 'react';
import { Bold, Italic, Link as LinkIcon, Image, Code, Video } from 'lucide-react';

interface MDXEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    id?: string;
    required?: boolean;
    className?: string;
}

export default function MDXEditor({
    value,
    onChange,
    placeholder = 'Write your content here... (Markdown supported)',
    rows = 8,
    id = 'mdx-editor',
    required = false,
    className = '',
}: MDXEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (before: string, after: string = '', cursorOffset: number = 0) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + cursorOffset;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const insertYouTube = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const template = '<YouTube url="" />';
        const newText = value.substring(0, start) + template + value.substring(start);

        onChange(newText);

        // Place cursor inside the quotes
        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + '<YouTube url="'.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    };

    return (
        <div className={className}>
            {/* Toolbar */}
            <div className="flex gap-1 p-2 bg-bg-tertiary border border-border-primary rounded-t-lg">
                <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](url)')}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="Link"
                >
                    <LinkIcon size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('![', '](url)')}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="Image"
                >
                    <Image size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="Code"
                >
                    <Code size={16} />
                </button>
                <button
                    type="button"
                    onClick={insertYouTube}
                    className="p-2 hover:bg-bg-primary rounded transition-colors text-text-secondary hover:text-text-primary"
                    title="YouTube Video"
                >
                    <Video size={16} />
                </button>
                <div className="ml-auto text-xs text-text-secondary self-center px-2 flex gap-3">
                    <span className="hover:text-text-primary cursor-help" title="Markdown help">
                        Markdown supported
                    </span>
                </div>
            </div>

            {/* Editor Textarea */}
            <textarea
                ref={textareaRef}
                id={id}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full bg-bg-tertiary border border-border-primary rounded-b-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-primary resize-none font-mono text-sm"
                placeholder={placeholder}
            />
        </div>
    );
}
