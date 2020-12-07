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
import { NodeFavoriteDirective, DataTableComponent, AppConfigPipe } from '@alfresco/adf-core';
import { CustomResourcesService, DocumentListComponent } from '@alfresco/adf-content-services';
import { RecentFilesComponent } from './recent-files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { Router } from '@angular/router';
import { PersonEntry, ResultSetPaging } from '@alfresco/js-api';

describe('RecentFilesComponent', () => {
  let fixture: ComponentFixture<RecentFilesComponent>;
  let component: RecentFilesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [DataTableComponent, NodeFavoriteDirective, DocumentListComponent, RecentFilesComponent, AppConfigPipe],
      providers: [
        {
          provide: Router,
          useValue: {
            url: 'recent-files'
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(RecentFilesComponent);
    component = fixture.componentInstance;

    const customResourcesService = TestBed.inject(CustomResourcesService);
    spyOn(customResourcesService.peopleApi, 'getPerson').and.returnValue(
      Promise.resolve({
        entry: { id: 'personId' }
      } as PersonEntry)
    );

    const page: ResultSetPaging = {
      list: {
        entries: [
          { entry: { id: '1', name: 'node1', nodeType: 'cm:file', isFile: true, isFolder: false } },
          { entry: { id: '2', name: 'node2', nodeType: 'cm:file', isFile: true, isFolder: false } }
        ],
        pagination: { count: 2, totalItems: 2 }
      }
    };

    spyOn(customResourcesService.searchApi, 'search').and.returnValue(Promise.resolve(page));
  });

  it('should call showPreview method', () => {
    const node: any = { entry: {} };
    spyOn(component, 'showPreview');
    fixture.detectChanges();

    component.onNodeDoubleClick(node);
    expect(component.showPreview).toHaveBeenCalledWith(node, {
      location: 'recent-files'
    });
  });
});
