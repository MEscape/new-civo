import 'server-only';
import { getAccessControl } from '@modules/auth';
import { HOME_PAGE_PATH, createSystemPage } from '@modules/builder';

import { CreateWebsite } from './application/commands/create-website';
import { UpdateWebsite } from './application/commands/update-website';
import { UpdateWebsiteTheme } from './application/commands/update-website-theme';
import { GetPublicWebsiteBySlug } from './application/queries/get-public-website-by-slug';
import { GetWebsiteById } from './application/queries/get-website-by-id';
import { ListWebsites } from './application/queries/list-websites';
import { LoggerWebsiteAuditLog } from './infrastructure/logging/logger-website-audit-log';
import { PrismaWebsiteRepository } from './infrastructure/prisma/prisma-website.repository';
import { BuilderHomePageProvisioner } from './infrastructure/provisioner/builder-home-page-provisioner';

/**
 * The module's composition root: the one file that knows both the
 * application use cases and their infrastructure adapters. Presentation
 * and framework entry points reach use cases only through here, so they
 * never import infrastructure. `server-only` makes an accidental import
 * from a Client Component a build error.
 */
const websites = new PrismaWebsiteRepository();
const homePages = new BuilderHomePageProvisioner(createSystemPage, HOME_PAGE_PATH);
const audit = new LoggerWebsiteAuditLog();
const authorization = getAccessControl();
const dependencies = { authorization, websites, audit };

export const websiteCommands = {
  createWebsite: new CreateWebsite({ ...dependencies, homePages }),
  updateWebsite: new UpdateWebsite(dependencies),
  updateWebsiteTheme: new UpdateWebsiteTheme(dependencies),
} as const;

export const websiteQueries = {
  getWebsiteById: new GetWebsiteById(dependencies),
  listWebsites: new ListWebsites(dependencies),
  getPublicWebsiteBySlug: new GetPublicWebsiteBySlug({ websites }),
} as const;
