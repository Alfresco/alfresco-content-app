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

import { ToolbarMenuComponent } from './toolbar-menu.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentActionRef, ContentActionType, DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { LibTestingModule } from '@alfresco/aca-shared';
import { ToolbarMenuItemComponent } from '../toolbar-menu-item/toolbar-menu-item.component';

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

  it('should track elements by content action id', () => {
    const contentActionRef: ContentActionRef = {
      id: 'action1',
      type: ContentActionType.button
    };

    expect(component.trackByActionId(0, contentActionRef)).toBe('action1');
  });

  describe('ngAfterViewInit', () => {
    it('should set mixed custom and standard menu items in right order', () => {
      const customMenuItem = jasmine.createSpyObj('MatMenuItem', ['focus'], { id: 'customMenuItem' });
      const dynamicComponent = { id: 'comp1', menuItem: customMenuItem } as DynamicExtensionComponent;

      component.dynamicExtensionComponents.reset([dynamicComponent]);

      const standardMenuItem = jasmine.createSpyObj('MatMenuItem', ['focus'], { id: 'standardMenuItem' });
      const toolbarItem = { actionRef: { id: 'item1' }, menuItem: standardMenuItem } as ToolbarMenuItemComponent;

      component.toolbarMenuItems.reset([toolbarItem]);

      component.actionRef = {
        id: 'parent',
        children: [
          { id: 'custom1', type: ContentActionType.custom, component: 'comp1' },
          { id: 'item1', type: ContentActionType.button },
          { id: 'custom2', type: ContentActionType.custom, component: 'comp1' }
        ]
      } as ContentActionRef;

      component.ngAfterViewInit();

      expect(component.menu._allItems.length).toBe(3);
      expect(component.menu._allItems.toArray()).toEqual([customMenuItem, standardMenuItem, customMenuItem]);
    });

    it('should skip items without menuItem property', () => {
      const customMenuItem = jasmine.createSpyObj('MatMenuItem', ['focus'], { id: 'menuItem1' });
      const toolbarItem1 = { actionRef: { id: 'item1' }, menuItem: customMenuItem } as ToolbarMenuItemComponent;
      const toolbarItem2 = { actionRef: { id: 'item2' } } as ToolbarMenuItemComponent;

      component.toolbarMenuItems.reset([toolbarItem1, toolbarItem2]);

      component.actionRef = {
        id: 'parent',
        children: [
          { id: 'item1', type: ContentActionType.button },
          { id: 'item2', type: ContentActionType.button }
        ]
      } as ContentActionRef;

      component.ngAfterViewInit();

      expect(component.menu._allItems.length).toBe(1);
      expect(component.menu._allItems.toArray()).toEqual([customMenuItem]);
    });

    it('should use component ID when component property is not specified for custom item', () => {
      const menuItem = jasmine.createSpyObj('MatMenuItem', ['focus'], { id: 'menuItem' });
      const dynamicComponent = { id: 'custom1', menuItem: menuItem } as DynamicExtensionComponent;

      component.dynamicExtensionComponents.reset([dynamicComponent]);

      component.actionRef = {
        id: 'parent',
        children: [{ id: 'custom1', type: ContentActionType.custom }]
      } as ContentActionRef;

      component.ngAfterViewInit();

      expect(component.menu._allItems.length).toBe(1);
      expect(component.menu._allItems.first).toBe(menuItem);
    });
  });
});
