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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  AlfrescoApiService,
  TimeAgoPipe,
  NodeNameTooltipPipe,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../services/content-management.service';
import { SharedFilesComponent } from './shared-files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ExperimentalDirective } from '../../directives/experimental.directive';

describe('SharedFilesComponent', () => {
  let fixture: ComponentFixture<SharedFilesComponent>;
  let component: SharedFilesComponent;
  let contentService: ContentManagementService;
  let alfrescoApi: AlfrescoApiService;
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
      imports: [AppTestingModule],
      declarations: [
        DataTableComponent,
        TimeAgoPipe,
        NodeNameTooltipPipe,
        NodeFavoriteDirective,
        DocumentListComponent,
        SharedFilesComponent,
        AppConfigPipe,
        ExperimentalDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(SharedFilesComponent);
    component = fixture.componentInstance;

    contentService = TestBed.get(ContentManagementService);
    alfrescoApi = TestBed.get(AlfrescoApiService);
    alfrescoApi.reset();

    spyOn(alfrescoApi.sharedLinksApi, 'findSharedLinks').and.returnValue(
      Promise.resolve(page)
    );
  });

  describe('OnInit', () => {
    beforeEach(() => {
      spyOn(component, 'reload').and.callFake(val => val);
    });

    it('should refresh on deleteNode event', () => {
      fixture.detectChanges();

      contentService.nodesDeleted.next();

      expect(component.reload).toHaveBeenCalled();
    });

    it('should refresh on restoreNode event', () => {
      fixture.detectChanges();

      contentService.nodesRestored.next();

      expect(component.reload).toHaveBeenCalled();
    });

    it('should reload on move node event', () => {
      fixture.detectChanges();

      contentService.nodesMoved.next();

      expect(component.reload).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call document list reload', () => {
      spyOn(component.documentList, 'reload');
      fixture.detectChanges();

      component.reload();

      expect(component.documentList.reload).toHaveBeenCalled();
    });
  });
});
