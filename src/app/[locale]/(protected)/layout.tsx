import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { requireSignedIn } from '@modules/auth';

/**
 * Reading the session is runtime data, and a segment's `loading.tsx` wraps
 * its page but not the layout beside it, so the check runs under its own
 * boundary. The fallback is empty on purpose: pages stream their own parts.
 * This is navigation convenience; every query authorizes for itself.
 */
async function SignedInGate({ children }: { readonly children: ReactNode }) {
  await requireSignedIn();
  return children;
}

export default function ProtectedLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <SignedInGate>{children}</SignedInGate>
    </Suspense>
  );
}
