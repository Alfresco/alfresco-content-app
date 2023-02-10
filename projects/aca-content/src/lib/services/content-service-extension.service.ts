/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentServiceExtensionService {
  constructor(private appConfigService: AppConfigService) {
    this.updateContentServiceAvailability();
  }

  updateContentServiceAvailability() {
    this.appConfigService.onLoad.pipe(take(1)).subscribe((config) => {
      if (config.plugins && config.plugins.contentService === false) {
        this.disableContentServices();
      } else {
        this.enableContentServices();
      }
    });
  }

  private disableContentServices() {
    if (localStorage) {
      localStorage.setItem('contentService', 'false');
    }
  }

  private enableContentServices() {
    if (localStorage && localStorage.getItem('contentService') === 'false') {
      localStorage.setItem('contentService', 'true');
    }
  }
}
