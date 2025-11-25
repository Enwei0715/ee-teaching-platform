import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        isLoading = false,
        loadingText,
        children,
        disabled,
        variant = 'primary',
        size = 'md',
        className = '',
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

        const variantStyles = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
            danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
            ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 focus:ring-gray-500'
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg'
        };

        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={`
                    ${baseStyles}
                    ${variantStyles[variant]}
                    ${sizeStyles[size]}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className={isLoading ? 'opacity-70' : ''}>
                    {isLoading && loadingText ? loadingText : children}
                </span>
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
