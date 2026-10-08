import {
  Container,
  PageHeading,
  Section,
} from '@components/layout/layout-primitives';

import { Link } from '@i18n';

export interface NotFoundPanelProps {
  readonly title: string;
  readonly description: string;
  readonly returnLabel: string;
}

/**
 * The body of every 404 page. Each route group supplies its own text; the
 * layout and the way home live here once. `Link` is the locale-aware one, so
 * the way home keeps the visitor's language.
 */
export function NotFoundPanel({
  title,
  description,
  returnLabel,
}: NotFoundPanelProps) {
  return (
    <Container className="max-w-md">
      <Section className="space-y-8 text-center">
        <PageHeading title={title} description={description} />
        <Link
          href="/"
          className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {returnLabel}
        </Link>
      </Section>
    </Container>
  );
}
