import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { ForgotPasswordForm, isAuthEnabled } from '@modules/auth';

import { Container, PageHeading, Section } from '@components/layout/layout-primitives';

import type { Locale } from '@i18n';

import { buildLocalizedMetadata } from '@lib/seo';


interface RouteProps {
    readonly params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'auth' });
    return buildLocalizedMetadata({
        locale,
        pathname: '/forgot-password',
        title: t('forgotPassword.metadata.title'),
        description: t('forgotPassword.metadata.description'),
    });
}

export default async function ForgotPasswordPage() {
    if (!isAuthEnabled) {notFound();}
    const t = await getTranslations('auth');

    return (
        <Container className="max-w-md">
            <Section className="space-y-8">
                <PageHeading
                    title={t('forgotPassword.title')}
                    description={t('forgotPassword.description')}
                />
                <ForgotPasswordForm />
            </Section>
        </Container>
    );
}
