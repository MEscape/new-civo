import { Container } from '@components/layout/layout-primitives';
import { Skeleton } from '@components/ui/skeleton';

export function AlertBannerSkeleton() {
  return (
    <div className="py-4" aria-busy="true">
      <Container>
        <Skeleton className="h-14 w-full" />
      </Container>
    </div>
  );
}
