import type { ReactNode } from 'react';

import { getComponentDefinition } from '../../../application/contracts/component-platform-constraints';

import type { LoadContent } from './load-content';
import type {
  ComponentProps,
  RegisteredComponentName,
  RenderContext,
} from '../../../application/contracts/component-platform-constraints';

/** What the page renderer hands to every component besides its own props. */
export interface RenderServices {
  readonly loadContent: LoadContent;
}

export interface ComponentRenderInput<TProps> extends RenderServices {
  readonly props: TProps;
  readonly context: RenderContext;
  /** Already rendered child nodes; empty for a component that cannot have children. */
  readonly children: ReactNode;
}

export interface ComponentImplementationSpec<TProps> {
  readonly render: (input: ComponentRenderInput<TProps>) => ReactNode;
  /**
   * Shown while an async (data-loading) component streams in. Leave it out
   * for components that render synchronously.
   */
  readonly skeleton?: ReactNode;
}

/** Everything the renderer knows about one node when it asks for its content. */
export interface NodeRenderRequest extends RenderServices {
  readonly rawProps: unknown;
  readonly context: RenderContext;
  readonly children: ReactNode;
}

/** A component with its props type erased: the props are parsed inside, so a caller needs no cast. */
export interface ComponentImplementation {
  render(request: NodeRenderRequest): ReactNode;
  readonly skeleton: ReactNode;
}

/**
 * Ties a UI implementation to its definition by the component's name. The
 * stored props are parsed with the definition's own prop fields before they
 * reach `render`, so the component only ever sees props of the type it
 * declared, and the type is written once, in the definition.
 */
export function implementComponent<T extends RegisteredComponentName>(
  type: T,
  spec: ComponentImplementationSpec<ComponentProps<T>>,
): ComponentImplementation {
  const definition = getComponentDefinition(type);
  return {
    render: ({ rawProps, context, children, loadContent }) =>
      spec.render({ props: definition.parseProps(rawProps), context, children, loadContent }),
    skeleton: spec.skeleton ?? null,
  };
}
