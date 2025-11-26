interface TerminalProps {
    children: React.ReactNode;
}

export function Terminal({ children }: TerminalProps) {
    return (
        <div className="my-6 rounded-lg overflow-hidden border border-border-primary shadow-lg">
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">terminal</span>
            </div>
            <pre className="bg-[#1e1e1e] p-4 text-green-400 font-mono text-sm overflow-x-auto">
                {children}
            </pre>
        </div>
    );
}
