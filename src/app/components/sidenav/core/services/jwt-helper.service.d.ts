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
import { StorageService } from './storage.service';
export declare class JwtHelperService {
  private storageService;
  static USER_NAME: string;
  static FAMILY_NAME: string;
  static GIVEN_NAME: string;
  static USER_EMAIL: string;
  static USER_ACCESS_TOKEN: string;
  static REALM_ACCESS: string;
  static RESOURCE_ACCESS: string;
  static USER_PREFERRED_USERNAME: string;
  constructor(storageService: StorageService);
  /**
   * Decodes a JSON web token into a JS object.
   * @param token Token in encoded form
   * @returns Decoded token data object
   */
  decodeToken(token: any): Object;
  private urlBase64Decode;
  /**
   * Gets a named value from the user access token.
   * @param key Key name of the field to retrieve
   * @returns Value from the token
   */
  getValueFromLocalAccessToken<T>(key: string): T;
  /**
   * Gets access token
   * @returns access token
   */
  getAccessToken(): string;
  /**
   * Gets a named value from the user access token.
   * @param accessToken your SSO access token where the value is encode
   * @param key Key name of the field to retrieve
   * @returns Value from the token
   */
  getValueFromToken<T>(accessToken: string, key: string): T;
  /**
   * Gets realm roles.
   * @returns Array of realm roles
   */
  getRealmRoles(): string[];
  /**
   * Gets Client roles.
   * @returns Array of client roles
   */
  getClientRoles(clientName: string): string[];
  /**
   * Checks for single realm role.
   * @param role Role name to check
   * @returns True if it contains given role, false otherwise
   */
  hasRealmRole(role: string): boolean;
  /**
   * Checks for realm roles.
   * @param rolesToCheck List of role names to check
   * @returns True if it contains at least one of the given roles, false otherwise
   */
  hasRealmRoles(rolesToCheck: string[]): boolean;
  /**
   * Checks for client roles.
   * @param clientName Targeted client name
   * @param rolesToCheck List of role names to check
   * @returns True if it contains at least one of the given roles, false otherwise
   */
  hasRealmRolesForClientRole(
    clientName: string,
    rolesToCheck: string[]
  ): boolean;
  /**
   * Checks for client role.
   * @param clientName Targeted client name
   * @param role Role name to check
   * @returns True if it contains given role, false otherwise
   */
  hasClientRole(clientName: string, role: string): boolean;
}
