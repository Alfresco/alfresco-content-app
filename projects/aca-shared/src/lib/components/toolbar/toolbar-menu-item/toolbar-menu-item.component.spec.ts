/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ToolbarMenuItemComponent } from './toolbar-menu-item.component';
import { AppExtensionService } from '../../../services/app.extension.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ContentActionRef, ContentActionType, DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { LibTestingModule } from '@alfresco/aca-shared';
import { MatMenuItem } from '@angular/material/menu';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('ToolbarMenuItemComponent', () => {
  let fixture: ComponentFixture<ToolbarMenuItemComponent>;
  let testingUtils: UnitTestingUtils;
  let component: ToolbarMenuItemComponent;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, ToolbarMenuItemComponent],
      providers: [
        { provide: AppExtensionService, useValue: { runActionById() {} } },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of({ count: 1 })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ToolbarMenuItemComponent);
    testingUtils = new UnitTestingUtils(fixture.debugElement);
    component = fixture.componentInstance;
    appExtensionService = TestBed.inject(AppExtensionService);
  });

  it('should run action on click', async () => {
    const runActionById = spyOn(appExtensionService, 'runActionById');

    component.actionRef = {
      id: 'button1',
      type: ContentActionType.button,
      actions: {
        click: 'ON_CLICK'
      },
      icon: 'icon-name'
    };

    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[id="button1"]');
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(runActionById).toHaveBeenCalled();
  });

  it('should run action with focus selector on click', async () => {
    const runActionById = spyOn(appExtensionService, 'runActionById');

    component.menuId = 'menu1';
    component.actionRef = {
      id: 'button1',
      type: ContentActionType.button,
      actions: {
        click: 'ON_CLICK'
      },
      icon: 'icon-name'
    };

    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[id="button1"]');
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(runActionById).toHaveBeenCalledWith('ON_CLICK', { focusedElementOnCloseSelector: '#menu1' });
  });

  it('should track elements by content action id', () => {
    const contentActionRef: ContentActionRef = {
      id: 'action1',
      type: ContentActionType.button
    };

    expect(component.trackByActionId(0, contentActionRef)).toBe('action1');
  });

  it('should assign menuItem from dynamic component', () => {
    component.actionRef = {
      id: 'action1',
      type: ContentActionType.custom
    };
    fixture.detectChanges();

    const innerElement = testingUtils.getByDirective(DynamicExtensionComponent);
    const menuItem = {} as MatMenuItem;
    innerElement.componentInstance.menuItem = menuItem;
    component.ngAfterViewInit();
    expect(component.menuItem).toEqual(menuItem);
  });
});
