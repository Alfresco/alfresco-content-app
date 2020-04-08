/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import { AlfrescoApiCompatibility, AlfrescoApiConfig } from '@alfresco/js-api';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import * as i0 from '@angular/core';
import * as i1 from '../app-config/app-config.service';
import * as i2 from './storage.service';
/* tslint:disable:adf-file-name */
export class AlfrescoApiService {
  /**
   * @param {?} appConfig
   * @param {?} storageService
   */
  constructor(appConfig, storageService) {
    this.appConfig = appConfig;
    this.storageService = storageService;
    /**
     * Publish/subscribe to events related to node updates.
     */
    this.nodeUpdated = new Subject();
    this.alfrescoApiInitializedSubject = new Subject();
    this.alfrescoApiInitialized = this.alfrescoApiInitializedSubject.asObservable();
  }
  /**
   * @return {?}
   */
  getInstance() {
    return this.alfrescoApi;
  }
  /**
   * @return {?}
   */
  get taskApi() {
    return this.getInstance().activiti.taskApi;
  }
  /**
   * @return {?}
   */
  get contentApi() {
    return this.getInstance().content;
  }
  /**
   * @return {?}
   */
  get nodesApi() {
    return this.getInstance().nodes;
  }
  /**
   * @return {?}
   */
  get renditionsApi() {
    return this.getInstance().core.renditionsApi;
  }
  /**
   * @return {?}
   */
  get sharedLinksApi() {
    return this.getInstance().core.sharedlinksApi;
  }
  /**
   * @return {?}
   */
  get sitesApi() {
    return this.getInstance().core.sitesApi;
  }
  /**
   * @return {?}
   */
  get favoritesApi() {
    return this.getInstance().core.favoritesApi;
  }
  /**
   * @return {?}
   */
  get peopleApi() {
    return this.getInstance().core.peopleApi;
  }
  /**
   * @return {?}
   */
  get searchApi() {
    return this.getInstance().search.searchApi;
  }
  /**
   * @return {?}
   */
  get versionsApi() {
    return this.getInstance().core.versionsApi;
  }
  /**
   * @return {?}
   */
  get classesApi() {
    return this.getInstance().core.classesApi;
  }
  /**
   * @return {?}
   */
  get groupsApi() {
    return this.getInstance().core.groupsApi;
  }
  /**
   * @return {?}
   */
  load() {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      yield this.appConfig.load().then(
        /**
         * @return {?}
         */
        () => {
          this.storageService.prefix = this.appConfig.get(
            AppConfigValues.STORAGE_PREFIX,
            ''
          );
          this.initAlfrescoApi();
          this.alfrescoApiInitializedSubject.next();
        }
      );
    });
  }
  /**
   * @return {?}
   */
  reset() {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      this.initAlfrescoApi();
    });
  }
  /**
   * @protected
   * @return {?}
   */
  initAlfrescoApi() {
    /** @type {?} */
    const oauth = Object.assign(
      {},
      this.appConfig.get(AppConfigValues.OAUTHCONFIG, null)
    );
    if (oauth) {
      oauth.redirectUri = window.location.origin + (oauth.redirectUri || '/');
      oauth.redirectUriLogout =
        window.location.origin + (oauth.redirectUriLogout || '/');
    }
    /** @type {?} */
    const config = new AlfrescoApiConfig({
      provider: this.appConfig.get(AppConfigValues.PROVIDERS),
      hostEcm: this.appConfig.get(AppConfigValues.ECMHOST),
      hostBpm: this.appConfig.get(AppConfigValues.BPMHOST),
      authType: this.appConfig.get(AppConfigValues.AUTHTYPE, 'BASIC'),
      contextRootBpm: this.appConfig.get(AppConfigValues.CONTEXTROOTBPM),
      contextRoot: this.appConfig.get(AppConfigValues.CONTEXTROOTECM),
      disableCsrf: this.appConfig.get(AppConfigValues.DISABLECSRF),
      withCredentials: this.appConfig.get(
        AppConfigValues.AUTH_WITH_CREDENTIALS,
        false
      ),
      domainPrefix: this.appConfig.get(AppConfigValues.STORAGE_PREFIX),
      oauth2: oauth
    });
    if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, config)) {
      this.lastConfig = config;
      this.alfrescoApi.configureJsApi(config);
    } else {
      this.lastConfig = config;
      this.alfrescoApi = new AlfrescoApiCompatibility(config);
    }
  }
  /**
   * @param {?} lastConfig
   * @param {?} newConfig
   * @return {?}
   */
  isDifferentConfig(lastConfig, newConfig) {
    return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
  }
}
AlfrescoApiService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
AlfrescoApiService.ctorParameters = () => [
  { type: AppConfigService },
  { type: StorageService }
];
/** @nocollapse */ AlfrescoApiService.ngInjectableDef = i0.defineInjectable({
  factory: function AlfrescoApiService_Factory() {
    return new AlfrescoApiService(
      i0.inject(i1.AppConfigService),
      i0.inject(i2.StorageService)
    );
  },
  token: AlfrescoApiService,
  providedIn: 'root'
});
if (false) {
  /**
   * Publish/subscribe to events related to node updates.
   * @type {?}
   */
  AlfrescoApiService.prototype.nodeUpdated;
  /**
   * @type {?}
   * @protected
   */
  AlfrescoApiService.prototype.alfrescoApiInitializedSubject;
  /** @type {?} */
  AlfrescoApiService.prototype.alfrescoApiInitialized;
  /**
   * @type {?}
   * @protected
   */
  AlfrescoApiService.prototype.alfrescoApi;
  /** @type {?} */
  AlfrescoApiService.prototype.lastConfig;
  /**
   * @type {?}
   * @protected
   */
  AlfrescoApiService.prototype.appConfig;
  /**
   * @type {?}
   * @protected
   */
  AlfrescoApiService.prototype.storageService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxmcmVzY28tYXBpLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9hbGZyZXNjby1hcGkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBTUgsd0JBQXdCLEVBQUUsaUJBQWlCLEVBQzlDLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7OztBQU9uRCxNQUFNLE9BQU8sa0JBQWtCOzs7OztJQWlFM0IsWUFDYyxTQUEyQixFQUMzQixjQUE4QjtRQUQ5QixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7Ozs7UUEvRDVDLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWdFOUIsSUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRixDQUFDOzs7O0lBekRELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQzs7OztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDL0MsQ0FBQzs7OztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQztJ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VFEsZ0JBQWdCO1lBR2hCLGNBQWM7Ozs7Ozs7O0lBV25CLHlDQUFrQzs7Ozs7SUFFbEMsMkRBQXNEOztJQUN0RCxvREFBd0M7Ozs7O0lBRXhDLHlDQUFnRDs7SUFFaEQsd0NBQThCOzs7OztJQXVEMUIsdUNBQXFDOzs7OztJQUNyQyw0Q0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIENvbnRlbnRBcGksXG4gICAgQ29yZSxcbiAgICBBY3Rpdml0aSxcbiAgICBTZWFyY2hBcGksXG4gICAgTm9kZSxcbiAgICBBbGZyZXNjb0FwaUNvbXBhdGliaWxpdHksIEFsZnJlc2NvQXBpQ29uZmlnXG59IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSwgQXBwQ29uZmlnVmFsdWVzIH0gZnJvbSAnLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgT2F1dGhDb25maWdNb2RlbCB9IGZyb20gJy4uL21vZGVscy9vYXV0aC1jb25maWcubW9kZWwnO1xuaW1wb3J0IHsgU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL3N0b3JhZ2Uuc2VydmljZSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOmFkZi1maWxlLW5hbWUgKi9cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBbGZyZXNjb0FwaVNlcnZpY2Uge1xuICAgIC8qKlxuICAgICAqIFB1Ymxpc2gvc3Vic2NyaWJlIHRvIGV2ZW50cyByZWxhdGVkIHRvIG5vZGUgdXBkYXRlcy5cbiAgICAgKi9cbiAgICBub2RlVXBkYXRlZCA9IG5ldyBTdWJqZWN0PE5vZGU+KCk7XG5cbiAgICBwcm90ZWN0ZWQgYWxmcmVzY29BcGlJbml0aWFsaXplZFN1YmplY3Q6IFN1YmplY3Q8YW55PjtcbiAgICBhbGZyZXNjb0FwaUluaXRpYWxpemVkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgICBwcm90ZWN0ZWQgYWxmcmVzY29BcGk6IEFsZnJlc2NvQXBpQ29tcGF0aWJpbGl0eTtcblxuICAgIGxhc3RDb25maWc6IEFsZnJlc2NvQXBpQ29uZmlnO1xuXG4gICAgZ2V0SW5zdGFuY2UoKTogQWxmcmVzY29BcGlDb21wYXRpYmlsaXR5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGk7XG4gICAgfVxuXG4gICAgZ2V0IHRhc2tBcGkoKTogQWN0aXZpdGkuVGFza0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuYWN0aXZpdGkudGFza0FwaTtcbiAgICB9XG5cbiAgICBnZXQgY29udGVudEFwaSgpOiBDb250ZW50QXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5jb250ZW50O1xuICAgIH1cblxuICAgIGdldCBub2Rlc0FwaSgpOiBDb3JlLk5vZGVzQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5ub2RlcztcbiAgICB9XG5cbiAgICBnZXQgcmVuZGl0aW9uc0FwaSgpOiBDb3JlLlJlbmRpdGlvbnNBcGkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZSgpLmNvcmUucmVuZGl0aW9uc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgc2hhcmVkTGlua3NBcGkoKTogQ29yZS5TaGFyZWRsaW5rc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuY29yZS5zaGFyZWRsaW5rc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgc2l0ZXNBcGkoKTogQ29yZS5TaXRlc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuY29yZS5zaXRlc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgZmF2b3JpdGVzQXBpKCk6IENvcmUuRmF2b3JpdGVzQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5jb3JlLmZhdm9yaXRlc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgcGVvcGxlQXBpKCk6IENvcmUuUGVvcGxlQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5jb3JlLnBlb3BsZUFwaTtcbiAgICB9XG5cbiAgICBnZXQgc2VhcmNoQXBpKCk6IFNlYXJjaEFwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuc2VhcmNoLnNlYXJjaEFwaTtcbiAgICB9XG5cbiAgICBnZXQgdmVyc2lvbnNBcGkoKTogQ29yZS5WZXJzaW9uc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuY29yZS52ZXJzaW9uc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgY2xhc3Nlc0FwaSgpOiBDb3JlLkNsYXNzZXNBcGkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZSgpLmNvcmUuY2xhc3Nlc0FwaTtcbiAgICB9XG5cbiAgICBnZXQgZ3JvdXBzQXBpKCk6IENvcmUuR3JvdXBzQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5jb3JlLmdyb3Vwc0FwaTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlU2VydmljZSkge1xuICAgICAgICB0aGlzLmFsZnJlc2NvQXBpSW5pdGlhbGl6ZWRTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgdGhpcy5hbGZyZXNjb0FwaUluaXRpYWxpemVkID0gdGhpcy5hbGZyZXNjb0FwaUluaXRpYWxpemVkU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcENvbmZpZy5sb2FkKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnByZWZpeCA9IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5TVE9SQUdFX1BSRUZJWCwgJycpO1xuICAgICAgICAgICAgdGhpcy5pbml0QWxmcmVzY29BcGkoKTtcbiAgICAgICAgICAgIHRoaXMuYWxmcmVzY29BcGlJbml0aWFsaXplZFN1YmplY3QubmV4dCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5pbml0QWxmcmVzY29BcGkoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdEFsZnJlc2NvQXBpKCkge1xuICAgICAgICBjb25zdCBvYXV0aDogT2F1dGhDb25maWdNb2RlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuYXBwQ29uZmlnLmdldDxPYXV0aENvbmZpZ01vZGVsPihBcHBDb25maWdWYWx1ZXMuT0FVVEhDT05GSUcsIG51bGwpKTtcbiAgICAgICAgaWYgKG9hdXRoKSB7XG4gICAgICAgICAgICBvYXV0aC5yZWRpcmVjdFVyaSA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAob2F1dGgucmVkaXJlY3RVcmkgfHwgJy8nKTtcbiAgICAgICAgICAgIG9hdXRoLnJlZGlyZWN0VXJpTG9nb3V0ID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIChvYXV0aC5yZWRpcmVjdFVyaUxvZ291dCB8fCAnLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IEFsZnJlc2NvQXBpQ29uZmlnKHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiB0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPihBcHBDb25maWdWYWx1ZXMuUFJPVklERVJTKSxcbiAgICAgICAgICAgIGhvc3RFY206IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5FQ01IT1NUKSxcbiAgICAgICAgICAgIGhvc3RCcG06IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5CUE1IT1NUKSxcbiAgICAgICAgICAgIGF1dGhUeXBlOiB0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPihBcHBDb25maWdWYWx1ZXMuQVVUSFRZUEUsICdCQVNJQycpLFxuICAgICAgICAgICAgY29udGV4dFJvb3RCcG06IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5DT05URVhUUk9PVEJQTSksXG4gICAgICAgICAgICBjb250ZXh0Um9vdDogdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oQXBwQ29uZmlnVmFsdWVzLkNPTlRFWFRST09URUNNKSxcbiAgICAgICAgICAgIGRpc2FibGVDc3JmOiB0aGlzLmFwcENvbmZpZy5nZXQ8Ym9vbGVhbj4oQXBwQ29uZmlnVmFsdWVzLkRJU0FCTEVDU1JGKSxcbiAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdGhpcy5hcHBDb25maWcuZ2V0PGJvb2xlYW4+KEFwcENvbmZpZ1ZhbHVlcy5BVVRIX1dJVEhfQ1JFREVOVElBTFMsIGZhbHNlKSxcbiAgICAgICAgICAgIGRvbWFpblByZWZpeCA6IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5TVE9SQUdFX1BSRUZJWCksXG4gICAgICAgICAgICBvYXV0aDI6IG9hdXRoXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmFsZnJlc2NvQXBpICYmIHRoaXMuaXNEaWZmZXJlbnRDb25maWcodGhpcy5sYXN0Q29uZmlnLCBjb25maWcpKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RDb25maWcgPSBjb25maWc7XG4gICAgICAgICAgICB0aGlzLmFsZnJlc2NvQXBpLmNvbmZpZ3VyZUpzQXBpKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RDb25maWcgPSBjb25maWc7XG4gICAgICAgICAgICB0aGlzLmFsZnJlc2NvQXBpID0gbmV3IEFsZnJlc2NvQXBpQ29tcGF0aWJpbGl0eShjb25maWcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpc0RpZmZlcmVudENvbmZpZyhsYXN0Q29uZmlnOiBBbGZyZXNjb0FwaUNvbmZpZywgbmV3Q29uZmlnOiBBbGZyZXNjb0FwaUNvbmZpZykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobGFzdENvbmZpZykgIT09IEpTT04uc3RyaW5naWZ5KG5ld0NvbmZpZyk7XG4gICAgfVxufVxuIl19
