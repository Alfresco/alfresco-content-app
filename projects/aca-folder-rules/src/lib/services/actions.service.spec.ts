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

import { ActionsService } from './actions.service';
import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { ActionsApi } from '@alfresco/js-api';
import { actionDefListMock, actionsTransformedListMock } from '../mock/actions.mock';
import { take } from 'rxjs/operators';

describe('ActionsService', () => {
  let actionsService: ActionsService;
  let apiCallSpy;
  const params = [{}, {}, {}, {}, {}, ['application/json'], ['application/json']];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      providers: [ActionsService]
    });

    actionsService = TestBed.inject(ActionsService);
  });

  it('should load the data into the observable', async () => {
    spyOn(ActionsApi.prototype, 'listActions').and.returnValue(Promise.resolve(actionDefListMock));
    const actionsPromise = actionsService.actionDefinitionsListing$.pipe(take(2)).toPromise();

    actionsService.loadActionDefinitions();

    const actionsList = await actionsPromise;
    expect(actionsList).toEqual(actionsTransformedListMock);
  });

  it('should set loading to true while the request is being sent', async () => {
    spyOn(ActionsApi.prototype, 'listActions').and.returnValue(Promise.resolve(actionDefListMock));
    const loadingTruePromise = actionsService.loading$.pipe(take(2)).toPromise();
    const loadingFalsePromise = actionsService.loading$.pipe(take(3)).toPromise();

    actionsService.loadActionDefinitions();

    expect(await loadingTruePromise).toBeTrue();
    expect(await loadingFalsePromise).toBeFalse();
  });

  it('loadAspects should send correct GET request', async () => {
    apiCallSpy = spyOn<any>(actionsService, 'publicApiCall').withArgs(`/action-parameter-constraints/ac-aspects`, 'GET', params).and.returnValue([]);

    actionsService.loadAspects();

    expect(apiCallSpy).toHaveBeenCalled();
    expect(apiCallSpy).toHaveBeenCalledWith(`/action-parameter-constraints/ac-aspects`, 'GET', params);
  });
});
