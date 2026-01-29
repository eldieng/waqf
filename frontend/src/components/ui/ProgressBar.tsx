import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    (
        {
            className,
            value,
            max = 100,
            showLabel = false,
            size = 'md',
            variant = 'primary',
            ...props
        },
        ref
    ) => {
        const percentage = Math.min(Math.round((value / max) * 100), 100);

        const sizes = {
            sm: 'h-2',
            md: 'h-3',
            lg: 'h-4',
        };

        const variants = {
            primary: 'from-emerald-500 to-teal-500',
            secondary: 'from-amber-500 to-orange-500',
            success: 'from-green-500 to-emerald-500',
            warning: 'from-yellow-500 to-amber-500',
        };

        return (
            <div ref={ref} className={cn('w-full', className)} {...props}>
                {showLabel && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                            <span className="font-bold text-emerald-600">
                                {value.toLocaleString()}
                            </span>{' '}
                            / {max.toLocaleString()}
                        </span>
                        <span className="font-bold text-emerald-600">{percentage}%</span>
                    </div>
                )}
                <div
                    className={cn(
                        'w-full bg-gray-200 rounded-full overflow-hidden',
                        sizes[size]
                    )}
                >
                    <div
                        className={cn(
                            'h-full bg-gradient-to-r rounded-full transition-all duration-500 ease-out',
                            variants[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={value}
                        aria-valuemin={0}
                        aria-valuemax={max}
                    />
                </div>
            </div>
        );
    }
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
