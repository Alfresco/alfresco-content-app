/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { SharedLinkViewComponent } from './shared-link-view.component';
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SetSelectedNodesAction } from '../../store/actions';

describe('SharedLinkViewComponent', () => {
  let component: SharedLinkViewComponent;
  let fixture: ComponentFixture<SharedLinkViewComponent>;
  let alfrescoApiService: AlfrescoApiService;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: () => of({})
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SharedLinkViewComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        {
          provide: AlfrescoApiService,
          useValue: {
            sharedLinksApi: {
              getSharedLink: () => of({ entry: { id: 'shared-id' } })
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' } },
            params: of({ id: '123' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(SharedLinkViewComponent);
    component = fixture.componentInstance;
    alfrescoApiService = TestBed.get(AlfrescoApiService);
  });

  it('should update store selection', fakeAsync(() => {
    spyOn(alfrescoApiService.sharedLinksApi, 'getSharedLink').and.callThrough();

    fixture.detectChanges();
    tick();

    console.log(component.viewerToolbarActions);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new SetSelectedNodesAction([<any>{ entry: { id: 'shared-id' } }])
    );
  }));

  it('should fetch link id from the active route', fakeAsync(() => {
    spyOn(alfrescoApiService.sharedLinksApi, 'getSharedLink').and.callThrough();

    fixture.detectChanges();
    tick();

    expect(component.sharedLinkId).toBe('123');
  }));
});
