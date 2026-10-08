import type { NotFoundAppError } from '@lib/errors';
import { err, ok } from '@lib/result';
import type { AppResult } from '@lib/result';
import { assertNever } from '@lib/utils';

import { pageNodeNotFound } from '../errors/builder-errors';

import {
  childrenOf,
  findNode,
  flattenNodes,
  isInSubtree,
  locateNode,
} from './tree-operations';

import type { FlatNode, Placement } from './tree-operations';
import type { NestingPolicy } from '../models/component-catalog';
import type { PageNodeId } from '../models/ids';
import type { PageNode } from '../models/page-node';


/*
 * Pure drag-and-drop placement. It turns "the pointer is at Y over node N"
 * into a policy-checked drop target, knowing nothing about the DOM, React or
 * any drag library. Node rects are plain numbers the presentation layer
 * measures and passes in.
 */

export type DropPosition = 'before' | 'after' | 'inside';

export interface Rect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

/** What is being dragged. `id: null` is a component fresh from the palette. */
export interface ActiveDrag {
  readonly id: PageNodeId | null;
  readonly type: string;
}

/**
 * Where a drop would land. `root` is the empty page; `relative` is a sibling
 * of `targetNodeId`; `inside` appends to a container.
 */
export type DropTarget =
  | {
      readonly kind: 'relative';
      readonly targetNodeId: PageNodeId;
      readonly position: 'before' | 'after';
      readonly parentId: PageNodeId | null;
    }
  | {
      readonly kind: 'inside';
      readonly targetNodeId: PageNodeId;
      readonly parentId: PageNodeId;
      readonly index: number;
    }
  | { readonly kind: 'root'; readonly index: number };

/** The hovered node and its parent. Both `FlatNode` and `NodeLocation` fit. */
type DropAnchor = Pick<FlatNode, 'node' | 'parentId'>;

/**
 * The top and bottom bands of a hovered node that resolve to before/after.
 * Generous (30%) so reordering is easy to hit; the middle resolves to
 * "inside" only for containers.
 */
const EDGE_BAND_RATIO = 0.3;
const MIDPOINT_RATIO = 0.5;

/**
 * An empty container is entirely "inside". A container with children offers
 * before/after from the outside; dropping inside it is done by hovering one
 * of its children, which is more precise than an ambiguous whole-container zone.
 */
export function resolveDropPosition(
  pointerY: number,
  targetRect: Rect,
  targetAcceptsChildren: boolean,
  targetIsEmpty: boolean
): DropPosition {
  if (targetAcceptsChildren && targetIsEmpty) {return 'inside';}

  const relativeY =
    targetRect.height > 0
      ? (pointerY - targetRect.top) / targetRect.height
      : MIDPOINT_RATIO;
  if (relativeY < EDGE_BAND_RATIO) {return 'before';}
  if (relativeY > 1 - EDGE_BAND_RATIO) {return 'after';}
  if (targetAcceptsChildren) {return 'inside';}
  return relativeY < MIDPOINT_RATIO ? 'before' : 'after';
}

/**
 * Callers have already excluded the dragged node and its subtree
 * (`isOwnSubtree`), so no self-check is repeated here.
 */
function relativeTarget(
  tree: readonly PageNode[],
  active: ActiveDrag,
  anchor: DropAnchor,
  position: 'before' | 'after',
  policy: NestingPolicy
): DropTarget | null {
  const parent =
    anchor.parentId === null ? null : findNode(tree, anchor.parentId);
  if (anchor.parentId !== null && parent === null) {return null;}
  // Before/after makes the node a sibling, so the PARENT must accept it.
  if (!policy.canNest(parent?.type ?? null, active.type)) {return null;}

  return {
    kind: 'relative',
    targetNodeId: anchor.node.id,
    position,
    parentId: anchor.parentId,
  };
}

function insideTarget(
  node: PageNode,
  active: ActiveDrag,
  policy: NestingPolicy
): DropTarget | null {
  if (!policy.canNest(node.type, active.type)) {return null;}
  return {
    kind: 'inside',
    targetNodeId: node.id,
    parentId: node.id,
    index: node.children.length,
  };
}

