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
import { NodeFavoriteDirective, DataTableComponent, AppConfigModule } from '@alfresco/adf-core';
import { CustomResourcesService, DocumentListComponent } from '@alfresco/adf-content-services';
import { RecentFilesComponent } from './recent-files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { Router } from '@angular/router';
import { NodePaging, SearchApi } from '@alfresco/js-api';
import { of } from 'rxjs';

describe('RecentFilesComponent', () => {
  let fixture: ComponentFixture<RecentFilesComponent>;
  let component: RecentFilesComponent;

  beforeEach(async () => {
    const searchApi = jasmine.createSpyObj('SearchApi', ['search']);

    const testBed = TestBed.configureTestingModule({
      imports: [AppTestingModule, AppConfigModule],
      declarations: [DataTableComponent, NodeFavoriteDirective, DocumentListComponent, RecentFilesComponent],
      providers: [
        { provide: SearchApi, useValue: searchApi },
        {
          provide: Router,
          useValue: {
            url: 'recent-files'
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    await testBed.compileComponents();

    const customResourcesService = TestBed.inject(CustomResourcesService);

    const page: NodePaging = {
      list: {
        entries: [
          {
            entry: {
              id: '1',
              name: 'node1',
              nodeType: 'cm:file',
              isFile: true,
              isFolder: false,
              createdAt: null,
              modifiedAt: null,
              modifiedByUser: null,
              createdByUser: null
            }
          },
          {
            entry: {
              id: '2',
              name: 'node2',
              nodeType: 'cm:file',
              isFile: true,
              isFolder: false,
              createdAt: null,
              modifiedAt: null,
              modifiedByUser: null,
              createdByUser: null
            }
          }
        ],
        pagination: { count: 2, totalItems: 2 }
      }
    };

    spyOn(customResourcesService, 'getRecentFiles').and.returnValue(of(page));

    fixture = TestBed.createComponent(RecentFilesComponent);
    component = fixture.componentInstance;
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
