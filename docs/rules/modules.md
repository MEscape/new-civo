# Module Rules

- Each business capability lives under `modules/<module>`.
- A module may contain `domain`, `application`, `infrastructure`, and `presentation`.
- `domain` contains models, errors, and ports.
- `application` contains commands and queries.
- `infrastructure` contains implementations of ports and external integrations.
- `presentation` contains actions, DTOs, and module-specific components.
- Server Actions are framework adapters; they live in `presentation/actions` and only call application use cases. See [`nextjs.md`](nextjs.md).
- Module-specific components belong in `presentation/components`.
- Shared UI components belong outside modules.
- A module must not import another module's infrastructure or internal implementation details.
- Cross-module communication must use the other module's public API.
- `index.ts` exposes the module's intentional public API.
- Internal implementation details must not be exported from the module public API.
- File and directory naming follows [`naming.md`](naming.md).
