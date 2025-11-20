/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
  extractSearchedWordFromEncodedQuery,
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
    it('should append "*" to search term', () => {
      expect(formatSearchTermByFields('test', ['name'])).toBe('(name:"test*")');
    });

    it('should not prefix when search term equals "*"', () => {
      expect(formatSearchTermByFields('*', ['name'])).toBe('(name:"*")');
    });

    it('should properly handle search terms starting with "="', () => {
      expect(formatSearchTermByFields('=test', ['name'])).toBe('(=name:"test")');
    });

    it('should format search term with set of fields and join with OR', () => {
      expect(formatSearchTermByFields('test', ['name', 'size'])).toBe('(name:"test*" OR size:"test*")');
    });
  });

  describe('formatSearchTerm', () => {
    it('should return empty string when input is invalid', () => {
      expect(formatSearchTerm(null)).toEqual('');
      expect(formatSearchTerm(undefined)).toEqual('');
    });

    it('should not transfer custom queries', () => {
      expect(formatSearchTerm('test:"term"')).toBe('test:"term"');
      expect(formatSearchTerm('"test"')).toBe('"test"');
    });

    it('should properly join multiple word search term', () => {
      expect(formatSearchTerm('test word term')).toBe('(cm:name:"test*") AND (cm:name:"word*") AND (cm:name:"term*")');
      expect(formatSearchTerm('test word term', ['name', 'size'])).toBe(
        '(name:"test*" OR size:"test*") AND (name:"word*" OR size:"word*") AND (name:"term*" OR size:"term*")'
      );
    });

    it('should format user input as cm:name if configuration not provided', () => {
      expect(formatSearchTerm('hello')).toBe(`(cm:name:"hello*")`);
    });

    it('should support conjunctions with AND operator', () => {
      expect(formatSearchTerm('big AND yellow AND banana', ['cm:name', 'cm:title'])).toBe(
        `(cm:name:"big*" OR cm:title:"big*") AND (cm:name:"yellow*" OR cm:title:"yellow*") AND (cm:name:"banana*" OR cm:title:"banana*")`
      );
    });

    it('should support conjunctions with OR operator', () => {
      expect(formatSearchTerm('big OR yellow OR banana', ['cm:name', 'cm:title'])).toBe(
        `(cm:name:"big*" OR cm:title:"big*") OR (cm:name:"yellow*" OR cm:title:"yellow*") OR (cm:name:"banana*" OR cm:title:"banana*")`
      );
    });

    it('should support exact term matching with operators', () => {
      expect(formatSearchTerm('=test1.pdf OR =test2.pdf', ['cm:name', 'cm:title'])).toBe(
        `(=cm:name:"test1.pdf" OR =cm:title:"test1.pdf") OR (=cm:name:"test2.pdf" OR =cm:title:"test2.pdf")`
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

    it('should properly trim set of parentheses from extracted user query', () => {
      const query = { userQuery: '(cm:name:"test")' };
      expect(extractUserQueryFromEncodedQuery(encodeQuery(query))).toBe('cm:name:"test"');
    });
  });

  describe('extractSearchedWordFromEncodedQuery', () => {
    it('should return empty string when encoded query is invalid', () => {
      const query = { otherProp: 'test' };
      expect(extractSearchedWordFromEncodedQuery(null)).toBe('');
      expect(extractSearchedWordFromEncodedQuery(undefined)).toBe('');
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('');
    });

    it('should properly extract search term', () => {
      const query = { userQuery: 'cm:name:"test*"' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('test');
    });

    it('should preserve quotes in search term for custom search', () => {
      const query = { userQuery: '"test"' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('"test"');
    });

    it('should properly extract search term when userQuery does not contain quotes', () => {
      const query = { userQuery: 'TEXT:abcdef' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('TEXT:abcdef');
    });

    it('should properly extract search term when userQuery contains field without quotes', () => {
      const query = { userQuery: 'cm:name:searchterm' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('cm:name:searchterm');
    });

    it('should handle mixed conditions with and without quotes', () => {
      const query = { userQuery: 'cm:name:"quoted term" AND TEXT:unquoted' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('quoted term TEXT:unquoted');
    });

    it('should handle complex search query', () => {
      const query = {
        userQuery: `((cm:name:"a*" OR cm:title:"a*" OR cm:description:"a*" OR TEXT:"a*" OR TAG:"a*") AND
          (cm:name:"b*" OR cm:title:"b*" OR cm:description:"b*" OR TEXT:"b*" OR TAG:"b*") OR
          (cm:name:"c*" OR cm:title:"c*" OR cm:description:"c*" OR TEXT:"c*" OR TAG:"c*"))`
      };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('a b OR c');
    });

    it('should not treat operator as a searched word', () => {
      const query = { userQuery: 'AND' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('');
    });

    it('should not unquote when searching for phrase', () => {
      const query = { userQuery: '"exact phrase search"' };
      expect(extractSearchedWordFromEncodedQuery(encodeQuery(query))).toBe('"exact phrase search"');
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
