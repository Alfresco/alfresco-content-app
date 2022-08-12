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

import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common'
import {FolderRulesService} from "../services/folder-rules.service";
import {Observable} from "rxjs";
import {Rule} from "../model/rule.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'aca-manage-rules',
  templateUrl: 'manage-rules.smart-component.html'
})
export class ManageRulesSmartComponent implements OnInit {


  rules$: Observable<Rule[]>
  isLoading$: Observable<boolean>
  folderInfo
  folderId = null


  constructor(private location: Location, private folderRulesService: FolderRulesService, private route: ActivatedRoute,) {
  }

  ngOnInit(): void{
    this.route.params.subscribe((params) => {
      this.folderId = params.nodeId;
      if (this.folderId) {
        this.folderRulesService.folderInfo$.subscribe(res => this.folderInfo = res)
        this.folderRulesService.loadRules(this.folderId)
        this.rules$ = this.folderRulesService.rulesListing$
        this.isLoading$ = this.folderRulesService.loading$
      }
    });


  }




  goBack(): void{
    this.location.back()
  }


}
