'use client';

import { useTranslations } from 'next-intl';

import { RouteErrorPanel } from '@components/shared/route-error-panel';

export default function AuthError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('auth');

    return (
        <RouteErrorPanel
            title={t('pageError.title')}
            description={t('pageError.description')}
            retryLabel={t('pageError.retry')}
            onRetry={reset}
        />
    );
}
