import { useTranslations } from "next-intl";

import type { CanonicalTargetField } from "../../application/contracts/data-source-constraints";
import type { DiscoveredFieldView } from "../../application/contracts/data-source-views";

export interface DataSourceMappingRowProps {
  readonly field: DiscoveredFieldView;
  readonly value: string;
  readonly targets: readonly CanonicalTargetField[];
  readonly usedTargets: ReadonlySet<string>;
  readonly onAssign: (sourcePath: string, targetPath: string) => void;
  readonly targetLabel: (path: string) => string;
}

export function DataSourceMappingRow({
  field,
  value,
  targets,
  usedTargets,
  onAssign,
  targetLabel,
}: DataSourceMappingRowProps) {
  const t = useTranslations("dataSources");

  return (
    <tr className="border-b border-border last:border-0">
      <th
        scope="row"
        className="py-1.5 pr-3 text-left font-mono text-xs font-normal text-copy"
      >
        {field.path}
      </th>
      <td className="max-w-40 truncate py-1.5 pr-3 text-copy-muted">
        {field.sampleValue}
      </td>
      <td className="py-1.5">
        <select
          aria-label={t("mapping.targetFieldFor", {
            field: field.path,
          })}
          value={value}
          onChange={(event) => { onAssign(field.path, event.target.value); }}
          className="h-8 w-full max-w-56 rounded-token border border-border-strong bg-surface px-2 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="">{t("mapping.unassigned")}</option>
          {targets.map((target) => (
            <option
              key={target.path}
              value={target.path}
              disabled={usedTargets.has(target.path)}
            >
              {targetLabel(target.path)}
              {target.required ? " *" : ""}
              {usedTargets.has(target.path)
                ? ` ${t("mapping.alreadyAssigned")}`
                : ""}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
