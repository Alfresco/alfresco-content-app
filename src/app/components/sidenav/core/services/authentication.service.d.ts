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
import { Observable, Subject } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { RedirectionModel } from '../models/redirection.model';
import { AppConfigService } from '../app-config/app-config.service';
import { UserRepresentation } from '@alfresco/js-api';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
export declare class AuthenticationService {
  private appConfig;
  private storageService;
  private alfrescoApi;
  private cookie;
  private logService;
  private redirectUrl;
  private bearerExcludedUrls;
  onLogin: Subject<any>;
  onLogout: Subject<any>;
  constructor(
    appConfig: AppConfigService,
    storageService: StorageService,
    alfrescoApi: AlfrescoApiService,
    cookie: CookieService,
    logService: LogService
  );
  /**
   * Checks if the user logged in.
   * @returns True if logged in, false otherwise
   */
  isLoggedIn(): boolean;
  isLoggedInWith(provider: string): boolean;
  /**
   * Does the provider support OAuth?
   * @returns True if supported, false otherwise
   */
  isOauth(): boolean;
  isPublicUrl(): boolean;
  /**
   * Does the provider support ECM?
   * @returns True if supported, false otherwise
   */
  isECMProvider(): boolean;
  /**
   * Does the provider support BPM?
   * @returns True if supported, false otherwise
   */
  isBPMProvider(): boolean;
  /**
   * Does the provider support both ECM and BPM?
   * @returns True if both are supported, false otherwise
   */
  isALLProvider(): boolean;
  /**
   * Logs the user in.
   * @param username Username for the login
   * @param password Password for the login
   * @param rememberMe Stores the user's login details if true
   * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
   */
  login(
    username: string,
    password: string,
    rememberMe?: boolean
  ): Observable<{
    type: string;
    ticket: any;
  }>;
  /**
   * Logs the user in with SSO
   */
  ssoImplicitLogin(): void;
  /**
   * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
   * @param rememberMe Enables a long-life cookie
   */
  private saveRememberMeCookie;
  /**
   * Checks whether the "remember me" cookie was set or not.
   * @returns True if set, false otherwise
   */
  isRememberMeSet(): boolean;
  /**
   * Logs the user out.
   * @returns Response event called when logout is complete
   */
  logout(): Observable<any>;
  private callApiLogout;
  /**
   * Gets the ECM ticket stored in the Storage.
   * @returns The ticket or `null` if none was found
   */
  getTicketEcm(): string | null;
  /**
   * Gets the BPM ticket stored in the Storage.
   * @returns The ticket or `null` if none was found
   */
  getTicketBpm(): string | null;
  /**
   * Gets the BPM ticket from the Storage in Base 64 format.
   * @returns The ticket or `null` if none was found
   */
  getTicketEcmBase64(): string | null;
  /**
   * Checks if the user is logged in on an ECM provider.
   * @returns True if logged in, false otherwise
   */
  isEcmLoggedIn(): boolean;
  /**
   * Checks if the user is logged in on a BPM provider.
   * @returns True if logged in, false otherwise
   */
  isBpmLoggedIn(): boolean;
  /**
   * Gets the ECM username.
   * @returns The ECM username
   */
  getEcmUsername(): string;
  /**
   * Gets the BPM username
   * @returns The BPM username
   */
  getBpmUsername(): string;
  /** Sets the URL to redirect to after login.
   * @param url URL to redirect to
   */
  setRedirect(url: RedirectionModel): void;
  /** Gets the URL to redirect to after login.
   * @returns The redirect URL
   */
  getRedirect(): string;
  /**
   * Gets information about the user currently logged into APS.
   * @returns User information
   */
  getBpmLoggedUser(): Observable<UserRepresentation>;
  private hasValidRedirection;
  private hasSelectedProviderAll;
  /**
   * Prints an error message in the console browser
   * @param error Error message
   * @returns Object representing the error message
   */
  handleError(error: any): Observable<any>;
  /**
   * Gets the set of URLs that the token bearer is excluded from.
   * @returns Array of URL strings
   */
  getBearerExcludedUrls(): string[];
  /**
   * Gets the auth token.
   * @returns Auth token string
   */
  getToken(): string;
  /**
   * Adds the auth token to an HTTP header using the 'bearer' scheme.
   * @param headersArg Header that will receive the token
   * @returns The new header with the token added
   */
  addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders>;
}
