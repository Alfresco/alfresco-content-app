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

import { ToolbarMenuComponent } from './toolbar-menu.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';
import { QueryList } from '@angular/core';
import { LibTestingModule } from '@alfresco/aca-shared';

describe('ToolbarMenuComponent', () => {
  let fixture: ComponentFixture<ToolbarMenuComponent>;
  let component: ToolbarMenuComponent;

  const actions = { id: 'action-1', type: 'button' } as ContentActionRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, ToolbarMenuComponent]
    });
    fixture = TestBed.createComponent(ToolbarMenuComponent);
    component = fixture.componentInstance;
    component.matTrigger = jasmine.createSpyObj('MatMenuTrigger', ['closeMenu']);
    component.actionRef = actions;

    fixture.detectChanges();
  });

  it('should close toolbar context menu', () => {
    spyOn(component.matTrigger, 'closeMenu');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.matTrigger.closeMenu).toHaveBeenCalled();
  });

  it('should populate underlying menu with toolbar items', () => {
    component.toolbarMenuItems = new QueryList();
    component.toolbarMenuItems.reset([{ menuItem: {} } as any]);
    expect(component.toolbarMenuItems.length).toBe(1);

    expect(component.menu._allItems.length).toBe(0);
    component.ngAfterViewInit();
    expect(component.menu._allItems.length).toBe(1);
  });

  it('should track elements by content action id', () => {
    const contentActionRef: ContentActionRef = {
      id: 'action1',
      type: ContentActionType.button
    };

    expect(component.trackByActionId(0, contentActionRef)).toBe('action1');
  });
});
