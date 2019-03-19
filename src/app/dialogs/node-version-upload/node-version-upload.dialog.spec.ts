/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { NodeVersionUploadDialogComponent } from './node-version-upload.dialog';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppNodeVersionModule } from '../../components/node-version/node-version.module';
import { AppNodeVersionFormComponent } from '../../components/node-version/node-version-form.component';
import { By } from '@angular/platform-browser';
import { CoreModule } from '@alfresco/adf-core';

describe('NodeVersionsDialogComponent', () => {
  let fixture: ComponentFixture<NodeVersionUploadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), AppTestingModule, AppNodeVersionModule],
      declarations: [NodeVersionUploadDialogComponent]
    });

    fixture = TestBed.createComponent(NodeVersionUploadDialogComponent);
    fixture.detectChanges();
  });

  it('should render version form component', () => {
    expect(
      fixture.debugElement.nativeElement.querySelector('app-node-version-form')
    ).not.toBe(null);
  });

  it('should have UPLOAD button state enabled by default', () => {
    const uploadButton = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[1] as HTMLElement;

    expect(uploadButton.textContent.includes('VERSION.DIALOG.UPLOAD')).toBe(
      true
    );
    expect(uploadButton.getAttribute('disabled')).toBe(null);
  });

  it('should have UPLOAD button disabled if for is invalid', () => {
    const uploadButton = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[1] as HTMLElement;

    const versionFormComponent: AppNodeVersionFormComponent = fixture.debugElement.query(
      By.directive(AppNodeVersionFormComponent)
    ).componentInstance;
    versionFormComponent.form.setErrors({ invalid: true });
    fixture.detectChanges();

    expect(uploadButton.getAttribute('disabled')).not.toBe(null);
  });
});
