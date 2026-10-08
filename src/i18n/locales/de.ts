import { deAuth as auth } from '@modules/auth';
import { deBuilder as builder } from '@modules/builder';
import { deComponentPlatform as componentPlatform } from '@modules/component-platform';
import { deDataSource as dataSource } from '@modules/data-sources';
import { deMap as map } from '@modules/map';
import { deRelease as release } from '@modules/release';
import { deWebsite as website } from '@modules/website';

import controls from '../messages/de/controls.json';
import errors from '../messages/de/errors.json';

const messages = {
  errors,
  controls,
  builder: {
    ...builder.builder,
    errors: { ...errors, ...builder.builder.errors },
  },
  website: {
    ...website.website,
    errors: { ...errors, ...website.website.errors },
  },
  release: {
    ...release.release,
    errors: { ...errors, ...release.release.errors },
  },
  dataSources: {
    ...dataSource.dataSources,
    errors: { ...errors, ...dataSource.dataSources.errors },
  },
  auth: {
    ...auth.auth,
    errors: { ...errors, ...auth.auth.errors },
  },
  map: map.map,
  componentPlatform: {
    ...componentPlatform.componentPlatform,
    // The platform owns no error texts of its own; it only inherits the shared ones.
    errors: { ...errors },
  },
} as const;

export default messages;
