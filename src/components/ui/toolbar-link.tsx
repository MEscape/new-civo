import type { AnchorHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@lib/utils";

/**
 * ToolbarLink — an `<a>` element styled to match toolbar icon-buttons.
 *
 * Used for anchor elements inside toolbars where a `<Button variant="ghost">` is
 * not appropriate (e.g., Next.js `<Link>` passthrough, external links).
 *
 * Sizing mirrors `Button size="icon"` from button.tsx so toolbar items line up
 * regardless of whether they render a <button> or an <a>.
 *
 * `label` is rendered as an `<sr-only>` span so icon-only links are accessible
 * without cluttering the visual layout.
 *
 * `newTab` is a shorthand for `target="_blank" rel="noopener noreferrer"`.
 */
export interface ToolbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Visible icon to render inside the link. */
    icon?: ReactNode;
    /** Accessible label (rendered as sr-only text when provided). */
    label?: string;
    /** Opens the link in a new tab with safe rel attributes. */
    newTab?: boolean;
    /** Whether to render in a visually active/selected state. */
    active?: boolean;
}

const ToolbarLink = forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
    ({ className, icon, label, newTab, active, children, ...props }, ref) => (
        <a
            ref={ref}
            data-slot="toolbar-link"
            data-active={active ?? undefined}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener noreferrer" : undefined}
            aria-label={label}
            className={cn(
                // Same geometry as `<Button size="icon">` so toolbar items align
                "inline-flex size-8 shrink-0 items-center justify-center rounded-token-sm",
                "text-copy-muted transition-colors",
                // Hover — matches Button ghost
                "hover:bg-canvas hover:text-copy",
                // Active / selected state
                "data-[active]:bg-canvas data-[active]:text-copy",
                // Focus ring — accent token, consistent system-wide
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                // SVG children inherit colour and stay non-interactive
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            {icon}
            {label && <span className="sr-only">{label}</span>}
            {children}
        </a>
    ),
);
ToolbarLink.displayName = "ToolbarLink";

export { ToolbarLink };
