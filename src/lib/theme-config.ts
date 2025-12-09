
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
    // Light theme removed as requested
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
    },
    midnight: {
        wrapper: 'bg-black',
        text: 'text-gray-300',
        prose: 'prose-invert prose-gray',
        border: 'border-gray-800',
        skeletonBase: 'bg-gray-900',
        skeletonPanel: 'bg-black border border-gray-800',
    },
    forest: {
        wrapper: 'bg-[#051a15]', // Deep forest green
        text: 'text-emerald-100',
        prose: 'prose-invert prose-emerald',
        border: 'border-emerald-900/30',
        skeletonBase: 'bg-emerald-900/20',
        skeletonPanel: 'bg-[#022c22] border border-emerald-900/30',
    },
    amethyst: {
        wrapper: 'bg-[#150f25]', // Deep purple
        text: 'text-purple-100',
        prose: 'prose-invert prose-violet',
        border: 'border-purple-900/30',
        skeletonBase: 'bg-purple-900/20',
        skeletonPanel: 'bg-[#2e1065] border border-purple-900/30',
    }
};

// Font Size Configuration - Scaled up for better visibility
// We provide both Tailwind class AND explicit CSS value for robust scaling
export const fontSizes = {
    small: {
        class: 'prose-base', // Was prose-sm (0.875rem), now base (1rem) for better readability as minimum
        cssValue: '1rem'
    },
    medium: {
        class: 'prose-xl', // Was prose-lg (1.125rem), now xl (1.25rem)
        cssValue: '1.25rem'
    },
    large: {
        class: 'prose-2xl',   // Was prose-xl (1.4rem), now 2xl (1.5rem)
        cssValue: '1.5rem'
    }
};
