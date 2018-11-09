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

import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlfrescoApiService,
  TimeAgoPipe,
  NodeNameTooltipPipe,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { FavoriteLibrariesComponent } from './favorite-libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '../../services/content-api.service';
import { ExperimentalDirective } from '../../directives/experimental.directive';
import { EffectsModule } from '@ngrx/effects';
import { LibraryEffects } from '../../store/effects';
import { of } from 'rxjs';

describe('LibrariesComponent', () => {
  let fixture: ComponentFixture<FavoriteLibrariesComponent>;
  let component: FavoriteLibrariesComponent;
  let alfrescoApi: AlfrescoApiService;
  let contentApiService: ContentApiService;
  let router: Router;
  let page;

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
        TimeAgoPipe,
        NodeNameTooltipPipe,
        NodeFavoriteDirective,
        DocumentListComponent,
        FavoriteLibrariesComponent,
        AppConfigPipe,
        ExperimentalDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FavoriteLibrariesComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.get(AlfrescoApiService);
    contentApiService = TestBed.get(ContentApiService);
    alfrescoApi.reset();
    router = TestBed.get(Router);

    spyOn(contentApiService, 'getNode').and.returnValue(
      of({ entry: { id: 'libraryId' } })
    );
  });

  describe('Favorite libraries data', () => {
    it('should initialise with default data', () => {
      expect(component.node).toBe(undefined);
      expect(component.dataIsLoading).toBe(true);
    });

    it('should get data on initialization', async(() => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      fixture.autoDetectChanges();

      expect(component.favoriteList).toEqual(page);
      expect(component.dataIsLoading).toBe(false);
    }));
  });

  describe('Node navigation', () => {
    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo({ entry: { guid: 'guid' } });

      expect(router.navigate).toHaveBeenCalledWith(['libraries', 'libraryId']);
    });
  });
});
