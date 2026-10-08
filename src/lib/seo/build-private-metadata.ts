import type { Metadata } from 'next';

/**
 * Metadata of a page behind sign-in. It must never be indexed, and a
 * canonical URL or social preview would only advertise it, so unlike
 * `buildLocalizedMetadata` this carries just a title and `noindex`.
 */
export function buildPrivateMetadata(title: string): Metadata {
    return { title, robots: { index: false, follow: false } };
}
