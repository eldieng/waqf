import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated';
    hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = true, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-100',
            outlined: 'bg-white border-2 border-gray-200',
            elevated: 'bg-white shadow-xl',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl overflow-hidden',
                    variants[variant],
                    hover &&
                    'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardImage = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string }
>(({ className, src, alt, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('relative h-48 bg-gray-100 overflow-hidden', className)}
        {...props}
    >
        {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt || ''}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
        ) : (
            children
        )}
    </div>
));
CardImage.displayName = 'CardImage';

const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-xl font-bold text-gray-900', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-gray-600 mt-2', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pt-0 flex items-center', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardHeader,
    CardImage,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
