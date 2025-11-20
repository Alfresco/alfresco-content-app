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
    const operators = ['AND', 'OR'];
    return operators.includes(input.trim());
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
  if (!encodedQuery) {
    return '';
  }

  const userQuery = extractUserQueryFromEncodedQuery(encodedQuery);
  if (!userQuery) {
    return '';
  }

  const tokenRegex = /\(([^()]+)\)|\b(AND|OR)\b/g;
  const fragments: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(userQuery))) {
    if (match[1]) {
      fragments.push(extractWordFromQuery(match[1]));
    } else if (match[2] === 'OR') {
      fragments.push('OR');
    }
  }

  if (fragments.length === 0) {
    return userQuery
      .split(/\bAND\b|\bOR\b/)
      .map((part) => extractWordFromQuery(part))
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  return fragments.join(' ').trim();
}

/**
 * Extracts the searched word from a part of search query
 *
 * @param queryPart encoded query
 * @returns searched word
 */
function extractWordFromQuery(queryPart: string): string {
  const regex = /:"([^"]+)"/;
  const quoted = regex.exec(queryPart);
  if (quoted) {
    return quoted[1].replace(/\*$/, '');
  }
  const trimmedPart = queryPart.trim();
  if (trimmedPart && !isOperator(trimmedPart)) {
    return trimmedPart;
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
