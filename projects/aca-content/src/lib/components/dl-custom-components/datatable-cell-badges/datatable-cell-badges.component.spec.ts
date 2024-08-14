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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatatableCellBadgesComponent } from './datatable-cell-badges.component';
import { AppExtensionService } from '@alfresco/aca-shared';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModule } from '@alfresco/adf-core';
import { Actions } from '@ngrx/effects';
import { NodeEntry } from '@alfresco/js-api';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ContentActionType } from '@alfresco/adf-extensions';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

const mockNode = {
  entry: {
    isFile: true,
    id: 'nodeId'
  }
} as NodeEntry;

const mockGetBadgesResponse = {
  id: 'test',
  type: ContentActionType.custom,
  icon: 'warning',
  tooltip: 'test tooltip'
};

describe('DatatableCellBadgesComponent', () => {
  let fixture: ComponentFixture<DatatableCellBadgesComponent>;
  let component: DatatableCellBadgesComponent;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AuthModule.forRoot(),
        HttpClientModule,
        StoreModule.forRoot(
          { app: (state) => state },
          {
            initialState: {
              app: {
                selection: {
                  nodes: [],
                  libraries: [],
                  isEmpty: true,
                  count: 0
                }
              }
            }
          }
        )
      ],
      providers: [Actions]
    });

    fixture = TestBed.createComponent(DatatableCellBadgesComponent);
    component = fixture.componentInstance;
    appExtensionService = TestBed.inject(AppExtensionService);
    component.node = mockNode;
  });

  it('should get badges when component initializes', () => {
    spyOn(appExtensionService, 'getBadges').and.returnValue(of([mockGetBadgesResponse]));
    component.ngOnInit();
    fixture.detectChanges();
    const badges = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-badge')).map((badge) => badge.nativeElement);
    expect(appExtensionService.getBadges).toHaveBeenCalled();
    expect(badges.length).toBe(1);
    expect(badges[0].innerText).toBe('warning');
    expect(badges[0].attributes['title'].value).toBe('test tooltip');
  });

  it('should render dynamic component when badge has one provided', () => {
    spyOn(appExtensionService, 'getBadges').and.returnValue(of([{ ...mockGetBadgesResponse, component: 'test-id' }]));
    component.ngOnInit();
    fixture.detectChanges();
    const dynamicComponent = fixture.debugElement.query(By.css('adf-dynamic-component')).nativeElement;
    expect(dynamicComponent).toBeDefined();
  });

  describe('mouse and keyboard events', () => {
    let badges: HTMLElement[];
    let runActionSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(appExtensionService, 'getBadges').and.returnValue(of([{ ...mockGetBadgesResponse, actions: { click: 'test' } }]));
      component.ngOnInit();
      fixture.detectChanges();
      badges = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-badge')).map((badge) => badge.nativeElement);
      runActionSpy = spyOn(appExtensionService, 'runActionById');
    });

    it('should call provided handler on click', () => {
      badges[0].click();
      expect(runActionSpy).toHaveBeenCalledWith('test', component.node);
    });

    it('should call provided handler on keypress event', () => {
      badges[0].dispatchEvent(new KeyboardEvent('keypress.enter'));
      expect(runActionSpy).toHaveBeenCalledWith('test', component.node);
    });
  });
});
