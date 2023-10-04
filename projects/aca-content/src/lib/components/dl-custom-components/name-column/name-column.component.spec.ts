/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CustomNameColumnComponent } from './name-column.component';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { ContentActionType } from '@alfresco/adf-extensions';
import { By } from '@angular/platform-browser';

describe('CustomNameColumnComponent', () => {
  let fixture: ComponentFixture<CustomNameColumnComponent>;
  let component: CustomNameColumnComponent;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot(),
        CustomNameColumnComponent,
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

    fixture = TestBed.createComponent(CustomNameColumnComponent);
    component = fixture.componentInstance;
    appExtensionService = TestBed.inject(AppExtensionService);
  });

  it('should not render lock element if file is not locked', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: true,
            id: 'nodeId'
          }
        },
        getValue: (key: string) => key
      }
    };

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).toBe(null);
  });

  it('should not render lock element if node is not a file', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: false,
            id: 'nodeId'
          }
        },
        getValue: (key: string) => key
      }
    };

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).toBe(null);
  });

  it('should render lock element if file is locked', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: true,
            id: 'nodeId',
            properties: { 'cm:lockType': 'WRITE_LOCK' }
          }
        },
        getValue: (key: string) => key
      }
    };

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).not.toBe(null);
  });

  it('should call parent component onClick method', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'onClick');

    component.onLinkClick(event);

    expect(component.onClick).toHaveBeenCalled();
  });

  it('should prevent event propagation', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.onLinkClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  describe('Name column badges', () => {
    beforeEach(() => {
      component.context = {
        row: {
          node: {
            entry: {
              isFile: true,
              id: 'nodeId'
            }
          },
          getValue: (key: string) => key
        }
      };
    });

    it('should get badges when component initializes', () => {
      spyOn(appExtensionService, 'getBadges').and.returnValue(
        of([{ id: 'test', type: ContentActionType.custom, icon: 'warning', tooltip: 'test tooltip' }])
      );
      component.ngOnInit();
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-badge')).map((badge) => badge.nativeElement);
      expect(appExtensionService.getBadges).toHaveBeenCalled();
      expect(badges.length).toBe(1);
      expect(badges[0].innerText).toBe('warning');
      expect(badges[0].attributes['title'].value).toBe('test tooltip');
    });

    it('should call provided handler on click', () => {
      spyOn(appExtensionService, 'runActionById');
      spyOn(appExtensionService, 'getBadges').and.returnValue(
        of([{ id: 'test', type: ContentActionType.custom, icon: 'warning', tooltip: 'test tooltip', actions: { click: 'test' } }])
      );
      component.ngOnInit();
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.css('.adf-datatable-cell-badge')).map((badge) => badge.nativeElement);
      badges[0].click();
      expect(appExtensionService.runActionById).toHaveBeenCalledWith('test', component.context.row.node);
    });

    it('should render dynamic component when badge has one provided', () => {
      spyOn(appExtensionService, 'getBadges').and.returnValue(
        of([{ id: 'test', type: ContentActionType.custom, icon: 'warning', tooltip: 'test tooltip', component: 'test-id' }])
      );
      component.ngOnInit();
      fixture.detectChanges();
      const dynamicComponent = fixture.debugElement.query(By.css('adf-dynamic-component')).nativeElement;
      expect(dynamicComponent).toBeDefined();
    });
  });
});
