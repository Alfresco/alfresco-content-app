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
import { HeaderActionsComponent } from './header-actions.component'
import { ContentActionType } from '@alfresco/adf-extensions';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CoreModule } from '@alfresco/adf-core';
import { AppHeaderActionsModule } from './header-actions.module';

describe('HeaderActionsComponent', () => {
  let component: HeaderActionsComponent;
  let fixture: ComponentFixture<HeaderActionsComponent>;
  
  let extensionService: AppExtensionService;
  let getCreateActionsSpy: jasmine.Spy;
  let getUploadActionsSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forRoot(), AppHeaderActionsModule],
      declarations: [HeaderActionsComponent]
    });

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    extensionService = TestBed.inject(AppExtensionService);

    getCreateActionsSpy = spyOn(extensionService, 'getCreateActions');
    getCreateActionsSpy.and.returnValue(
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

    getUploadActionsSpy = spyOn(extensionService, 'getUploadActions');
    getUploadActionsSpy.and.returnValue(
      of([
        {
          id: 'action3',
          type: ContentActionType.button,
          title: 'upload action one'
        }
      ])
    );

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('total number of buttons in header should be 2 if route is personal-files', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.action-bar > .aca-mat-button'));
    const createButton: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    const uploadButton: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="upload-button"]')).nativeElement;

    expect(buttons.length).toBe(2);
    expect(createButton).toBeTruthy();
    expect(uploadButton).toBeTruthy();
  });

  it('total number of buttons in header should be 1 if route is libraries', async () => {
    spyOn(component, 'isLibrariesRoute').and.returnValue(true);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.action-bar > .aca-mat-button'));
    const createButton: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;

    expect(buttons.length).toBe(1);
    expect(createButton).toBeTruthy();
  });

  async function clickCreateMenu() {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="create-button"]')).nativeElement;
    button.click();
  }

  async function clickUploadMenu() {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="upload-button"]')).nativeElement;
    button.click();
  }

  it('should render menu items when create menu is opened' , async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    await clickCreateMenu();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(2);

    const menuItemOne: HTMLSpanElement = (menuItems[0].nativeElement as HTMLButtonElement).querySelector('[data-automation-id="menu-item-title"]');
    const menuItemTwo: HTMLSpanElement = (menuItems[1].nativeElement as HTMLButtonElement).querySelector('[data-automation-id="menu-item-title"]');
    expect(menuItemOne.innerText).toBe('create action one');
    expect(menuItemTwo.innerText).toBe('create action two');
  });

  it('should render menu items when upload menu is opened', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    await clickUploadMenu();

    const menuItems = fixture.debugElement.queryAll(By.css('.app-toolbar-menu-item'));
    expect(menuItems.length).toBe(1);

    const menuItemOne: HTMLSpanElement = (menuItems[0].nativeElement as HTMLButtonElement).querySelector('[data-automation-id="menu-item-title"]');
    expect(menuItemOne.innerText).toBe('upload action one');
  });
});
