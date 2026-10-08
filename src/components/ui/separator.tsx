import type { HTMLAttributes } from "react";

import { cn } from "@lib/utils";

/**
 * Visual separator. Uses `bg-border` so it always respects the theme.
 *
 * `role="separator"` is set only for actual visual/semantic dividers.
 * For decorative spacers, pass `aria-hidden="true"` at the call site.
 */
function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }) {
    return (
        <div
            role={decorative ? "none" : "separator"}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
