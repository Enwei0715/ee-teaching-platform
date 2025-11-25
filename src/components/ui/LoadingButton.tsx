import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export default function LoadingButton({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    className = '',
    ...props
}: LoadingButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`inline-flex items-center justify-center gap-2 ${className} ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? loadingText : children}
        </button>
    );
}
