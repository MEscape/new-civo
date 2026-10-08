import type { ReactNode } from 'react';

import { cn } from '@lib/utils';

import type { ComponentProps } from '../../../application/contracts/component-platform-constraints';

type SectionTone = ComponentProps<'section'>['tone'];

const TONE_CLASSES = {
  default: '',
  muted: 'bg-surface',
} as const satisfies Record<SectionTone, string>;

export interface SectionBlockProps {
  readonly tone: SectionTone;
  readonly children: ReactNode;
}

/**
 * Groups child components under one background. It adds no padding of its
 * own: the children are sections that already space themselves, and a
 * second layer would double the gap.
 */
export function SectionBlock({ tone, children }: SectionBlockProps) {
  return <div className={cn('w-full', TONE_CLASSES[tone])}>{children}</div>;
}
