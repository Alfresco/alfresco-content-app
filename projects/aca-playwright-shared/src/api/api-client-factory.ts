/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
  AdminTenantsApi,
  AdminUsersApi,
  AlfrescoApi,
  ContentClient,
  GroupsApi,
  NodesApi,
  PeopleApi,
  QueriesApi,
  SearchApi,
  SecurityGroupsApi,
  SecurityMarksApi,
  SitesApi,
  UploadApi,
  SharedlinksApi,
  FavoritesApi,
  TrashcanApi,
  PersonEntry,
  CommentsApi,
  CategoriesApi,
  TagsApi
} from '@alfresco/js-api';
import { users } from '../base-config';
import { Person, PersonModel } from './people-api-models';

export interface AcaBackend {
  sites: SitesApi;
  upload: UploadApi;
  nodes: NodesApi;
  share: SharedlinksApi;
  favorites: FavoritesApi;
  trashCan: TrashcanApi;

  tearDown(): Promise<any>;
}

const { BASE_URL } = process.env;

const config = {
  authType: 'BASIC',
  hostBpm: BASE_URL,
  hostEcm: BASE_URL,
  provider: 'ECM',
  contextRoot: 'alfresco'
};

export class ApiClientFactory {
  public alfrescoApi: AlfrescoApi;
  public sites: SitesApi;
  public upload: UploadApi;
  public nodes: NodesApi;
  public people: PeopleApi;
  public adminUsers: AdminUsersApi;
  public adminTenant: AdminTenantsApi;
  public groups: GroupsApi;
  public queries: QueriesApi;
  public search: SearchApi;
  public securityGroupsApi: SecurityGroupsApi;
  public securityMarksApi: SecurityMarksApi;
  public contentClient: ContentClient;
  public share: SharedlinksApi;
  public favorites: FavoritesApi;
  public trashCan: TrashcanApi;
  public commentsApi: CommentsApi;
  public queriesApi: QueriesApi;
  public categoriesApi: CategoriesApi;
  public tagsApi: TagsApi;
  constructor() {
    this.alfrescoApi = new AlfrescoApi(config);
  }

  public async setUpAcaBackend(userName: string, password?: string): Promise<AcaBackend> {
    await this.login(userName, password);

    this.sites = new SitesApi(this.alfrescoApi);
    this.upload = new UploadApi(this.alfrescoApi);
    this.nodes = new NodesApi(this.alfrescoApi);
    this.people = new PeopleApi(this.alfrescoApi);
    this.adminUsers = new AdminUsersApi(this.alfrescoApi);
    this.adminTenant = new AdminTenantsApi(this.alfrescoApi);
    this.groups = new GroupsApi(this.alfrescoApi);
    this.queries = new QueriesApi(this.alfrescoApi);
    this.search = new SearchApi(this.alfrescoApi);
    this.securityGroupsApi = new SecurityGroupsApi(this.alfrescoApi);
    this.securityMarksApi = new SecurityMarksApi(this.alfrescoApi);
    this.share = new SharedlinksApi(this.alfrescoApi);
    this.favorites = new FavoritesApi(this.alfrescoApi);
    this.trashCan = new TrashcanApi(this.alfrescoApi);
    this.commentsApi = new CommentsApi(this.alfrescoApi);
    this.queriesApi = new QueriesApi(this.alfrescoApi);
    this.categoriesApi = new CategoriesApi(this.alfrescoApi);
    this.tagsApi = new TagsApi(this.alfrescoApi);

    return this;
  }

  async tearDown(): Promise<ApiClientFactory> {
    await this.alfrescoApi.logout();
    return this;
  }

  async login(userName: string, password?: string) {
    const predefinedUserKey = Object.keys(users).find((user) => user === userName || users[user].username === userName);
    const userToLog = predefinedUserKey ? users[predefinedUserKey] : undefined;
    let e: any;

    const user = userToLog?.username ?? userName;
    const userPassword = userToLog?.password ?? password;
    try {
      e = await this.alfrescoApi.login(user, userPassword);
    } catch (error) {
      console.error(`[API Client Factory] Log in user ${user} failed ${e}`);
      throw error;
    }
  }

  async loginUser(user: PersonModel) {
    let e: any;
    try {
      e = await this.alfrescoApi.login(user.username, user.password);
    } catch (error) {
      console.error(`[API Client Factory] Log in user ${user.username} failed ${e}`);
      throw error;
    }
  }

  async createUser(user: PersonModel): Promise<PersonEntry> {
    const person = new Person(user);
    const peopleApi = new PeopleApi(this.alfrescoApi);

    try {
      return peopleApi.createPerson(person);
    } catch (error) {
      console.error('[API Client Factory] createUser failed : ', error);
      return null;
    }
  }

  async changePassword(username: string, newPassword: string): Promise<PersonEntry> {
    const peopleApi = new PeopleApi(this.alfrescoApi);

    try {
      return peopleApi.updatePerson(username, { password: newPassword });
    } catch (error) {
      console.error('[API Client Factory] changePassword failed : ', error);
      return null;
    }
  }
}
