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

import { SettingsComponent } from './settings.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, setupTestBed, StorageService } from '@alfresco/adf-core';
import { AcaSettingsModule } from './settings.module';
import { By } from '@angular/platform-browser';
import { AppExtensionService, initialState, LibTestingModule, SettingsParameterRef } from '@alfresco/aca-shared';
import { provideMockStore } from '@ngrx/store/testing';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let component: SettingsComponent;
  let storage: StorageService;
  let appExtensions: AppExtensionService;

  let stringParam: SettingsParameterRef;
  let boolParam: SettingsParameterRef;

  setupTestBed({
    imports: [CoreModule.forRoot(), AcaSettingsModule, LibTestingModule],
    providers: [provideMockStore({ initialState })]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    storage = TestBed.inject(StorageService);
    appExtensions = TestBed.inject(AppExtensionService);

    stringParam = {
      key: 'key',
      name: 'param1',
      type: 'string',
      value: 'paramValue'
    };

    boolParam = {
      key: 'key',
      name: 'param2',
      type: 'boolean',
      value: true
    };
  });

  it('should retrieve string param value from storage', () => {
    spyOn(storage, 'getItem').and.returnValue('storageValue');

    const value = component.getStringParamValue(stringParam);
    expect(value).toBe('storageValue');
  });

  it('should use param value as fallback when storage is empty', () => {
    spyOn(storage, 'getItem').and.returnValue(null);

    const value = component.getStringParamValue(stringParam);
    expect(value).toBe('paramValue');
  });

  it('should save param value', () => {
    spyOn(storage, 'setItem').and.stub();

    component.setParamValue(stringParam, 'test');

    expect(stringParam.value).toBe('test');
    expect(storage.setItem).toHaveBeenCalledWith(stringParam.key, stringParam.value);
  });

  it('should save param value only if changed', () => {
    spyOn(storage, 'setItem').and.stub();

    component.setParamValue(stringParam, 'test');
    component.setParamValue(stringParam, 'test');
    component.setParamValue(stringParam, 'test');

    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should retrieve boolean param value', () => {
    const getItemSpy = spyOn(storage, 'getItem').and.returnValue('true');
    expect(component.getBooleanParamValue(boolParam)).toBe(true);

    getItemSpy.and.returnValue('false');
    expect(component.getBooleanParamValue(boolParam)).toBe(false);
  });

  it('should fallback to boolean param value when storage is empty', () => {
    spyOn(storage, 'getItem').and.returnValue(null);
    expect(component.getBooleanParamValue(boolParam)).toBe(true);
  });

  it('should render categories as expansion panels', async () => {
    spyOn(component, 'reset').and.stub();

    appExtensions.settingGroups = [
      {
        id: 'group1',
        name: 'Group 1',
        parameters: []
      },
      {
        id: 'group2',
        name: 'Group 2',
        parameters: []
      }
    ];

    fixture.detectChanges();
    await fixture.whenStable();

    const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
    expect(panels.length).toBe(3);
  });
});
