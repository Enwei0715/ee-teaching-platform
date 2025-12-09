
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
        prose: 'prose-slate prose-headings:text-slate-900 prose-p:text-slate-800 prose-strong:text-slate-900 prose-code:text-slate-900 prose-li:text-slate-800',
        border: 'border-slate-200',
        skeletonBase: 'bg-slate-200',
        skeletonPanel: 'bg-white border border-slate-200',
    },
    sepia: {
        wrapper: 'bg-[#f4ecd8]',
        text: 'text-[#433422]', // Darker brown for better contrast
        // Warm tones with high contrast
        prose: 'prose-stone prose-headings:text-[#433422] prose-p:text-[#5b4636] prose-strong:text-[#433422] prose-code:text-[#433422] prose-li:text-[#5b4636]',
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
