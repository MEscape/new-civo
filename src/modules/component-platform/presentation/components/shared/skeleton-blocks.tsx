import type { ReactNode } from 'react';

import { Container, Grid, Section } from '@components/layout/layout-primitives';
import type { GridColumns } from '@components/layout/layout-primitives';
import { Card, CardContent } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

import { useTranslations } from '@i18n/client';


const MAX_PLACEHOLDERS = 8;
const PLACEHOLDER_KEYS = Array.from(
  { length: MAX_PLACEHOLDERS },
  (_, index) => `placeholder-${String(index)}`
);

function placeholderKeys(count: number): readonly string[] {
  return PLACEHOLDER_KEYS.slice(0, count);
}

export interface SectionSkeletonProps {
  readonly children: ReactNode;
  readonly tone?: 'default' | 'muted';
  readonly containerClassName?: string;
  readonly withHeading?: boolean;
}

/** Says once, politely, what a busy region is waiting for; the blocks themselves are hidden. */
export function LoadingAnnouncement() {
  const t = useTranslations('componentPlatform');
  return (
    <p role="status" className="sr-only">
      {t('states.loading')}
    </p>
  );
}

/** Section chrome (heading bar + container) shared by every skeleton. */
export function SectionSkeleton({
  children,
  tone = 'default',
  containerClassName,
  withHeading = true,
}: SectionSkeletonProps) {
  return (
    <Section tone={tone} aria-busy="true">
      <LoadingAnnouncement />
      <Container className={containerClassName}>
        {withHeading && <Skeleton className="mb-6 h-7 w-56" />}
        {children}
      </Container>
    </Section>
  );
}

export interface CardGridSkeletonProps {
  readonly columns: GridColumns;
  readonly count?: number;
  readonly withImage?: boolean;
}

export function CardGridSkeleton({
  columns,
  count = columns,
  withImage = false,
}: CardGridSkeletonProps) {
  return (
    <Grid columns={columns}>
      {placeholderKeys(count).map((key) => (
        <Card key={key} className="overflow-hidden">
          {withImage && <Skeleton className="h-40 w-full rounded-none" />}
          <CardContent className="space-y-3 pt-5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

export function RowListSkeleton({ rows = 4 }: { readonly rows?: number }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        {placeholderKeys(rows).map((key) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton({
  className = 'h-72',
}: {
  readonly className?: string;
}) {
  return <Skeleton className={`w-full ${className}`} />;
}
