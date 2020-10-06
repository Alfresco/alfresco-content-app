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
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { AppExtensionService } from '@alfresco/aca-shared';
import { ContentActionType } from '@alfresco/adf-extensions';
import { By } from '@angular/platform-browser';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('CreateMenuComponent', () => {
  let fixture: ComponentFixture<CreateMenuComponent>;
  let extensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forRoot(), AppCreateMenuModule, OverlayModule],
      providers: [Overlay]
    });

    extensionService = TestBed.inject(AppExtensionService);
    spyOn(extensionService, 'getCreateActions').and.returnValue([
      {
        id: 'action1',
        type: ContentActionType.button,
        title: 'action one'
      }
    ]);

    fixture = TestBed.createComponent(CreateMenuComponent);
  });

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
    fixture.detectChanges();
    await fixture.whenStable();

    expect(extensionService.getCreateActions).toHaveBeenCalled();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(1);

    const label: HTMLSpanElement = (menuItems[0].nativeElement as HTMLButtonElement).querySelector('[data-automation-id="button-title"]');
    expect(label.innerText).toBe('action one');
  });
});
