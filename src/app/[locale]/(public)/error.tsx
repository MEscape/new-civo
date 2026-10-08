'use client';

import { useTranslations } from 'next-intl';

import { RouteErrorPanel } from '@components/shared/route-error-panel';

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('app');

    return (
        <RouteErrorPanel
            title={t('routeError.title')}
            description={t('routeError.description')}
            retryLabel={t('routeError.retry')}
            onRetry={reset}
        />
    );
}
