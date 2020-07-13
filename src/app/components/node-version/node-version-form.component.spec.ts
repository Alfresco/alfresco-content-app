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

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppNodeVersionFormComponent } from './node-version-form.component';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('AppNodeVersionFormComponent', () => {
  let fixture;
  let component;

  setupTestBed({
    imports: [TranslateModule.forRoot(), CoreModule.forRoot(), NoopAnimationsModule],
    declarations: [AppNodeVersionFormComponent]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNodeVersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have minor version option selected', () => {
    const isSelected = fixture.debugElement.nativeElement.querySelectorAll('.form__version--option')[0].classList.contains('mat-radio-checked');

    expect(isSelected).toBe(true);
  });

  it('should emit form state on changes', () => {
    const formData = {
      comment: 'some text',
      version: true
    };
    spyOn(component.update, 'emit');

    component.form.valueChanges.next(formData);
    expect(component.update.emit).toHaveBeenCalledWith(formData);
  });

  it('form should have valid state upon initialization', () => {
    expect(component.form.valid).toBe(true);
  });
});
