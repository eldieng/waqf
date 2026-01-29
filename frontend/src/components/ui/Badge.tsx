import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'urgent';
    size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
        const variants = {
            default: 'bg-gray-100 text-gray-700',
            success: 'bg-emerald-100 text-emerald-700',
            warning: 'bg-amber-100 text-amber-700',
            danger: 'bg-red-100 text-red-700',
            info: 'bg-blue-100 text-blue-700',
            urgent: 'bg-red-500 text-white animate-pulse',
        };

        const sizes = {
            sm: 'text-xs px-2.5 py-0.5',
            md: 'text-sm px-3 py-1',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center font-medium rounded-full',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';

export { Badge };
