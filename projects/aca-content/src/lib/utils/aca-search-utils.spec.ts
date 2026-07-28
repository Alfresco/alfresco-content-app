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

import {
  extractFiltersFromEncodedQuery,
  extractParsedQueryFromEncodedQuery,
  extractUserQueryFromEncodedQuery,
  formatSearchTerm,
  formatSearchTermByFields,
  isOperator
} from './aca-search-utils';
import { Buffer } from 'buffer';

describe('SearchUtils', () => {
  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  describe('isOperator', () => {
    it('should detect AND operator', () => {
      expect(isOperator('AND')).toBeTrue();
    });

    it('should detect OR operator', () => {
      expect(isOperator('OR')).toBeTrue();
    });

    it('should return false when operator is not present', () => {
      expect(isOperator('WITH')).toBeFalse();
    });

    it('should return false when input is not valid', () => {
      expect(isOperator(null)).toBeFalse();
      expect(isOperator(undefined)).toBeFalse();
    });

    it('should treat lowercase operators as search terms', () => {
      expect(isOperator('and')).toBeFalse();
      expect(isOperator('or')).toBeFalse();
    });
  });

  describe('formatSearchTermByFields', () => {
    it('should not append wildcard by default', () => {
      expect(formatSearchTermByFields('test', ['name'])).toBe('(name:"test")');
    });

    it('should append "*" to search term when wildcards are enabled', () => {
      expect(formatSearchTermByFields('test', ['name'], true)).toBe('(name:"test*")');
    });

    it('should format search term with set of fields and join with OR', () => {
      expect(formatSearchTermByFields('test', ['name', 'size'])).toBe('(name:"test" OR size:"test")');
    });

    it('should format search term with set of fields and append wildcards when enabled', () => {
      expect(formatSearchTermByFields('test', ['name', 'size'], true)).toBe('(name:"test*" OR size:"test*")');
    });
  });

  describe('formatSearchTerm', () => {
    it('should return empty string when input is invalid', () => {
      expect(formatSearchTerm(null)).toEqual('');
      expect(formatSearchTerm(undefined)).toEqual('');
    });

    it('should return the raw input untouched in formula mode', () => {
      expect(formatSearchTerm('test:"term"', ['cm:name'], 'formula')).toBe('test:"term"');
      expect(formatSearchTerm('cm:name:"foo" AND TEXT:bar', ['cm:name'], 'formula')).toBe('cm:name:"foo" AND TEXT:bar');
    });

    it('should properly join multiple word search term', () => {
      expect(formatSearchTerm('test word term')).toBe('((cm:name:"test") AND (cm:name:"word") AND (cm:name:"term"))');
      expect(formatSearchTerm('test word term', ['name', 'size'])).toBe(
        '((name:"test" OR size:"test") AND (name:"word" OR size:"word") AND (name:"term" OR size:"term"))'
      );
    });

    it('should append wildcards to every word when wildcards are enabled', () => {
      expect(formatSearchTerm('test word term', ['cm:name'], 'regular', true)).toBe(
        '((cm:name:"test*") AND (cm:name:"word*") AND (cm:name:"term*"))'
      );
    });

    it('should format user input as cm:name if configuration not provided', () => {
      expect(formatSearchTerm('hello')).toBe(`((cm:name:"hello"))`);
    });

    it('should support conjunctions with AND operator', () => {
      expect(formatSearchTerm('big AND yellow AND banana', ['cm:name', 'cm:title'])).toBe(
        `((cm:name:"big" OR cm:title:"big") AND (cm:name:"yellow" OR cm:title:"yellow") AND (cm:name:"banana" OR cm:title:"banana"))`
      );
    });

    it('should support conjunctions with OR operator', () => {
      expect(formatSearchTerm('big OR yellow OR banana', ['cm:name', 'cm:title'])).toBe(
        `((cm:name:"big" OR cm:title:"big") OR (cm:name:"yellow" OR cm:title:"yellow") OR (cm:name:"banana" OR cm:title:"banana"))`
      );
    });

    it('should split words correctly when multiple whitespaces are present', () => {
      expect(formatSearchTerm('  big  yellow  ', ['cm:name', 'cm:title'])).toBe(
        `((cm:name:"big" OR cm:title:"big") AND (cm:name:"yellow" OR cm:title:"yellow"))`
      );
    });
  });

  describe('extractUserQueryFromEncodedQuery', () => {
    it('should return empty string when encoded query is invalid', () => {
      expect(extractUserQueryFromEncodedQuery(null)).toBe('');
      expect(extractUserQueryFromEncodedQuery(undefined)).toBe('');
    });

    it('should properly extract user query', () => {
      const query = { userQuery: 'cm:name:"test"' };
      expect(extractUserQueryFromEncodedQuery(encodeQuery(query))).toBe('cm:name:"test"');
    });

    it('should return the raw user query without trimming parentheses', () => {
      const query = { userQuery: '(cm:name:"test")' };
      expect(extractUserQueryFromEncodedQuery(encodeQuery(query))).toBe('(cm:name:"test")');
    });
  });

  describe('extractParsedQueryFromEncodedQuery', () => {
    it('should return empty string when encoded query is invalid', () => {
      expect(extractParsedQueryFromEncodedQuery(null)).toBe('');
      expect(extractParsedQueryFromEncodedQuery(undefined)).toBe('');
    });

    it('should properly extract parsed query', () => {
      const query = { parsedQuery: '(cm:name:"test*")' };
      expect(extractParsedQueryFromEncodedQuery(encodeQuery(query))).toBe('(cm:name:"test*")');
    });

    it('should return empty string when parsed query is not present', () => {
      const query = { userQuery: 'cm:name:"test"' };
      expect(extractParsedQueryFromEncodedQuery(encodeQuery(query))).toBe('');
    });
  });

  describe('extractFiltersFromEncodedQuery', () => {
    it('should return null when encoded query is invalid', () => {
      expect(extractFiltersFromEncodedQuery(null)).toBeNull();
      expect(extractFiltersFromEncodedQuery(undefined)).toBeNull();
    });

    it('should properly parse encoded object', () => {
      const query = { userQuery: 'cm:name:"test*"', filterProp: 'test' };
      expect(extractFiltersFromEncodedQuery(encodeQuery(query))).toEqual(query);
    });
  });
});
