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
import { from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { JwtHelperService } from './jwt-helper.service';
import { LogService } from './log.service';
import * as i0 from '@angular/core';
import * as i1 from './jwt-helper.service';
import * as i2 from './alfresco-api.service';
import * as i3 from '../app-config/app-config.service';
import * as i4 from './log.service';
/**
 * @record
 */
export function IdentityUserQueryResponse() {}
if (false) {
  /** @type {?} */
  IdentityUserQueryResponse.prototype.entries;
  /** @type {?} */
  IdentityUserQueryResponse.prototype.pagination;
}
/**
 * @record
 */
export function IdentityUserPasswordModel() {}
if (false) {
  /** @type {?|undefined} */
  IdentityUserPasswordModel.prototype.type;
  /** @type {?|undefined} */
  IdentityUserPasswordModel.prototype.value;
  /** @type {?|undefined} */
  IdentityUserPasswordModel.prototype.temporary;
}
/**
 * @record
 */
export function IdentityUserQueryCloudRequestModel() {}
if (false) {
  /** @type {?} */
  IdentityUserQueryCloudRequestModel.prototype.first;
  /** @type {?} */
  IdentityUserQueryCloudRequestModel.prototype.max;
}
/**
 * @record
 */
export function IdentityJoinGroupRequestModel() {}
if (false) {
  /** @type {?} */
  IdentityJoinGroupRequestModel.prototype.realm;
  /** @type {?} */
  IdentityJoinGroupRequestModel.prototype.userId;
  /** @type {?} */
  IdentityJoinGroupRequestModel.prototype.groupId;
}
export class IdentityUserService {
  /**
   * @param {?} jwtHelperService
   * @param {?} alfrescoApiService
   * @param {?} appConfigService
   * @param {?} logService
   */
  constructor(
    jwtHelperService,
    alfrescoApiService,
    appConfigService,
    logService
  ) {
    this.jwtHelperService = jwtHelperService;
    this.alfrescoApiService = alfrescoApiService;
    this.appConfigService = appConfigService;
    this.logService = logService;
  }
  /**
   * Gets the name and other basic details of the current user.
   * @return {?} The user's details
   */
  getCurrentUserInfo() {
    /** @type {?} */
    const familyName = this.jwtHelperService.getValueFromLocalAccessToken(
      JwtHelperService.FAMILY_NAME
    );
    /** @type {?} */
    const givenName = this.jwtHelperService.getValueFromLocalAccessToken(
      JwtHelperService.GIVEN_NAME
    );
    /** @type {?} */
    const email = this.jwtHelperService.getValueFromLocalAccessToken(
      JwtHelperService.USER_EMAIL
    );
    /** @type {?} */
    const username = this.jwtHelperService.getValueFromLocalAccessToken(
      JwtHelperService.USER_PREFERRED_USERNAME
    );
    return {
      firstName: givenName,
      lastName: familyName,
      email: email,
      username: username
    };
  }
  /**
   * Find users based on search input.
   * @param {?} search Search query string
   * @return {?} List of users
   */
  findUsersByName(search) {
    if (search === '') {
      return of([]);
    }
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = { search: search };
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          return response.map(
            /**
             * @param {?} user
             * @return {?}
             */
            user => {
              return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
              };
            }
          );
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
   * Find users based on username input.
   * @param {?} username Search query string
   * @return {?} List of users
   */
  findUserByUsername(username) {
    if (username === '') {
      return of([]);
    }
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = { username: username };
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          return response.map(
            /**
             * @param {?} user
             * @return {?}
             */
            user => {
              return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
              };
            }
          );
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
   * Find users based on email input.
   * @param {?} email Search query string
   * @return {?} List of users
   */
  findUserByEmail(email) {
    if (email === '') {
      return of([]);
    }
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = { email: email };
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          return response.map(
            /**
             * @param {?} user
             * @return {?}
             */
            user => {
              return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
              };
            }
          );
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
   * Find users based on id input.
   * @param {?} id Search query string
   * @return {?} users object
   */
  findUserById(id) {
    if (id === '') {
      return of([]);
    }
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + id;
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    );
  }
  /**
   * Get client roles of a user for a particular client.
   * @param {?} userId ID of the target user
   * @param {?} clientId ID of the client app
   * @return {?} List of client roles
   */
  getClientRoles(userId, clientId) {
    /** @type {?} */
    const url = this.buildUserClientRoleMapping(userId, clientId);
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    );
  }
  /**
   * Checks whether user has access to a client app.
   * @param {?} userId ID of the target user
   * @param {?} clientId ID of the client app
   * @return {?} True if the user has access, false otherwise
   */
  checkUserHasClientApp(userId, clientId) {
    return this.getClientRoles(userId, clientId).pipe(
      map(
        /**
         * @param {?} clientRoles
         * @return {?}
         */
        clientRoles => {
          if (clientRoles.length > 0) {
            return true;
          }
          return false;
        }
      )
    );
  }
  /**
   * Checks whether a user has any of the client app roles.
   * @param {?} userId ID of the target user
   * @param {?} clientId ID of the client app
   * @param {?} roleNames List of role names to check for
   * @return {?} True if the user has one or more of the roles, false otherwise
   */
  checkUserHasAnyClientAppRole(userId, clientId, roleNames) {
    return this.getClientRoles(userId, clientId).pipe(
      map(
        /**
         * @param {?} clientRoles
         * @return {?}
         */
        clientRoles => {
          /** @type {?} */
          let hasRole = false;
          if (clientRoles.length > 0) {
            roleNames.forEach(
              /**
               * @param {?} roleName
               * @return {?}
               */
              roleName => {
                /** @type {?} */
                const role = clientRoles.find(
                  /**
                   * @param {?} availableRole
                   * @return {?}
                   */
                  (availableRole => {
                    return availableRole.name === roleName;
                  })
                );
                if (role) {
                  hasRole = true;
                  return;
                }
              }
            );
          }
          return hasRole;
        }
      )
    );
  }
  /**
   * Gets the client ID for an application.
   * @param {?} applicationName Name of the application
   * @return {?} Client ID string
   */
  getClientIdByApplicationName(applicationName) {
    /** @type {?} */
    const url = this.buildGetClientsUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = { clientId: applicationName };
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          /** @type {?} */
          const clientId =
            response && response.length > 0 ? response[0].id : '';
          return clientId;
        }
      )
    );
  }
  /**
   * Checks if a user has access to an application.
   * @param {?} userId ID of the user
   * @param {?} applicationName Name of the application
   * @return {?} True if the user has access, false otherwise
   */
  checkUserHasApplicationAccess(userId, applicationName) {
    return this.getClientIdByApplicationName(applicationName).pipe(
      switchMap(
        /**
         * @param {?} clientId
         * @return {?}
         */
        clientId => {
          return this.checkUserHasClientApp(userId, clientId);
        }
      )
    );
  }
  /**
   * Checks if a user has any application role.
   * @param {?} userId ID of the target user
   * @param {?} applicationName Name of the application
   * @param {?} roleNames List of role names to check for
   * @return {?} True if the user has one or more of the roles, false otherwise
   */
  checkUserHasAnyApplicationRole(userId, applicationName, roleNames) {
    return this.getClientIdByApplicationName(applicationName).pipe(
      switchMap(
        /**
         * @param {?} clientId
         * @return {?}
         */
        clientId => {
          return this.checkUserHasAnyClientAppRole(userId, clientId, roleNames);
        }
      )
    );
  }
  /**
   * Gets details for all users.
   * @return {?} Array of user info objects
   */
  getUsers() {
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          authNames,
          contentTypes,
          accepts,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          return response;
        }
      )
    );
  }
  /**
   * Gets a list of roles for a user.
   * @param {?} userId ID of the user
   * @return {?} Array of role info objects
   */
  getUserRoles(userId) {
    /** @type {?} */
    const url = this.buildRolesUrl(userId);
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          Object,
          null,
          null
        )
    ).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => {
          return response;
        }
      )
    );
  }
  /**
   * Gets an array of users (including the current user) who have any of the roles in the supplied list.
   * @param {?} roleNames List of role names to look for
   * @return {?} Array of user info objects
   */
  getUsersByRolesWithCurrentUser(roleNames) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      const filteredUsers = [];
      if (roleNames && roleNames.length > 0) {
        /** @type {?} */
        const users = yield this.getUsers().toPromise();
        for (let i = 0; i < users.length; i++) {
          /** @type {?} */
          const hasAnyRole = yield this.userHasAnyRole(users[i].id, roleNames);
          if (hasAnyRole) {
            filteredUsers.push(users[i]);
          }
        }
      }
      return filteredUsers;
    });
  }
  /**
   * Gets an array of users (not including the current user) who have any of the roles in the supplied list.
   * @param {?} roleNames List of role names to look for
   * @return {?} Array of user info objects
   */
  getUsersByRolesWithoutCurrentUser(roleNames) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      const filteredUsers = [];
      if (roleNames && roleNames.length > 0) {
        /** @type {?} */
        const currentUser = this.getCurrentUserInfo();
        /** @type {?} */
        let users = yield this.getUsers().toPromise();
        users = users.filter(
          /**
           * @param {?} user
           * @return {?}
           */
          user => {
            return user.username !== currentUser.username;
          }
        );
        for (let i = 0; i < users.length; i++) {
          /** @type {?} */
          const hasAnyRole = yield this.userHasAnyRole(users[i].id, roleNames);
          if (hasAnyRole) {
            filteredUsers.push(users[i]);
          }
        }
      }
      return filteredUsers;
    });
  }
  /**
   * @private
   * @param {?} userId
   * @param {?} roleNames
   * @return {?}
   */
  userHasAnyRole(userId, roleNames) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      const userRoles = yield this.getUserRoles(userId).toPromise();
      /** @type {?} */
      const hasAnyRole = roleNames.some(
        /**
         * @param {?} roleName
         * @return {?}
         */
        (roleName => {
          /** @type {?} */
          const filteredRoles = userRoles.filter(
            /**
             * @param {?} userRole
             * @return {?}
             */
            (userRole => {
              return (
                userRole.name.toLocaleLowerCase() ===
                roleName.toLocaleLowerCase()
              );
            })
          );
          return filteredRoles.length > 0;
        })
      );
      return hasAnyRole;
    });
  }
  /**
   * Checks if a user has one of the roles from a list.
   * @param {?} userId ID of the target user
   * @param {?} roleNames Array of roles to check for
   * @return {?} True if the user has one of the roles, false otherwise
   */
  checkUserHasRole(userId, roleNames) {
    return this.getUserRoles(userId).pipe(
      map(
        /**
         * @param {?} userRoles
         * @return {?}
         */
        userRoles => {
          /** @type {?} */
          let hasRole = false;
          if (userRoles && userRoles.length > 0) {
            roleNames.forEach(
              /**
               * @param {?} roleName
               * @return {?}
               */
              roleName => {
                /** @type {?} */
                const role = userRoles.find(
                  /**
                   * @param {?} userRole
                   * @return {?}
                   */
                  (userRole => {
                    return roleName === userRole.name;
                  })
                );
                if (role) {
                  hasRole = true;
                  return;
                }
              }
            );
          }
          return hasRole;
        }
      )
    );
  }
  /**
   * Gets details for all users.
   * @param {?} requestQuery
   * @return {?} Array of user information objects.
   */
  queryUsers(requestQuery) {
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = { first: requestQuery.first, max: requestQuery.max };
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    return this.getTotalUsersCount().pipe(
      switchMap(
        /**
         * @param {?} totalCount
         * @return {?}
         */
        totalCount =>
          from(
            this.alfrescoApiService
              .getInstance()
              .oauth2Auth.callCustomApi(
                url,
                httpMethod,
                pathParams,
                queryParams,
                headerParams,
                formParams,
                bodyParam,
                authNames,
                contentTypes,
                null,
                null,
                null
              )
          ).pipe(
            map(
              /**
               * @param {?} response
               * @return {?}
               */
              response => {
                return /** @type {?} */ ({
                  entries: response,
                  pagination: {
                    skipCount: requestQuery.first,
                    maxItems: requestQuery.max,
                    count: totalCount,
                    hasMoreItems: false,
                    totalItems: totalCount
                  }
                });
              }
            ),
            catchError(
              /**
               * @param {?} error
               * @return {?}
               */
              error => this.handleError(error)
            )
          )
      )
    );
  }
  /**
   * Gets users total count.
   * @return {?} Number of users count.
   */
  getTotalUsersCount() {
    /** @type {?} */
    const url = this.buildUserUrl() + `/count`;
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          'GET',
          null,
          null,
          null,
          null,
          null,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Creates new user.
   * @param {?} newUser Object containing the new user details.
   * @return {?} Empty response when the user created.
   */
  createUser(newUser) {
    /** @type {?} */
    const url = this.buildUserUrl();
    /** @type {?} */
    const request = JSON.stringify(newUser);
    /** @type {?} */
    const httpMethod = 'POST';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Updates user details.
   * @param {?} userId Id of the user.
   * @param {?} updatedUser Object containing the user details.
   * @return {?} Empty response when the user updated.
   */
  updateUser(userId, updatedUser) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId;
    /** @type {?} */
    const request = JSON.stringify(updatedUser);
    /** @type {?} */
    const httpMethod = 'PUT';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Deletes User.
   * @param {?} userId Id of the  user.
   * @return {?} Empty response when the user deleted.
   */
  deleteUser(userId) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId;
    /** @type {?} */
    const httpMethod = 'DELETE';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Changes user password.
   * @param {?} userId Id of the user.
   * @param {?} newPassword
   * @return {?} Empty response when the password changed.
   */
  changePassword(userId, newPassword) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/reset-password';
    /** @type {?} */
    const request = JSON.stringify(newPassword);
    /** @type {?} */
    const httpMethod = 'PUT';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Gets involved groups.
   * @param {?} userId Id of the user.
   * @return {?} Array of involved groups information objects.
   */
  getInvolvedGroups(userId) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/groups/';
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = { id: userId };
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          authNames,
          contentTypes,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Joins group.
   * @param {?} joinGroupRequest Details of join group request (IdentityJoinGroupRequestModel).
   * @return {?} Empty response when the user joined the group.
   */
  joinGroup(joinGroupRequest) {
    /** @type {?} */
    const url =
      this.buildUserUrl() +
      '/' +
      joinGroupRequest.userId +
      '/groups/' +
      joinGroupRequest.groupId;
    /** @type {?} */
    const request = JSON.stringify(joinGroupRequest);
    /** @type {?} */
    const httpMethod = 'PUT';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Leaves group.
   * @param {?} userId Id of the user.
   * @param {?} groupId Id of the  group.
   * @return {?} Empty response when the user left the group.
   */
  leaveGroup(userId, groupId) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/groups/' + groupId;
    /** @type {?} */
    const httpMethod = 'DELETE';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Gets available roles
   * @param {?} userId Id of the user.
   * @return {?} Array of available roles information objects
   */
  getAvailableRoles(userId) {
    /** @type {?} */
    const url =
      this.buildUserUrl() + '/' + userId + '/role-mappings/realm/available';
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          authNames,
          contentTypes,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Gets assigned roles.
   * @param {?} userId Id of the user.
   * @return {?} Array of assigned roles information objects
   */
  getAssignedRoles(userId) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = { id: userId };
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          authNames,
          contentTypes,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Gets effective roles.
   * @param {?} userId Id of the user.
   * @return {?} Array of composite roles information objects
   */
  getEffectiveRoles(userId) {
    /** @type {?} */
    const url =
      this.buildUserUrl() + '/' + userId + '/role-mappings/realm/composite';
    /** @type {?} */
    const httpMethod = 'GET';
    /** @type {?} */
    const pathParams = { id: userId };
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = {};
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const authNames = [];
    /** @type {?} */
    const contentTypes = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          authNames,
          contentTypes,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Assigns roles to the user.
   * @param {?} userId Id of the user.
   * @param {?} roles Array of roles.
   * @return {?} Empty response when the role assigned.
   */
  assignRoles(userId, roles) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
    /** @type {?} */
    const request = JSON.stringify(roles);
    /** @type {?} */
    const httpMethod = 'POST';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * Removes assigned roles.
   * @param {?} userId Id of the user.
   * @param {?} removedRoles
   * @return {?} Empty response when the role removed.
   */
  removeRoles(userId, removedRoles) {
    /** @type {?} */
    const url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
    /** @type {?} */
    const request = JSON.stringify(removedRoles);
    /** @type {?} */
    const httpMethod = 'DELETE';
    /** @type {?} */
    const pathParams = {};
    /** @type {?} */
    const queryParams = {};
    /** @type {?} */
    const bodyParam = request;
    /** @type {?} */
    const headerParams = {};
    /** @type {?} */
    const formParams = {};
    /** @type {?} */
    const contentTypes = ['application/json'];
    /** @type {?} */
    const accepts = ['application/json'];
    return from(
      this.alfrescoApiService
        .getInstance()
        .oauth2Auth.callCustomApi(
          url,
          httpMethod,
          pathParams,
          queryParams,
          headerParams,
          formParams,
          bodyParam,
          contentTypes,
          accepts,
          null,
          null,
          null
        )
    ).pipe(
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => this.handleError(error)
      )
    );
  }
  /**
   * @private
   * @return {?}
   */
  buildUserUrl() {
    return `${this.appConfigService.get('identityHost')}/users`;
  }
  /**
   * @private
   * @param {?} userId
   * @param {?} clientId
   * @return {?}
   */
  buildUserClientRoleMapping(userId, clientId) {
    return `${this.appConfigService.get(
      'identityHost'
    )}/users/${userId}/role-mappings/clients/${clientId}/composite`;
  }
  /**
   * @private
   * @param {?} userId
   * @return {?}
   */
  buildRolesUrl(userId) {
    return `${this.appConfigService.get(
      'identityHost'
    )}/users/${userId}/role-mappings/realm/composite`;
  }
  /**
   * @private
   * @return {?}
   */
  buildGetClientsUrl() {
    return `${this.appConfigService.get('identityHost')}/clients`;
  }
  /**
   * Throw the error
   * @private
   * @param {?} error
   * @return {?}
   */
  handleError(error) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }
}
IdentityUserService.decorators = [
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
IdentityUserService.ctorParameters = () => [
  { type: JwtHelperService },
  { type: AlfrescoApiService },
  { type: AppConfigService },
  { type: LogService }
];
/** @nocollapse */ IdentityUserService.ngInjectableDef = i0.defineInjectable({
  factory: function IdentityUserService_Factory() {
    return new IdentityUserService(
      i0.inject(i1.JwtHelperService),
      i0.inject(i2.AlfrescoApiService),
      i0.inject(i3.AppConfigService),
      i0.inject(i4.LogService)
    );
  },
  token: IdentityUserService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  IdentityUserService.prototype.jwtHelperService;
  /**
   * @type {?}
   * @private
   */
  IdentityUserService.prototype.alfrescoApiService;
  /**
   * @type {?}
   * @private
   */
  IdentityUserService.prototype.appConfigService;
  /**
   * @type {?}
   * @private
   */
  IdentityUserService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHktdXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvaWRlbnRpdHktdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUlwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7QUFFM0MsK0NBSUM7OztJQUZHLDRDQUE2Qjs7SUFDN0IsK0NBQXVCOzs7OztBQUczQiwrQ0FJQzs7O0lBSEcseUNBQWM7O0lBQ2QsMENBQWU7O0lBQ2YsOENBQW9COzs7OztBQUd4Qix3REFHQzs7O0lBRkcsbURBQWM7O0lBQ2QsaURBQVk7Ozs7O0FBR2hCLG1EQUlDOzs7SUFIRyw4Q0FBYzs7SUFDZCwrQ0FBZTs7SUFDZixnREFBZ0I7O0FBTXBCLE1BQU0sT0FBTyxtQkFBbUI7Ozs7Ozs7SUFFNUIsWUFDWSxnQkFBa0MsRUFDbEMsa0JBQXNDLEVBQ3RDLGdCQUFrQyxFQUNsQyxVQUFzQjtRQUh0QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtR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QU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFVLE1BQU0sZ0NBQWdDLENBQUM7SUFDeEcsQ0FBQzs7Ozs7SUFFTyxrQkFBa0I7UUFDdEIsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUNsRSxDQUFDOzs7Ozs7O0lBTU8sV0FBVyxDQUFDLEtBQWU7UUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsT0FBTyxVQUFVLENBQUMsS0FBSyxJQUFJLGNBQWMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OztZQXJxQkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBNUJRLGdCQUFnQjtZQURoQixrQkFBa0I7WUFKbEIsZ0JBQWdCO1lBTWhCLFVBQVU7Ozs7Ozs7O0lBK0JYLCtDQUEwQzs7Ozs7SUFDMUMsaURBQThDOzs7OztJQUM5QywrQ0FBMEM7Ozs7O0lBQzFDLHlDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9hcHAtY29uZmlnL2FwcC1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBJZGVudGl0eUdyb3VwTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvaWRlbnRpdHktZ3JvdXAubW9kZWwnO1xuaW1wb3J0IHsgSWRlbnRpdHlSb2xlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvaWRlbnRpdHktcm9sZS5tb2RlbCc7XG5pbXBvcnQgeyBJZGVudGl0eVVzZXJNb2RlbCB9IGZyb20gJy4uL21vZGVscy9pZGVudGl0eS11c2VyLm1vZGVsJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4vYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0SGVscGVyU2VydmljZSB9IGZyb20gJy4vand0LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuL2xvZy5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJZGVudGl0eVVzZXJRdWVyeVJlc3BvbnNlIHtcblxuICAgIGVudHJpZXM6IElkZW50aXR5VXNlck1vZGVsW107XG4gICAgcGFnaW5hdGlvbjogUGFnaW5hdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJZGVudGl0eVVzZXJQYXNzd29yZE1vZGVsIHtcbiAgICB0eXBlPzogc3RyaW5nO1xuICAgIHZhbHVlPzogc3RyaW5nO1xuICAgIHRlbXBvcmFyeT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpdHlVc2VyUXVlcnlDbG91ZFJlcXVlc3RNb2RlbCB7XG4gICAgZmlyc3Q6IG51bWJlcjtcbiAgICBtYXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJZGVudGl0eUpvaW5Hcm91cFJlcXVlc3RNb2RlbCB7XG4gICAgcmVhbG06IHN0cmluZztcbiAgICB1c2VySWQ6IHN0cmluZztcbiAgICBncm91cElkOiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgSWRlbnRpdHlVc2VyU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBqd3RIZWxwZXJTZXJ2aWNlOiBKd3RIZWxwZXJTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGFsZnJlc2NvQXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGFwcENvbmZpZ1NlcnZpY2U6IEFwcENvbmZpZ1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgbG9nU2VydmljZTogTG9nU2VydmljZSkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIGFuZCBvdGhlciBiYXNpYyBkZXRhaWxzIG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICogQHJldHVybnMgVGhlIHVzZXIncyBkZXRhaWxzXG4gICAgICovXG4gICAgZ2V0Q3VycmVudFVzZXJJbmZvKCk6IElkZW50aXR5VXNlck1vZGVsIHtcbiAgICAgICAgY29uc3QgZmFtaWx5TmFtZSA9IHRoaXMuand0SGVscGVyU2VydmljZS5nZXRWYWx1ZUZyb21Mb2NhbEFjY2Vzc1Rva2VuPHN0cmluZz4oSnd0SGVscGVyU2VydmljZS5GQU1JTFlfTkFNRSk7XG4gICAgICAgIGNvbnN0IGdpdmVuTmFtZSA9IHRoaXMuand0SGVscGVyU2VydmljZS5nZXRWYWx1ZUZyb21Mb2NhbEFjY2Vzc1Rva2VuPHN0cmluZz4oSnd0SGVscGVyU2VydmljZS5HSVZFTl9OQU1FKTtcbiAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLmp3dEhlbHBlclNlcnZpY2UuZ2V0VmFsdWVGcm9tTG9jYWxBY2Nlc3NUb2tlbjxzdHJpbmc+KEp3dEhlbHBlclNlcnZpY2UuVVNFUl9FTUFJTCk7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gdGhpcy5qd3RIZWxwZXJTZXJ2aWNlLmdldFZhbHVlRnJvbUxvY2FsQWNjZXNzVG9rZW48c3RyaW5nPihKd3RIZWxwZXJTZXJ2aWNlLlVTRVJfUFJFRkVSUkVEX1VTRVJOQU1FKTtcbiAgICAgICAgcmV0dXJuIHsgZmlyc3ROYW1lOiBnaXZlbk5hbWUsIGxhc3ROYW1lOiBmYW1pbHlOYW1lLCBlbWFpbDogZW1haWwsIHVzZXJuYW1lOiB1c2VybmFtZSB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgdXNlcnMgYmFzZWQgb24gc2VhcmNoIGlucHV0LlxuICAgICAqIEBwYXJhbSBzZWFyY2ggU2VhcmNoIHF1ZXJ5IHN0cmluZ1xuICAgICAqIEByZXR1cm5zIExpc3Qgb2YgdXNlcnNcbiAgICAgKi9cbiAgICBmaW5kVXNlcnNCeU5hbWUoc2VhcmNoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPElkZW50aXR5VXNlck1vZGVsW10+IHtcbiAgICAgICAgaWYgKHNlYXJjaCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihbXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0ge30sIHF1ZXJ5UGFyYW1zID0geyBzZWFyY2g6IHNlYXJjaCB9LCBib2R5UGFyYW0gPSB7fSwgaGVhZGVyUGFyYW1zID0ge30sXG4gICAgICAgICAgICBmb3JtUGFyYW1zID0ge30sIGNvbnRlbnRUeXBlcyA9IFsnYXBwbGljYXRpb24vanNvbiddLCBhY2NlcHRzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgICAgaGVhZGVyUGFyYW1zLCBmb3JtUGFyYW1zLCBib2R5UGFyYW0sXG4gICAgICAgICAgICBjb250ZW50VHlwZXMsIGFjY2VwdHMsIE9iamVjdCwgbnVsbCwgbnVsbClcbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogW10pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UubWFwKCAodXNlcjogSWRlbnRpdHlVc2VyTW9kZWwpID0+ICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IHVzZXIuaWQsIGZpcnN0TmFtZTogdXNlci5maXJzdE5hbWUsICBsYXN0TmFtZTogdXNlci5sYXN0TmFtZSwgZW1haWw6IHVzZXIuZW1haWwsIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCB1c2VycyBiYXNlZCBvbiB1c2VybmFtZSBpbnB1dC5cbiAgICAgKiBAcGFyYW0gdXNlcm5hbWUgU2VhcmNoIHF1ZXJ5IHN0cmluZ1xuICAgICAqIEByZXR1cm5zIExpc3Qgb2YgdXNlcnNcbiAgICAgKi9cbiAgICBmaW5kVXNlckJ5VXNlcm5hbWUodXNlcm5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8SWRlbnRpdHlVc2VyTW9kZWxbXT4ge1xuICAgICAgICBpZiAodXNlcm5hbWUgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gb2YoW10pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCk7XG4gICAgICAgIGNvbnN0IGh0dHBNZXRob2QgPSAnR0VUJywgcGF0aFBhcmFtcyA9IHt9LCBxdWVyeVBhcmFtcyA9IHsgdXNlcm5hbWU6IHVzZXJuYW1lIH0sIGJvZHlQYXJhbSA9IHt9LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgICAgIGZvcm1QYXJhbXMgPSB7fSwgY29udGVudFR5cGVzID0gWydhcHBsaWNhdGlvbi9qc29uJ10sIGFjY2VwdHMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgYWNjZXB0cywgT2JqZWN0LCBudWxsLCBudWxsKVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBbXSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5tYXAoICh1c2VyOiBJZGVudGl0eVVzZXJNb2RlbCkgPT4gIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogdXNlci5pZCwgZmlyc3ROYW1lOiB1c2VyLmZpcnN0TmFtZSwgIGxhc3ROYW1lOiB1c2VyLmxhc3ROYW1lLCBlbWFpbDogdXNlci5lbWFpbCwgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWV9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHVzZXJzIGJhc2VkIG9uIGVtYWlsIGlucHV0LlxuICAgICAqIEBwYXJhbSBlbWFpbCBTZWFyY2ggcXVlcnkgc3RyaW5nXG4gICAgICogQHJldHVybnMgTGlzdCBvZiB1c2Vyc1xuICAgICAqL1xuICAgIGZpbmRVc2VyQnlFbWFpbChlbWFpbDogc3RyaW5nKTogT2JzZXJ2YWJsZTxJZGVudGl0eVVzZXJNb2RlbFtdPiB7XG4gICAgICAgIGlmIChlbWFpbCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihbXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0ge30sIHF1ZXJ5UGFyYW1zID0geyBlbWFpbDogZW1haWwgfSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLFxuICAgICAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBPYmplY3QsIG51bGwsIG51bGwpXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IFtdKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLm1hcCggKHVzZXI6IElkZW50aXR5VXNlck1vZGVsKSA9PiAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiB1c2VyLmlkLCBmaXJzdE5hbWU6IHVzZXIuZmlyc3ROYW1lLCAgbGFzdE5hbWU6IHVzZXIubGFzdE5hbWUsIGVtYWlsOiB1c2VyLmVtYWlsLCB1c2VybmFtZTogdXNlci51c2VybmFtZX07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgdXNlcnMgYmFzZWQgb24gaWQgaW5wdXQuXG4gICAgICogQHBhcmFtIGlkIFNlYXJjaCBxdWVyeSBzdHJpbmdcbiAgICAgKiBAcmV0dXJucyB1c2VycyBvYmplY3RcbiAgICAgKi9cbiAgICBmaW5kVXNlckJ5SWQoaWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGlmIChpZCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihbXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKSArICcvJyArIGlkO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ0dFVCcsIHBhdGhQYXJhbXMgPSB7fSwgcXVlcnlQYXJhbXMgPSB7fSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiAoZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgYWNjZXB0cywgT2JqZWN0LCBudWxsLCBudWxsKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY2xpZW50IHJvbGVzIG9mIGEgdXNlciBmb3IgYSBwYXJ0aWN1bGFyIGNsaWVudC5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElEIG9mIHRoZSB0YXJnZXQgdXNlclxuICAgICAqIEBwYXJhbSBjbGllbnRJZCBJRCBvZiB0aGUgY2xpZW50IGFwcFxuICAgICAqIEByZXR1cm5zIExpc3Qgb2YgY2xpZW50IHJvbGVzXG4gICAgICovXG4gICAgZ2V0Q2xpZW50Um9sZXModXNlcklkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueVtdPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyQ2xpZW50Um9sZU1hcHBpbmcodXNlcklkLCBjbGllbnRJZCk7XG4gICAgICAgIGNvbnN0IGh0dHBNZXRob2QgPSAnR0VUJywgcGF0aFBhcmFtcyA9IHt9LCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSB7fSwgaGVhZGVyUGFyYW1zID0ge30sXG4gICAgICAgICAgICBmb3JtUGFyYW1zID0ge30sIGNvbnRlbnRUeXBlcyA9IFsnYXBwbGljYXRpb24vanNvbiddLCBhY2NlcHRzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgICAgaGVhZGVyUGFyYW1zLCBmb3JtUGFyYW1zLCBib2R5UGFyYW0sXG4gICAgICAgICAgICBjb250ZW50VHlwZXMsIGFjY2VwdHMsIE9iamVjdCwgbnVsbCwgbnVsbClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB1c2VyIGhhcyBhY2Nlc3MgdG8gYSBjbGllbnQgYXBwLlxuICAgICAqIEBwYXJhbSB1c2VySWQgSUQgb2YgdGhlIHRhcmdldCB1c2VyXG4gICAgICogQHBhcmFtIGNsaWVudElkIElEIG9mIHRoZSBjbGllbnQgYXBwXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgYWNjZXNzLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBjaGVja1VzZXJIYXNDbGllbnRBcHAodXNlcklkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50Um9sZXModXNlcklkLCBjbGllbnRJZCkucGlwZShcbiAgICAgICAgICAgIG1hcCgoY2xpZW50Um9sZXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNsaWVudFJvbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSB1c2VyIGhhcyBhbnkgb2YgdGhlIGNsaWVudCBhcHAgcm9sZXMuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJRCBvZiB0aGUgdGFyZ2V0IHVzZXJcbiAgICAgKiBAcGFyYW0gY2xpZW50SWQgSUQgb2YgdGhlIGNsaWVudCBhcHBcbiAgICAgKiBAcGFyYW0gcm9sZU5hbWVzIExpc3Qgb2Ygcm9sZSBuYW1lcyB0byBjaGVjayBmb3JcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBvbmUgb3IgbW9yZSBvZiB0aGUgcm9sZXMsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGNoZWNrVXNlckhhc0FueUNsaWVudEFwcFJvbGUodXNlcklkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcsIHJvbGVOYW1lczogc3RyaW5nW10pOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50Um9sZXModXNlcklkLCBjbGllbnRJZCkucGlwZShcbiAgICAgICAgICAgIG1hcCgoY2xpZW50Um9sZXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGhhc1JvbGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoY2xpZW50Um9sZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByb2xlTmFtZXMuZm9yRWFjaCgocm9sZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvbGUgPSBjbGllbnRSb2xlcy5maW5kKChhdmFpbGFibGVSb2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF2YWlsYWJsZVJvbGUubmFtZSA9PT0gcm9sZU5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNSb2xlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaGFzUm9sZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY2xpZW50IElEIGZvciBhbiBhcHBsaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0gYXBwbGljYXRpb25OYW1lIE5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAgICogQHJldHVybnMgQ2xpZW50IElEIHN0cmluZ1xuICAgICAqL1xuICAgIGdldENsaWVudElkQnlBcHBsaWNhdGlvbk5hbWUoYXBwbGljYXRpb25OYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkR2V0Q2xpZW50c1VybCgpO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ0dFVCcsIHBhdGhQYXJhbXMgPSB7fSwgcXVlcnlQYXJhbXMgPSB7IGNsaWVudElkOiBhcHBsaWNhdGlvbk5hbWUgfSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LCBmb3JtUGFyYW1zID0ge30sXG4gICAgICAgICAgICBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsIGhlYWRlclBhcmFtcyxcbiAgICAgICAgICAgICAgICBmb3JtUGFyYW1zLCBib2R5UGFyYW0sIGNvbnRlbnRUeXBlcyxcbiAgICAgICAgICAgICAgICBhY2NlcHRzLCBPYmplY3QsIG51bGwsIG51bGwpXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xpZW50SWQgPSByZXNwb25zZSAmJiByZXNwb25zZS5sZW5ndGggPiAwID8gcmVzcG9uc2VbMF0uaWQgOiAnJztcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50SWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhIHVzZXIgaGFzIGFjY2VzcyB0byBhbiBhcHBsaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElEIG9mIHRoZSB1c2VyXG4gICAgICogQHBhcmFtIGFwcGxpY2F0aW9uTmFtZSBOYW1lIG9mIHRoZSBhcHBsaWNhdGlvblxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGFjY2VzcywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgY2hlY2tVc2VySGFzQXBwbGljYXRpb25BY2Nlc3ModXNlcklkOiBzdHJpbmcsIGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudElkQnlBcHBsaWNhdGlvbk5hbWUoYXBwbGljYXRpb25OYW1lKS5waXBlKFxuICAgICAgICAgICAgc3dpdGNoTWFwKChjbGllbnRJZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tVc2VySGFzQ2xpZW50QXBwKHVzZXJJZCwgY2xpZW50SWQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSB1c2VyIGhhcyBhbnkgYXBwbGljYXRpb24gcm9sZS5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElEIG9mIHRoZSB0YXJnZXQgdXNlclxuICAgICAqIEBwYXJhbSBhcHBsaWNhdGlvbk5hbWUgTmFtZSBvZiB0aGUgYXBwbGljYXRpb25cbiAgICAgKiBAcGFyYW0gcm9sZU5hbWVzIExpc3Qgb2Ygcm9sZSBuYW1lcyB0byBjaGVjayBmb3JcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBvbmUgb3IgbW9yZSBvZiB0aGUgcm9sZXMsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGNoZWNrVXNlckhhc0FueUFwcGxpY2F0aW9uUm9sZSh1c2VySWQ6IHN0cmluZywgYXBwbGljYXRpb25OYW1lOiBzdHJpbmcsIHJvbGVOYW1lczogc3RyaW5nW10pOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50SWRCeUFwcGxpY2F0aW9uTmFtZShhcHBsaWNhdGlvbk5hbWUpLnBpcGUoXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKGNsaWVudElkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja1VzZXJIYXNBbnlDbGllbnRBcHBSb2xlKHVzZXJJZCwgY2xpZW50SWQsIHJvbGVOYW1lcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgZGV0YWlscyBmb3IgYWxsIHVzZXJzLlxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIHVzZXIgaW5mbyBvYmplY3RzXG4gICAgICovXG4gICAgZ2V0VXNlcnMoKTogT2JzZXJ2YWJsZTxJZGVudGl0eVVzZXJNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCk7XG4gICAgICAgIGNvbnN0IGh0dHBNZXRob2QgPSAnR0VUJywgcGF0aFBhcmFtcyA9IHt9LCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSB7fSwgaGVhZGVyUGFyYW1zID0ge30sXG4gICAgICAgICAgICBmb3JtUGFyYW1zID0ge30sIGF1dGhOYW1lcyA9IFtdLCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLCBhdXRoTmFtZXMsXG4gICAgICAgICAgICBjb250ZW50VHlwZXMsIGFjY2VwdHMsIG51bGwsIG51bGwpXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IElkZW50aXR5VXNlck1vZGVsW10pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIHJvbGVzIGZvciBhIHVzZXIuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJRCBvZiB0aGUgdXNlclxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIHJvbGUgaW5mbyBvYmplY3RzXG4gICAgICovXG4gICAgZ2V0VXNlclJvbGVzKHVzZXJJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxJZGVudGl0eVJvbGVNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRSb2xlc1VybCh1c2VySWQpO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ0dFVCcsIHBhdGhQYXJhbXMgPSB7fSwgcXVlcnlQYXJhbXMgPSB7fSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLFxuICAgICAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBPYmplY3QsIG51bGwsIG51bGwpXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IElkZW50aXR5Um9sZU1vZGVsW10pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYW4gYXJyYXkgb2YgdXNlcnMgKGluY2x1ZGluZyB0aGUgY3VycmVudCB1c2VyKSB3aG8gaGF2ZSBhbnkgb2YgdGhlIHJvbGVzIGluIHRoZSBzdXBwbGllZCBsaXN0LlxuICAgICAqIEBwYXJhbSByb2xlTmFtZXMgTGlzdCBvZiByb2xlIG5hbWVzIHRvIGxvb2sgZm9yXG4gICAgICogQHJldHVybnMgQXJyYXkgb2YgdXNlciBpbmZvIG9iamVjdHNcbiAgICAgKi9cbiAgICBhc3luYyBnZXRVc2Vyc0J5Um9sZXNXaXRoQ3VycmVudFVzZXIocm9sZU5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8SWRlbnRpdHlVc2VyTW9kZWxbXT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZFVzZXJzOiBJZGVudGl0eVVzZXJNb2RlbFtdID0gW107XG4gICAgICAgIGlmIChyb2xlTmFtZXMgJiYgcm9sZU5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgdGhpcy5nZXRVc2VycygpLnRvUHJvbWlzZSgpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzQW55Um9sZSA9IGF3YWl0IHRoaXMudXNlckhhc0FueVJvbGUodXNlcnNbaV0uaWQsIHJvbGVOYW1lcyk7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0FueVJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5wdXNoKHVzZXJzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRVc2VycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IG9mIHVzZXJzIChub3QgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHVzZXIpIHdobyBoYXZlIGFueSBvZiB0aGUgcm9sZXMgaW4gdGhlIHN1cHBsaWVkIGxpc3QuXG4gICAgICogQHBhcmFtIHJvbGVOYW1lcyBMaXN0IG9mIHJvbGUgbmFtZXMgdG8gbG9vayBmb3JcbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiB1c2VyIGluZm8gb2JqZWN0c1xuICAgICAqL1xuICAgIGFzeW5jIGdldFVzZXJzQnlSb2xlc1dpdGhvdXRDdXJyZW50VXNlcihyb2xlTmFtZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxJZGVudGl0eVVzZXJNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkVXNlcnM6IElkZW50aXR5VXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgaWYgKHJvbGVOYW1lcyAmJiByb2xlTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFVzZXIgPSB0aGlzLmdldEN1cnJlbnRVc2VySW5mbygpO1xuICAgICAgICAgICAgbGV0IHVzZXJzID0gYXdhaXQgdGhpcy5nZXRVc2VycygpLnRvUHJvbWlzZSgpO1xuXG4gICAgICAgICAgICB1c2VycyA9IHVzZXJzLmZpbHRlcigodXNlcikgPT4geyByZXR1cm4gdXNlci51c2VybmFtZSAhPT0gY3VycmVudFVzZXIudXNlcm5hbWU7IH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzQW55Um9sZSA9IGF3YWl0IHRoaXMudXNlckhhc0FueVJvbGUodXNlcnNbaV0uaWQsIHJvbGVOYW1lcyk7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0FueVJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5wdXNoKHVzZXJzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRVc2VycztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHVzZXJIYXNBbnlSb2xlKHVzZXJJZDogc3RyaW5nLCByb2xlTmFtZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGNvbnN0IHVzZXJSb2xlcyA9IGF3YWl0IHRoaXMuZ2V0VXNlclJvbGVzKHVzZXJJZCkudG9Qcm9taXNlKCk7XG4gICAgICAgIGNvbnN0IGhhc0FueVJvbGUgPSByb2xlTmFtZXMuc29tZSgocm9sZU5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUm9sZXMgPSB1c2VyUm9sZXMuZmlsdGVyKCh1c2VyUm9sZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyUm9sZS5uYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IHJvbGVOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkUm9sZXMubGVuZ3RoID4gMDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGhhc0FueVJvbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgdXNlciBoYXMgb25lIG9mIHRoZSByb2xlcyBmcm9tIGEgbGlzdC5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElEIG9mIHRoZSB0YXJnZXQgdXNlclxuICAgICAqIEBwYXJhbSByb2xlTmFtZXMgQXJyYXkgb2Ygcm9sZXMgdG8gY2hlY2sgZm9yXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgb25lIG9mIHRoZSByb2xlcywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgY2hlY2tVc2VySGFzUm9sZSh1c2VySWQ6IHN0cmluZywgcm9sZU5hbWVzOiBzdHJpbmdbXSk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyUm9sZXModXNlcklkKS5waXBlKG1hcCgodXNlclJvbGVzOiBJZGVudGl0eVJvbGVNb2RlbFtdKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFzUm9sZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHVzZXJSb2xlcyAmJiB1c2VyUm9sZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJvbGVOYW1lcy5mb3JFYWNoKChyb2xlTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvbGUgPSB1c2VyUm9sZXMuZmluZCgodXNlclJvbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb2xlTmFtZSA9PT0gdXNlclJvbGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNSb2xlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhc1JvbGU7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGRldGFpbHMgZm9yIGFsbCB1c2Vycy5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiB1c2VyIGluZm9ybWF0aW9uIG9iamVjdHMuXG4gICAgICovXG4gICAgcXVlcnlVc2VycyhyZXF1ZXN0UXVlcnk6IElkZW50aXR5VXNlclF1ZXJ5Q2xvdWRSZXF1ZXN0TW9kZWwpOiBPYnNlcnZhYmxlPElkZW50aXR5VXNlclF1ZXJ5UmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0ge30sXG4gICAgICAgIHF1ZXJ5UGFyYW1zID0geyBmaXJzdDogcmVxdWVzdFF1ZXJ5LmZpcnN0LCBtYXg6IHJlcXVlc3RRdWVyeS5tYXggfSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICBmb3JtUGFyYW1zID0ge30sIGF1dGhOYW1lcyA9IFtdLCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbFVzZXJzQ291bnQoKS5waXBlKFxuICAgICAgICAgICAgICAgIHN3aXRjaE1hcCgodG90YWxDb3VudDogYW55KSA9PlxuICAgICAgICAgICAgICAgIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgICAgICAgICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLCBhdXRoTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgbnVsbCwgbnVsbCwgbnVsbClcbiAgICAgICAgICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IElkZW50aXR5VXNlck1vZGVsW10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8SWRlbnRpdHlVc2VyUXVlcnlSZXNwb25zZT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJpZXM6IHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXBDb3VudDogcmVxdWVzdFF1ZXJ5LmZpcnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SXRlbXM6IHJlcXVlc3RRdWVyeS5tYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdG90YWxDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc01vcmVJdGVtczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEl0ZW1zOiB0b3RhbENvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdXNlcnMgdG90YWwgY291bnQuXG4gICAgICogQHJldHVybnMgTnVtYmVyIG9mIHVzZXJzIGNvdW50LlxuICAgICAqL1xuICAgIGdldFRvdGFsVXNlcnNDb3VudCgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXNlclVybCgpICsgYC9jb3VudGA7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlcyA9IFsnYXBwbGljYXRpb24vanNvbiddLCBhY2NlcHRzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkodXJsLCAnR0VUJyxcbiAgICAgICAgICAgICAgbnVsbCwgbnVsbCwgbnVsbCxcbiAgICAgICAgICAgICAgbnVsbCwgbnVsbCwgY29udGVudFR5cGVzLFxuICAgICAgICAgICAgICBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIG5ldyB1c2VyLlxuICAgICAqIEBwYXJhbSBuZXdVc2VyIE9iamVjdCBjb250YWluaW5nIHRoZSBuZXcgdXNlciBkZXRhaWxzLlxuICAgICAqIEByZXR1cm5zIEVtcHR5IHJlc3BvbnNlIHdoZW4gdGhlIHVzZXIgY3JlYXRlZC5cbiAgICAgKi9cbiAgICBjcmVhdGVVc2VyKG5ld1VzZXI6IElkZW50aXR5VXNlck1vZGVsKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IEpTT04uc3RyaW5naWZ5KG5ld1VzZXIpO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ1BPU1QnLCBwYXRoUGFyYW1zID0ge30sIHF1ZXJ5UGFyYW1zID0ge30sIGJvZHlQYXJhbSA9IHJlcXVlc3QsIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICBmb3JtUGFyYW1zID0ge30sIGNvbnRlbnRUeXBlcyA9IFsnYXBwbGljYXRpb24vanNvbiddLCBhY2NlcHRzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20oXG4gICAgICAgICAgICB0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgYWNjZXB0cywgbnVsbCwgbnVsbCwgbnVsbFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgKS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHVzZXIgZGV0YWlscy5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElkIG9mIHRoZSB1c2VyLlxuICAgICAqIEBwYXJhbSB1cGRhdGVkVXNlciBPYmplY3QgY29udGFpbmluZyB0aGUgdXNlciBkZXRhaWxzLlxuICAgICAqIEByZXR1cm5zIEVtcHR5IHJlc3BvbnNlIHdoZW4gdGhlIHVzZXIgdXBkYXRlZC5cbiAgICAgKi9cbiAgICB1cGRhdGVVc2VyKHVzZXJJZDogc3RyaW5nLCB1cGRhdGVkVXNlcjogSWRlbnRpdHlVc2VyTW9kZWwpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXNlclVybCgpICsgJy8nICsgdXNlcklkO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkodXBkYXRlZFVzZXIpO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ1BVVCcsIHBhdGhQYXJhbXMgPSB7fSAsIHF1ZXJ5UGFyYW1zID0ge30sIGJvZHlQYXJhbSA9IHJlcXVlc3QsIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICBmb3JtUGFyYW1zID0ge30sIGNvbnRlbnRUeXBlcyA9IFsnYXBwbGljYXRpb24vanNvbiddLCBhY2NlcHRzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLFxuICAgICAgICBjb250ZW50VHlwZXMsIGFjY2VwdHMsIG51bGwsIG51bGwsIG51bGxcbiAgICAgICAgKSkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycm9yKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIFVzZXIuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJZCBvZiB0aGUgIHVzZXIuXG4gICAgICogQHJldHVybnMgRW1wdHkgcmVzcG9uc2Ugd2hlbiB0aGUgdXNlciBkZWxldGVkLlxuICAgICAqL1xuICAgIGRlbGV0ZVVzZXIodXNlcklkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXNlclVybCgpICsgJy8nICsgdXNlcklkO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ0RFTEVURScsIHBhdGhQYXJhbXMgPSB7fSAsIHF1ZXJ5UGFyYW1zID0ge30sIGJvZHlQYXJhbSA9IHt9LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB1c2VyIHBhc3N3b3JkLlxuICAgICAqIEBwYXJhbSB1c2VySWQgSWQgb2YgdGhlIHVzZXIuXG4gICAgICogQHBhcmFtIGNyZWRlbnRpYWxzIERldGFpbHMgb2YgdXNlciBDcmVkZW50aWFscy5cbiAgICAgKiBAcmV0dXJucyBFbXB0eSByZXNwb25zZSB3aGVuIHRoZSBwYXNzd29yZCBjaGFuZ2VkLlxuICAgICAqL1xuICAgIGNoYW5nZVBhc3N3b3JkKHVzZXJJZDogc3RyaW5nLCBuZXdQYXNzd29yZDogSWRlbnRpdHlVc2VyUGFzc3dvcmRNb2RlbCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL3Jlc2V0LXBhc3N3b3JkJztcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IEpTT04uc3RyaW5naWZ5KG5ld1Bhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdQVVQnLCBwYXRoUGFyYW1zID0ge30gLCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSByZXF1ZXN0LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBpbnZvbHZlZCBncm91cHMuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJZCBvZiB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBpbnZvbHZlZCBncm91cHMgaW5mb3JtYXRpb24gb2JqZWN0cy5cbiAgICAgKi9cbiAgICBnZXRJbnZvbHZlZEdyb3Vwcyh1c2VySWQ6IHN0cmluZyk6IE9ic2VydmFibGU8SWRlbnRpdHlHcm91cE1vZGVsW10+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVzZXJVcmwoKSArICcvJyArIHVzZXJJZCArICcvZ3JvdXBzLyc7XG4gICAgICAgIGNvbnN0IGh0dHBNZXRob2QgPSAnR0VUJywgcGF0aFBhcmFtcyA9IHsgaWQ6IHVzZXJJZH0sXG4gICAgICAgIHF1ZXJ5UGFyYW1zID0ge30sIGJvZHlQYXJhbSA9IHt9LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBhdXRoTmFtZXMgPSBbXSwgY29udGVudFR5cGVzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgICAgICAgICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLCBhdXRoTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgbnVsbCwgbnVsbCwgbnVsbFxuICAgICAgICAgICAgICAgICAgICApKS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEpvaW5zIGdyb3VwLlxuICAgICAqIEBwYXJhbSBqb2luR3JvdXBSZXF1ZXN0IERldGFpbHMgb2Ygam9pbiBncm91cCByZXF1ZXN0IChJZGVudGl0eUpvaW5Hcm91cFJlcXVlc3RNb2RlbCkuXG4gICAgICogQHJldHVybnMgRW1wdHkgcmVzcG9uc2Ugd2hlbiB0aGUgdXNlciBqb2luZWQgdGhlIGdyb3VwLlxuICAgICAqL1xuICAgIGpvaW5Hcm91cChqb2luR3JvdXBSZXF1ZXN0OiBJZGVudGl0eUpvaW5Hcm91cFJlcXVlc3RNb2RlbCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyBqb2luR3JvdXBSZXF1ZXN0LnVzZXJJZCArICcvZ3JvdXBzLycgKyBqb2luR3JvdXBSZXF1ZXN0Lmdyb3VwSWQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBKU09OLnN0cmluZ2lmeShqb2luR3JvdXBSZXF1ZXN0KTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdQVVQnLCBwYXRoUGFyYW1zID0ge30gLCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSByZXF1ZXN0LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVhdmVzIGdyb3VwLlxuICAgICAqIEBwYXJhbSB1c2VySWQgSWQgb2YgdGhlIHVzZXIuXG4gICAgICogQHBhcmFtIGdyb3VwSWQgSWQgb2YgdGhlICBncm91cC5cbiAgICAgKiBAcmV0dXJucyBFbXB0eSByZXNwb25zZSB3aGVuIHRoZSB1c2VyIGxlZnQgdGhlIGdyb3VwLlxuICAgICAqL1xuICAgIGxlYXZlR3JvdXAodXNlcklkOiBhbnksIGdyb3VwSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL2dyb3Vwcy8nICsgZ3JvdXBJZDtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdERUxFVEUnLCBwYXRoUGFyYW1zID0ge30gLCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSB7fSwgaGVhZGVyUGFyYW1zID0ge30sXG4gICAgICAgIGZvcm1QYXJhbXMgPSB7fSwgY29udGVudFR5cGVzID0gWydhcHBsaWNhdGlvbi9qc29uJ10sIGFjY2VwdHMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgaGVhZGVyUGFyYW1zLCBmb3JtUGFyYW1zLCBib2R5UGFyYW0sXG4gICAgICAgIGNvbnRlbnRUeXBlcywgYWNjZXB0cywgbnVsbCwgbnVsbCwgbnVsbFxuICAgICAgICApKS5waXBlKFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYXZhaWxhYmxlIHJvbGVzXG4gICAgICogQHBhcmFtIHVzZXJJZCBJZCBvZiB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBhdmFpbGFibGUgcm9sZXMgaW5mb3JtYXRpb24gb2JqZWN0c1xuICAgICAqL1xuICAgIGdldEF2YWlsYWJsZVJvbGVzKHVzZXJJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxJZGVudGl0eVJvbGVNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL3JvbGUtbWFwcGluZ3MvcmVhbG0vYXZhaWxhYmxlJztcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0ge30sXG4gICAgICAgIHF1ZXJ5UGFyYW1zID0ge30sIGJvZHlQYXJhbSA9IHt9LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBhdXRoTmFtZXMgPSBbXSwgY29udGVudFR5cGVzID0gWydhcHBsaWNhdGlvbi9qc29uJ107XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5vYXV0aDJBdXRoLmNhbGxDdXN0b21BcGkoXG4gICAgICAgICAgICAgICAgICAgIHVybCwgaHR0cE1ldGhvZCwgcGF0aFBhcmFtcywgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclBhcmFtcywgZm9ybVBhcmFtcywgYm9keVBhcmFtLCBhdXRoTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlcywgbnVsbCwgbnVsbCwgbnVsbFxuICAgICAgICAgICAgICAgICAgICApKS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYXNzaWduZWQgcm9sZXMuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJZCBvZiB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBhc3NpZ25lZCByb2xlcyBpbmZvcm1hdGlvbiBvYmplY3RzXG4gICAgICovXG4gICAgZ2V0QXNzaWduZWRSb2xlcyh1c2VySWQ6IHN0cmluZyk6IE9ic2VydmFibGU8SWRlbnRpdHlSb2xlTW9kZWxbXT4ge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXNlclVybCgpICsgJy8nICsgdXNlcklkICsgJy9yb2xlLW1hcHBpbmdzL3JlYWxtJztcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0geyBpZDogdXNlcklkfSxcbiAgICAgICAgcXVlcnlQYXJhbXMgPSB7fSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICBmb3JtUGFyYW1zID0ge30sIGF1dGhOYW1lcyA9IFtdLCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgICAgICAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyUGFyYW1zLCBmb3JtUGFyYW1zLCBib2R5UGFyYW0sIGF1dGhOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICAgICAgICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBlZmZlY3RpdmUgcm9sZXMuXG4gICAgICogQHBhcmFtIHVzZXJJZCBJZCBvZiB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBjb21wb3NpdGUgcm9sZXMgaW5mb3JtYXRpb24gb2JqZWN0c1xuICAgICAqL1xuICAgIGdldEVmZmVjdGl2ZVJvbGVzKHVzZXJJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxJZGVudGl0eVJvbGVNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL3JvbGUtbWFwcGluZ3MvcmVhbG0vY29tcG9zaXRlJztcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdHRVQnLCBwYXRoUGFyYW1zID0geyBpZDogdXNlcklkfSxcbiAgICAgICAgcXVlcnlQYXJhbXMgPSB7fSwgYm9keVBhcmFtID0ge30sIGhlYWRlclBhcmFtcyA9IHt9LFxuICAgICAgICBmb3JtUGFyYW1zID0ge30sIGF1dGhOYW1lcyA9IFtdLCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm9hdXRoMkF1dGguY2FsbEN1c3RvbUFwaShcbiAgICAgICAgICAgICAgICAgICAgdXJsLCBodHRwTWV0aG9kLCBwYXRoUGFyYW1zLCBxdWVyeVBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyUGFyYW1zLCBmb3JtUGFyYW1zLCBib2R5UGFyYW0sIGF1dGhOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICAgICAgICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzaWducyByb2xlcyB0byB0aGUgdXNlci5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElkIG9mIHRoZSB1c2VyLlxuICAgICAqIEBwYXJhbSByb2xlcyBBcnJheSBvZiByb2xlcy5cbiAgICAgKiBAcmV0dXJucyBFbXB0eSByZXNwb25zZSB3aGVuIHRoZSByb2xlIGFzc2lnbmVkLlxuICAgICAqL1xuICAgIGFzc2lnblJvbGVzKHVzZXJJZDogc3RyaW5nLCByb2xlczogSWRlbnRpdHlSb2xlTW9kZWxbXSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL3JvbGUtbWFwcGluZ3MvcmVhbG0nO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkocm9sZXMpO1xuICAgICAgICBjb25zdCBodHRwTWV0aG9kID0gJ1BPU1QnLCBwYXRoUGFyYW1zID0ge30gLCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSByZXF1ZXN0LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhc3NpZ25lZCByb2xlcy5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElkIG9mIHRoZSB1c2VyLlxuICAgICAqIEBwYXJhbSByb2xlcyBBcnJheSBvZiByb2xlcy5cbiAgICAgKiBAcmV0dXJucyBFbXB0eSByZXNwb25zZSB3aGVuIHRoZSByb2xlIHJlbW92ZWQuXG4gICAgICovXG4gICAgcmVtb3ZlUm9sZXModXNlcklkOiBzdHJpbmcsIHJlbW92ZWRSb2xlczogSWRlbnRpdHlSb2xlTW9kZWxbXSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVc2VyVXJsKCkgKyAnLycgKyB1c2VySWQgKyAnL3JvbGUtbWFwcGluZ3MvcmVhbG0nO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5zdHJpbmdpZnkocmVtb3ZlZFJvbGVzKTtcbiAgICAgICAgY29uc3QgaHR0cE1ldGhvZCA9ICdERUxFVEUnLCBwYXRoUGFyYW1zID0ge30gLCBxdWVyeVBhcmFtcyA9IHt9LCBib2R5UGFyYW0gPSByZXF1ZXN0LCBoZWFkZXJQYXJhbXMgPSB7fSxcbiAgICAgICAgZm9ybVBhcmFtcyA9IHt9LCBjb250ZW50VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2pzb24nXSwgYWNjZXB0cyA9IFsnYXBwbGljYXRpb24vanNvbiddO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkub2F1dGgyQXV0aC5jYWxsQ3VzdG9tQXBpKFxuICAgICAgICB1cmwsIGh0dHBNZXRob2QsIHBhdGhQYXJhbXMsIHF1ZXJ5UGFyYW1zLFxuICAgICAgICBoZWFkZXJQYXJhbXMsIGZvcm1QYXJhbXMsIGJvZHlQYXJhbSxcbiAgICAgICAgY29udGVudFR5cGVzLCBhY2NlcHRzLCBudWxsLCBudWxsLCBudWxsXG4gICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFVzZXJVcmwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYXBwQ29uZmlnU2VydmljZS5nZXQoJ2lkZW50aXR5SG9zdCcpfS91c2Vyc2A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFVzZXJDbGllbnRSb2xlTWFwcGluZyh1c2VySWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0KCdpZGVudGl0eUhvc3QnKX0vdXNlcnMvJHt1c2VySWR9L3JvbGUtbWFwcGluZ3MvY2xpZW50cy8ke2NsaWVudElkfS9jb21wb3NpdGVgO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRSb2xlc1VybCh1c2VySWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0KCdpZGVudGl0eUhvc3QnKX0vdXNlcnMvJHt1c2VySWR9L3JvbGUtbWFwcGluZ3MvcmVhbG0vY29tcG9zaXRlYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJ1aWxkR2V0Q2xpZW50c1VybCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5hcHBDb25maWdTZXJ2aWNlLmdldCgnaWRlbnRpdHlIb3N0Jyl9L2NsaWVudHNgO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IHRoZSBlcnJvclxuICAgICAqIEBwYXJhbSBlcnJvclxuICAgICAqL1xuICAgIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3I6IFJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMubG9nU2VydmljZS5lcnJvcihlcnJvcik7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcbiAgICB9XG59XG4iXX0=
