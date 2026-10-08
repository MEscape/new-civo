# Global Components (`@components`)

This directory contains the global React components for the application, organized by their role and scope.

## Available Modules

### `@components/ui` (UI Library)

Our core UI components are built using **shadcn/ui** and **Radix UI** primitives. They have been extensively customized and adjusted to perfectly integrate with our specific design token system, ensuring visual consistency across the application.

Instead of relying on external icon libraries, we use our own custom SVG icons defined locally in `icons.tsx`.

- **Available Primitives:** Accordion, Alert, Avatar, Badge, Button, Card, Dialog, Dropdown Menu, Icons, Input, Select, Separator, Sheet, Skeleton, Switch, Table, Tabs, Toolbar Link, and Tooltip.
- _Note:_ Always prefer using these existing components over creating custom ones for fundamental UI elements.

### `@components/shared` (Shared Components)

Composite or application-specific components that reuse `@components/ui` primitives for recurring patterns (like forms).

- `text-field.tsx`: Reusable text input field wrapper.
- `select-field.tsx`: Reusable select dropdown field wrapper.
- `field-message.tsx`: Form field validation message wrapper.

### `@components/layout` (Layout Primitives)

Components responsible for structural layout constraints and shells.

- `layout-primitives.tsx`: Contains core layout wrappers and containers used to structure pages and sections.

### `@components/providers` (Context Providers)

Global React Context providers that wrap the application or specific trees to supply state and configuration.

- `i18n-provider.tsx`: Server-side i18n initialization.
- `i18n-client-provider.tsx`: Client-side i18n context provider.
