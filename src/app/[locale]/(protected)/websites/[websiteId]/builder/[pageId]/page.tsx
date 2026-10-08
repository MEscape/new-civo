import { cache } from 'react';

import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import {
    BuilderSessionProvider,
    BuilderShell,
    builderQueries,
    collectDatasetTypes,
    toEditorSessionDto,
} from '@modules/builder';
import { dataSourceQueries } from '@modules/data-sources';
import { releaseRoutes } from '@modules/release/client';
import {
    themeToCssVariables,
    websiteQueries,
    websiteRoutes,
} from '@modules/website';

import { failRoute } from '@lib/errors';

const SIGN_IN_PATH = '/sign-in'; // adapt to your auth routes

interface RouteProps {
    readonly params: Promise<{ websiteId: string; pageId: string }>;
}

/** Deduplicates the load between `generateMetadata` and the page within one request. */
const loadSession = cache((pageId: string) =>
    builderQueries.getEditorSession.execute(pageId)
);

export async function generateMetadata({
                                           params,
                                       }: RouteProps): Promise<Metadata> {
    const { pageId } = await params;
    const t = await getTranslations('builder');
    const result = await loadSession(pageId);
    return {
        title: result.match(
            (session) => t('metadata.title', { pageTitle: session.page.title }),
            () => t('metadata.fallbackTitle')
        ),
        robots: { index: false },
    };
}

export default async function BuilderPage({ params }: RouteProps) {
    const { websiteId, pageId } = await params;

    const sessionView = (await loadSession(pageId)).match(
        (view) => view,
        (error) => failRoute(error, SIGN_IN_PATH)
    );
    // The stored page is authoritative; a URL that disagrees with it is simply wrong.
    if (sessionView.page.websiteId !== websiteId) {notFound();}

    const [website, datasets] = await Promise.all([
        websiteQueries.getWebsiteById.execute(websiteId),
        dataSourceQueries.listCompatibleDatasets.execute({
            websiteId,
            canonicalKinds: collectDatasetTypes(sessionView.components),
        }),
    ]);
    const websiteView = website.match((view) => view, (error) => failRoute(error, SIGN_IN_PATH));
    const datasetOptions = datasets.match((options) => {
        const result: Record<string, Array<import('@modules/builder').DatasetOptionDto>> = {};
        for (const opt of options) {
            let arr = result[opt.canonicalKind];
            if (!arr) {
                arr = [];
                result[opt.canonicalKind] = arr;
            }
            arr.push({
                id: opt.id,
                name: opt.name,
                sourceName: opt.source.name,
            });
        }
        return result;
    }, (error) => failRoute(error, SIGN_IN_PATH));

    return (
        <BuilderSessionProvider
            key={sessionView.page.id}
            session={toEditorSessionDto(sessionView)}
            datasetOptions={datasetOptions}
        >
            <BuilderShell
                website={{ name: websiteView.name }}
                pageTitle={sessionView.page.title}
                themeStyle={themeToCssVariables(websiteView.theme)}
                links={{
                    websites: websiteRoutes.list(),
                    publicSite: releaseRoutes.publicSite(websiteView.slug),
                    settings: websiteRoutes.settings(websiteView.id),
                }}
            />
        </BuilderSessionProvider>
    );
}
