import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Required by the one application cache (`'use cache'` in data-sources). Lifetimes are
  // declared where they are used, so there are no named cache-life profiles here.
  cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
