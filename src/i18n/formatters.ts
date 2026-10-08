import { useLocale, useTimeZone } from 'next-intl';
import { getLocale, getTimeZone } from 'next-intl/server';

import { formatDate, formatDateTime, formatRelativeTime, type DateInput } from '@lib/utils/date';
import { formatNumber, formatPercent, formatMoney, formatBytes } from '@lib/utils/number';

import { I18N_CONFIG, type Locale, type Direction } from './config';

export type AppFormatters = ReturnType<typeof createAppFormatters>;

function createAppFormatters(locale: string, timeZone: string) {
    return {
        date: (input: DateInput, options?: Intl.DateTimeFormatOptions) => formatDate(input, locale, timeZone, options),
        dateTime: (input: DateInput) => formatDateTime(input, locale, timeZone),
        relativeTime: (input: DateInput, now: DateInput) => formatRelativeTime(input, now, locale),
        number: (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, locale, options),
        percent: (ratio: number, fractionDigits?: number) => formatPercent(ratio, locale, fractionDigits),
        money: (minorUnits: number, currency: string) => formatMoney(minorUnits, currency, locale),
        bytes: (bytes: number, fractionDigits?: number) => formatBytes(bytes, locale, fractionDigits),
    };
}

export function useAppFormatters(): AppFormatters {
    const locale = useLocale();
    const timeZone = useTimeZone() ?? I18N_CONFIG.defaultTimeZone;
    return createAppFormatters(locale, timeZone);
}

export async function getAppFormatters(): Promise<AppFormatters> {
    const locale = await getLocale();
    const timeZone = await getTimeZone();
    return createAppFormatters(locale, timeZone);
}

export function getDirection(locale: Locale): Direction {
    return I18N_CONFIG.definitions[locale].direction;
}
