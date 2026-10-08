import type { InfrastructureAppError } from '@lib/errors';
import type { AppResultAsync } from '@lib/result';

import { renderAuthEmail } from './auth-email-templates';

import type { AuthEmailKind, MailLocale } from './auth-email-templates';
import type { MailTransport } from './mail-transport';
import type {
    AuthLinkMessage,
    AuthMailer,
} from '../../domain/ports/auth-mailer.port';

export interface TransactionalAuthMailerSettings {
    readonly appName: string;
}

/** The real `AuthMailer`: renders the copy and hands it to a `MailTransport`. */
export class TransactionalAuthMailer implements AuthMailer {
    constructor(
        private readonly transport: MailTransport,
        private readonly settings: TransactionalAuthMailerSettings
    ) { }

    sendVerification(
        message: AuthLinkMessage
    ): AppResultAsync<void, InfrastructureAppError> {
        return this.send('verification', message.to, message.url, message.locale);
    }

    sendPasswordReset(
        message: AuthLinkMessage
    ): AppResultAsync<void, InfrastructureAppError> {
        return this.send('password_reset', message.to, message.url, message.locale);
    }

    sendExistingAccountNotice(message: {
        readonly to: string;
        readonly locale: MailLocale;
    }): AppResultAsync<void, InfrastructureAppError> {
        return this.send('existing_account', message.to, null, message.locale);
    }

    private send(
        kind: AuthEmailKind,
        to: string,
        url: string | null,
        locale: MailLocale
    ): AppResultAsync<void, InfrastructureAppError> {
        return this.transport.send({
            to,
            ...renderAuthEmail({
                kind,
                locale,
                appName: this.settings.appName,
                url,
            }),
        });
    }
}
