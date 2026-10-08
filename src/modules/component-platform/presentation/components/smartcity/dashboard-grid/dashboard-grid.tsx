import { Container, Grid, Section, SectionHeading } from '@components/layout/layout-primitives';
import { Card, CardContent } from '@components/ui/card';

import { getTranslations } from '@i18n/server';

import { trimToNull } from '@lib/utils';

import {
  pickDistribution,
  pickSeries,
} from '../../../../application/contracts/component-platform-constraints';
import { ContentOriginBadge } from '../../shared/content-origin-badge';
import { ContentState } from '../../shared/content-state';
import { columnsForCount } from '../../shared/grid-columns';
import { MetricDonutChartClient } from '../donut-chart/metric-donut-chart.client';
import { categoryFilter } from '../support/category-filter';
import { BREAKDOWN_LIMIT, OBSERVATION_LIMIT } from '../support/dataset-limits';
import { MetricCard } from '../support/metric-card';
import { MetricTrendChartClient } from '../trend-chart/metric-trend-chart.client';

import type {
  ComponentProps,
  RenderContext,
} from '../../../../application/contracts/component-platform-constraints';
import type { ContentOrigin } from '../../../../application/contracts/content-views';
import type { LoadContent } from '../../page-renderer/load-content';

export interface DashboardGridComponentProps {
  readonly props: ComponentProps<'dashboardGrid'>;
  readonly context: RenderContext;
  readonly loadContent: LoadContent;
}

/**
 * KPI tiles, a trend chart and a distribution in one section. The tiles read
 * metrics, the trend measurements over time and the distribution its parts:
 * three shapes, three datasets. The trend and the distribution are optional
 * and are only loaded when the editor chose a dataset for them; with nothing
 * chosen at all, the editor canvas shows all three as labelled samples.
 */
export async function DashboardGrid({ props, context, loadContent }: DashboardGridComponentProps) {
  const isNothingBound = trimToNull(props.datasetId) === null;
  const wantsTrend = isNothingBound || trimToNull(props.trendDatasetId) !== null;
  const wantsDistribution = isNothingBound || trimToNull(props.breakdownDatasetId) !== null;
  const base = { mode: context.mode, websiteId: context.websiteId };
  const category = categoryFilter(props.category);

  const [t, metrics, observations, parts] = await Promise.all([
    getTranslations('componentPlatform'),
    loadContent({
      ...base,
      kind: 'SmartCityMetric',
      datasetId: props.datasetId,
      category,
    }),
    wantsTrend
      ? loadContent({
          ...base,
          kind: 'SmartCityObservation',
          datasetId: props.trendDatasetId,
          category,
          limit: OBSERVATION_LIMIT,
        })
      : null,
    wantsDistribution
      ? loadContent({
          ...base,
          kind: 'SmartCityBreakdownEntry',
          datasetId: props.breakdownDatasetId,
          limit: BREAKDOWN_LIMIT,
        })
      : null,
  ]);
  const heading = trimToNull(props.heading) ?? t('dashboardGrid.defaultHeading');

  if (metrics.isErr()) {
    return <ContentState kind="error" heading={heading} />;
  }
  const { items, origin } = metrics.value;
  if (items.length === 0) {
    return <ContentState kind="empty" heading={heading} />;
  }

  // A failing optional panel is left out rather than taking the whole dashboard down.
  const series = observations?.isOk() ? pickSeries(observations.value.items, null) : null;
  const distribution = parts?.isOk() ? pickDistribution(parts.value.items, null) : null;
  const sample: ContentOrigin | undefined = [
    origin,
    observations?.isOk() ? observations.value.origin : undefined,
    parts?.isOk() ? parts.value.origin : undefined,
  ].find((entry) => entry?.kind === 'sample');

  return (
    <Section className="relative">
      <ContentOriginBadge origin={sample ?? origin} />
      <Container>
        <SectionHeading>{heading}</SectionHeading>

        <Grid as="ul" columns={columnsForCount(items.length)}>
          {items.map((metric) => (
            <li key={metric.id}>
              <MetricCard metric={metric} size="compact" />
            </li>
          ))}
        </Grid>

        {(series !== null || distribution !== null) && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {series !== null && (
              <Card>
                <CardContent className="pt-5">
                  <p className="mb-3 text-sm font-medium text-copy">
                    {t('dashboardGrid.trendTitle', { label: series.name })}
                  </p>
                  <MetricTrendChartClient data={series.points} unit={series.unit} />
                </CardContent>
              </Card>
            )}
            {distribution !== null && (
              <Card>
                <CardContent className="pt-5">
                  <p className="mb-3 text-sm font-medium text-copy">
                    {distribution.group === undefined
                      ? t('dashboardGrid.distributionFallbackTitle')
                      : t('dashboardGrid.distributionTitle', {
                          label: distribution.group,
                        })}
                  </p>
                  <MetricDonutChartClient data={distribution.parts} />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
