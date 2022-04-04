/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ContentExtensionService } from './content-extension.service';
import {
  AppConfigService,
  AppConfigServiceMock,
  setupTestBed
} from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('ContentExtensionService', () => {
  let service: ContentExtensionService
  let appConfig: AppConfigService;

  setupTestBed({
    imports: [
      HttpClientModule
    ],
    providers: [
      { provide: AppConfigService, useClass: AppConfigServiceMock }
    ]
  });

  beforeEach(() => {
    service = TestBed.inject(ContentExtensionService);
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      plugins: {
        contentPlugin: true
      }
    });

    appConfig.load();
    appConfig.onLoad = of(appConfig.config);
  });

  it('should set the content plugin to true in local storage when it is set to true in the app config', () => {
    expect(service).toBeDefined();
    expect(localStorage.getItem('contentPlugin')).toEqual('true');
  });

  afterEach(() => {
    localStorage.clear();
  })

});
