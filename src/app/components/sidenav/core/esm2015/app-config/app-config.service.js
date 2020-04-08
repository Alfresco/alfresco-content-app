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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectUtils } from '../utils/object-utils';
import { Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '@angular/common/http';
/** @enum {string} */
const AppConfigValues = {
  APP_CONFIG_LANGUAGES_KEY: 'languages',
  PROVIDERS: 'providers',
  OAUTHCONFIG: 'oauth2',
  ECMHOST: 'ecmHost',
  BASESHAREURL: 'baseShareUrl',
  BPMHOST: 'bpmHost',
  IDENTITY_HOST: 'identityHost',
  AUTHTYPE: 'authType',
  CONTEXTROOTECM: 'contextRootEcm',
  CONTEXTROOTBPM: 'contextRootBpm',
  ALFRESCO_REPOSITORY_NAME: 'alfrescoRepositoryName',
  LOG_LEVEL: 'logLevel',
  LOGIN_ROUTE: 'loginRoute',
  DISABLECSRF: 'disableCSRF',
  AUTH_WITH_CREDENTIALS: 'auth.withCredentials',
  APPLICATION: 'application',
  STORAGE_PREFIX: 'application.storagePrefix',
  NOTIFY_DURATION: 'notificationDefaultDuration'
};
export { AppConfigValues };
/** @enum {string} */
const Status = {
  INIT: 'init',
  LOADING: 'loading',
  LOADED: 'loaded'
};
export { Status };
/* spellchecker: enable */
export class AppConfigService {
  /**
   * @param {?} http
   */
  constructor(http) {
    this.http = http;
    this.config = {
      application: {
        name: 'Alfresco ADF Application'
      },
      ecmHost: 'http://{hostname}{:port}/ecm',
      bpmHost: 'http://{hostname}{:port}/bpm',
      logLevel: 'silent',
      alfrescoRepositoryName: 'alfresco-1'
    };
    this.status = Status.INIT;
    this.onLoadSubject = new Subject();
    this.onLoad = this.onLoadSubject.asObservable();
  }
  /**
   * Requests notification of a property value when it is loaded.
   * @param {?} property The desired property value
   * @return {?} Property value, when loaded
   */
  select(property) {
    return this.onLoadSubject.pipe(
      map(
        /**
         * @param {?} config
         * @return {?}
         */
        config => config[property]
      ),
      distinctUntilChanged()
    );
  }
  /**
   * Gets the value of a named property.
   * @template T
   * @param {?} key Name of the property
   * @param {?=} defaultValue Value to return if the key is not found
   * @return {?} Value of the property
   */
  get(key, defaultValue) {
    /** @type {?} */
    let result = ObjectUtils.getValue(this.config, key);
    if (typeof result === 'string') {
      /** @type {?} */
      const keywords = new Map();
      keywords.set('hostname', this.getLocationHostname());
      keywords.set(':port', this.getLocationPort(':'));
      keywords.set('port', this.getLocationPort());
      keywords.set('protocol', this.getLocationProtocol());
      result = this.formatString(result, keywords);
    }
    if (result === undefined) {
      return defaultValue;
    }
    return /** @type {?} */ (result);
  }
  /**
   * Gets the location.protocol value.
   * @return {?} The location.protocol string
   */
  getLocationProtocol() {
    return location.protocol;
  }
  /**
   * Gets the location.hostname property.
   * @return {?} Value of the property
   */
  getLocationHostname() {
    return location.hostname;
  }
  /**
   * Gets the location.port property.
   * @param {?=} prefix Text added before port value
   * @return {?} Port with prefix
   */
  getLocationPort(prefix = '') {
    return location.port ? prefix + location.port : '';
  }
  /**
   * Loads the config file.
   * @return {?} Notification when loading is complete
   */
  load() {
    return new Promise
    /**
     * @param {?} resolve
     * @return {?}
     */(resolve =>
      tslib_1.__awaiter(this, void 0, void 0, function*() {
        /** @type {?} */
        const configUrl = `app.config.json?v=${Date.now()}`;
        if (this.status === Status.INIT) {
          this.status = Status.LOADING;
          yield this.http.get(configUrl).subscribe(
            /**
             * @param {?} data
             * @return {?}
             */
            data => {
              this.status = Status.LOADED;
              this.config = Object.assign({}, this.config, data || {});
              this.onLoadSubject.next(this.config);
              resolve(this.config);
            }
            /**
             * @return {?}
             */,
            () => {
              resolve(this.config);
            }
          );
        } else if (this.status === Status.LOADED) {
          resolve(this.config);
        } else if (this.status === Status.LOADING) {
          this.onLoad.subscribe(
            /**
             * @return {?}
             */
            () => {
              resolve(this.config);
            }
          );
        }
      })
    );
  }
  /**
   * @private
   * @param {?} str
   * @param {?} keywords
   * @return {?}
   */
  formatString(str, keywords) {
    /** @type {?} */
    let result = str;
    keywords.forEach(
      /**
       * @param {?} value
       * @param {?} key
       * @return {?}
       */
      (value, key) => {
        /** @type {?} */
        const expr = new RegExp('{' + key + '}', 'gm');
        result = result.replace(expr, value);
      }
    );
    return result;
  }
}
AppConfigService.decorators = [
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
AppConfigService.ctorParameters = () => [{ type: HttpClient }];
/** @nocollapse */ AppConfigService.ngInjectableDef = i0.defineInjectable({
  factory: function AppConfigService_Factory() {
    return new AppConfigService(i0.inject(i1.HttpClient));
  },
  token: AppConfigService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  AppConfigService.prototype.config;
  /** @type {?} */
  AppConfigService.prototype.status;
  /**
   * @type {?}
   * @protected
   */
  AppConfigService.prototype.onLoadSubject;
  /** @type {?} */
  AppConfigService.prototype.onLoad;
  /**
   * @type {?}
   * @private
   */
  AppConfigService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbmZpZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7SUFJdkQsMEJBQTJCLFdBQVc7SUFDdEMsV0FBWSxXQUFXO0lBQ3ZCLGFBQWMsUUFBUTtJQUN0QixTQUFVLFNBQVM7SUFDbkIsY0FBZSxjQUFjO0lBQzdCLFNBQVUsU0FBUztJQUNuQixlQUFnQixjQUFjO0lBQzlCLFVBQVcsVUFBVTtJQUNyQixnQkFBaUIsZ0JBQWdCO0lBQ2pDLGdCQUFpQixnQkFBZ0I7SUFDakMsMEJBQTJCLHdCQUF3QjtJQUNuRCxXQUFZLFVBQVU7SUFDdEIsYUFBYyxZQUFZO0lBQzFCLGFBQWMsYUFBYTtJQUMzQix1QkFBd0Isc0JBQXNCO0lBQzlDLGFBQWMsYUFBYTtJQUMzQixnQkFBaUIsMkJBQTJCO0lBQzVDLGlCQUFrQiw2QkFBNkI7Ozs7O0lBSS9DLE1BQU8sTUFBTTtJQUNiLFNBQVUsU0FBUztJQUNuQixRQUFTLFFBQVE7Ozs7QUFRckIsTUFBTSxPQUFPLGdCQUFnQjs7OztJQWdCekIsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQWRwQyxXQUFNLEdBQVE7WUFDVixXQUFXLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLDBCQUEwQjthQUNu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ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJy4uL3V0aWxzL29iamVjdC11dGlscyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiBzcGVsbGNoZWNrZXI6IGRpc2FibGUgKi9cbmV4cG9ydCBlbnVtIEFwcENvbmZpZ1ZhbHVlcyB7XG4gICAgQVBQX0NPTkZJR19MQU5HVUFHRVNfS0VZID0gJ2xhbmd1YWdlcycsXG4gICAgUFJPVklERVJTID0gJ3Byb3ZpZGVycycsXG4gICAgT0FVVEhDT05GSUcgPSAnb2F1dGgyJyxcbiAgICBFQ01IT1NUID0gJ2VjbUhvc3QnLFxuICAgIEJBU0VTSEFSRVVSTCA9ICdiYXNlU2hhcmVVcmwnLFxuICAgIEJQTUhPU1QgPSAnYnBtSG9zdCcsXG4gICAgSURFTlRJVFlfSE9TVCA9ICdpZGVudGl0eUhvc3QnLFxuICAgIEFVVEhUWVBFID0gJ2F1dGhUeXBlJyxcbiAgICBDT05URVhUUk9PVEVDTSA9ICdjb250ZXh0Um9vdEVjbScsXG4gICAgQ09OVEVYVFJPT1RCUE0gPSAnY29udGV4dFJvb3RCcG0nLFxuICAgIEFMRlJFU0NPX1JFUE9TSVRPUllfTkFNRSA9ICdhbGZyZXNjb1JlcG9zaXRvcnlOYW1lJyxcbiAgICBMT0dfTEVWRUwgPSAnbG9nTGV2ZWwnLFxuICAgIExPR0lOX1JPVVRFID0gJ2xvZ2luUm91dGUnLFxuICAgIERJU0FCTEVDU1JGID0gJ2Rpc2FibGVDU1JGJyxcbiAgICBBVVRIX1dJVEhfQ1JFREVOVElBTFMgPSAnYXV0aC53aXRoQ3JlZGVudGlhbHMnLFxuICAgIEFQUExJQ0FUSU9OID0gJ2FwcGxpY2F0aW9uJyxcbiAgICBTVE9SQUdFX1BSRUZJWCA9ICdhcHBsaWNhdGlvbi5zdG9yYWdlUHJlZml4JyxcbiAgICBOT1RJRllfRFVSQVRJT04gPSAnbm90aWZpY2F0aW9uRGVmYXVsdER1cmF0aW9uJ1xufVxuXG5leHBvcnQgZW51bSBTdGF0dXMge1xuICAgIElOSVQgPSAnaW5pdCcsXG4gICAgTE9BRElORyA9ICdsb2FkaW5nJyxcbiAgICBMT0FERUQgPSAnbG9hZGVkJ1xufVxuXG4vKiBzcGVsbGNoZWNrZXI6IGVuYWJsZSAqL1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFwcENvbmZpZ1NlcnZpY2Uge1xuXG4gICAgY29uZmlnOiBhbnkgPSB7XG4gICAgICAgIGFwcGxpY2F0aW9uOiB7XG4gICAgICAgICAgICBuYW1lOiAnQWxmcmVzY28gQURGIEFwcGxpY2F0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICBlY21Ib3N0OiAnaHR0cDovL3tob3N0bmFtZX17OnBvcnR9L2VjbScsXG4gICAgICAgIGJwbUhvc3Q6ICdodHRwOi8ve2hvc3RuYW1lfXs6cG9ydH0vYnBtJyxcbiAgICAgICAgbG9nTGV2ZWw6ICdzaWxlbnQnLFxuICAgICAgICBhbGZyZXNjb1JlcG9zaXRvcnlOYW1lOiAnYWxmcmVzY28tMSdcbiAgICB9O1xuXG4gICAgc3RhdHVzOiBTdGF0dXMgPSBTdGF0dXMuSU5JVDtcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3ViamVjdDogU3ViamVjdDxhbnk+O1xuICAgIG9uTG9hZDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XG4gICAgICAgIHRoaXMub25Mb2FkU3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIHRoaXMub25Mb2FkID0gdGhpcy5vbkxvYWRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIG5vdGlmaWNhdGlvbiBvZiBhIHByb3BlcnR5IHZhbHVlIHdoZW4gaXQgaXMgbG9hZGVkLlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgZGVzaXJlZCBwcm9wZXJ0eSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIFByb3BlcnR5IHZhbHVlLCB3aGVuIGxvYWRlZFxuICAgICAqL1xuICAgIHNlbGVjdChwcm9wZXJ0eTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25Mb2FkU3ViamVjdFxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChjb25maWcpID0+IGNvbmZpZ1twcm9wZXJ0eV0pLFxuICAgICAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYSBuYW1lZCBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0ga2V5IE5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBWYWx1ZSB0byByZXR1cm4gaWYgdGhlIGtleSBpcyBub3QgZm91bmRcbiAgICAgKiBAcmV0dXJucyBWYWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKi9cbiAgICBnZXQ8VD4oa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IFQpOiBUIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gT2JqZWN0VXRpbHMuZ2V0VmFsdWUodGhpcy5jb25maWcsIGtleSk7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qga2V5d29yZHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgICAgICAgICAga2V5d29yZHMuc2V0KCdob3N0bmFtZScsIHRoaXMuZ2V0TG9jYXRpb25Ib3N0bmFtZSgpKTtcbiAgICAgICAgICAgIGtleXdvcmRzLnNldCgnOnBvcnQnLCB0aGlzLmdldExvY2F0aW9uUG9ydCgnOicpKTtcbiAgICAgICAgICAgIGtleXdvcmRzLnNldCgncG9ydCcsIHRoaXMuZ2V0TG9jYXRpb25Qb3J0KCkpO1xuICAgICAgICAgICAga2V5d29yZHMuc2V0KCdwcm90b2NvbCcsIHRoaXMuZ2V0TG9jYXRpb25Qcm90b2NvbCgpKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZm9ybWF0U3RyaW5nKHJlc3VsdCwga2V5d29yZHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gPFQ+IHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBsb2NhdGlvbi5wcm90b2NvbCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgbG9jYXRpb24ucHJvdG9jb2wgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0TG9jYXRpb25Qcm90b2NvbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2w7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbG9jYXRpb24uaG9zdG5hbWUgcHJvcGVydHkuXG4gICAgICogQHJldHVybnMgVmFsdWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICovXG4gICAgZ2V0TG9jYXRpb25Ib3N0bmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbG9jYXRpb24ucG9ydCBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0gcHJlZml4IFRleHQgYWRkZWQgYmVmb3JlIHBvcnQgdmFsdWVcbiAgICAgKiBAcmV0dXJucyBQb3J0IHdpdGggcHJlZml4XG4gICAgICovXG4gICAgZ2V0TG9jYXRpb25Qb3J0KHByZWZpeDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24ucG9ydCA/IHByZWZpeCArIGxvY2F0aW9uLnBvcnQgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyB0aGUgY29uZmlnIGZpbGUuXG4gICAgICogQHJldHVybnMgTm90aWZpY2F0aW9uIHdoZW4gbG9hZGluZyBpcyBjb21wbGV0ZVxuICAgICAqL1xuICAgIGxvYWQoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb25maWdVcmwgPSBgYXBwLmNvbmZpZy5qc29uP3Y9JHtEYXRlLm5vdygpfWA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gU3RhdHVzLklOSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5MT0FESU5HO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaHR0cC5nZXQoY29uZmlnVXJsKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkxPQURFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25maWcsIGRhdGEgfHwge30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRTdWJqZWN0Lm5leHQodGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPT09IFN0YXR1cy5MT0FERUQpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPT09IFN0YXR1cy5MT0FESU5HKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkxvYWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZm9ybWF0U3RyaW5nKHN0cjogc3RyaW5nLCBrZXl3b3JkczogTWFwPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXN1bHQgPSBzdHI7XG5cbiAgICAgICAga2V5d29yZHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhwciA9IG5ldyBSZWdFeHAoJ3snICsga2V5ICsgJ30nLCAnZ20nKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKGV4cHIsIHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iXX0=
