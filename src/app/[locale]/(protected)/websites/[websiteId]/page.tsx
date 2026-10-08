import { cache } from 'react';

import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { builderRoutes } from '@modules/builder/client';
import { ReleaseHistoryPanel, releaseQueries } from '@modules/release';
import { releaseRoutes, toReleaseHistoryDto } from '@modules/release/client';
import { websiteQueries, websiteRoutes } from '@modules/website';

import { I18nProvider } from '@components/providers/i18n-provider';
import { Container, Grid, PageHeading, Section } from '@components/layout/layout-primitives';
import { Card, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

import { Link } from '@i18n';

import { buildPrivateMetadata } from '@lib/seo';

import { orFail } from '@/app/_lib/or-fail';

interface RouteProps {
    readonly params: Promise<{ websiteId: string }>;
}

/** Deduplicates the load between `generateMetadata` and the page within one request. */
const loadWebsite = cache((websiteId: string) => websiteQueries.getWebsiteById.execute(websiteId));

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { websiteId } = await params;
    const website = orFail(await loadWebsite(websiteId));
    return buildPrivateMetadata(website.name);
}

export default async function WebsitePage({ params }: RouteProps) {
    const { websiteId } = await params;
    const t = await getTranslations('website');
    const [website, history] = await Promise.all([
        loadWebsite(websiteId),
        releaseQueries.listReleases.execute(websiteId),
    ]).then(([site, releases]) => [orFail(site), orFail(releases)] as const);

    const links = [
        { key: 'builder', href: builderRoutes.pages(website.id) },
        { key: 'settings', href: websiteRoutes.settings(website.id) },
        { key: 'migrations', href: releaseRoutes.migrations(website.id) },
    ] as const;

    return (
        <Container className="max-w-4xl">
            <Section className="space-y-8">
                <PageHeading title={website.name} description={website.description ?? undefined} />

                <Grid columns={3} as="ul">
                    {links.map(({ key, href }) => (
                        <li key={key}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <Link href={href}>{t(`pages.detail.links.${key}.title`)}</Link>
                                    </CardTitle>
                                    <CardDescription>{t(`pages.detail.links.${key}.description`)}</CardDescription>
                                </CardHeader>
                            </Card>
                        </li>
                    ))}
                </Grid>

                <div className="space-y-4">
                    <h2 className="font-heading text-lg font-semibold text-copy">
                        {t('pages.detail.releasesTitle')}
                    </h2>
                    <I18nProvider namespaces={['release']}>
                        <ReleaseHistoryPanel
                            websiteId={website.id}
                            history={toReleaseHistoryDto(history.releases)}
                        />
                    </I18nProvider>
                </div>
            </Section>
        </Container>
    );
}
