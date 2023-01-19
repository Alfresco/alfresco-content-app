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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('HeaderActionsComponent', () => {
  let component: HeaderActionsComponent;
  let fixture: ComponentFixture<HeaderActionsComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, MatMenuModule, NoopAnimationsModule, MatButtonModule],
      declarations: [HeaderActionsComponent],
      providers: []
    });

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open create menu on click of create button', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    buttons.forEach((btn) => btn.click());

    const createMenu = fixture.debugElement.queryAll(By.css('.app-create-menu__root-menu app-create-menu__sub-menu'));
    expect(createMenu).toBeTruthy();
  });

  it('should open upload menu on click of upload button', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    buttons.forEach((btn) => btn.click());

    const uploadMenu = fixture.debugElement.queryAll(By.css('.app-upload-menu__root-menu app-upload-menu__sub-menu'));
    expect(uploadMenu).toBeTruthy();
  });
});
