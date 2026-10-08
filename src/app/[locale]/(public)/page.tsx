import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { Container, PageHeading, Section } from '@components/layout/layout-primitives';

import { requireLocale } from '@i18n';

import { buildLocalizedMetadata } from '@lib/seo';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const locale = requireLocale((await params).locale);
    const t = await getTranslations({ locale, namespace: 'controls.metadata' });

    return buildLocalizedMetadata({
        locale,
        pathname: '',
        title: t('title'),
        description: t('description'),
    });
}

export default function LocaleRootPage() {
    return (
        <Container className="max-w-4xl">
            <Section className="space-y-8 mt-12 text-center">
                <PageHeading 
                    title="Civo" 
                    description="Municipal & Smart City Website Builder"
                />
                <p className="text-muted-foreground">Public landing page coming soon.</p>
            </Section>
        </Container>
    );
}
