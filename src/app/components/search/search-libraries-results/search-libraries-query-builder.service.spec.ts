/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';

describe('SearchLibrariesQueryBuilderService', () => {
  let apiService: AlfrescoApiService;
  let queriesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });

    apiService = TestBed.get(AlfrescoApiService);
    apiService.reset();
    queriesApi = apiService.getInstance().core.queriesApi;
  });

  it('should have empty user query by default', () => {
    const builder = new SearchLibrariesQueryBuilderService(apiService);
    expect(builder.userQuery).toBe('');
  });

  it('should trim user query value', () => {
    const builder = new SearchLibrariesQueryBuilderService(apiService);
    builder.userQuery = ' something   ';
    expect(builder.userQuery).toEqual('something');
  });

  it('should build query and raise an event on update', async () => {
    const builder = new SearchLibrariesQueryBuilderService(apiService);
    const query = {};
    spyOn(builder, 'buildQuery').and.returnValue(query);

    let eventArgs = null;
    builder.updated.subscribe(args => (eventArgs = args));

    await builder.update();
    expect(eventArgs).toBe(query);
  });

  it('should build query and raise an event on execute', async () => {
    const data = {};
    spyOn(queriesApi, 'findSites').and.returnValue(Promise.resolve(data));

    const builder = new SearchLibrariesQueryBuilderService(apiService);
    const query = {};
    spyOn(builder, 'buildQuery').and.returnValue(query);

    let eventArgs = null;
    builder.executed.subscribe(args => (eventArgs = args));

    await builder.execute();
    expect(eventArgs).toBe(data);
  });

  it('should require a query fragment to build query', () => {
    const builder = new SearchLibrariesQueryBuilderService(apiService);

    const compiled = builder.buildQuery();
    expect(compiled).toBeNull();
  });

  it('should build query when there is a useQuery value', () => {
    const searchedTerm = 'test';
    const builder = new SearchLibrariesQueryBuilderService(apiService);

    builder.userQuery = searchedTerm;

    const compiled = builder.buildQuery();
    expect(compiled.term).toBe(searchedTerm);
  });

  it('should use pagination settings', () => {
    const searchedTerm = 'test';
    const builder = new SearchLibrariesQueryBuilderService(apiService);

    builder.paging = { maxItems: 5, skipCount: 5 };
    builder.userQuery = searchedTerm;

    const compiled = builder.buildQuery();
    expect(compiled.opts).toEqual({ maxItems: 5, skipCount: 5 });
  });
});
