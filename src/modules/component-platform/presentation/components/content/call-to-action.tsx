import { Container, Section } from '@components/layout/layout-primitives';
import { Button } from '@components/ui/button';

import { getTranslations } from '@i18n/server';

import { trimToNull } from '@lib/utils';

import type { ComponentProps } from '../../../application/contracts/component-platform-constraints';

const FALLBACK_HREF = '#';

export interface CallToActionComponentProps {
  readonly props: ComponentProps<'callToAction'>;
}

/** A highlighted block with one button. */
export async function CallToAction({ props }: CallToActionComponentProps) {
  const t = await getTranslations('componentPlatform');
  const heading = trimToNull(props.heading) ?? t('callToAction.defaultHeading');
  const body = trimToNull(props.body);
  const buttonLabel =
    trimToNull(props.buttonLabel) ?? t('callToAction.defaultButtonLabel');
  const href = trimToNull(props.href) ?? FALLBACK_HREF;

  return (
    <Section>
      <Container>
        <div className="rounded-token bg-primary px-8 py-12 text-white sm:px-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl">{heading}</h2>
              {body !== null && (
                <p className="mt-2 max-w-lg text-white/80">{body}</p>
              )}
            </div>
            <Button asChild variant="accent" size="lg" className="shrink-0">
              <a href={href}>{buttonLabel}</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
