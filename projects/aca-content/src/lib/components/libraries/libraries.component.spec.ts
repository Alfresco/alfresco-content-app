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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { EffectsModule } from '@ngrx/effects';
import { LibraryEffects } from '../../store/effects';
import { ContentApiService } from '@alfresco/aca-shared';
import { getTitleElementText } from '../../testing/test-utils';

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
      imports: [AppTestingModule, EffectsModule.forRoot([LibraryEffects]), LibrariesComponent]
    });

    fixture = TestBed.createComponent(LibrariesComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.inject(AlfrescoApiService);
    contentApiService = TestBed.inject(ContentApiService);
    alfrescoApi.reset();
    router = TestBed.inject(Router);

    const sitesApi = contentApiService.sitesApi;

    spyOn(sitesApi, 'listSites').and.returnValue(Promise.resolve(page));
    spyOn(sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve({}));
  });

  describe('Initialization', () => {
    it('should set title to MY_LIBRARIES.TITLE based on selectedRowItemsCount', () => {
      fixture.detectChanges();
      expect(getTitleElementText(fixture)).toBe('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');

      component.selectedRowItemsCount = 2;
      fixture.detectChanges();
      expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
    });
  });

  describe('Node navigation', () => {
    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
