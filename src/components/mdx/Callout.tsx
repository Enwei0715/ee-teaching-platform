import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
    type?: 'info' | 'warning' | 'success' | 'error';
    title?: string;
    children: React.ReactNode;
}

const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
    error: XCircle,
};

const styles = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200',
    success: 'bg-green-500/10 border-green-500/20 text-green-200',
    error: 'bg-red-500/10 border-red-500/20 text-red-200',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const Icon = icons[type];

    return (
        <div className={cn('my-6 p-4 rounded-lg border flex gap-3', styles[type])}>
            <Icon className="shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
                {title && <div className="font-bold mb-1">{title}</div>}
                <div className="text-sm leading-relaxed opacity-90">{children}</div>
            </div>
        </div>
    );
}
