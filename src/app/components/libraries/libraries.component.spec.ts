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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppStore, NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentManagementService } from '../../services/content-management.service';
import {
  AlfrescoApiService,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { EffectsModule } from '@ngrx/effects';
import { LibraryEffects } from '../../store/effects';
import { of } from 'rxjs';

describe('LibrariesComponent', () => {
  let fixture: ComponentFixture<LibrariesComponent>;
  let component: LibrariesComponent;
  let alfrescoApi: AlfrescoApiService;
  let page;
  let store: Store<AppStore>;
  let content: ContentManagementService;

  beforeEach(() => {
    page = {
      list: {
        entries: [{ entry: { id: 1 } }, { entry: { id: 2 } }],
        pagination: { data: 'data' }
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([LibraryEffects])],
      declarations: [
        DataTableComponent,
        NodeFavoriteDirective,
        DocumentListComponent,
        LibrariesComponent,
        AppConfigPipe
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => of(),
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LibrariesComponent);
    content = TestBed.get(ContentManagementService);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.get(AlfrescoApiService);
    store = TestBed.get(Store);
    alfrescoApi.reset();

    spyOn(alfrescoApi.sitesApi, 'getSites').and.returnValue(
      Promise.resolve(page)
    );
    spyOn(alfrescoApi.peopleApi, 'getSiteMembership').and.returnValue(
      Promise.resolve({})
    );
  });

  beforeEach(() => {
    store.dispatch['calls'].reset();
  });

  describe('Events', () => {
    beforeEach(() => {
      spyOn(component, 'reload').and.stub();
    });

    it('should reload list on libraryDeleted event', () => {
      fixture.detectChanges();
      content.libraryDeleted.next();
      expect(component.reload).toHaveBeenCalled();
    });

    it('should reload list on libraryLeft event', () => {
      fixture.detectChanges();
      content.libraryLeft.next();
      expect(component.reload).toHaveBeenCalled();
    });

    it('should reload list on libraryUpdated event', () => {
      fixture.detectChanges();
      content.libraryUpdated.next();
      expect(component.reload).toHaveBeenCalled();
    });
  });

  describe('Node navigation', () => {
    it('does not navigate when node is not passed', () => {
      component.navigateTo(null);

      expect(store.dispatch).not.toHaveBeenCalledWith();
    });

    it('should navigate when node is passed', () => {
      const libraryNode = {
        entry: {
          id: 'library-id',
          title: 'library-title',
          visibility: 'private',
          guid: 'library-guid'
        }
      };
      component.navigateTo(libraryNode);

      expect(store.dispatch).toHaveBeenCalledWith(
        new NavigateLibraryAction(libraryNode.entry.guid)
      );
    });
  });
});
