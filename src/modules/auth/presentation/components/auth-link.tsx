import type { ComponentProps } from 'react';

import Link from 'next/link';

import { cn } from '@lib/utils';

/** A text link with the module's one link style; visible keyboard focus included. */
export function AuthLink({ className, ...props }: ComponentProps<typeof Link>) {
    return (
        <Link
            className={cn(
                'rounded-token text-sm font-medium text-copy underline underline-offset-4 hover:text-copy-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                className
            )}
            {...props}
        />
    );
}
