"use client";

import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import React, { forwardRef } from "react";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { Icons } from "@components/ui/icons";

import { cn } from "@lib/utils";


const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef<
    React.ComponentRef<typeof SheetPrimitive.Overlay>,
    ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-copy/40 backdrop-blur-sm",
            "data-[state=open]:animate-sheet-overlay data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            className,
        )}
        {...props}
    />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
    "fixed z-50 flex flex-col gap-4 bg-surface p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom: "inset-x-0 bottom-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:animate-sheet-left sm:max-w-sm",
                right: "inset-y-0 right-0 h-full w-3/4 border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:animate-sheet-right sm:max-w-sm",
            },
        },
        defaultVariants: { side: "right" },
    },
);

interface SheetContentProps
    extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> { }

const SheetContent = forwardRef<React.ComponentRef<typeof SheetPrimitive.Content>, SheetContentProps>(
    ({ side = "right", className, children, ...props }, ref) => (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
                <SheetPrimitive.Close className="absolute right-4 top-4 rounded-token-sm p-1 text-copy-muted opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none disabled:pointer-events-none">
                    <Icons.close className="size-4" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
                {children}
            </SheetPrimitive.Content>
        </SheetPortal>
    ),
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

const SheetTitle = forwardRef<
    React.ComponentRef<typeof SheetPrimitive.Title>,
    ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("font-heading text-lg font-semibold text-copy", className)}
        {...props}
    />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef<
    React.ComponentRef<typeof SheetPrimitive.Description>,
    ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn("text-sm text-copy-muted", className)}
        {...props}
    />
));
SheetDescription.displayName = "SheetDescription";

export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetOverlay,
    SheetPortal,
    SheetTitle,
    SheetTrigger,
};
