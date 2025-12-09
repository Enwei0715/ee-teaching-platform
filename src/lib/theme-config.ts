
// Shared configuration for Lesson Appearance to ensure consistency between Content and Skeletons

export const themeStyles = {
    default: {
        wrapper: 'bg-bg-primary',
        text: 'text-text-primary',
        prose: 'prose-invert', // Dark mode defaults
        border: 'border-border-primary',
        skeletonBase: 'bg-white/10', // bone color
        skeletonPanel: 'glass-panel',
    },
    light: {
        wrapper: 'bg-white',
        text: 'text-slate-900',
        // Force specific colors to override any global dark mode defaults
        prose: 'prose-slate prose-headings:text-slate-900! prose-p:text-slate-800! prose-strong:text-slate-900! prose-code:text-slate-900! prose-li:text-slate-800! [&_h1]:text-slate-900! [&_h2]:text-slate-900! [&_h3]:text-slate-900! [&_strong]:text-slate-900! [&_code]:text-slate-900!',
        border: 'border-slate-200',
        skeletonBase: 'bg-slate-200',
        skeletonPanel: 'bg-white border border-slate-200',
    },
    sepia: {
        wrapper: 'bg-[#f4ecd8]',
        text: 'text-[#433422]', // Darker brown for better contrast
        // Warm tones with high contrast - explicit overrides for specific elements
        // Using !important via tailwind (!) to force override any inherited dark mode styles
        prose: 'prose-stone prose-headings:text-[#433422]! prose-p:text-[#433422]! prose-strong:text-[#2d2317]! prose-code:text-[#433422]! prose-li:text-[#433422]! [&_h1]:text-[#2d2317]! [&_h2]:text-[#2d2317]! [&_h3]:text-[#2d2317]! [&_strong]:text-[#2d2317]! [&_code]:text-[#433422]!',
        border: 'border-[#d3cbb7]',
        skeletonBase: 'bg-[#e2d8b8]',
        skeletonPanel: 'bg-[#f4ecd8] border border-[#d3cbb7]',
    },
    navy: {
        wrapper: 'bg-[#0f172a]',
        text: 'text-slate-200',
        prose: 'prose-invert prose-blue',
        border: 'border-blue-900/30',
        skeletonBase: 'bg-blue-900/30',
        skeletonPanel: 'bg-[#1e293b] border border-blue-900/30',
    }
};

// Font Size Configuration - Scaled up for better visibility
// We provide both Tailwind class AND explicit CSS value for robust scaling
export const fontSizes = {
    small: {
        class: 'prose-sm',
        cssValue: '0.875rem'
    },
    medium: {
        class: 'prose-lg', // Bumped up default
        cssValue: '1.125rem'
    },
    large: {
        class: 'prose-xl',   // Much larger
        cssValue: '1.4rem'
    }
};
