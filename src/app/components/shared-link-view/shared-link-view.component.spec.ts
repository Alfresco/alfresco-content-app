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

import { SharedLinkViewComponent } from './shared-link-view.component';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '@alfresco/aca-shared';

describe('SharedLinkViewComponent', () => {
  let component: SharedLinkViewComponent;
  let fixture: ComponentFixture<SharedLinkViewComponent>;
  let appExtensionService: AppExtensionService;
  let spyGetSharedLink;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: () => of({})
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SharedLinkViewComponent],
      providers: [
        AppExtensionService,
        { provide: Store, useValue: storeMock },
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
    appExtensionService = TestBed.inject(AppExtensionService);
    appExtensionService.selection = {
      isEmpty: true,
      count: 0,
      libraries: null,
      nodes: null
    };

    spyGetSharedLink = spyOn(component['sharedLinksApi'], 'getSharedLink');

    storeMock.dispatch.calls.reset();
  });

  afterEach(() => {
    spyGetSharedLink.calls.reset();
  });

  it('should update store selection', fakeAsync(() => {
    spyGetSharedLink.and.returnValue(Promise.resolve({ entry: { id: 'shared-id' } }));

    fixture.detectChanges();
    tick();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([{ entry: { id: 'shared-id' } } as any]));
  }));

  it('should not update store on error', fakeAsync(() => {
    spyGetSharedLink.and.returnValue(Promise.reject('error'));

    fixture.detectChanges();
    tick();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  }));

  it('should not update actions reference if selection is empty', fakeAsync(() => {
    spyGetSharedLink.and.returnValue(Promise.resolve({ entry: { id: 'shared-id' } }));

    fixture.detectChanges();
    tick();

    expect(component.viewerToolbarActions).toEqual([]);
  }));

  it('should update actions reference if selection is not empty', fakeAsync(() => {
    appExtensionService.selection = {
      isEmpty: false,
      count: 1,
      libraries: null,
      nodes: null
    };
    spyOn(appExtensionService, 'getSharedLinkViewerToolbarActions').and.callThrough();
    spyGetSharedLink.and.returnValue(Promise.resolve({ entry: { id: 'shared-id' } }));

    fixture.detectChanges();
    tick();

    expect(appExtensionService.getSharedLinkViewerToolbarActions).toHaveBeenCalled();
  }));

  it('should fetch link id from the active route', fakeAsync(() => {
    spyGetSharedLink.and.returnValue(Promise.resolve({ entry: { id: 'shared-id' } }));

    fixture.detectChanges();
    tick();

    expect(component.sharedLinkId).toBe('123');
  }));
});
