/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { SecurityGroup,
  SecurityGroupEntry,
  SecurityGroupPaging,
  SecurityGroupsApi,
  SecurityMark,
  SecurityMarkEntry,
  SecurityMarkPaging,
  SecurityMarksApi,
  NodeSecurityMarksApi,
  NodeSecurityMarkBody} from '@alfresco/js-api';
import { SecurityGroupResponse } from './security-group-response.interface';
import { SecurityMarkResponse } from './security-mark-response.interface';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';

const DEFAULT_INCLUDE = 'inUse';

@Injectable({ providedIn: 'root' })
export class SecurityMarksService {
  private securityGroup: SecurityGroupsApi;
  private securityMark: SecurityMarksApi;
  private nodeSecurityMark: NodeSecurityMarksApi;
  private mapOfSecurityGroupAndMark = new Map<SecurityGroup, SecurityMark[]>();

  constructor(
    private apiService: AlfrescoApiService
  ) {}

  get nodeMarksApi() {
    return (
        this.nodeSecurityMark ||
        (this.nodeSecurityMark = new NodeSecurityMarksApi(
            this.apiService.getInstance()
        ))
    );
  }

  get groupsApi() {
    return (
        this.securityGroup ||
        (this.securityGroup = new SecurityGroupsApi(
            this.apiService.getInstance()
        ))
    );
  }

  get securityDataMap(){
    this.getSecurityGroup()
        .then((data) =>
          this.getSecurityMarks(data.entries));

    return this.mapOfSecurityGroupAndMark;
  }

  getSecurityMarks(groups : SecurityGroup[]){
    this.mapOfSecurityGroupAndMark.clear();
    groups.forEach(
      group =>
        this.getSecurityMark(group.id)
          .then(marks => {
            this.mapOfSecurityGroupAndMark.set(group, marks.entries)})
    );
  }

  get marksApi() {
    return (
        this.securityMark ||
        (this.securityMark = new SecurityMarksApi(
            this.apiService.getInstance()
        ))
    );
  }

  getSecurityGroup(): Promise<SecurityGroupResponse> {
    let securityGroupResponse: SecurityGroupResponse;
    return new Promise((resolve, reject) => {
        this.groupsApi
            .getSecurityGroups({
              DEFAULT_INCLUDE
            })
            .then((response: SecurityGroupPaging) => {
                        securityGroupResponse = {
                          entries: response.list.entries.map(
                            (group: SecurityGroupEntry) => group.entry)
                        }
                resolve(securityGroupResponse);
            })
            .catch((error) => {
                reject(error);
            });
    });
  }

  getSecurityMark(
    SecurityGroupId: string,
    include = DEFAULT_INCLUDE
  ): Promise<SecurityMarkResponse> {
    let securityMarkResponse: SecurityMarkResponse;
    return new Promise((resolve, reject) => {
      this.marksApi
          .getSecurityMarks(SecurityGroupId, {
              include
          })
          .then((response: SecurityMarkPaging) => {
                  securityMarkResponse = {
                      entries: response.list.entries.map(
                        (mark: SecurityMarkEntry) => mark.entry)
                  }
                  resolve(securityMarkResponse);
          })
          .catch((error) => {
              reject(error);
          });
    });
  }

  onSave(nodeId: string, array: Array<NodeSecurityMarkBody>) {
    return new Promise((resolve, reject) => {
      this.nodeMarksApi
          .manageSecurityMarksOnNode(nodeId, array)
          .then(response => {
            resolve(response);
          })
          .catch((error) => {
              reject(error);
          });
    });
  }

  getNodeSecurityMarks(nodeId: string,
    include = DEFAULT_INCLUDE): Promise<SecurityMarkResponse>{
    let securityMarkResponse: SecurityMarkResponse;
    return new Promise((resolve, reject) => {
      this.nodeMarksApi
          .getSecurityMarksOnNode(nodeId, {include})
          .then((response: SecurityMarkPaging) => {
            securityMarkResponse = {
              entries: response.list.entries.map(
                (mark: SecurityMarkEntry) => mark.entry)
            }
            resolve(securityMarkResponse);
          })
          .catch((error) => {
              reject(error);
          });
    });
  }
}
