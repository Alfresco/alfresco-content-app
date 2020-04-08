/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { Observable, Subject, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from './jwt-helper.service';
import { StorageService } from './storage.service';
import * as i0 from '@angular/core';
import * as i1 from '../app-config/app-config.service';
import * as i2 from './storage.service';
import * as i3 from './alfresco-api.service';
import * as i4 from './cookie.service';
import * as i5 from './log.service';
/** @type {?} */
const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
/** @type {?} */
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;
export class AuthenticationService {
  /**
   * @param {?} appConfig
   * @param {?} storageService
   * @param {?} alfrescoApi
   * @param {?} cookie
   * @param {?} logService
   */
  constructor(appConfig, storageService, alfrescoApi, cookie, logService) {
    this.appConfig = appConfig;
    this.storageService = storageService;
    this.alfrescoApi = alfrescoApi;
    this.cookie = cookie;
    this.logService = logService;
    this.redirectUrl = null;
    this.bearerExcludedUrls = ['auth/realms', 'resources/', 'assets/'];
    this.onLogin = new Subject();
    this.onLogout = new Subject();
  }
  /**
   * Checks if the user logged in.
   * @return {?} True if logged in, false otherwise
   */
  isLoggedIn() {
    if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
      return false;
    }
    return this.alfrescoApi.getInstance().isLoggedIn();
  }
  /**
   * @param {?} provider
   * @return {?}
   */
  isLoggedInWith(provider) {
    if (provider === 'BPM') {
      return this.isBpmLoggedIn();
    } else if (provider === 'ECM') {
      return this.isEcmLoggedIn();
    } else {
      return this.isLoggedIn();
    }
  }
  /**
   * Does the provider support OAuth?
   * @return {?} True if supported, false otherwise
   */
  isOauth() {
    return this.alfrescoApi.getInstance().isOauthConfiguration();
  }
  /**
   * @return {?}
   */
  isPublicUrl() {
    return this.alfrescoApi.getInstance().isPublicUrl();
  }
  /**
   * Does the provider support ECM?
   * @return {?} True if supported, false otherwise
   */
  isECMProvider() {
    return this.alfrescoApi.getInstance().isEcmConfiguration();
  }
  /**
   * Does the provider support BPM?
   * @return {?} True if supported, false otherwise
   */
  isBPMProvider() {
    return this.alfrescoApi.getInstance().isBpmConfiguration();
  }
  /**
   * Does the provider support both ECM and BPM?
   * @return {?} True if both are supported, false otherwise
   */
  isALLProvider() {
    return this.alfrescoApi.getInstance().isEcmBpmConfiguration();
  }
  /**
   * Logs the user in.
   * @param {?} username Username for the login
   * @param {?} password Password for the login
   * @param {?=} rememberMe Stores the user's login details if true
   * @return {?} Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
   */
  login(username, password, rememberMe = false) {
    return from(this.alfrescoApi.getInstance().login(username, password)).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          this.saveRememberMeCookie(rememberMe);
          this.onLogin.next(response);
          return {
            type: this.appConfig.get(AppConfigValues.PROVIDERS),
            ticket: response
          };
        }
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Logs the user in with SSO
   * @return {?}
   */
  ssoImplicitLogin() {
    this.alfrescoApi.getInstance().implicitLogin();
  }
  /**
   * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
   * @private
   * @param {?} rememberMe Enables a long-life cookie
   * @return {?}
   */
  saveRememberMeCookie(rememberMe) {
    /** @type {?} */
    let expiration = null;
    if (rememberMe) {
      expiration = new Date();
      /** @type {?} */
      const time = expiration.getTime();
      /** @type {?} */
      const expireTime = time + REMEMBER_ME_UNTIL;
      expiration.setTime(expireTime);
    }
    this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
  }
  /**
   * Checks whether the "remember me" cookie was set or not.
   * @return {?} True if set, false otherwise
   */
  isRememberMeSet() {
    return this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) === null ? false : true;
  }
  /**
   * Logs the user out.
   * @return {?} Response event called when logout is complete
   */
  logout() {
    return from(this.callApiLogout()).pipe(
      tap(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          this.onLogout.next(response);
          return response;
        }
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * @private
   * @return {?}
   */
  callApiLogout() {
    if (this.alfrescoApi.getInstance()) {
      return this.alfrescoApi.getInstance().logout();
    }
    return Promise.resolve();
  }
  /**
   * Gets the ECM ticket stored in the Storage.
   * @return {?} The ticket or `null` if none was found
   */
  getTicketEcm() {
    return this.alfrescoApi.getInstance().getTicketEcm();
  }
  /**
   * Gets the BPM ticket stored in the Storage.
   * @return {?} The ticket or `null` if none was found
   */
  getTicketBpm() {
    return this.alfrescoApi.getInstance().getTicketBpm();
  }
  /**
   * Gets the BPM ticket from the Storage in Base 64 format.
   * @return {?} The ticket or `null` if none was found
   */
  getTicketEcmBase64() {
    /** @type {?} */
    const ticket = this.alfrescoApi.getInstance().getTicketEcm();
    if (ticket) {
      return 'Basic ' + btoa(ticket);
    }
    return null;
  }
  /**
   * Checks if the user is logged in on an ECM provider.
   * @return {?} True if logged in, false otherwise
   */
  isEcmLoggedIn() {
    if (this.isECMProvider() || this.isALLProvider()) {
      if (
        !this.isOauth() &&
        this.cookie.isEnabled() &&
        !this.isRememberMeSet()
      ) {
        return false;
      }
      return this.alfrescoApi.getInstance().isEcmLoggedIn();
    }
    return false;
  }
  /**
   * Checks if the user is logged in on a BPM provider.
   * @return {?} True if logged in, false otherwise
   */
  isBpmLoggedIn() {
    if (this.isBPMProvider() || this.isALLProvider()) {
      if (
        !this.isOauth() &&
        this.cookie.isEnabled() &&
        !this.isRememberMeSet()
      ) {
        return false;
      }
      return this.alfrescoApi.getInstance().isBpmLoggedIn();
    }
    return false;
  }
  /**
   * Gets the ECM username.
   * @return {?} The ECM username
   */
  getEcmUsername() {
    return this.alfrescoApi.getInstance().getEcmUsername();
  }
  /**
   * Gets the BPM username
   * @return {?} The BPM username
   */
  getBpmUsername() {
    return this.alfrescoApi.getInstance().getBpmUsername();
  }
  /**
   * Sets the URL to redirect to after login.
   * @param {?} url URL to redirect to
   * @return {?}
   */
  setRedirect(url) {
    this.redirectUrl = url;
  }
  /**
   * Gets the URL to redirect to after login.
   * @return {?} The redirect URL
   */
  getRedirect() {
    /** @type {?} */
    const provider = /** @type {?} */ (this.appConfig.get(
      AppConfigValues.PROVIDERS
    ));
    return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
  }
  /**
   * Gets information about the user currently logged into APS.
   * @return {?} User information
   */
  getBpmLoggedUser() {
    return from(
      this.alfrescoApi.getInstance().activiti.profileApi.getProfile()
    );
  }
  /**
   * @private
   * @param {?} provider
   * @return {?}
   */
  hasValidRedirection(provider) {
    return (
      this.redirectUrl &&
      (this.redirectUrl.provider === provider ||
        this.hasSelectedProviderAll(provider))
    );
  }
  /**
   * @private
   * @param {?} provider
   * @return {?}
   */
  hasSelectedProviderAll(provider) {
    return (
      this.redirectUrl &&
      (this.redirectUrl.provider === 'ALL' || provider === 'ALL')
    );
  }
  /**
   * Prints an error message in the console browser
   * @param {?} error Error message
   * @return {?} Object representing the error message
   */
  handleError(error) {
    this.logService.error('Error when logging in', error);
    return throwError(error || 'Server error');
  }
  /**
   * Gets the set of URLs that the token bearer is excluded from.
   * @return {?} Array of URL strings
   */
  getBearerExcludedUrls() {
    return this.bearerExcludedUrls;
  }
  /**
   * Gets the auth token.
   * @return {?} Auth token string
   */
  getToken() {
    return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
  }
  /**
   * Adds the auth token to an HTTP header using the 'bearer' scheme.
   * @param {?=} headersArg Header that will receive the token
   * @return {?} The new header with the token added
   */
  addTokenToHeader(headersArg) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      /** @type {?} */
      let headers = headersArg;
      if (!headers) {
        headers = new HttpHeaders();
      }
      try {
        /** @type {?} */
        const token = this.getToken();
        headers = headers.set('Authorization', 'bearer ' + token);
        observer.next(headers);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
AuthenticationService.decorators = [
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
AuthenticationService.ctorParameters = () => [
  { type: AppConfigService },
  { type: StorageService },
  { type: AlfrescoApiService },
  { type: CookieService },
  { type: LogService }
];
/** @nocollapse */ AuthenticationService.ngInjectableDef = i0.defineInjectable({
  factory: function AuthenticationService_Factory() {
    return new AuthenticationService(
      i0.inject(i1.AppConfigService),
      i0.inject(i2.StorageService),
      i0.inject(i3.AlfrescoApiService),
      i0.inject(i4.CookieService),
      i0.inject(i5.LogService)
    );
  },
  token: AuthenticationService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.redirectUrl;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.bearerExcludedUrls;
  /** @type {?} */
  AuthenticationService.prototype.onLogin;
  /** @type {?} */
  AuthenticationService.prototype.onLogout;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.appConfig;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.storageService;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.alfrescoApi;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.cookie;
  /**
   * @type {?}
   * @private
   */
  AuthenticationService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aGVudGljYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL2F1dGhlbnRpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUVyRixPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7OztNQUU3QyxzQkFBc0IsR0FBRyxzQkFBc0I7O01BQy9DLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBS2xELE1BQU0sT0FBTyxxQkFBcUI7Ozs7Ozs7O0lBUTlCLFlBQ1ksU0FBMkIsRUFDM0IsY0FBOEIsRUFDOUIsV0FBK0IsRUFDL0IsTUFBcUIsRUFDckIsVUFBc0I7UUFKdEIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsbUJBQWMs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Z0Y7O0lBRWhGLHdDQUEyQzs7SUFDM0MseUNBQTRDOzs7OztJQUd4QywwQ0FBbUM7Ozs7O0lBQ25DLCtDQUFzQzs7Ozs7SUFDdEMsNENBQXVDOzs7OztJQUN2Qyx1Q0FBNkI7Ozs7O0lBQzdCLDJDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGZyb20sIHRocm93RXJyb3IsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBbGZyZXNjb0FwaVNlcnZpY2UgfSBmcm9tICcuL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICcuL2Nvb2tpZS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IFJlZGlyZWN0aW9uTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvcmVkaXJlY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSwgQXBwQ29uZmlnVmFsdWVzIH0gZnJvbSAnLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlclJlcHJlc2VudGF0aW9uIH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5pbXBvcnQgeyBtYXAsIGNhdGNoRXJyb3IsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSnd0SGVscGVyU2VydmljZSB9IGZyb20gJy4vand0LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlLnNlcnZpY2UnO1xuXG5jb25zdCBSRU1FTUJFUl9NRV9DT09LSUVfS0VZID0gJ0FMRlJFU0NPX1JFTUVNQkVSX01FJztcbmNvbnN0IFJFTUVNQkVSX01FX1VOVElMID0gMTAwMCAqIDYwICogNjAgKiAyNCAqIDMwO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEF1dGhlbnRpY2F0aW9uU2VydmljZSB7XG4gICAgcHJpdmF0ZSByZWRpcmVjdFVybDogUmVkaXJlY3Rpb25Nb2RlbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIGJlYXJlckV4Y2x1ZGVkVXJsczogc3RyaW5nW10gPSBbJ2F1dGgvcmVhbG1zJywgJ3Jlc291cmNlcy8nLCAnYXNzZXRzLyddO1xuXG4gICAgb25Mb2dpbjogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICAgIG9uTG9nb3V0OiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHBDb25maWc6IEFwcENvbmZpZ1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGFsZnJlc2NvQXBpOiBBbGZyZXNjb0FwaVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgY29va2llOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGxvZ1NlcnZpY2U6IExvZ1NlcnZpY2UpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHVzZXIgbG9nZ2VkIGluLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgbG9nZ2VkIGluLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYXV0aCgpICYmIHRoaXMuY29va2llLmlzRW5hYmxlZCgpICYmICF0aGlzLmlzUmVtZW1iZXJNZVNldCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5pc0xvZ2dlZEluKCk7XG4gICAgfVxuXG4gICAgaXNMb2dnZWRJbldpdGgocHJvdmlkZXI6IHN0cmluZykge1xuICAgICAgICBpZiAocHJvdmlkZXIgPT09ICdCUE0nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0JwbUxvZ2dlZEluKCk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXIgPT09ICdFQ00nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0VjbUxvZ2dlZEluKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0xvZ2dlZEluKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSBwcm92aWRlciBzdXBwb3J0IE9BdXRoP1xuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VwcG9ydGVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpc09hdXRoKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGZyZXNjb0FwaS5nZXRJbnN0YW5jZSgpLmlzT2F1dGhDb25maWd1cmF0aW9uKCk7XG4gICAgfVxuXG4gICAgaXNQdWJsaWNVcmwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuaXNQdWJsaWNVcmwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSBwcm92aWRlciBzdXBwb3J0IEVDTT9cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1cHBvcnRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFQ01Qcm92aWRlcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5pc0VjbUNvbmZpZ3VyYXRpb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSBwcm92aWRlciBzdXBwb3J0IEJQTT9cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1cHBvcnRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNCUE1Qcm92aWRlcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5pc0JwbUNvbmZpZ3VyYXRpb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSBwcm92aWRlciBzdXBwb3J0IGJvdGggRUNNIGFuZCBCUE0/XG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBib3RoIGFyZSBzdXBwb3J0ZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGlzQUxMUHJvdmlkZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuaXNFY21CcG1Db25maWd1cmF0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9ncyB0aGUgdXNlciBpbi5cbiAgICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWUgZm9yIHRoZSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZCBmb3IgdGhlIGxvZ2luXG4gICAgICogQHBhcmFtIHJlbWVtYmVyTWUgU3RvcmVzIHRoZSB1c2VyJ3MgbG9naW4gZGV0YWlscyBpZiB0cnVlXG4gICAgICogQHJldHVybnMgT2JqZWN0IHdpdGggYXV0aCB0eXBlIChcIkVDTVwiLCBcIkJQTVwiIG9yIFwiQUxMXCIpIGFuZCBhdXRoIHRpY2tldFxuICAgICAqL1xuICAgIGxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlbWVtYmVyTWU6IGJvb2xlYW4gPSBmYWxzZSk6IE9ic2VydmFibGU8eyB0eXBlOiBzdHJpbmcsIHRpY2tldDogYW55IH0+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaS5nZXRJbnN0YW5jZSgpLmxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCkpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmVtZW1iZXJNZUNvb2tpZShyZW1lbWJlck1lKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvZ2luLm5leHQocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5hcHBDb25maWcuZ2V0KEFwcENvbmZpZ1ZhbHVlcy5QUk9WSURFUlMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlja2V0OiByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIHRoZSB1c2VyIGluIHdpdGggU1NPXG4gICAgICovXG4gICAgc3NvSW1wbGljaXRMb2dpbigpIHtcbiAgICAgICAgdGhpcy5hbGZyZXNjb0FwaS5nZXRJbnN0YW5jZSgpLmltcGxpY2l0TG9naW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNvb2tpZSBhcyBlaXRoZXIgYSBsb25nLWxpZmUgY29va2llIG9yIGEgc2Vzc2lvbiBjb29raWUuXG4gICAgICogQHBhcmFtIHJlbWVtYmVyTWUgRW5hYmxlcyBhIGxvbmctbGlmZSBjb29raWVcbiAgICAgKi9cbiAgICBwcml2YXRlIHNhdmVSZW1lbWJlck1lQ29va2llKHJlbWVtYmVyTWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgbGV0IGV4cGlyYXRpb24gPSBudWxsO1xuXG4gICAgICAgIGlmIChyZW1lbWJlck1lKSB7XG4gICAgICAgICAgICBleHBpcmF0aW9uID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBleHBpcmF0aW9uLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZVRpbWUgPSB0aW1lICsgUkVNRU1CRVJfTUVfVU5USUw7XG4gICAgICAgICAgICBleHBpcmF0aW9uLnNldFRpbWUoZXhwaXJlVGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb29raWUuc2V0SXRlbShSRU1FTUJFUl9NRV9DT09LSUVfS0VZLCAnMScsIGV4cGlyYXRpb24sIG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBcInJlbWVtYmVyIG1lXCIgY29va2llIHdhcyBzZXQgb3Igbm90LlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc2V0LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpc1JlbWVtYmVyTWVTZXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5jb29raWUuZ2V0SXRlbShSRU1FTUJFUl9NRV9DT09LSUVfS0VZKSA9PT0gbnVsbCkgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9ncyB0aGUgdXNlciBvdXQuXG4gICAgICogQHJldHVybnMgUmVzcG9uc2UgZXZlbnQgY2FsbGVkIHdoZW4gbG9nb3V0IGlzIGNvbXBsZXRlXG4gICAgICovXG4gICAgbG9nb3V0KCkge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmNhbGxBcGlMb2dvdXQoKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRhcCgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvZ291dC5uZXh0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGxBcGlMb2dvdXQoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgRUNNIHRpY2tldCBzdG9yZWQgaW4gdGhlIFN0b3JhZ2UuXG4gICAgICogQHJldHVybnMgVGhlIHRpY2tldCBvciBgbnVsbGAgaWYgbm9uZSB3YXMgZm91bmRcbiAgICAgKi9cbiAgICBnZXRUaWNrZXRFY20oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuZ2V0VGlja2V0RWNtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgQlBNIHRpY2tldCBzdG9yZWQgaW4gdGhlIFN0b3JhZ2UuXG4gICAgICogQHJldHVybnMgVGhlIHRpY2tldCBvciBgbnVsbGAgaWYgbm9uZSB3YXMgZm91bmRcbiAgICAgKi9cbiAgICBnZXRUaWNrZXRCcG0oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuZ2V0VGlja2V0QnBtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgQlBNIHRpY2tldCBmcm9tIHRoZSBTdG9yYWdlIGluIEJhc2UgNjQgZm9ybWF0LlxuICAgICAqIEByZXR1cm5zIFRoZSB0aWNrZXQgb3IgYG51bGxgIGlmIG5vbmUgd2FzIGZvdW5kXG4gICAgICovXG4gICAgZ2V0VGlja2V0RWNtQmFzZTY0KCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICBjb25zdCB0aWNrZXQgPSB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuZ2V0VGlja2V0RWNtKCk7XG4gICAgICAgIGlmICh0aWNrZXQpIHtcbiAgICAgICAgICAgIHJldHVybiAnQmFzaWMgJyArIGJ0b2EodGlja2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluIG9uIGFuIEVDTSBwcm92aWRlci5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGxvZ2dlZCBpbiwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFY21Mb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFQ01Qcm92aWRlcigpIHx8IHRoaXMuaXNBTExQcm92aWRlcigpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPYXV0aCgpICYmIHRoaXMuY29va2llLmlzRW5hYmxlZCgpICYmICF0aGlzLmlzUmVtZW1iZXJNZVNldCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5pc0VjbUxvZ2dlZEluKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4gb24gYSBCUE0gcHJvdmlkZXIuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBsb2dnZWQgaW4sIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGlzQnBtTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzQlBNUHJvdmlkZXIoKSB8fCB0aGlzLmlzQUxMUHJvdmlkZXIoKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT2F1dGgoKSAmJiB0aGlzLmNvb2tpZS5pc0VuYWJsZWQoKSAmJiAhdGhpcy5pc1JlbWVtYmVyTWVTZXQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuaXNCcG1Mb2dnZWRJbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBFQ00gdXNlcm5hbWUuXG4gICAgICogQHJldHVybnMgVGhlIEVDTSB1c2VybmFtZVxuICAgICAqL1xuICAgIGdldEVjbVVzZXJuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsZnJlc2NvQXBpLmdldEluc3RhbmNlKCkuZ2V0RWNtVXNlcm5hbWUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBCUE0gdXNlcm5hbWVcbiAgICAgKiBAcmV0dXJucyBUaGUgQlBNIHVzZXJuYW1lXG4gICAgICovXG4gICAgZ2V0QnBtVXNlcm5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5nZXRCcG1Vc2VybmFtZSgpO1xuICAgIH1cblxuICAgIC8qKiBTZXRzIHRoZSBVUkwgdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgbG9naW4uXG4gICAgICogQHBhcmFtIHVybCBVUkwgdG8gcmVkaXJlY3QgdG9cbiAgICAgKi9cbiAgICBzZXRSZWRpcmVjdCh1cmw6IFJlZGlyZWN0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5yZWRpcmVjdFVybCA9IHVybDtcbiAgICB9XG5cbiAgICAvKiogR2V0cyB0aGUgVVJMIHRvIHJlZGlyZWN0IHRvIGFmdGVyIGxvZ2luLlxuICAgICAqIEByZXR1cm5zIFRoZSByZWRpcmVjdCBVUkxcbiAgICAgKi9cbiAgICBnZXRSZWRpcmVjdCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IDxzdHJpbmc+IHRoaXMuYXBwQ29uZmlnLmdldChBcHBDb25maWdWYWx1ZXMuUFJPVklERVJTKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzVmFsaWRSZWRpcmVjdGlvbihwcm92aWRlcikgPyB0aGlzLnJlZGlyZWN0VXJsLnVybCA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdXNlciBjdXJyZW50bHkgbG9nZ2VkIGludG8gQVBTLlxuICAgICAqIEByZXR1cm5zIFVzZXIgaW5mb3JtYXRpb25cbiAgICAgKi9cbiAgICBnZXRCcG1Mb2dnZWRVc2VyKCk6IE9ic2VydmFibGU8VXNlclJlcHJlc2VudGF0aW9uPiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGkuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5wcm9maWxlQXBpLmdldFByb2ZpbGUoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYXNWYWxpZFJlZGlyZWN0aW9uKHByb3ZpZGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkaXJlY3RVcmwgJiYgKHRoaXMucmVkaXJlY3RVcmwucHJvdmlkZXIgPT09IHByb3ZpZGVyIHx8IHRoaXMuaGFzU2VsZWN0ZWRQcm92aWRlckFsbChwcm92aWRlcikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFzU2VsZWN0ZWRQcm92aWRlckFsbChwcm92aWRlcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZGlyZWN0VXJsICYmICh0aGlzLnJlZGlyZWN0VXJsLnByb3ZpZGVyID09PSAnQUxMJyB8fCBwcm92aWRlciA9PT0gJ0FMTCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByaW50cyBhbiBlcnJvciBtZXNzYWdlIGluIHRoZSBjb25zb2xlIGJyb3dzZXJcbiAgICAgKiBAcGFyYW0gZXJyb3IgRXJyb3IgbWVzc2FnZVxuICAgICAqIEByZXR1cm5zIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBoYW5kbGVFcnJvcihlcnJvcjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKCdFcnJvciB3aGVuIGxvZ2dpbmcgaW4nLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZXQgb2YgVVJMcyB0aGF0IHRoZSB0b2tlbiBiZWFyZXIgaXMgZXhjbHVkZWQgZnJvbS5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBVUkwgc3RyaW5nc1xuICAgICAqL1xuICAgIGdldEJlYXJlckV4Y2x1ZGVkVXJscygpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJlYXJlckV4Y2x1ZGVkVXJscztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhdXRoIHRva2VuLlxuICAgICAqIEByZXR1cm5zIEF1dGggdG9rZW4gc3RyaW5nXG4gICAgICovXG4gICAgZ2V0VG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0SXRlbShKd3RIZWxwZXJTZXJ2aWNlLlVTRVJfQUNDRVNTX1RPS0VOKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBhdXRoIHRva2VuIHRvIGFuIEhUVFAgaGVhZGVyIHVzaW5nIHRoZSAnYmVhcmVyJyBzY2hlbWUuXG4gICAgICogQHBhcmFtIGhlYWRlcnNBcmcgSGVhZGVyIHRoYXQgd2lsbCByZWNlaXZlIHRoZSB0b2tlblxuICAgICAqIEByZXR1cm5zIFRoZSBuZXcgaGVhZGVyIHdpdGggdGhlIHRva2VuIGFkZGVkXG4gICAgICovXG4gICAgYWRkVG9rZW5Ub0hlYWRlcihoZWFkZXJzQXJnPzogSHR0cEhlYWRlcnMpOiBPYnNlcnZhYmxlPEh0dHBIZWFkZXJzPiB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IE9ic2VydmVyPGFueT4pID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzID0gaGVhZGVyc0FyZztcbiAgICAgICAgICAgIGlmICghaGVhZGVycykge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW46IHN0cmluZyA9IHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnYmVhcmVyICcgKyB0b2tlbik7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChoZWFkZXJzKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
