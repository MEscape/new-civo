'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import {
  AXIS_FONT_SIZE,
  CHART_COLORS,
  CHART_SERIES_COLORS,
  TOOLTIP_STYLE,
} from '../support/chart-theme';

export interface DonutDatum {
  readonly label: string;
  readonly value: number;
}

export function MetricDonutChartClient({ data }: { readonly data: readonly DonutDatum[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[...data]}
            dataKey="value"
            nameKey="label"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke={CHART_COLORS.background}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={
                  CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] ?? CHART_COLORS.primary
                }
              />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: AXIS_FONT_SIZE }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
