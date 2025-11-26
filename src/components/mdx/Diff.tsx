interface DiffProps {
    before: string;
    after: string;
    language?: string;
}

export function Diff({ before, after, language = 'javascript' }: DiffProps) {
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');

    return (
        <div className="my-6 border border-border-primary rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border-primary">
                <div className="bg-red-900/20">
                    <div className="px-4 py-2 bg-red-900/30 border-b border-red-800/50 font-semibold text-sm text-red-200">
                        Before
                    </div>
                    <pre className="p-4 text-sm font-mono text-red-200 overflow-x-auto">
                        {beforeLines.map((line, i) => (
                            <div key={i} className="leading-6">
                                <span className="text-red-400 select-none mr-4">-</span>
                                {line}
                            </div>
                        ))}
                    </pre>
                </div>
                <div className="bg-green-900/20">
                    <div className="px-4 py-2 bg-green-900/30 border-b border-green-800/50 font-semibold text-sm text-green-200">
                        After
                    </div>
                    <pre className="p-4 text-sm font-mono text-green-200 overflow-x-auto">
                        {afterLines.map((line, i) => (
                            <div key={i} className="leading-6">
                                <span className="text-green-400 select-none mr-4">+</span>
                                {line}
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
}
