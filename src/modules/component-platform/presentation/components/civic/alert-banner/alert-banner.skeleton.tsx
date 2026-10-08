import { Container } from '@components/layout/layout-primitives';
import { Skeleton } from '@components/ui/skeleton';

import { LoadingAnnouncement } from '../../shared/skeleton-blocks';

export function AlertBannerSkeleton() {
  return (
    <div className="py-4" aria-busy="true">
      <LoadingAnnouncement />
      <Container>
        <Skeleton className="h-14 w-full" />
      </Container>
    </div>
  );
}
