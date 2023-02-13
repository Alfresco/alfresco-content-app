/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { HeaderActionsComponent } from './header-actions.component';
import { ContentActionType } from '@alfresco/adf-extensions';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CoreModule } from '@alfresco/adf-core';
import { AppHeaderActionsModule } from './header-actions.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HeaderActionsComponent', () => {
  let fixture: ComponentFixture<HeaderActionsComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forRoot(), AppHeaderActionsModule, RouterTestingModule],
      declarations: [HeaderActionsComponent]
    });

    const extensionService = TestBed.inject(AppExtensionService);
    spyOn(extensionService, 'getCreateActions').and.returnValue(
      of([
        {
          id: 'action1',
          type: ContentActionType.button,
          title: 'create action one'
        },
        {
          id: 'action2',
          type: ContentActionType.button,
          title: 'create action two'
        }
      ])
    );

    spyOn(extensionService, 'getUploadActions').and.returnValue(
      of([
        {
          id: 'action3',
          type: ContentActionType.button,
          title: 'upload action one'
        }
      ])
    );

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HeaderActionsComponent);
    fixture.detectChanges();
  });

  const getCreateButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
  const getUploadButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id="upload-button"]')).nativeElement;

  it('total number of buttons in header should be 2 if route is personal-files', async () => {
    spyOnProperty(router, 'url').and.returnValue('/personal-files');

    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = fixture.debugElement.queryAll(By.css('.action-bar > .aca-mat-button'));

    expect(buttons.length).toBe(2);
    expect(getCreateButton()).toBeTruthy();
    expect(getUploadButton()).toBeTruthy();
  });

  it('total number of buttons in header should be 1 if route is libraries', async () => {
    spyOnProperty(router, 'url').and.returnValue('/libraries');

    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = fixture.debugElement.queryAll(By.css('.action-bar > .aca-mat-button'));

    expect(buttons.length).toBe(1);
    expect(getCreateButton()).toBeTruthy();
  });

  it('should render menu items when create menu is opened', async () => {
    spyOnProperty(router, 'url').and.returnValue('/personal-files');

    fixture.detectChanges();
    await fixture.whenStable();

    getCreateButton().click();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(2);

    const menuItemOne = (menuItems[0].nativeElement as HTMLButtonElement).querySelector<HTMLSpanElement>('[data-automation-id="menu-item-title"]');
    const menuItemTwo = (menuItems[1].nativeElement as HTMLButtonElement).querySelector<HTMLSpanElement>('[data-automation-id="menu-item-title"]');
    expect(menuItemOne.innerText).toBe('create action one');
    expect(menuItemTwo.innerText).toBe('create action two');
  });

  it('should render menu items when upload menu is opened', async () => {
    spyOnProperty(router, 'url').and.returnValue('/personal-files');

    fixture.detectChanges();
    await fixture.whenStable();

    getUploadButton().click();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(1);

    const menuItemOne = (menuItems[0].nativeElement as HTMLButtonElement).querySelector<HTMLSpanElement>('[data-automation-id="menu-item-title"]');
    expect(menuItemOne.innerText).toBe('upload action one');
  });
});
