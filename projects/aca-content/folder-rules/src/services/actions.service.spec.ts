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

import { ActionsService } from './actions.service';
import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { ActionsApi } from '@alfresco/js-api';
import { actionDefListMock, actionsTransformedListMock } from '../mock/actions.mock';
import { take } from 'rxjs/operators';
import { dummyConstraints, rawConstraints } from '../mock/action-parameter-constraints.mock';
import { of } from 'rxjs';

describe('ActionsService', () => {
  let actionsService: ActionsService;

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

  it('loadParameterConstraints should send GET request and return formatted observable', async () => {
    const params = [{}, {}, {}, {}, {}, ['application/json'], ['application/json']];
    const constraintName = dummyConstraints[0].name;
    const formattedConstraints = dummyConstraints[0].constraints;

    const apiCallSpy = spyOn<any>(actionsService, 'publicApiCall')
      .withArgs(`/action-parameter-constraints/${constraintName}`, 'GET', params)
      .and.returnValue(of(rawConstraints));

    actionsService.getParameterConstraints(constraintName).subscribe((result) => expect(result).toEqual(formattedConstraints));

    expect(apiCallSpy).toHaveBeenCalled();
    expect(apiCallSpy).toHaveBeenCalledWith(`/action-parameter-constraints/${constraintName}`, 'GET', params);
  });

  it('loadActionParameterConstraints should load the data into the observable', async () => {
    spyOn(actionsService, 'getParameterConstraints').and.returnValue(of(dummyConstraints[0].constraints));

    const constraintsPromise = actionsService.parameterConstraints$.pipe(take(2)).toPromise();

    actionsService.loadActionParameterConstraints(actionsTransformedListMock);

    const parameterConstraints = await constraintsPromise;

    expect(parameterConstraints).toEqual(dummyConstraints);
  });
});