/** True when `targetId` is the dragged node or lies inside it: never a valid drop. */
function isOwnSubtree(
  tree: readonly PageNode[],
  active: ActiveDrag,
  targetId: PageNodeId
): boolean {
  if (active.id === null) {return false;}
  if (active.id === targetId) {return true;}
  const activeNode = findNode(tree, active.id);
  return activeNode === null || isInSubtree(activeNode, targetId);
}

/**
 * The drop target for a pointer at `pointerY` over node `targetId`, or
 * `null` when the drop would be invalid. The UI never shows an indicator for
 * an operation the tree refuses.
 */
export function resolveDropTargetForNode(
  tree: readonly PageNode[],
  active: ActiveDrag,
  targetId: PageNodeId,
  pointerY: number,
  targetRect: Rect,
  policy: NestingPolicy
): DropTarget | null {
  const location = locateNode(tree, targetId);
  if (location === null || isOwnSubtree(tree, active, targetId)) {return null;}

  const position = resolveDropPosition(
    pointerY,
    targetRect,
    policy.acceptsChildren(location.node.type),
    location.node.children.length === 0
  );
  return position === 'inside'
    ? insideTarget(location.node, active, policy)
    : relativeTarget(tree, active, location, position, policy);
}

/**
 * The drop target for a pointer over empty canvas: after the last root
 * node, or the start of an empty page.
 */
export function resolveDropTargetAtCanvasEnd(
  tree: readonly PageNode[],
  active: ActiveDrag,
  policy: NestingPolicy
): DropTarget | null {
  const lastRoot = tree.at(-1);
  if (lastRoot === undefined) {
    return policy.canNest(null, active.type)
      ? { kind: 'root', index: 0 }
      : null;
  }
  if (lastRoot.id === active.id) {return null;}
  return relativeTarget(
    tree,
    active,
    { node: lastRoot, parentId: null },
    'after',
    policy
  );
}

/**
 * Keyboard movement: the next LEGAL target one step up (`-1`) or down (`1`)
 * in render order. It skips the dragged node's own subtree and positions
 * the tree refuses, so a keypress never gets stuck on an illegal neighbour.
 */
export function stepDropTarget(
  tree: readonly PageNode[],
  active: ActiveDrag,
  currentTargetId: PageNodeId,
  direction: -1 | 1,
  policy: NestingPolicy
): DropTarget | null {
  const flat = flattenNodes(tree);
  const currentIndex = flat.findIndex(
    (entry) => entry.node.id === currentTargetId
  );
  if (currentIndex === -1) {return null;}

  for (
    let index = currentIndex + direction;
    index >= 0 && index < flat.length;
    index += direction
  ) {
    const candidate = flat[index];
    if (
      candidate === undefined ||
      isOwnSubtree(tree, active, candidate.node.id)
    )
      {continue;}
    const target = relativeTarget(
      tree,
      active,
      candidate,
      direction === -1 ? 'before' : 'after',
      policy
    );
    if (target !== null) {return target;}
  }
  return null;
}

/**
 * Turns a drop target into the concrete insertion point `moveNode` and
 * `insertNode` expect. A node moving later within its own siblings shifts
 * everything after it left by one once lifted out, so the index is
 * compensated here, once, instead of at every call site.
 */
export function resolvePlacement(
  tree: readonly PageNode[],
  activeId: PageNodeId | null,
  target: DropTarget
): AppResult<Placement, NotFoundAppError> {
  switch (target.kind) {
    case 'root':
      return ok({ parentId: null, index: target.index });
    case 'inside':
      return ok({ parentId: target.parentId, index: target.index });
    case 'relative': {
      const siblings = childrenOf(tree, target.parentId);
      if (siblings === null) {return err(pageNodeNotFound());}
      const targetIndex = siblings.findIndex(
        (node) => node.id === target.targetNodeId
      );
      if (targetIndex === -1) {return err(pageNodeNotFound());}

      const activeIndex =
        activeId === null
          ? -1
          : siblings.findIndex((node) => node.id === activeId);
      const base = target.position === 'before' ? targetIndex : targetIndex + 1;
      const isLiftedFromBefore =
        activeIndex !== -1 && activeIndex < targetIndex;
      return ok({
        parentId: target.parentId,
        index: isLiftedFromBefore ? base - 1 : base,
      });
    }
    default:
      return assertNever(target);
  }
}
