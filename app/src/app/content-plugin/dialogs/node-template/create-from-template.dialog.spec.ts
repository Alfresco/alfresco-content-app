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

import { CreateFromTemplateDialogComponent } from './create-from-template.dialog';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { CoreModule, TranslationMock } from '@alfresco/adf-core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CreateFromTemplate } from '@alfresco/aca-shared/store';
import { Node } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';

const text = (length: number) => new Array(length).fill(Math.random().toString().substring(2, 3)).join('');

describe('CreateFileFromTemplateDialogComponent', () => {
  let fixture: ComponentFixture<CreateFromTemplateDialogComponent>;
  let component: CreateFromTemplateDialogComponent;
  let store;

  const data = {
    id: 'node-id',
    name: 'node-name',
    isFolder: false,
    isFile: true,
    properties: {
      'cm:title': 'node-title',
      'cm:description': ''
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule.forRoot(), AppTestingModule, MatDialogModule],
      declarations: [CreateFromTemplateDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: TranslationMock,
          useValue: {
            instant: jasmine.createSpy('instant')
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch')
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(CreateFromTemplateDialogComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    component.data = data as Node;
  });

  it('should populate form with provided dialog data', () => {
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe(data.name);
    expect(component.form.controls.title.value).toBe(data.properties['cm:title']);
    expect(component.form.controls.description.value).toBe(data.properties['cm:description']);
  });

  it('should invalidate form if required `name` field is invalid', () => {
    fixture.detectChanges();

    component.form.controls.name.setValue('');
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if required `name` field has `only spaces`', () => {
    fixture.detectChanges();

    component.form.controls.name.setValue('   ');
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if required `name` field has `ending dot`', () => {
    fixture.detectChanges();

    component.form.controls.name.setValue('something.');
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if `title` text length is long', () => {
    fixture.detectChanges();

    component.form.controls.title.setValue(text(260));
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate form if `description` text length is long', () => {
    fixture.detectChanges();

    component.form.controls.description.setValue(text(520));
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
  });

  it('should create node from template with form values', () => {
    const newNode = {
      id: 'node-id',
      name: 'new-node-name',
      isFolder: false,
      isFile: true,
      properties: {
        'cm:title': 'new-node-title',
        'cm:description': 'new-node-description'
      }
    } as Node;

    fixture.detectChanges();

    component.form.controls.name.setValue('new-node-name');
    component.form.controls.title.setValue('new-node-title');
    component.form.controls.description.setValue('new-node-description');

    fixture.detectChanges();

    component.onSubmit();

    expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(new CreateFromTemplate(newNode));
  });
});
