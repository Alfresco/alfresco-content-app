/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SearchLibrariesQueryBuilderService, LibrarySearchQuery } from './search-libraries-query-builder.service';

describe('SearchLibrariesQueryBuilderService', () => {
  let apiService: AlfrescoApiService;
  let builder: SearchLibrariesQueryBuilderService;
  let queriesApi;
  const query = {} as LibrarySearchQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });

    apiService = TestBed.inject(AlfrescoApiService);
    apiService.reset();
    builder = new SearchLibrariesQueryBuilderService(apiService);
    queriesApi = builder['queriesApi'];
  });

  it('should have empty user query by default', () => {
    expect(builder.userQuery).toBe('');
  });

  it('should trim user query value', () => {
    builder.userQuery = ' something   ';
    expect(builder.userQuery).toEqual('something');
  });

  it('should build query and raise an event on update', async () => {
    spyOn(builder, 'buildQuery').and.returnValue(query);

    let eventArgs = null;
    builder.updated.subscribe((args) => (eventArgs = args));

    await builder.update();
    expect(eventArgs).toBe(query);
  });

  it('should build query and raise an event on execute', async () => {
    const data = {};
    spyOn(queriesApi, 'findSites').and.returnValue(Promise.resolve(data));

    spyOn(builder, 'buildQuery').and.returnValue(query);

    let eventArgs = null;
    builder.executed.subscribe((args) => (eventArgs = args));

    await builder.execute();
    expect(eventArgs).toBe(data);
  });

  it('should require a query fragment to build query', () => {
    const compiled = builder.buildQuery();
    expect(compiled).toBeNull();
  });

  it('should build query when there is a useQuery value', () => {
    const searchedTerm = 'test';

    builder.userQuery = searchedTerm;

    const compiled = builder.buildQuery();
    expect(compiled.term).toBe(searchedTerm);
  });

  it('should use pagination settings', () => {
    const searchedTerm = 'test';

    builder.paging = { maxItems: 5, skipCount: 5 };
    builder.userQuery = searchedTerm;

    const compiled = builder.buildQuery();
    expect(compiled.opts).toEqual({ maxItems: 5, skipCount: 5 });
  });

  it('should raise an event on error', async () => {
    const err = '{"error": {"statusCode": 400}}';
    spyOn(queriesApi, 'findSites').and.returnValue(Promise.reject(err));

    spyOn(builder, 'buildQuery').and.returnValue(query);

    let eventArgs = null;
    builder.hadError.subscribe((args) => (eventArgs = args));

    await builder.execute();
    expect(eventArgs).toBe(err);
  });
});
