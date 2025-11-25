'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditMode } from '@/context/EditModeContext';
import { Check, X, Edit2 } from 'lucide-react';

interface EditableTextProps {
    // Common props
    defaultText: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    className?: string;
    multiline?: boolean;

    // Mode configuration
    mode?: 'static' | 'entity';

    // Static mode props
    contentKey?: string;

    // Entity mode props
    apiEndpoint?: string;
    fieldName?: string;
}

export default function EditableText({
    defaultText,
    tag: Tag = 'p',
    className = '',
    multiline = false,
    mode = 'static',
    contentKey,
    apiEndpoint,
    fieldName
}: EditableTextProps) {
    const { isEditMode } = useEditMode();
    const [content, setContent] = useState(defaultText);
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState(defaultText);
    const [loading, setLoading] = useState(mode === 'static'); // Only load for static

    // Fetch content on mount ONLY for static mode
    useEffect(() => {
        if (mode === 'entity') {
            setContent(defaultText);
            setTempContent(defaultText);
            setLoading(false);
            return;
        }

        if (!contentKey) return;

        const fetchContent = async () => {
            try {
                const res = await fetch(`/api/site-content?key=${contentKey}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.content) {
                        setContent(data.content);
                        setTempContent(data.content);
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch content for ${contentKey}`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [contentKey, mode, defaultText]);

    const handleSave = async () => {
        try {
            let res;
            if (mode === 'static') {
                if (!contentKey) throw new Error("contentKey required for static mode");
                res = await fetch('/api/site-content', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: contentKey, content: tempContent })
                });
            } else {
                // Entity mode
                if (!apiEndpoint || !fieldName) throw new Error("apiEndpoint and fieldName required for entity mode");
                res = await fetch(apiEndpoint, {
                    method: 'PATCH', // Assuming PATCH for partial updates
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [fieldName]: tempContent })
                });
            }

            if (res.ok) {
                setContent(tempContent);
                setIsEditing(false);
            } else {
                alert('Failed to save content');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save content');
        }
    };

    const handleCancel = () => {
        setTempContent(content);
        setIsEditing(false);
    };

    if (loading) {
        return <Tag className={className}>{defaultText}</Tag>;
    }

    if (isEditMode) {
        if (isEditing) {
            return (
                <div className="relative group block w-full">
                    {multiline ? (
                        <textarea
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            className={`w-full bg-gray-900 border border-indigo-500 rounded p-2 text-white outline-none min-h-[100px] ${className}`}
                            autoFocus
                            onClick={(e) => e.preventDefault()} // Prevent link click if inside link
                        />
                    ) : (
                        <input
                            type="text"
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            className={`w-full bg-gray-900 border border-indigo-500 rounded p-2 text-white outline-none ${className}`}
                            autoFocus
                            onClick={(e) => e.preventDefault()}
                        />
                    )}
                    <div className="absolute -top-8 right-0 flex gap-1 bg-gray-800 rounded p-1 shadow-lg z-10" onClick={(e) => e.preventDefault()}>
                        <button onClick={(e) => { e.preventDefault(); handleSave(); }} className="p-1 text-green-400 hover:bg-gray-700 rounded"><Check size={16} /></button>
                        <button onClick={(e) => { e.preventDefault(); handleCancel(); }} className="p-1 text-red-400 hover:bg-gray-700 rounded"><X size={16} /></button>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`relative border-2 border-dashed border-indigo-500/30 hover:border-indigo-500 rounded p-1 cursor-pointer transition-colors group ${className}`}
                onClick={(e) => {
                    e.preventDefault(); // Important: Stop propagation if inside a Link
                    e.stopPropagation();
                    setIsEditing(true);
                }}
            >
                <Tag>{content}</Tag>
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white rounded-bl text-xs">
                    <Edit2 size={12} />
                </div>
            </div>
        );
    }

    return <Tag className={className}>{content}</Tag>;
}
