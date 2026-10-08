import { Container, Section } from '@components/layout/layout-primitives';
import { Skeleton } from '@components/ui/skeleton';

import { useTranslations } from '@i18n/client';

export default function AuthLoading() {
  const t = useTranslations('auth');

  return (
    <Container className="max-w-md">
      <Section className="space-y-8" aria-busy="true">
        <p role="status" className="sr-only">
          {t('loading')}
        </p>
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </Section>
    </Container>
  );
}
