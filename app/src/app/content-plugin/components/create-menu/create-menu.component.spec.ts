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

import { CreateMenuComponent } from './create-menu.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@alfresco/adf-core';
import { AppCreateMenuModule } from './create-menu.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { AppExtensionService } from '@alfresco/aca-shared';
import { ContentActionType } from '@alfresco/adf-extensions';
import { By } from '@angular/platform-browser';
import { AppTestingModule } from '../../testing/app-testing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { getContentActionRef } from '../../testing/content-action-ref';

describe('CreateMenuComponent', () => {
  let fixture: ComponentFixture<CreateMenuComponent>;
  let extensionService: AppExtensionService;
  let getCreateActionsSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forRoot(), AppCreateMenuModule, OverlayModule, MatMenuModule, MatButtonModule]
    });

    extensionService = TestBed.inject(AppExtensionService);
    getCreateActionsSpy = spyOn(extensionService, 'getCreateActions');
    getCreateActionsSpy.and.returnValue(
      of([
        {
          id: 'action1',
          type: ContentActionType.button,
          title: 'action one'
        }
      ])
    );

    spyOn(extensionService, 'getMainAction').and.returnValue(of(getContentActionRef()));

    fixture = TestBed.createComponent(CreateMenuComponent);
  });

  async function clickMenu() {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should render collapsed button', async () => {
    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    const isCollapsed = button.classList.contains('app-create-menu--collapsed');

    expect(isCollapsed).toBe(true);
  });

  it('should render expanded button', async () => {
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    const isCollapsed = button.classList.contains('app-create-menu--collapsed');

    expect(isCollapsed).toBe(false);
  });

  it('should render custom actions', async () => {
    await clickMenu();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(1);

    const label: HTMLSpanElement = (menuItems[0].nativeElement as HTMLButtonElement).querySelector('[data-automation-id="menu-item-title"]');
    expect(label.innerText).toBe('action one');
  });

  it('should render sub-menus', async () => {
    getCreateActionsSpy.and.returnValue(
      of([
        {
          id: 'level1',
          type: ContentActionType.menu,
          title: 'level one',
          children: [
            {
              id: 'level2',
              type: ContentActionType.button,
              title: 'level two'
            }
          ]
        }
      ])
    );

    await clickMenu();

    const level1 = fixture.debugElement.query(By.css('#level1')).nativeElement as HTMLButtonElement;
    level1.click();

    const overlayContainer = TestBed.inject(OverlayContainer);
    const level2 = overlayContainer.getContainerElement().querySelector('#level2');

    expect(level2).not.toBeNull();
  });

  it('should recognise if main button is present', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    const isSecondaryButton = button.classList.contains('app-create-menu-secondary-button');

    expect(isSecondaryButton).toBeTrue();
  });
});
