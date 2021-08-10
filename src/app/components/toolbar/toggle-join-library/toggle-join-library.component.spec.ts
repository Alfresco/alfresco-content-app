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

import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectiveModule } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SnackbarErrorAction, SnackbarInfoAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';
import { AppHookService, ContentApiService } from '@alfresco/aca-shared';

describe('ToggleJoinLibraryComponent', () => {
  let component: ToggleJoinLibraryButtonComponent;
  let fixture: ComponentFixture<ToggleJoinLibraryButtonComponent>;
  let appHookService: AppHookService;
  let contentApiService: any;
  let store: Store<any>;
  let entry;

  beforeEach(() => {
    entry = {
      id: 'lib-id',
      joinRequested: true,
      title: 'test',
      visibility: 'MODERATED'
    };

    TestBed.configureTestingModule({
      imports: [AppTestingModule, DirectiveModule],
      declarations: [ToggleJoinLibraryButtonComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => of({ library: { entry, isLibrary: true } }),
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    appHookService = TestBed.inject(AppHookService);

    contentApiService = TestBed.inject(ContentApiService);
    fixture = TestBed.createComponent(ToggleJoinLibraryButtonComponent);
    component = fixture.componentInstance;
    spyOn(contentApiService['sitesApi'], 'getSiteMembershipRequestForPerson').and.stub();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should get Store selection entry on initialization', (done) => {
    component.selection$.subscribe((selection) => {
      expect(selection.library.entry).toEqual(entry);
      done();
    });
  });

  it('should dispatch `SnackbarErrorAction` action on error', () => {
    const event = { error: {}, i18nKey: 'ERROR_i18nKey' };
    component.onErrorEvent(event);

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction(event.i18nKey));
  });

  it('should dispatch `SnackbarInfoAction` action on onToggleEvent', () => {
    const event = { shouldReload: true, i18nKey: 'SOME_i18nKey' };
    component.onToggleEvent(event);

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarInfoAction(event.i18nKey));
  });

  it('should call libraryJoined.next on contentManagementService onToggleEvent', (done) => {
    spyOn(appHookService.libraryJoined, 'next').and.callThrough();

    appHookService.libraryJoined.subscribe(() => {
      expect(appHookService.libraryJoined.next).toHaveBeenCalled();
      done();
    });
    const event = { shouldReload: true, i18nKey: null };
    component.onToggleEvent(event);
  });

  it('should call joinLibraryToggle.next on contentManagementService onToggleEvent', (done) => {
    spyOn(appHookService.joinLibraryToggle, 'next').and.callThrough();

    appHookService.joinLibraryToggle.subscribe(() => {
      expect(appHookService.joinLibraryToggle.next).toHaveBeenCalled();
      done();
    });
    const event = { shouldReload: false, i18nKey: null };
    component.onToggleEvent(event);
  });
});
