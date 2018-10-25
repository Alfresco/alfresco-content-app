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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
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
import { TrashcanComponent } from './trashcan.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ExperimentalDirective } from '../../directives/experimental.directive';

describe('TrashcanComponent', () => {
  let fixture: ComponentFixture<TrashcanComponent>;
  let component: TrashcanComponent;
  let alfrescoApi: AlfrescoApiService;
  let contentService: ContentManagementService;
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
        TrashcanComponent,
        AppConfigPipe,
        ExperimentalDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TrashcanComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.get(AlfrescoApiService);
    alfrescoApi.reset();
    contentService = TestBed.get(ContentManagementService);

    component.documentList = <any>{
      reload: jasmine.createSpy('reload'),
      resetSelection: jasmine.createSpy('resetSelection')
    };
  });

  beforeEach(() => {
    spyOn(alfrescoApi.nodesApi, 'getDeletedNodes').and.returnValue(
      Promise.resolve(page)
    );
  });

  it('should reload on nodes purged', () => {
    component.ngOnInit();
    spyOn(component, 'reload').and.stub();
    contentService.nodesPurged.next({});
    expect(component.reload).toHaveBeenCalled();
  });

  describe('onRestoreNode()', () => {
    it('should call refresh()', () => {
      spyOn(component, 'reload');
      fixture.detectChanges();

      contentService.nodesRestored.next();

      expect(component.reload).toHaveBeenCalled();
    });
  });

  describe('refresh()', () => {
    it('calls child component to reload', () => {
      component.reload();
      expect(component.documentList.reload).toHaveBeenCalled();
    });

    it('calls child component to reset selection', () => {
      component.reload();
      expect(component.documentList.resetSelection).toHaveBeenCalled();
    });
  });
});
