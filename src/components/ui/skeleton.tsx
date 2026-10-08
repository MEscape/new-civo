import type { HTMLAttributes } from "react";

import { cn } from "@lib/utils";

/**
 * Animated loading placeholder. Uses `bg-canvas` to stay on-theme.
 *
 * Rule §19: never use raw gray values for skeletons — they must track the
 * current theme's canvas color.
 */
function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-token bg-canvas", className)}
            aria-busy="true"
            aria-live="polite"
            {...props}
        />
    );
}

export { Skeleton };
