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
import { Pagination } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityUserModel } from '../models/identity-user.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { JwtHelperService } from './jwt-helper.service';
import { LogService } from './log.service';
export interface IdentityUserQueryResponse {
  entries: IdentityUserModel[];
  pagination: Pagination;
}
export interface IdentityUserPasswordModel {
  type?: string;
  value?: string;
  temporary?: boolean;
}
export interface IdentityUserQueryCloudRequestModel {
  first: number;
  max: number;
}
export interface IdentityJoinGroupRequestModel {
  realm: string;
  userId: string;
  groupId: string;
}
export declare class IdentityUserService {
  private jwtHelperService;
  private alfrescoApiService;
  private appConfigService;
  private logService;
  constructor(
    jwtHelperService: JwtHelperService,
    alfrescoApiService: AlfrescoApiService,
    appConfigService: AppConfigService,
    logService: LogService
  );
  /**
   * Gets the name and other basic details of the current user.
   * @returns The user's details
   */
  getCurrentUserInfo(): IdentityUserModel;
  /**
   * Find users based on search input.
   * @param search Search query string
   * @returns List of users
   */
  findUsersByName(search: string): Observable<IdentityUserModel[]>;
  /**
   * Find users based on username input.
   * @param username Search query string
   * @returns List of users
   */
  findUserByUsername(username: string): Observable<IdentityUserModel[]>;
  /**
   * Find users based on email input.
   * @param email Search query string
   * @returns List of users
   */
  findUserByEmail(email: string): Observable<IdentityUserModel[]>;
  /**
   * Find users based on id input.
   * @param id Search query string
   * @returns users object
   */
  findUserById(id: string): Observable<any>;
  /**
   * Get client roles of a user for a particular client.
   * @param userId ID of the target user
   * @param clientId ID of the client app
   * @returns List of client roles
   */
  getClientRoles(userId: string, clientId: string): Observable<any[]>;
  /**
   * Checks whether user has access to a client app.
   * @param userId ID of the target user
   * @param clientId ID of the client app
   * @returns True if the user has access, false otherwise
   */
  checkUserHasClientApp(userId: string, clientId: string): Observable<boolean>;
  /**
   * Checks whether a user has any of the client app roles.
   * @param userId ID of the target user
   * @param clientId ID of the client app
   * @param roleNames List of role names to check for
   * @returns True if the user has one or more of the roles, false otherwise
   */
  checkUserHasAnyClientAppRole(
    userId: string,
    clientId: string,
    roleNames: string[]
  ): Observable<boolean>;
  /**
   * Gets the client ID for an application.
   * @param applicationName Name of the application
   * @returns Client ID string
   */
  getClientIdByApplicationName(applicationName: string): Observable<string>;
  /**
   * Checks if a user has access to an application.
   * @param userId ID of the user
   * @param applicationName Name of the application
   * @returns True if the user has access, false otherwise
   */
  checkUserHasApplicationAccess(
    userId: string,
    applicationName: string
  ): Observable<boolean>;
  /**
   * Checks if a user has any application role.
   * @param userId ID of the target user
   * @param applicationName Name of the application
   * @param roleNames List of role names to check for
   * @returns True if the user has one or more of the roles, false otherwise
   */
  checkUserHasAnyApplicationRole(
    userId: string,
    applicationName: string,
    roleNames: string[]
  ): Observable<boolean>;
  /**
   * Gets details for all users.
   * @returns Array of user info objects
   */
  getUsers(): Observable<IdentityUserModel[]>;
  /**
   * Gets a list of roles for a user.
   * @param userId ID of the user
   * @returns Array of role info objects
   */
  getUserRoles(userId: string): Observable<IdentityRoleModel[]>;
  /**
   * Gets an array of users (including the current user) who have any of the roles in the supplied list.
   * @param roleNames List of role names to look for
   * @returns Array of user info objects
   */
  getUsersByRolesWithCurrentUser(
    roleNames: string[]
  ): Promise<IdentityUserModel[]>;
  /**
   * Gets an array of users (not including the current user) who have any of the roles in the supplied list.
   * @param roleNames List of role names to look for
   * @returns Array of user info objects
   */
  getUsersByRolesWithoutCurrentUser(
    roleNames: string[]
  ): Promise<IdentityUserModel[]>;
  private userHasAnyRole;
  /**
   * Checks if a user has one of the roles from a list.
   * @param userId ID of the target user
   * @param roleNames Array of roles to check for
   * @returns True if the user has one of the roles, false otherwise
   */
  checkUserHasRole(userId: string, roleNames: string[]): Observable<boolean>;
  /**
   * Gets details for all users.
   * @returns Array of user information objects.
   */
  queryUsers(
    requestQuery: IdentityUserQueryCloudRequestModel
  ): Observable<IdentityUserQueryResponse>;
  /**
   * Gets users total count.
   * @returns Number of users count.
   */
  getTotalUsersCount(): Observable<number>;
  /**
   * Creates new user.
   * @param newUser Object containing the new user details.
   * @returns Empty response when the user created.
   */
  createUser(newUser: IdentityUserModel): Observable<any>;
  /**
   * Updates user details.
   * @param userId Id of the user.
   * @param updatedUser Object containing the user details.
   * @returns Empty response when the user updated.
   */
  updateUser(userId: string, updatedUser: IdentityUserModel): Observable<any>;
  /**
   * Deletes User.
   * @param userId Id of the  user.
   * @returns Empty response when the user deleted.
   */
  deleteUser(userId: string): Observable<any>;
  /**
   * Changes user password.
   * @param userId Id of the user.
   * @param credentials Details of user Credentials.
   * @returns Empty response when the password changed.
   */
  changePassword(
    userId: string,
    newPassword: IdentityUserPasswordModel
  ): Observable<any>;
  /**
   * Gets involved groups.
   * @param userId Id of the user.
   * @returns Array of involved groups information objects.
   */
  getInvolvedGroups(userId: string): Observable<IdentityGroupModel[]>;
  /**
   * Joins group.
   * @param joinGroupRequest Details of join group request (IdentityJoinGroupRequestModel).
   * @returns Empty response when the user joined the group.
   */
  joinGroup(joinGroupRequest: IdentityJoinGroupRequestModel): Observable<any>;
  /**
   * Leaves group.
   * @param userId Id of the user.
   * @param groupId Id of the  group.
   * @returns Empty response when the user left the group.
   */
  leaveGroup(userId: any, groupId: string): Observable<any>;
  /**
   * Gets available roles
   * @param userId Id of the user.
   * @returns Array of available roles information objects
   */
  getAvailableRoles(userId: string): Observable<IdentityRoleModel[]>;
  /**
   * Gets assigned roles.
   * @param userId Id of the user.
   * @returns Array of assigned roles information objects
   */
  getAssignedRoles(userId: string): Observable<IdentityRoleModel[]>;
  /**
   * Gets effective roles.
   * @param userId Id of the user.
   * @returns Array of composite roles information objects
   */
  getEffectiveRoles(userId: string): Observable<IdentityRoleModel[]>;
  /**
   * Assigns roles to the user.
   * @param userId Id of the user.
   * @param roles Array of roles.
   * @returns Empty response when the role assigned.
   */
  assignRoles(userId: string, roles: IdentityRoleModel[]): Observable<any>;
  /**
   * Removes assigned roles.
   * @param userId Id of the user.
   * @param roles Array of roles.
   * @returns Empty response when the role removed.
   */
  removeRoles(
    userId: string,
    removedRoles: IdentityRoleModel[]
  ): Observable<any>;
  private buildUserUrl;
  private buildUserClientRoleMapping;
  private buildRolesUrl;
  private buildGetClientsUrl;
  /**
   * Throw the error
   * @param error
   */
  private handleError;
}
