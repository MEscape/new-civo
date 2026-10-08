import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import {
    ResetPasswordForm,
    ResetPasswordLinkMissing,
    isAuthEnabled,
    parseResetPasswordPageParams,
} from '@modules/auth';

import { Container, PageHeading, Section } from '@components/layout/layout-primitives';

import type { Locale } from '@i18n';

import { buildLocalizedMetadata } from '@lib/seo';


interface RouteProps {
    readonly params: Promise<{ locale: Locale }>;
    readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'auth' });
    return buildLocalizedMetadata({
        locale,
        pathname: '/reset-password',
        title: t('resetPassword.metadata.title'),
        description: t('resetPassword.metadata.description'),
    });
}

export default async function ResetPasswordPage({ searchParams }: RouteProps) {
    if (!isAuthEnabled) {notFound();}
    const t = await getTranslations('auth');
    const { token } = parseResetPasswordPageParams(await searchParams);

    return (
        <Container className="max-w-md">
            <Section className="space-y-8">
                <PageHeading
                    title={t('resetPassword.title')}
                    description={t('resetPassword.description')}
                />
                {token === undefined ? (
                    <ResetPasswordLinkMissing />
                ) : (
                    <ResetPasswordForm token={token} />
                )}
            </Section>
        </Container>
    );
}
