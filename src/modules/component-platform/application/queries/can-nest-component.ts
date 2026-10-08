import { ok } from '@lib/result';
import type { AppResult } from '@lib/result';

import type { PublicComponentPlatformDependencies } from '../component-platform-dependencies';

export interface CanNestComponentInput {
  /** `null`: directly on the page. */
  readonly parentType: string | null;
  readonly childType: string;
}

/** Whether `childType` may be placed under `parentType`. An unknown type simply cannot be nested. */
export class CanNestComponent {
  constructor(private readonly deps: PublicComponentPlatformDependencies) {}

  execute(input: CanNestComponentInput): AppResult<boolean, never> {
    return ok(this.deps.registry.canNest(input.parentType, input.childType));
  }
}
