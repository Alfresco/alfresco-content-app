/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { InLastDateType } from '@alfresco/adf-content-services';
import { endOfToday, format, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';

/**
 * Single date filter state for one metadata field in the search UI.
 *
 * For this helper we only care about the IN_LAST mode and the corresponding
 * value/unit pair used to build placeholders.
 */
export interface DateRangeFilterConfig {
  dateRangeType?: string;
  inLastValueType?: string;
  inLastValue?: number;
}

/**
 * Date range configuration currently supported by compiled query templating.
 */
export interface CreatedModifiedDateRangeFilterConfig {
  'cm:created'?: DateRangeFilterConfig;
  'cm:modified'?: DateRangeFilterConfig;
}

/**
 * Converts concrete date ranges in a compiled query into relative placeholders
 * for fields configured as IN_LAST.
 *
 * Example transformation:
 * cm:created:['2026-10-01T00:00:00+01:00' TO '2026-10-29T23:59:59+01:00']
 * => cm:created:['${4_WEEKS}' TO '${TODAY}']
 *
 * Fields not configured as IN_LAST are left unchanged.
 *
 * @param compiledQuery Fully built query containing concrete date literals.
 * @param dateRange Date filter state used to decide which ranges become placeholders.
 * @returns Query string with date placeholders where applicable.
 */
export function withInLastDatePlaceholders(compiledQuery: string, dateRange: CreatedModifiedDateRangeFilterConfig): string {
  if (!compiledQuery || !dateRange) {
    return compiledQuery;
  }

  let templateQuery = compiledQuery;
  const fields = Object.keys(dateRange) as Array<keyof CreatedModifiedDateRangeFilterConfig>;

  fields.forEach((field) => {
    const dateFilter = dateRange[field];
    if (dateFilter?.dateRangeType !== 'IN_LAST' || !dateFilter.inLastValue) {
      return;
    }

    const unit = String(dateFilter.inLastValueType ?? '').toUpperCase() as InLastDateType;

    const relativePlaceholder = '${' + `${dateFilter.inLastValue}_${unit}` + '}';
    const todayPlaceholder = '${TODAY}';
    const fieldPattern = new RegExp(`(${escapeRegex(field)}:\\[)\\s*'[^']*'\\s+TO\\s+'[^']*'\\s*(\\])`);

    templateQuery = templateQuery.replace(fieldPattern, `$1'${relativePlaceholder}' TO '${todayPlaceholder}'$2`);
  });

  return templateQuery;
}

/**
 * Resolves relative date placeholders inside a compiled query into concrete
 * datetime values, using the same IN_LAST semantics as the date-range filter.
 *
 * Supported placeholders:
 * - ${TODAY}
 * - ${N_DAYS}
 * - ${N_WEEKS}
 * - ${N_MONTHS}
 *
 * The output format is `yyyy-MM-dd'T'HH:mm:ssXXX`, for example
 * `2026-10-29T23:59:59+01:00`.
 *
 * @param compiledQuery Query that may contain relative date placeholders.
 * @param now Optional clock injection for deterministic testing.
 * @returns Query with placeholders replaced by concrete date values.
 */
export function resolveInLastDatePlaceholders(compiledQuery: string, now = new Date()): string {
  if (!compiledQuery) {
    return compiledQuery;
  }

  const todayDateTime = formatDateForQuery(endOfToday());

  return compiledQuery
    .replace(/\$\{TODAY\}/g, todayDateTime)
    .replace(/\$\{(\d+)_(DAYS|WEEKS|MONTHS)\}/g, (_match, rawValue: string, rawUnit: InLastDateType) => {
      const amount = Number(rawValue);
      if (!Number.isFinite(amount)) {
        return _match;
      }

      const fromDate = getInLastStartDate(now, amount, rawUnit);
      return formatDateForQuery(fromDate);
    });
}

function getInLastStartDate(baseDate: Date, amount: number, unit: InLastDateType): Date {
  switch (unit) {
    case 'DAYS':
      return startOfDay(subDays(baseDate, amount));
    case 'WEEKS':
      return startOfWeek(subWeeks(baseDate, amount));
    case 'MONTHS':
      return startOfMonth(subMonths(baseDate, amount));
    default:
      return startOfDay(baseDate);
  }
}

function formatDateForQuery(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/**
 * Escapes regex metacharacters so dynamic field names can be matched literally.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
