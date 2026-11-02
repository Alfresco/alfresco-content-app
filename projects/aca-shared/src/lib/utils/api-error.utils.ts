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

import { ModelError } from '@alfresco/js-api';

export interface ApiError {
  message?: string;
  response?: {
    body?: ModelError | string;
  };
  error?: Error;
}

function toPayload(value: ModelError | string): ModelError {
  if (typeof value === 'object') {
    return value?.error ? value : null;
  }

  if (typeof value === 'string') {
    try {
      const parsed: ModelError = JSON.parse(value);
      return parsed?.error ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function parsePayload(error: ApiError): ModelError {
  return toPayload(error?.response?.body) ?? toPayload(error?.message);
}

/**
 * Extracts the human readable message the backend sent with a failed API call.
 *
 * @param error failed call error
 * @param fallback translation key to use when the response carried no message
 * @returns the backend message, or `fallback`
 */
export function getApiErrorMessage(error: ApiError, fallback = 'CORE.MESSAGES.ERRORS.GENERIC'): string {
  const briefSummary = parsePayload(error)?.error?.briefSummary;

  return briefSummary?.trim() ? briefSummary : fallback;
}
