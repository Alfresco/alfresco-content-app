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

import { format, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { resolveInLastDatePlaceholders, withInLastDatePlaceholders } from './aca-search-query-date-template.utils';

describe('SearchQueryDateTemplateUtils', () => {
  describe('withInLastDatePlaceholders', () => {
    it('should return original query when dateRange is not provided', () => {
      const query = "cm:created:['2026-10-01T00:00:00+01:00' TO '2026-10-29T23:59:59+01:00']";

      expect(withInLastDatePlaceholders(query, undefined)).toBe(query);
    });

    it('should replace created and modified ranges with placeholders when dateRangeType is IN_LAST', () => {
      const query =
        "(cm:created:['2026-10-04T00:00:00+02:00' TO '2026-10-29T23:59:59+01:00'] AND cm:modified:['2026-10-26T00:00:00+01:00' TO '2026-10-29T23:59:59+01:00'])";

      const result = withInLastDatePlaceholders(query, {
        'cm:created': {
          dateRangeType: 'IN_LAST',
          inLastValueType: 'WEEKS',
          inLastValue: 3
        },
        'cm:modified': {
          dateRangeType: 'IN_LAST',
          inLastValueType: 'DAYS',
          inLastValue: 2
        }
      });

      expect(result).toBe("(cm:created:['${3_WEEKS}' TO '${TODAY}'] AND cm:modified:['${2_DAYS}' TO '${TODAY}'])");
    });

    it('should keep field range untouched when dateRangeType is not IN_LAST', () => {
      const query =
        "(cm:created:['2026-10-04T00:00:00+02:00' TO '2026-10-29T23:59:59+01:00'] AND cm:modified:['2026-10-26T00:00:00+01:00' TO '2026-10-29T23:59:59+01:00'])";

      const result = withInLastDatePlaceholders(query, {
        'cm:created': {
          dateRangeType: 'ANY',
          inLastValueType: 'WEEKS',
          inLastValue: 3
        },
        'cm:modified': {
          dateRangeType: 'IN_LAST',
          inLastValueType: 'DAYS',
          inLastValue: 2
        }
      });

      expect(result).toBe("(cm:created:['2026-10-04T00:00:00+02:00' TO '2026-10-29T23:59:59+01:00'] AND cm:modified:['${2_DAYS}' TO '${TODAY}'])");
    });
  });

  describe('resolveInLastDatePlaceholders', () => {
    const formatDate = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");

    it('should return original query when placeholders are not present', () => {
      const query = "cm:name:'test'";

      expect(resolveInLastDatePlaceholders(query, new Date('2026-10-29T12:30:00+01:00'))).toBe(query);
    });

    it('should resolve DAYS, WEEKS and MONTHS placeholders using the provided date as reference', () => {
      const referenceDate = new Date('2026-10-29T12:30:00+01:00');
      const query = "(cm:created:['${2_DAYS}' TO '${TODAY}'] AND cm:modified:['${1_WEEKS}' TO '${TODAY}'] AND cm:test:['${3_MONTHS}' TO '${TODAY}'])";

      const result = resolveInLastDatePlaceholders(query, referenceDate);

      expect(result).toContain(`'${formatDate(startOfDay(subDays(referenceDate, 2)))}'`);
      expect(result).toContain(`'${formatDate(startOfWeek(subWeeks(referenceDate, 1)))}'`);
      expect(result).toContain(`'${formatDate(startOfMonth(subMonths(referenceDate, 3)))}'`);
      expect(result).not.toContain('${TODAY}');
    });
  });
});
