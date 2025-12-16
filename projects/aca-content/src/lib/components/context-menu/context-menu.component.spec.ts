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
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContentActionRef, ContentActionType, ExtensionService } from '@alfresco/adf-extensions';

import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { Component, ViewChild } from '@angular/core';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { UnitTestingUtils } from '@alfresco/adf-core';

@Component({
  selector: 'aca-custom-menu-component',
  standalone: true,
  imports: [MatMenuModule],
  // eslint-disable-next-line @alfresco/eslint-angular/no-angular-material-selectors
  template: '<button mat-menu-item id="custom-action">Custom Component Content</button>'
})
class TestCustomMenuComponent {
  data: any;
  @ViewChild(MatMenuItem) menuItem: MatMenuItem;
}

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextMenuComponent>;
  let component: ContextMenuComponent;
  let extensionsService: AppExtensionService;
  let extensionService: ExtensionService;
  let unitTestingUtils: UnitTestingUtils;

  const contextItem: ContentActionRef = {
    type: ContentActionType.button,
    id: 'action-button',
    title: 'Test Button',
    actions: {
      click: 'TEST_EVENT'
    },
    icon: 'icon-name'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, TestCustomMenuComponent],
      providers: [
        {
          provide: ContextMenuOverlayRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of({ count: 1 })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;

    extensionsService = TestBed.inject(AppExtensionService);
    extensionService = TestBed.inject(ExtensionService);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  it('should load context menu actions on init', () => {
    spyOn(extensionsService, 'getAllowedContextMenuActions').and.returnValue(of([contextItem]));
    fixture.detectChanges();

    expect(component.actions.length).toBe(1);
  });

  it('should render defined context menu actions items', async () => {
    spyOn(extensionsService, 'getAllowedContextMenuActions').and.returnValue(of([contextItem]));
    fixture.detectChanges();
    await fixture.whenStable();

    const contextMenuButtons = unitTestingUtils.getAllByCSS('.aca-context-menu button');
    const actionButtonLabel = unitTestingUtils.getInnerTextByCSS(
      `.aca-context-menu button:first-child [data-automation-id="${contextItem.id}-label"]`
    );

    expect(contextMenuButtons?.length).toBe(1);
    expect(actionButtonLabel).toBe(contextItem.title);
  });

  it('should not render context menu if no actions items', async () => {
    spyOn(extensionsService, 'getAllowedContextMenuActions').and.returnValue(of([]));
    fixture.detectChanges();
    await fixture.whenStable();

    const contextMenuElements = unitTestingUtils.getByCSS('.aca-context-menu');

    expect(contextMenuElements).toBeNull();
  });

  it('should append menu items in the correct order according to actions array', async () => {
    const customComponentAction: ContentActionRef = {
      type: ContentActionType.custom,
      component: 'test-custom-component',
      id: 'custom-action',
      data: { testProp: 'test-value' }
    };

    const buttonAction2: ContentActionRef = {
      type: ContentActionType.button,
      id: 'button-action-2',
      title: 'Button 2',
      actions: {
        click: 'EVENT_2'
      },
      icon: 'icon-name'
    };

    const orderedActions = [contextItem, customComponentAction, buttonAction2];

    spyOn(extensionsService, 'getAllowedContextMenuActions').and.returnValue(of(orderedActions));
    spyOn(extensionService, 'getComponentById').and.returnValue(TestCustomMenuComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const menuItems = component.menu._allItems.toArray();
    expect(menuItems.length).toBe(3);

    const menuItemsIds = menuItems.map((item) => item._getHostElement().getAttribute('id'));
    const domIds: string[] = Array.from(unitTestingUtils.getAllByCSS('button')).map((button) => button.nativeElement.getAttribute('id'));
    expect(domIds).toEqual(menuItemsIds);
  });
});
