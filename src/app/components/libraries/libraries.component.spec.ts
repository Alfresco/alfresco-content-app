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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AlfrescoApiService, NodeFavoriteDirective, DataTableComponent, AppConfigModule } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { EffectsModule } from '@ngrx/effects';
import { LibraryEffects } from '../../store/effects';
import { ContentApiService } from '@alfresco/aca-shared';

describe('LibrariesComponent', () => {
  let fixture: ComponentFixture<LibrariesComponent>;
  let component: LibrariesComponent;
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
      imports: [AppTestingModule, EffectsModule.forRoot([LibraryEffects]), AppConfigModule],
      declarations: [DataTableComponent, NodeFavoriteDirective, DocumentListComponent, LibrariesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LibrariesComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.inject(AlfrescoApiService);
    contentApiService = TestBed.inject(ContentApiService);
    alfrescoApi.reset();
    router = TestBed.inject(Router);

    const sitesApi: any = contentApiService['sitesApi'];

    spyOn(sitesApi, 'listSites').and.returnValue(Promise.resolve(page));
    spyOn(sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve({}));
  });

  describe('Node navigation', () => {
    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
