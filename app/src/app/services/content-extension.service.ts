
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
  providedIn: 'root',
})
export class ContentExtensionService {
  constructor(
    private appConfigService: AppConfigService
  ) {
    this.appConfigService.onLoad.pipe(take(1)).subscribe((config) => {
      if (config.plugins && (config.plugins.contentPlugin === true || config.plugins.contentPlugin === 'true')) {
        this.enableContentPlugin();
      }
    });
  }

  enableContentPlugin() {
    if (localStorage && localStorage.getItem('contentPlugin') === null) {
      localStorage.setItem('contentPlugin', 'true');
    }
  }
}
