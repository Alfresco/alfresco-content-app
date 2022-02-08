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

import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@alfresco/adf-core';
import { AlfrescoOfficeExtensionService } from './alfresco-office-extension.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState, LibTestingModule } from '../testing/lib-testing-module';

describe('AlfrescoOfficeExtensionService', () => {
  let appConfig: AppConfigService;
  let service: AlfrescoOfficeExtensionService;
  const mock = () => {
    let storage: { [key: string]: any } = {};
    return {
      getItem: (key: string) => (key in storage ? storage[key] : null),
      setItem: (key: string, value: any) => (storage[key] = value || ''),
      removeItem: (key: string) => delete storage[key],
      clear: () => (storage = {})
    };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [provideMockStore({ initialState })]
    });

    service = TestBed.inject(AlfrescoOfficeExtensionService);

    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      aosPlugin: true
    });

    Object.defineProperty(window, 'localStorage', { value: mock() });
  });

  it('Should initialize the localStorage with the item aosPlugin true if not present', () => {
    expect(localStorage.getItem('aosPlugin')).toBeNull('The localStorage aosPlugin is not null');
    service.enablePlugin();
    expect(localStorage.getItem('aosPlugin')).toBe('true');
    expect(service.isAosPluginEnabled()).toBe(true);
  });

  it('Should not change the item aosPlugin value if false', () => {
    localStorage.setItem('aosPlugin', 'false');
    service.enablePlugin();
    expect(localStorage.getItem('aosPlugin')).toBe('false');
    expect(service.isAosPluginEnabled()).toBe(false);
  });

  it('Should not change the item aosPlugin value if true', () => {
    localStorage.setItem('aosPlugin', 'true');
    service.enablePlugin();
    expect(localStorage.getItem('aosPlugin')).toBe('true');
    expect(service.isAosPluginEnabled()).toBe(true);
  });

  it('Should change the item aosPlugin disabled', () => {
    localStorage.setItem('aosPlugin', 'true');
    service.disablePlugin();
    expect(localStorage.getItem('aosPlugin')).toBeNull();
    expect(service.isAosPluginEnabled()).toBe(false);
  });
});
