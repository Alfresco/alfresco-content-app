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

import { SecurityGroup, SecurityMark, NodeSecurityMarkBody } from '@alfresco/js-api';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecurityMarkResponse } from './security-mark-response.interface';
import { SecurityMarksService } from './security-marks.service';
export interface SecurityMarksDialogData {
  title: string;
  nodeId: string;
}

@Component({
  templateUrl: './security-marks.dialog.html',
  styleUrls: ['./security-marks.dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityMarksDialogComponent {
  availableGroupAndMarkMap = new Map<SecurityGroup, SecurityMark[]>();
  existingGroupAndMarkOnNodeMap = new Map<string, Map<string, string>>();
  newGroupAndMarkMap = new Map<string, Map<string, NodeSecurityMarkBody>>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SecurityMarksDialogData,
    private securityMarksService: SecurityMarksService,
    private dialogRef: MatDialogRef<SecurityMarksDialogComponent>
  ) {}

  ngOnInit(){
    this.getData();
    this.getSecurityMarksOnNode();
  }

  handleCancel() {
    this.availableGroupAndMarkMap.clear();
    this.newGroupAndMarkMap.clear();
    this.existingGroupAndMarkOnNodeMap.clear();
  }

  getData(){
    this.availableGroupAndMarkMap = this.securityMarksService.securityDataMap;
  }

  manageSecurityMarksList(securityMarkId: string, securityGroupId: string){
    let securityMarkMap: Map<string, NodeSecurityMarkBody> =
      this.newGroupAndMarkMap.get(securityGroupId);

    if(securityMarkMap == null || securityMarkMap.size == 0){
      securityMarkMap = new Map<string, NodeSecurityMarkBody>();
      if(this.existingGroupAndMarkOnNodeMap.get(securityGroupId)?.has(securityMarkId)){
        securityMarkMap.set(securityMarkId,
          {id: securityMarkId, groupId: securityGroupId,
            op: 'REMOVE'} as NodeSecurityMarkBody);
      }
      else{
        securityMarkMap.set(securityMarkId,
          {id: securityMarkId, groupId: securityGroupId,
            op: 'ADD'} as NodeSecurityMarkBody);
      }
      this.newGroupAndMarkMap.set(securityGroupId, securityMarkMap);
    } else {
      if(securityMarkMap.has(securityMarkId)){
        securityMarkMap.delete(securityMarkId);

        if(this.newGroupAndMarkMap.get(securityGroupId)?.size == 0){
          this.newGroupAndMarkMap.delete(securityGroupId);
        }
      }
      else{
        if(this.existingGroupAndMarkOnNodeMap.get(securityGroupId)?.has(securityMarkId)){
          securityMarkMap.set(securityMarkId,
            {id: securityMarkId, groupId: securityGroupId,
              op: 'REMOVE'} as NodeSecurityMarkBody)
          this.newGroupAndMarkMap.set(securityGroupId, securityMarkMap);
        }
        else{
          securityMarkMap.set(securityMarkId,
            {id: securityMarkId, groupId: securityGroupId,
              op: 'ADD'} as NodeSecurityMarkBody)
          this.newGroupAndMarkMap.set(securityGroupId, securityMarkMap);
        }
      }
    }
    console.log(this.existingGroupAndMarkOnNodeMap)
  }

  onSave() {
    var array: Array<NodeSecurityMarkBody> = [];
    this.newGroupAndMarkMap.forEach(function(value){
      value.forEach((securityMarkBody: NodeSecurityMarkBody) =>
        array.push(securityMarkBody))
      });

    if(array.length > 0){
      this.securityMarksService.onSave(this.data.nodeId, array);
    }

    this.dialogRef.close();
  }

  getSecurityMarksOnNode(){
    this.existingGroupAndMarkOnNodeMap.clear();
    this.securityMarksService
      .getNodeSecurityMarks(this.data.nodeId)
      .then((securityMarkResponse: SecurityMarkResponse) => {
        securityMarkResponse.entries
          .forEach((securityMark: SecurityMark) => {
            let securityMarkMap: Map<string, string>
              = this.existingGroupAndMarkOnNodeMap.get(securityMark.groupId);
            securityMarkMap =
              (securityMarkMap == null || securityMarkMap.size == 0)
                ? new Map<string, string>() : securityMarkMap;
            securityMarkMap.set(securityMark.id, securityMark.name);
            this.existingGroupAndMarkOnNodeMap.set(securityMark.groupId, securityMarkMap);
          })
    });
  }

  isSelected(securityMarkId: string, securityGroupId: string): string{
    if(this.newGroupAndMarkMap.get(securityGroupId)?.has(securityMarkId)){
      return 'marksChanged';
    }
    else if(this.existingGroupAndMarkOnNodeMap.get(securityGroupId)?.has(securityMarkId)){
      return 'existingMarks';
    }
    return 'noChange';
  }
}
