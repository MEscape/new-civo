import { useTranslations } from 'next-intl';

/** An empty page offers a starting action, not a blank canvas. */
export function CanvasEmptyState() {
  const t = useTranslations('builder');
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-2 rounded-token border border-dashed border-border text-center">
      <p className="text-sm font-medium text-copy">
        {t('canvas.empty.title')}
      </p>
      <p className="max-w-xs text-sm text-copy-muted">
        {t('canvas.empty.hint')}
      </p>
    </div>
  );
}
