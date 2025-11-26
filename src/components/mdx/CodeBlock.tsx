'use client';

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
    language?: string;
    code?: string;
    codeBase64?: string;
}

// Syntax highlighting function
const highlightCode = (code: string, lang: string): React.ReactNode[] => {
    const lines = code.split('\n');

    return lines.map((line, lineIndex) => {
        // Preserve empty lines
        if (!line.trim()) {
            return <span key={lineIndex}>&nbsp;</span>;
        }

        const tokens: React.ReactNode[] = [];
        let remaining = line;
        let tokenIndex = 0;

        // C/C++ syntax patterns
        const patterns = [
            // Preprocessor directives
            { regex: /^(#\s*include|#\s*define|#\s*ifdef|#\s*ifndef|#\s*endif|#\s*pragma)\b/, color: '#c586c0' },
            // Comments
            { regex: /^(\/\/.*|\/\*[\s\S]*?\*\/)/, color: '#6a9955' },
            // Strings
            { regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/, color: '#ce9178' },
            // Keywords (C/C++, JS, Python, Java, SQL, Bash)
            { regex: /^(int|char|void|float|double|long|short|unsigned|signed|struct|typedef|enum|const|static|extern|return|if|else|for|while|do|switch|case|default|break|continue|sizeof|auto|register|volatile|function|var|let|async|await|new|this|class|extends|import|export|from|def|elif|print|lambda|try|except|finally|raise|with|as|pass|global|nonlocal|True|False|None|null|undefined|NaN|public|private|protected|interface|implements|package|super|throws|boolean|byte|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|DROP|ALTER|JOIN|ON|GROUP|BY|ORDER|LIMIT|echo|source|fi|done|then|esac)\b/, color: '#569cd6' },
            // Numbers
            { regex: /^(\d+\.?\d*|\.\d+)/, color: '#b5cea8' },
            // Function calls
            { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/, color: '#dcdcaa' },
            // Operators
            { regex: /^([+\-*/%=<>!&|^~?:])/, color: '#d4d4d4' },
            // Brackets and parentheses
            { regex: /^([(){}\[\];,])/, color: '#d4d4d4' },
            // Identifiers
            { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)/, color: '#9cdcfe' },
        ];

        while (remaining.length > 0) {
            let matched = false;

            // Try to match patterns
            for (const { regex, color } of patterns) {
                const match = remaining.match(regex);
                if (match) {
                    tokens.push(
                        <span key={`${lineIndex}-${tokenIndex}`} style={{ color }}>
                            {match[0]}
                        </span>
                    );
                    remaining = remaining.substring(match[0].length);
                    tokenIndex++;
                    matched = true;
                    break;
                }
            }

            // If no pattern matched, consume one character
            if (!matched) {
                const char = remaining[0];
                tokens.push(
                    <span key={`${lineIndex}-${tokenIndex}`} style={{ color: '#d4d4d4' }}>
                        {char}
                    </span>
                );
                remaining = remaining.substring(1);
                tokenIndex++;
            }
        }

        return <span key={lineIndex}>{tokens}</span>;
    });
};

export default function CodeBlock({ className, children, language, code, codeBase64 }: CodeBlockProps) {
    const match = language ? [null, language] : /language-(\w+)/.exec(className || '');
    const lang = (match && match[1]) || 'text';

    let content = '';

    // Base64 decoding
    if (codeBase64) {
        try {
            if (typeof window === 'undefined') {
                content = Buffer.from(codeBase64, 'base64').toString('utf-8');
            } else {
                content = atob(codeBase64);
            }
        } catch (e) {
            console.error('CodeBlock: Failed to decode Base64', e);
            content = '❌ Error: Failed to decode code block';
        }
    }
    else if (code) {
        content = code;
    }
    else if (children) {
        if (typeof children === 'string') {
            content = children;
        } else {
            content = String(children || '');
        }
    }

    // Aggressive cleaning - remove backticks ONLY, preserve all other whitespace
    if (!codeBase64 && content) {
        // Only trim start/end, don't trim internal lines
        let trimmed = content;

        // Remove leading/trailing entirely empty lines
        while (trimmed.startsWith('\n')) trimmed = trimmed.substring(1);
        while (trimmed.endsWith('\n')) trimmed = trimmed.substring(0, trimmed.length - 1);

        // Remove backticks from start/end
        while (trimmed.length > 0 && (trimmed.charCodeAt(0) === 96 || trimmed[0] === '`')) {
            trimmed = trimmed.substring(1);
        }
        while (trimmed.length > 0 && (trimmed.charCodeAt(trimmed.length - 1) === 96 || trimmed[trimmed.length - 1] === '`')) {
            trimmed = trimmed.substring(0, trimmed.length - 1);
        }

        content = trimmed;
    }

    // Highlight code
    const highlightedLines = highlightCode(content, lang);

    return (
        <div className="relative group my-6">
            {/* Language badge */}
            <div className="absolute right-3 top-3 text-xs font-mono opacity-50 group-hover:opacity-100 transition-opacity z-10 px-2 py-1 bg-gray-800/80 rounded text-gray-400">
                {lang}
            </div>

            {/* Code block */}
            <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg bg-[#1e1e1e]">
                <div className="px-6 py-4 overflow-x-auto">
                    <table
                        style={{
                            width: '100%',
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            borderSpacing: 0,
                            borderCollapse: 'separate'
                        }}
                    >
                        <tbody>
                            {highlightedLines.map((line, index) => (
                                <tr key={index}>
                                    <td
                                        style={{
                                            color: '#858585',
                                            minWidth: '3em',
                                            paddingRight: '1.5em',
                                            paddingTop: '0',
                                            paddingBottom: '0',
                                            textAlign: 'right',
                                            verticalAlign: 'top',
                                            userSelect: 'none',
                                            border: 'none'
                                        }}
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        style={{
                                            paddingLeft: '0',
                                            paddingRight: '0',
                                            paddingTop: '0',
                                            paddingBottom: '0',
                                            whiteSpace: 'pre',
                                            verticalAlign: 'top',
                                            border: 'none'
                                        }}
                                    >
                                        {line}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
