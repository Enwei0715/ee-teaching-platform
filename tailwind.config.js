/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: "#0d1117",
                    secondary: "#161b22",
                    tertiary: "#21262d",
                },
                border: {
                    primary: "#30363d",
                    secondary: "#6e7681",
                },
                text: {
                    primary: "#ffffff",
                    secondary: "#8b949e",
                    link: "#58a6ff",
                },
                accent: {
                    primary: "#2f81f7",
                    success: "#238636",
                    danger: "#da3633",
                    warning: "#d29922",
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        // Mobile-first: Reduced indentation for small screens
                        'ul, ol': {
                            paddingLeft: '1rem', // Reduced from default ~1.625rem
                        },
                        'ul > li, ol > li': {
                            paddingLeft: '0.25rem',
                        },
                        // Nested lists - even tighter on mobile
                        'ul > li > ul, ol > li > ol': {
                            paddingLeft: '0.75rem', // Much tighter for nested lists
                        },
                        'ul > li > ul > li, ol > li > ol > li': {
                            paddingLeft: '0.25rem',
                        },
                    },
                },
                // Desktop breakpoints: Restore more standard indentation
                md: {
                    css: {
                        'ul, ol': {
                            paddingLeft: '1.5rem',
                        },
                        'ul > li > ul, ol > li > ol': {
                            paddingLeft: '1.25rem',
                        },
                    },
                },
                lg: {
                    css: {
                        'ul, ol': {
                            paddingLeft: '1.625rem',
                        },
                        'ul > li > ul, ol > li > ol': {
                            paddingLeft: '1.5rem',
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
