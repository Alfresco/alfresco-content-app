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
import { StorageService } from './storage.service';
import * as i0 from '@angular/core';
import * as i1 from './storage.service';
export class JwtHelperService {
  /**
   * @param {?} storageService
   */
  constructor(storageService) {
    this.storageService = storageService;
  }
  /**
   * Decodes a JSON web token into a JS object.
   * @param {?} token Token in encoded form
   * @return {?} Decoded token data object
   */
  decodeToken(token) {
    /** @type {?} */
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    /** @type {?} */
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }
  /**
   * @private
   * @param {?} token
   * @return {?}
   */
  urlBase64Decode(token) {
    /** @type {?} */
    let output = token.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return decodeURIComponent(escape(window.atob(output)));
  }
  /**
   * Gets a named value from the user access token.
   * @template T
   * @param {?} key Key name of the field to retrieve
   * @return {?} Value from the token
   */
  getValueFromLocalAccessToken(key) {
    return this.getValueFromToken(this.getAccessToken(), key);
  }
  /**
   * Gets access token
   * @return {?} access token
   */
  getAccessToken() {
    return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
  }
  /**
   * Gets a named value from the user access token.
   * @template T
   * @param {?} accessToken your SSO access token where the value is encode
   * @param {?} key Key name of the field to retrieve
   * @return {?} Value from the token
   */
  getValueFromToken(accessToken, key) {
    /** @type {?} */
    let value;
    if (accessToken) {
      /** @type {?} */
      const tokenPayload = this.decodeToken(accessToken);
      value = tokenPayload[key];
    }
    return /** @type {?} */ (value);
  }
  /**
   * Gets realm roles.
   * @return {?} Array of realm roles
   */
  getRealmRoles() {
    /** @type {?} */
    const access = this.getValueFromLocalAccessToken(
      JwtHelperService.REALM_ACCESS
    );
    return access ? access['roles'] : [];
  }
  /**
   * Gets Client roles.
   * @param {?} clientName
   * @return {?} Array of client roles
   */
  getClientRoles(clientName) {
    /** @type {?} */
    const clientRole = this.getValueFromLocalAccessToken(
      JwtHelperService.RESOURCE_ACCESS
    )[clientName];
    return clientRole ? clientRole['roles'] : [];
  }
  /**
   * Checks for single realm role.
   * @param {?} role Role name to check
   * @return {?} True if it contains given role, false otherwise
   */
  hasRealmRole(role) {
    /** @type {?} */
    let hasRole = false;
    if (this.getAccessToken()) {
      /** @type {?} */
      const realmRoles = this.getRealmRoles();
      hasRole = realmRoles.some(
        /**
         * @param {?} currentRole
         * @return {?}
         */
        currentRole => {
          return currentRole === role;
        }
      );
    }
    return hasRole;
  }
  /**
   * Checks for realm roles.
   * @param {?} rolesToCheck List of role names to check
   * @return {?} True if it contains at least one of the given roles, false otherwise
   */
  hasRealmRoles(rolesToCheck) {
    return rolesToCheck.some(
      /**
       * @param {?} currentRole
       * @return {?}
       */
      currentRole => {
        return this.hasRealmRole(currentRole);
      }
    );
  }
  /**
   * Checks for client roles.
   * @param {?} clientName Targeted client name
   * @param {?} rolesToCheck List of role names to check
   * @return {?} True if it contains at least one of the given roles, false otherwise
   */
  hasRealmRolesForClientRole(clientName, rolesToCheck) {
    return rolesToCheck.some(
      /**
       * @param {?} currentRole
       * @return {?}
       */
      currentRole => {
        return this.hasClientRole(clientName, currentRole);
      }
    );
  }
  /**
   * Checks for client role.
   * @param {?} clientName Targeted client name
   * @param {?} role Role name to check
   * @return {?} True if it contains given role, false otherwise
   */
  hasClientRole(clientName, role) {
    /** @type {?} */
    let hasRole = false;
    if (this.getAccessToken()) {
      /** @type {?} */
      const clientRoles = this.getClientRoles(clientName);
      hasRole = clientRoles.some(
        /**
         * @param {?} currentRole
         * @return {?}
         */
        currentRole => {
          return currentRole === role;
        }
      );
    }
    return hasRole;
  }
}
JwtHelperService.USER_NAME = 'name';
JwtHelperService.FAMILY_NAME = 'family_name';
JwtHelperService.GIVEN_NAME = 'given_name';
JwtHelperService.USER_EMAIL = 'email';
JwtHelperService.USER_ACCESS_TOKEN = 'access_token';
JwtHelperService.REALM_ACCESS = 'realm_access';
JwtHelperService.RESOURCE_ACCESS = 'resource_access';
JwtHelperService.USER_PREFERRED_USERNAME = 'preferred_username';
JwtHelperService.decorators = [
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
JwtHelperService.ctorParameters = () => [{ type: StorageService }];
/** @nocollapse */ JwtHelperService.ngInjectableDef = i0.defineInjectable({
  factory: function JwtHelperService_Factory() {
    return new JwtHelperService(i0.inject(i1.StorageService));
  },
  token: JwtHelperService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  JwtHelperService.USER_NAME;
  /** @type {?} */
  JwtHelperService.FAMILY_NAME;
  /** @type {?} */
  JwtHelperService.GIVEN_NAME;
  /** @type {?} */
  JwtHelperService.USER_EMAIL;
  /** @type {?} */
  JwtHelperService.USER_ACCESS_TOKEN;
  /** @type {?} */
  JwtHelperService.REALM_ACCESS;
  /** @type {?} */
  JwtHelperService.RESOURCE_ACCESS;
  /** @type {?} */
  JwtHelperService.USER_PREFERRED_USERNAME;
  /**
   * @type {?}
   * @private
   */
  JwtHelperService.prototype.storageService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWhlbHBlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvand0LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7QUFLbkQsTUFBTSxPQUFPLGdCQUFnQjs7OztJQVd6QixZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFDbEQsQ0FBQzs7Ozs7O0lBT0QsV0FBVyxDQUFDLEtBQUs7O2NBQ1AsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRTlCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzVDOztjQUVLLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Ozs7OztJQUVPLGVBQWUsQ0FBQyxLQUFLOztZQUNyQixNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDeEQsUUFBUSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNKLE1BQU07YUFDVDtZQUNELEtB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QUM7WUFDbkQsT0FBTyxHQUFHLFdBQVcsQ0FBQyxJQUFJOzs7O1lBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDdkMsT0FBTyxXQUFXLEtBQUssSUFBSSxDQUFDO1lBQ2hDLENBQUMsRUFBQyxDQUFDO1NBQ047UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDOztBQTdKTSwwQkFBUyxHQUFHLE1BQU0sQ0FBQztBQUNuQiw0QkFBVyxHQUFHLGFBQWEsQ0FBQztBQUM1QiwyQkFBVSxHQUFHLFlBQVksQ0FBQztBQUMxQiwyQkFBVSxHQUFHLE9BQU8sQ0FBQztBQUNyQixrQ0FBaUIsR0FBRyxjQUFjLENBQUM7QUFDbkMsNkJBQVksR0FBRyxjQUFjLENBQUM7QUFDOUIsZ0NBQWUsR0FBRyxpQkFBaUIsQ0FBQztBQUNwQyx3Q0FBdUIsR0FBRyxvQkFBb0IsQ0FBQzs7WUFaekQsVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBSlEsY0FBYzs7Ozs7SUFPbkIsMkJBQTBCOztJQUMxQiw2QkFBbUM7O0lBQ25DLDRCQUFpQzs7SUFDakMsNEJBQTRCOztJQUM1QixtQ0FBMEM7O0lBQzFDLDhCQUFxQzs7SUFDckMsaUNBQTJDOztJQUMzQyx5Q0FBc0Q7Ozs7O0lBRTFDLDBDQUFzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zdG9yYWdlLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEp3dEhlbHBlclNlcnZpY2Uge1xuXG4gICAgc3RhdGljIFVTRVJfTkFNRSA9ICduYW1lJztcbiAgICBzdGF0aWMgRkFNSUxZX05BTUUgPSAnZmFtaWx5X25hbWUnO1xuICAgIHN0YXRpYyBHSVZFTl9OQU1FID0gJ2dpdmVuX25hbWUnO1xuICAgIHN0YXRpYyBVU0VSX0VNQUlMID0gJ2VtYWlsJztcbiAgICBzdGF0aWMgVVNFUl9BQ0NFU1NfVE9LRU4gPSAnYWNjZXNzX3Rva2VuJztcbiAgICBzdGF0aWMgUkVBTE1fQUNDRVNTID0gJ3JlYWxtX2FjY2Vzcyc7XG4gICAgc3RhdGljIFJFU09VUkNFX0FDQ0VTUyA9ICdyZXNvdXJjZV9hY2Nlc3MnO1xuICAgIHN0YXRpYyBVU0VSX1BSRUZFUlJFRF9VU0VSTkFNRSA9ICdwcmVmZXJyZWRfdXNlcm5hbWUnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9yYWdlU2VydmljZTogU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGVzIGEgSlNPTiB3ZWIgdG9rZW4gaW50byBhIEpTIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gdG9rZW4gVG9rZW4gaW4gZW5jb2RlZCBmb3JtXG4gICAgICogQHJldHVybnMgRGVjb2RlZCB0b2tlbiBkYXRhIG9iamVjdFxuICAgICAqL1xuICAgIGRlY29kZVRva2VuKHRva2VuKTogT2JqZWN0IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSldUIG11c3QgaGF2ZSAzIHBhcnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWNvZGVkID0gdGhpcy51cmxCYXNlNjREZWNvZGUocGFydHNbMV0pO1xuICAgICAgICBpZiAoIWRlY29kZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRlY29kZSB0aGUgdG9rZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29kZWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXJsQmFzZTY0RGVjb2RlKHRva2VuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IHRva2VuLnJlcGxhY2UoLy0vZywgJysnKS5yZXBsYWNlKC9fL2csICcvJyk7XG4gICAgICAgIHN3aXRjaCAob3V0cHV0Lmxlbmd0aCAlIDQpIHtcbiAgICAgICAgICAgIGNhc2UgMDoge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAyOiB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc9PSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIDM6IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJz0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBiYXNlNjR1cmwgc3RyaW5nIScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKHdpbmRvdy5hdG9iKG91dHB1dCkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmFtZWQgdmFsdWUgZnJvbSB0aGUgdXNlciBhY2Nlc3MgdG9rZW4uXG4gICAgICogQHBhcmFtIGtleSBLZXkgbmFtZSBvZiB0aGUgZmllbGQgdG8gcmV0cmlldmVcbiAgICAgKiBAcmV0dXJucyBWYWx1ZSBmcm9tIHRoZSB0b2tlblxuICAgICAqL1xuICAgIGdldFZhbHVlRnJvbUxvY2FsQWNjZXNzVG9rZW48VD4oa2V5OiBzdHJpbmcpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWVGcm9tVG9rZW4odGhpcy5nZXRBY2Nlc3NUb2tlbigpLCBrZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWNjZXNzIHRva2VuXG4gICAgICogQHJldHVybnMgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgZ2V0QWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0SXRlbShKd3RIZWxwZXJTZXJ2aWNlLlVTRVJfQUNDRVNTX1RPS0VOKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmFtZWQgdmFsdWUgZnJvbSB0aGUgdXNlciBhY2Nlc3MgdG9rZW4uXG4gICAgICogQHBhcmFtIGFjY2Vzc1Rva2VuIHlvdXIgU1NPIGFjY2VzcyB0b2tlbiB3aGVyZSB0aGUgdmFsdWUgaXMgZW5jb2RlXG4gICAgICogQHBhcmFtIGtleSBLZXkgbmFtZSBvZiB0aGUgZmllbGQgdG8gcmV0cmlldmVcbiAgICAgKiBAcmV0dXJucyBWYWx1ZSBmcm9tIHRoZSB0b2tlblxuICAgICAqL1xuICAgIGdldFZhbHVlRnJvbVRva2VuPFQ+KGFjY2Vzc1Rva2VuOiBzdHJpbmcsIGtleTogc3RyaW5nKTogVCB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgaWYgKGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlblBheWxvYWQgPSB0aGlzLmRlY29kZVRva2VuKGFjY2Vzc1Rva2VuKTtcbiAgICAgICAgICAgIHZhbHVlID0gdG9rZW5QYXlsb2FkW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDxUPiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHJlYWxtIHJvbGVzLlxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIHJlYWxtIHJvbGVzXG4gICAgICovXG4gICAgZ2V0UmVhbG1Sb2xlcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGFjY2VzcyA9IHRoaXMuZ2V0VmFsdWVGcm9tTG9jYWxBY2Nlc3NUb2tlbjxhbnk+KEp3dEhlbHBlclNlcnZpY2UuUkVBTE1fQUNDRVNTKTtcbiAgICAgICAgcmV0dXJuIGFjY2VzcyA/IGFjY2Vzc1sncm9sZXMnXSA6IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgQ2xpZW50IHJvbGVzLlxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIGNsaWVudCByb2xlc1xuICAgICAqL1xuICAgIGdldENsaWVudFJvbGVzKGNsaWVudE5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgY2xpZW50Um9sZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTG9jYWxBY2Nlc3NUb2tlbjxhbnk+KEp3dEhlbHBlclNlcnZpY2UuUkVTT1VSQ0VfQUNDRVNTKVtjbGllbnROYW1lXTtcbiAgICAgICAgcmV0dXJuIGNsaWVudFJvbGUgPyBjbGllbnRSb2xlWydyb2xlcyddIDogW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGZvciBzaW5nbGUgcmVhbG0gcm9sZS5cbiAgICAgKiBAcGFyYW0gcm9sZSBSb2xlIG5hbWUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGl0IGNvbnRhaW5zIGdpdmVuIHJvbGUsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGhhc1JlYWxtUm9sZShyb2xlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGhhc1JvbGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QWNjZXNzVG9rZW4oKSkge1xuICAgICAgICAgICAgY29uc3QgcmVhbG1Sb2xlcyA9IHRoaXMuZ2V0UmVhbG1Sb2xlcygpO1xuICAgICAgICAgICAgaGFzUm9sZSA9IHJlYWxtUm9sZXMuc29tZSgoY3VycmVudFJvbGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFJvbGUgPT09IHJvbGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzUm9sZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZm9yIHJlYWxtIHJvbGVzLlxuICAgICAqIEBwYXJhbSByb2xlc1RvQ2hlY2sgTGlzdCBvZiByb2xlIG5hbWVzIHRvIGNoZWNrXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBpdCBjb250YWlucyBhdCBsZWFzdCBvbmUgb2YgdGhlIGdpdmVuIHJvbGVzLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBoYXNSZWFsbVJvbGVzKHJvbGVzVG9DaGVjazogc3RyaW5nIFtdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiByb2xlc1RvQ2hlY2suc29tZSgoY3VycmVudFJvbGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc1JlYWxtUm9sZShjdXJyZW50Um9sZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBmb3IgY2xpZW50IHJvbGVzLlxuICAgICAqIEBwYXJhbSBjbGllbnROYW1lIFRhcmdldGVkIGNsaWVudCBuYW1lXG4gICAgICogQHBhcmFtIHJvbGVzVG9DaGVjayBMaXN0IG9mIHJvbGUgbmFtZXMgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGl0IGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBvZiB0aGUgZ2l2ZW4gcm9sZXMsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGhhc1JlYWxtUm9sZXNGb3JDbGllbnRSb2xlKGNsaWVudE5hbWU6IHN0cmluZywgcm9sZXNUb0NoZWNrOiBzdHJpbmcgW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHJvbGVzVG9DaGVjay5zb21lKChjdXJyZW50Um9sZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFzQ2xpZW50Um9sZShjbGllbnROYW1lLCBjdXJyZW50Um9sZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBmb3IgY2xpZW50IHJvbGUuXG4gICAgICogQHBhcmFtIGNsaWVudE5hbWUgVGFyZ2V0ZWQgY2xpZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gcm9sZSBSb2xlIG5hbWUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGl0IGNvbnRhaW5zIGdpdmVuIHJvbGUsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGhhc0NsaWVudFJvbGUoY2xpZW50TmFtZTogc3RyaW5nLCByb2xlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGhhc1JvbGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QWNjZXNzVG9rZW4oKSkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50Um9sZXMgPSB0aGlzLmdldENsaWVudFJvbGVzKGNsaWVudE5hbWUpO1xuICAgICAgICAgICAgaGFzUm9sZSA9IGNsaWVudFJvbGVzLnNvbWUoKGN1cnJlbnRSb2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRSb2xlID09PSByb2xlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc1JvbGU7XG4gICAgfVxufVxuIl19
