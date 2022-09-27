/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
        contentService: true
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
