'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
    chart: string;
    children?: string;
}

export function Mermaid({ chart, children }: MermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Use chart prop or children content
    const chartDefinition = chart || children || '';

    useEffect(() => {
        const renderChart = async () => {
            if (!containerRef.current || !chartDefinition.trim()) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Dynamically import mermaid
                const mermaid = (await import('mermaid')).default;

                // Configure mermaid
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose', // Allow HTML in nodes
                    themeVariables: {
                        primaryColor: '#6366f1',
                        primaryTextColor: '#e2e8f0',
                        primaryBorderColor: '#4f46e5',
                        lineColor: '#64748b',
                        secondaryColor: '#8b5cf6',
                        tertiaryColor: '#ec4899',
                        background: '#1e293b',
                        mainBkg: '#1e293b',
                        secondBkg: '#334155',
                        tertiaryBkg: '#475569',
                        textColor: '#e2e8f0',
                        border1: '#475569',
                        border2: '#64748b',
                        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    },
                });

                // Decode HTML entities (e.g. &gt; -> >)
                const txt = document.createElement('textarea');
                txt.innerHTML = chartDefinition;
                let decodedChart = txt.value.trim();

                // Auto-quote unquoted content inside square brackets []
                // This fixes issues with special characters like () inside labels
                // e.g. T1[Task (High)] -> T1["Task (High)"]
                decodedChart = decodedChart.replace(/\[([^"\]]+)\]/g, '["$1"]');

                // Generate unique ID for this diagram
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Render the diagram
                const { svg } = await mermaid.render(id, decodedChart);

                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError(`${err instanceof Error ? err.message : 'Failed to render diagram'}\n\nSource:\n${chartDefinition}`);
                setIsLoading(false);
            }
        };

        renderChart();
    }, [chartDefinition]);

    if (!chartDefinition.trim()) {
        return (
            <div className="my-8 p-4 bg-bg-secondary rounded-lg border border-border-primary">
                <p className="text-text-secondary text-sm">No chart data provided</p>
            </div>
        );
    }

    return (
        <div className="my-8">
            {isLoading && (
                <div className="flex items-center justify-center p-8 bg-bg-secondary rounded-lg border border-border-primary">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm font-medium mb-2">Failed to render Mermaid diagram</p>
                    <pre className="text-xs text-red-300 overflow-x-auto">{error}</pre>
                </div>
            )}

            <div
                ref={containerRef}
                className={`flex justify-center items-center bg-bg-secondary rounded-lg border border-border-primary p-6 ${isLoading || error ? 'hidden' : ''}`}
            />
        </div>
    );
}
