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

/**
 * Checks if string is an AND or OR operator
 *
 * @param input string to check if it is an operator
 * @returns boolean
 */
export function isOperator(input: string): boolean {
  if (input) {
    input = input.trim().toUpperCase();

    const operators = ['AND', 'OR'];
    return operators.includes(input);
  }
  return false;
}

/**
 * Formats a search term by provided fields
 *
 * @param term search term
 * @param fields array of fields
 * @returns string
 */
export function formatSearchTermByFields(term: string, fields: string[]): string {
  let prefix = '';
  let suffix = '*';

  if (term.startsWith('=')) {
    prefix = '=';
    suffix = '';
    term = term.substring(1);
  }

  if (term === '*') {
    prefix = '';
    suffix = '';
  }

  return '(' + fields.map((field) => `${prefix}${field}:"${term}${suffix}"`).join(' OR ') + ')';
}

/**
 * Formats a search term, splits by words, skips custom queries containing ':' or '"'
 *
 * @param userInput search term
 * @param fields array of fields
 * @returns string
 */
export function formatSearchTerm(userInput: string, fields = ['cm:name']): string {
  if (!userInput) {
    return '';
  }
  userInput = userInput.trim();

  if (userInput.includes(':') || userInput.includes('"')) {
    return userInput;
  }

  const words = userInput.split(' ');

  if (words.length > 1) {
    const separator = words.some(isOperator) ? ' ' : ' AND ';
    return words.map((term) => (isOperator(term) ? term : formatSearchTermByFields(term, fields))).join(separator);
  }

  return formatSearchTermByFields(userInput, fields);
}

/**
 * Decodes a query and extracts the user query
 *
 * @param encodedQuery encoded query
 * @returns string
 */
export function extractUserQueryFromEncodedQuery(encodedQuery: string): string {
  if (encodedQuery) {
    const decodedQuery: { [key: string]: any } = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encodedQuery), (c) => c.charCodeAt(0))));
    return trimUserQuery(decodedQuery.userQuery);
  }
  return '';
}

/**
 * Extracts user query from encoded query and splits it to get a search term
 *
 * @param encodedQuery encoded query
 * @returns string
 */
export function extractSearchedWordFromEncodedQuery(encodedQuery: string): string {
  if (encodedQuery) {
    const userQuery = extractUserQueryFromEncodedQuery(encodedQuery);
    return userQuery !== '' && userQuery !== undefined
      ? userQuery
          .split('AND')
          .map((searchCondition) => {
            const searchTerm = searchCondition.includes('"') ? searchCondition.split('"')[1] : searchCondition.trim();
            return searchTerm?.endsWith('*') && searchTerm !== '*' ? searchTerm.slice(0, -1) : searchTerm;
          })
          .join(' ')
      : '';
  }
  return '';
}

/**
 * Extracts filters configuration from encoded query
 *
 * @param encodedQuery encoded query
 * @returns object containing filters configuration
 */
export function extractFiltersFromEncodedQuery(encodedQuery: string): any {
  if (encodedQuery) {
    const decodedQuery = new TextDecoder().decode(Uint8Array.from(atob(encodedQuery), (c) => c.charCodeAt(0)));
    return JSON.parse(decodedQuery);
  }
  return null;
}

/**
 * Trims one set of parentheses from parsed user query.
 *
 * @param userQuery user query parsed from encoded query
 * @returns string
 */
function trimUserQuery(userQuery: string): string {
  const trimmedQuery = userQuery?.replace(/^\(/, '');
  return trimmedQuery?.replace(/\)$/, '') ?? '';
}
