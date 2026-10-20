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

import { ErrorError, ModelError } from '@alfresco/js-api';
import { ApiError, getApiErrorMessage } from './api-error.utils';

describe('getApiErrorMessage', () => {
  const GENERIC = 'CORE.MESSAGES.ERRORS.GENERIC';
  const briefSummary = 'Only admin or system user is allowed to define uses of or directly execute this action';

  const payload = (error: Partial<ErrorError>): ModelError => ({ error: error as ErrorError });

  it('should read briefSummary from the parsed response body', () => {
    const error: ApiError = {
      message: 'cannot POST /rules (500)',
      response: { body: payload({ errorKey: 'framework.exception.ApiDefault', statusCode: 500, briefSummary }) }
    };

    expect(getApiErrorMessage(error)).toBe(briefSummary);
  });

  it('should read briefSummary from the raw response text', () => {
    const error: ApiError = { message: JSON.stringify(payload({ errorKey: 'framework.exception.ApiDefault', briefSummary })) };

    expect(getApiErrorMessage(error)).toBe(briefSummary);
  });

  it('should read briefSummary from a response body left serialised by the client', () => {
    const error: ApiError = { response: { body: JSON.stringify(payload({ briefSummary })) } };

    expect(getApiErrorMessage(error)).toBe(briefSummary);
  });

  it('should fall back to the message when the response body holds no payload', () => {
    const error: ApiError = { message: JSON.stringify(payload({ briefSummary })), response: { body: '<html>502 Bad Gateway</html>' } };

    expect(getApiErrorMessage(error)).toBe(briefSummary);
  });

  it('should never return the errorKey, as it has no translation in the client', () => {
    const error: ApiError = { response: { body: payload({ errorKey: 'framework.exception.ApiDefault', statusCode: 500 }) } };

    expect(getApiErrorMessage(error)).toBe(GENERIC);
  });

  it('should fall back when the error carries no API payload', () => {
    expect(getApiErrorMessage({ message: 'Failed to fetch' })).toBe(GENERIC);
    expect(getApiErrorMessage({ error: new Error('Network error') })).toBe(GENERIC);
    expect(getApiErrorMessage(undefined)).toBe(GENERIC);
    expect(getApiErrorMessage(null)).toBe(GENERIC);
  });

  it('should fall back when the response is not JSON at all', () => {
    const error: ApiError = { message: '<html>502 Bad Gateway</html>', response: { body: '<html>502 Bad Gateway</html>' } };

    expect(getApiErrorMessage(error)).toBe(GENERIC);
  });

  it('should fall back for a blank briefSummary', () => {
    const error: ApiError = { message: JSON.stringify(payload({ briefSummary: '   ' })) };

    expect(getApiErrorMessage(error)).toBe(GENERIC);
  });

  it('should use a caller supplied fallback key', () => {
    expect(getApiErrorMessage({ message: 'Failed to fetch' }, 'MY.OWN.KEY')).toBe('MY.OWN.KEY');
  });
});
