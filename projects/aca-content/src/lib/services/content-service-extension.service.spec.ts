/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ContentServiceExtensionService } from './content-service-extension.service';
import { AppConfigService, AppConfigServiceMock, setupTestBed } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('ContentServiceExtensionService', () => {
  let service: ContentServiceExtensionService;
  let appConfig: AppConfigService;

  setupTestBed({
    imports: [HttpClientModule],
    providers: [{ provide: AppConfigService, useClass: AppConfigServiceMock }]
  });

  beforeEach(() => {
    service = TestBed.inject(ContentServiceExtensionService);
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      plugins: {
        contentService: 'true'
      }
    });

    appConfig.load();
    appConfig.onLoad = of(appConfig.config);
  });

  it('should set the content service to true when it is false in local storage and enabled in the app config', () => {
    localStorage.setItem('contentService', 'false');
    service.updateContentServiceAvailability();

    expect(localStorage.getItem('contentService')).toEqual('true');
  });

  it('should set the content service to false in local storage when it is false in the app config', () => {
    appConfig.config.plugins.contentService = false;
    appConfig.load();
    appConfig.onLoad = of(appConfig.config);
    service.updateContentServiceAvailability();

    expect(localStorage.getItem('contentService')).toEqual('false');
  });

  afterEach(() => {
    localStorage.clear();
  });
});
