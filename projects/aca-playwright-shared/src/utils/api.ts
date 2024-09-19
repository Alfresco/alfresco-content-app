/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export type ApiResultPredicate<T> = (result: T) => boolean;
export type ApiCall<T> = () => Promise<T>;

export async function waitForApi<T>(apiCall: ApiCall<T>, predicate: ApiResultPredicate<T>, retry: number = 30, delay: number = 1000) {
  const apiCallWithPredicateChecking = async () => {
    const apiCallResult = await apiCall();
    if (predicate(apiCallResult)) {
      return Promise.resolve(apiCallResult);
    } else {
      return Promise.reject(new Error(`API call did not satisfy predicate: ${JSON.stringify(apiCallResult)}`));
    }
  };

  return retryCall(apiCallWithPredicateChecking, retry, delay);
}

function retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1000): Promise<string> {
  const pause = (duration) => new Promise((res) => setTimeout(res, duration));
  const run = (retries) =>
    fn().catch((err) =>
      retries > 1
        ? pause(delay).then(() => run(retries - 1))
        : Promise.reject(new Error(`API call did not satisfy predicate: ${JSON.stringify(err)}`))
    );

  return run(retry);
}
