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

import { CreateFileFromTemplateDialogComponent } from './create-from-template.dialog';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { CoreModule } from '@alfresco/adf-core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

function text(length: number) {
  return new Array(length)
    .fill(
      Math.random()
        .toString()
        .substring(2, 3)
    )
    .join('');
}

describe('CreateFileFromTemplateDialogComponent', () => {
  let fixture: ComponentFixture<CreateFileFromTemplateDialogComponent>;
  let component: CreateFileFromTemplateDialogComponent;
  let dialogRef: MatDialogRef<CreateFileFromTemplateDialogComponent>;

  const data = {
    id: 'node-id',
    name: 'node-name',
    properties: {
      'cm:title': 'node-title',
      'cm:description': ''
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), AppTestingModule, MatDialogModule],
      declarations: [CreateFileFromTemplateDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ]
    });

    fixture = TestBed.createComponent(CreateFileFromTemplateDialogComponent);
    dialogRef = TestBed.get(MatDialogRef);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should populate form with provided dialog data', () => {
    expect(component.form.controls.name.value).toBe(data.name);
    expect(component.form.controls.title.value).toBe(
      data.properties['cm:title']
    );
    expect(component.form.controls.description.value).toBe(
      data.properties['cm:description']
    );
  });

  it('should invalidate form if required `name` field is invalid', () => {
    component.form.controls.name.setValue('');
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if required `name` field has `only spaces`', () => {
    component.form.controls.name.setValue('   ');
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if required `name` field has `ending dot`', () => {
    component.form.controls.name.setValue('something.');
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if `title` text length is long', () => {
    component.form.controls.title.setValue(text(260));
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if `description` text length is long', () => {
    component.form.controls.description.setValue(text(520));
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should update data with form values', () => {
    component.form.controls.name.setValue('new-node-name');
    component.form.controls.title.setValue('new-node-title');
    component.form.controls.description.setValue('new-node-description');

    fixture.detectChanges();

    component.onSubmit();

    expect(dialogRef.close['calls'].argsFor(0)[0]).toEqual({
      id: 'node-id',
      name: 'new-node-name',
      properties: {
        'cm:title': 'new-node-title',
        'cm:description': 'new-node-description'
      }
    });
  });
});
