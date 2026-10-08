import React, { type HTMLAttributes } from "react";

import { cn } from "@lib/utils";

/**
 * Avatar container. Displays an image when present, falls back to initials.
 *
 * Tokens: `bg-secondary` as the default fill (neutral mid-tone from the
 * brand palette), `text-secondary-foreground` for the initials text.
 */
function Avatar({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "relative flex size-10 shrink-0 overflow-hidden rounded-full",
                className,
            )}
            {...props}
        />
    );
}

function AvatarImage({ className, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            className={cn("aspect-square size-full object-cover", className)}
            alt={alt}
            {...props}
        />
    );
}

/**
 * Shown when image is absent or fails to load.
 * Initials must be ≤ 2 characters for legibility.
 */
function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "flex size-full items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground",
                className,
            )}
            {...props}
        />
    );
}

export { Avatar, AvatarFallback, AvatarImage };
