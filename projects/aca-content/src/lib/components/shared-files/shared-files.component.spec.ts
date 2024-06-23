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
import { CustomResourcesService } from '@alfresco/adf-content-services';
import { SharedFilesComponent } from './shared-files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SharedLinkPaging } from '@alfresco/js-api';
import { AppService } from '@alfresco/aca-shared';
import { getTitleElementText } from '../../testing/test-utils';
import { ActivatedRoute, Router } from '@angular/router';

describe('SharedFilesComponent', () => {
  let fixture: ComponentFixture<SharedFilesComponent>;
  let page: SharedLinkPaging;
  let component: SharedFilesComponent;
  const routerMock = {
    routerState: { root: '' },
    url: 'shared-files'
  };
  const route = {
    snapshot: {
      data: {
        sortingPreferenceKey: ''
      }
    }
  };

  const appServiceMock = {
    appNavNarMode$: new BehaviorSubject('collapsed'),
    toggleAppNavBar$: new Subject()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SharedFilesComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: AppService,
          useValue: appServiceMock
        }
      ]
    });

    page = {
      list: {
        entries: [{ entry: { id: '1' } }, { entry: { id: '2' } }],
        pagination: { count: 2 }
      }
    };

    const customResourcesService = TestBed.inject(CustomResourcesService);
    spyOn(customResourcesService, 'loadSharedLinks').and.returnValue(of(page));
    fixture = TestBed.createComponent(SharedFilesComponent);
    component = fixture.componentInstance;
  });

  it('should set title based on selectedRowItemsCount', () => {
    fixture.detectChanges();
    expect(getTitleElementText(fixture)).toBe('APP.BROWSE.SHARED.TITLE');

    component.selectedRowItemsCount = 5;
    fixture.detectChanges();
    expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
  });

  // TODO: needs better testing strategy
  // eslint-disable-next-line ban/ban
  xit('[C280093] should not display pagination for empty data', async () => {
    page = { list: { pagination: { totalItems: 0 }, entries: [] } };

    fixture.detectChanges();
    await fixture.whenStable();

    const pagination = fixture.debugElement.query(By.css('.adf-pagination'));
    expect(pagination).toBeNull();
  });
});
