/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
  UploadApi
} from '@alfresco/js-api';

import { users } from '../page-objects';

import { logger } from '@alfresco/adf-cli/scripts/logger';
import { ActionTypes, Rule } from './rules-api';

export interface AcaBackend {
  sites: SitesApi;
  upload: UploadApi;
  nodes: NodesApi;

  tearDown(): Promise<any>;
}

const config = {
  authType: process.env.APP_CONFIG_AUTH_TYPE,
  hostBpm: process.env.APP_CONFIG_BPM_HOST,
  hostEcm: process.env.APP_CONFIG_ECM_HOST,
  provider: process.env.APP_CONFIG_PROVIDER,
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

  constructor() {
    this.alfrescoApi = new AlfrescoApi(config);
  }

  public async setUpAcaBackend(userProfile: keyof typeof users): Promise<AcaBackend> {
    await this.login(userProfile);

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

    return this;
  }

  async tearDown() {
    await this.alfrescoApi.logout();
    return this;
  }

  private callApi(path: string, httpMethod: string, body: object = {}): Promise<any> {
    // APIs used by this service are still private and not yet available for public use
    const params = [{}, {}, {}, {}, body, ['application/json'], ['application/json']];
    return this.alfrescoApi.contentPrivateClient.callApi(path, httpMethod, ...params);
  }

  async createRule(nodeId: string, rule: Partial<Rule>, ruleSetId: string = '-default-'): Promise<Rule> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'POST', { ...rule });
    return response.entry;
  }

  async createRandomRule(folderId: string, ruleName: string): Promise<Rule> {
    const response = await this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: [ActionTypes.ADDFEATURES.value, ActionTypes.CHECKIN.value]
    });
    return response;
  }

  async login(userProfile: keyof typeof users) {
    const userToLog =
      users[
        Object.keys(users)
          .filter((user) => user.match(new RegExp(`^${userProfile.toString()}$`)))
          .toString()
      ] || userProfile;
    let e: any;

    try {
      e = await this.alfrescoApi.login(userToLog.username, userToLog.password);
    } catch (error) {
      logger.error(`[API Client Factory] Log in user ${userToLog.username} failed ${e}`);
      throw error;
    }
  }
}
