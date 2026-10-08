import { Container, Section } from '@components/layout/layout-primitives';
import { Skeleton } from '@components/ui/skeleton';

import { LoadingAnnouncement } from '../../shared/skeleton-blocks';

export function MapBlockSkeleton() {
  return (
    <Section aria-busy="true">
      <LoadingAnnouncement />
      <Container>
        <Skeleton className="mb-6 h-8 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </Container>
    </Section>
  );
}
