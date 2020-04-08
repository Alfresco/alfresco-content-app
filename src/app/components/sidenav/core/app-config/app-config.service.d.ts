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
import { Observable, Subject } from 'rxjs';
export declare enum AppConfigValues {
  APP_CONFIG_LANGUAGES_KEY = 'languages',
  PROVIDERS = 'providers',
  OAUTHCONFIG = 'oauth2',
  ECMHOST = 'ecmHost',
  BASESHAREURL = 'baseShareUrl',
  BPMHOST = 'bpmHost',
  IDENTITY_HOST = 'identityHost',
  AUTHTYPE = 'authType',
  CONTEXTROOTECM = 'contextRootEcm',
  CONTEXTROOTBPM = 'contextRootBpm',
  ALFRESCO_REPOSITORY_NAME = 'alfrescoRepositoryName',
  LOG_LEVEL = 'logLevel',
  LOGIN_ROUTE = 'loginRoute',
  DISABLECSRF = 'disableCSRF',
  AUTH_WITH_CREDENTIALS = 'auth.withCredentials',
  APPLICATION = 'application',
  STORAGE_PREFIX = 'application.storagePrefix',
  NOTIFY_DURATION = 'notificationDefaultDuration'
}
export declare enum Status {
  INIT = 'init',
  LOADING = 'loading',
  LOADED = 'loaded'
}
export declare class AppConfigService {
  private http;
  config: any;
  status: Status;
  protected onLoadSubject: Subject<any>;
  onLoad: Observable<any>;
  constructor(http: HttpClient);
  /**
   * Requests notification of a property value when it is loaded.
   * @param property The desired property value
   * @returns Property value, when loaded
   */
  select(property: string): Observable<any>;
  /**
   * Gets the value of a named property.
   * @param key Name of the property
   * @param defaultValue Value to return if the key is not found
   * @returns Value of the property
   */
  get<T>(key: string, defaultValue?: T): T;
  /**
   * Gets the location.protocol value.
   * @returns The location.protocol string
   */
  getLocationProtocol(): string;
  /**
   * Gets the location.hostname property.
   * @returns Value of the property
   */
  getLocationHostname(): string;
  /**
   * Gets the location.port property.
   * @param prefix Text added before port value
   * @returns Port with prefix
   */
  getLocationPort(prefix?: string): string;
  /**
   * Loads the config file.
   * @returns Notification when loading is complete
   */
  load(): Promise<any>;
  private formatString;
}
