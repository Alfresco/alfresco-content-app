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
  /*
    this map stores the security group/s and mark/s
    which are available for that particular user
  */
  availableGroupAndMarkMap = new Map<SecurityGroup, SecurityMark[]>();

  /*
    this map stores the security group/s and mark/s
    which are assigned on that specific node
    key : security group id
    value : Set<security mark id>
  */
  assignedGroupAndMarkOnNodeMap = new Map<string, Set<string>>();

  /*
    this map stores the security group/s and mark/s on
    which the user has clicked to add or remove the
    security mark
    key : security group id
    value : Map<security mark id, NodeSecurityMarkBody>
  */
  newlySelectedGroupAndMarkMap = new Map<string, Map<string, NodeSecurityMarkBody>>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SecurityMarksDialogData,
    private securityMarksService: SecurityMarksService,
    private dialogRef: MatDialogRef<SecurityMarksDialogComponent>
  ) {}

  ngOnInit(){
    this.getDialogData();
    this.getSecurityMarksAssignedOnNode();
  }

  handleCancel() {
    this.availableGroupAndMarkMap.clear();
    this.newlySelectedGroupAndMarkMap.clear();
    this.assignedGroupAndMarkOnNodeMap.clear();
  }

  getDialogData(){
    this.availableGroupAndMarkMap = this.securityMarksService.securityDataMap;
  }

  /*
    this method is called whenever user clicks on the security
    marks in the dialog box. This method further compares the data with
    the already assigned security marks map (assignedGroupAndMarkOnNodeMap)
    and then decide whether to add or remove that mark from that node
  */
  manageSecurityMarksList(securityMarkId: string, securityGroupId: string){
    let securityMarkMap: Map<string, NodeSecurityMarkBody> =
      this.newlySelectedGroupAndMarkMap.get(securityGroupId);

    if(securityMarkMap != null && securityMarkMap.has(securityMarkId)){
      this.sameSecurityMarkSelectedEventHandler(
        securityMarkMap, securityMarkId, securityGroupId);
    }
    else {
      securityMarkMap = securityMarkMap == null ?
        new Map<string, NodeSecurityMarkBody>() : securityMarkMap;

        this.manageSecurityMarkEventHandler(
          securityMarkMap, securityMarkId, securityGroupId);
    }
  }

  private sameSecurityMarkSelectedEventHandler(
    securityMarkMap: Map<string, NodeSecurityMarkBody>,
    securityMarkId: string, securityGroupId: string) {

    securityMarkMap.delete(securityMarkId);

    if(this.newlySelectedGroupAndMarkMap.get(securityGroupId)?.size == 0){
      this.newlySelectedGroupAndMarkMap.delete(securityGroupId);
    }
  }

  private manageSecurityMarkEventHandler(
    securityMarkMap: Map<string, NodeSecurityMarkBody>,
    securityMarkId: string, securityGroupId: string) {

    if(this.assignedGroupAndMarkOnNodeMap.get(securityGroupId)?.has(securityMarkId)) {
      this.setPayloadBasedOnOperation(securityMarkMap,
        securityMarkId, securityGroupId, 'REMOVE');
    }
    else {
      this.setPayloadBasedOnOperation(securityMarkMap,
        securityMarkId, securityGroupId, 'ADD');
    }

    this.newlySelectedGroupAndMarkMap.set(securityGroupId, securityMarkMap);
  }

  private setPayloadBasedOnOperation(
    securityMarkMap: Map<string, NodeSecurityMarkBody>,
    securityMarkId: string, securityGroupId: string,
    operation: string) {

    securityMarkMap.set(securityMarkId,
      {id: securityMarkId, groupId: securityGroupId,
        op: operation} as NodeSecurityMarkBody);
  }

  onSave() {
    var array: Array<NodeSecurityMarkBody> = [];
    this.newlySelectedGroupAndMarkMap.forEach(function(value){
      value.forEach((securityMarkBody: NodeSecurityMarkBody) =>
        array.push(securityMarkBody))
      });

    if(array.length > 0){
      this.securityMarksService.onSave(this.data.nodeId, array);
    }

    this.dialogRef.close();
  }

  getSecurityMarksAssignedOnNode(){
    this.assignedGroupAndMarkOnNodeMap.clear();
    this.securityMarksService
      .getNodeSecurityMarks(this.data.nodeId)
      .then((securityMarkResponse: SecurityMarkResponse) => {
        securityMarkResponse.entries
          .forEach((securityMark: SecurityMark) => {
            let securityMarkSet: Set<string>
              = this.assignedGroupAndMarkOnNodeMap.get(securityMark.groupId);
            securityMarkSet = (securityMarkSet == null || securityMarkSet.size == 0)
                ? new Set<string>() : securityMarkSet;
            securityMarkSet.add(securityMark.id);
            this.assignedGroupAndMarkOnNodeMap.set(securityMark.groupId, securityMarkSet);
          })
    });
  }

  /*
    this method decides the background color of
    the security mark/s like for assigned marks,
    unassigned marks, selected marks to add/remove
  */
  setBackgroundColorForSecurityMark(
    securityMarkId: string, securityGroupId: string): string{

    if(this.newlySelectedGroupAndMarkMap.get(securityGroupId)?.has(securityMarkId)){
      return 'selectedMarks';
    }
    else if(this.assignedGroupAndMarkOnNodeMap.get(securityGroupId)?.has(securityMarkId)){
      return 'assignedMarks';
    }
    return 'unAssignedMarks';
  }

  isSaveButtonDisabled(): boolean{
    return this.newlySelectedGroupAndMarkMap.size == 0;
  }
}
