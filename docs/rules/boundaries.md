# Dependency Boundary Rules

- Domain must not import Next.js, React, Prisma, infrastructure, or presentation.
- Application must not import React, Next.js, infrastructure implementations, or presentation.
- Application depends on domain ports, not infrastructure implementations.
- Infrastructure may depend on domain and application contracts.
- Presentation may depend on application contracts and presentation types.
- Presentation must not import infrastructure.
- Shared UI must not import business modules.
- Modules must not import another module's infrastructure.
- Framework entry points may depend on application and presentation APIs.
- Cross-module access must use the target module's public API. See [`modules.md`](modules.md).
- Dependency direction must be enforced by linting.
