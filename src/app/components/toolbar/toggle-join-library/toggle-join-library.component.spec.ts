/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { LibraryMembershipDirective } from '../../../directives/library-membership.directive';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  SnackbarErrorAction,
  SnackbarInfoAction
} from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { ContentManagementService } from '../../../services/content-management.service';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';

describe('ToggleJoinLibraryComponent', () => {
  let component: ToggleJoinLibraryButtonComponent;
  let fixture: ComponentFixture<ToggleJoinLibraryButtonComponent>;
  let alfrescoApi: AlfrescoApiService;
  let contentManagementService: ContentManagementService;
  let entry;

  const storeMock = {
    select: () => of({ library: { entry, isLibrary: true } }),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    entry = {
      id: 'lib-id',
      joinRequested: true,
      title: 'test',
      visibility: 'MODERATED'
    };

    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        ToggleJoinLibraryButtonComponent,
        LibraryMembershipDirective
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ToggleJoinLibraryButtonComponent);
    component = fixture.componentInstance;
    alfrescoApi = TestBed.get(AlfrescoApiService);
    contentManagementService = TestBed.get(ContentManagementService);

    spyOn(alfrescoApi.peopleApi, 'getSiteMembershipRequest').and.stub();
  });

  afterEach(() => {
    fixture.destroy();
    storeMock.dispatch.calls.reset();
  });

  it('should get Store selection entry on initialization', done => {
    component.selection$.subscribe(selection => {
      expect(selection.library.entry).toEqual(entry);
      done();
    });
  });

  it('should dispatch `SnackbarErrorAction` action on error', () => {
    const event = { error: {}, i18nKey: 'ERROR_i18nKey' };
    component.onErrorEvent(event);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new SnackbarErrorAction(event.i18nKey)
    );
  });

  it('should dispatch `SnackbarInfoAction` action on onToggleEvent', () => {
    const event = { shouldReload: true, i18nKey: 'SOME_i18nKey' };
    component.onToggleEvent(event);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new SnackbarInfoAction(event.i18nKey)
    );
  });

  it('should call libraryJoined.next on contentManagementService onToggleEvent', done => {
    spyOn(contentManagementService.libraryJoined, 'next').and.callThrough();

    contentManagementService.libraryJoined.subscribe(() => {
      expect(contentManagementService.libraryJoined.next).toHaveBeenCalled();
      done();
    });
    const event = { shouldReload: true, i18nKey: null };
    component.onToggleEvent(event);
  });

  it('should call joinLibraryToggle.next on contentManagementService onToggleEvent', done => {
    spyOn(contentManagementService.joinLibraryToggle, 'next').and.callThrough();

    contentManagementService.joinLibraryToggle.subscribe(() => {
      expect(
        contentManagementService.joinLibraryToggle.next
      ).toHaveBeenCalled();
      done();
    });
    const event = { shouldReload: false, i18nKey: null };
    component.onToggleEvent(event);
  });
});
