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

import { Injectable } from '@angular/core';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';
import { take } from 'rxjs/operators';
import sha256 from 'crypto-js/sha256';

@Injectable({
  providedIn: 'root'
})
export class PendoService {
  private pendoConfig: {
    pendoEnabled: boolean;
    pendoKey: string;
    pendoExcludeAllText: boolean;
    pendoCustomerName: boolean;
  };

  constructor(private authenticationService: AuthenticationService, private appConfigService: AppConfigService) {}

  init(): void {
    this.pendoConfig = this.appConfigService.get('analytics.pendo');
    if (this.pendoConfig?.pendoEnabled) {
      this.injectPendo();
      this.initPendo();
    }
  }

  private injectPendo() {
    ((apiKey: string) => {
      (function (p, e, n, d, o) {
        // eslint-disable-next-line
        let v, w, x, y, z;
        o = p[d] = p[d] || {};
        // eslint-disable-next-line
        o._q = o._q || [];
        // eslint-disable-next-line
        v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
        for (w = 0, x = v.length; w < x; ++w) {
          (function (m) {
            o[m] =
              o[m] ||
              function () {
                // eslint-disable-next-line
                o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
              };
          })(v[w]);
        }
        // eslint-disable-next-line
        y = e.createElement(n);
        y.async = !0;
        y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
        // eslint-disable-next-line
        z = e.getElementsByTagName(n)[0];
        z.parentNode.insertBefore(y, z);
      })(window, document, 'script', 'pendo');
    }).bind(this)(this.pendoConfig.pendoKey);
  }

  private initPendo(): void {
    this.authenticationService.onLogin.pipe(take(1)).subscribe(() => {
      const username = this.authenticationService.getEcmUsername() || this.authenticationService.getBpmUsername();
      const hiddenUserName = this.hashUserName(username);
      const accountId = this.getAccountId();
      window['pendo'].initialize({
        visitor: {
          id: hiddenUserName
        },
        account: {
          id: accountId
        }
      });
    });
  }

  private hashUserName(username: string) {
    return sha256(username).toString();
  }

  private getAccountId() {
    const titleAppKebabCase = this.appConfigService.get<string>('application.name')?.replace(/\s+/g, '-').toLowerCase();

    const customerName = this.appConfigService.get<boolean>('customer.name');
    return customerName || titleAppKebabCase;
  }
}
