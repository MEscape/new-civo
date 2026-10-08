'use client';

import { useTranslations } from 'next-intl';

import { Container, PageHeading, Section } from '@components/layout/layout-primitives';

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('auth');
    return (
        <Container className="max-w-md">
            <Section className="space-y-8 text-center">
                <PageHeading 
                    title={t('pageError.title')} 
                    description={error.message || t('pageError.description')}
                />
                <button
                    onClick={() => { reset(); }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
                >
                    {t('pageError.retry')}
                </button>
            </Section>
        </Container>
    );
}
