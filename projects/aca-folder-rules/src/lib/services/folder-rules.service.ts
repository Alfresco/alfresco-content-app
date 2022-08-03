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

import {Injectable} from "@angular/core";
import {BehaviorSubject, from, Observable} from "rxjs";
import {finalize, map} from "rxjs/operators";
import {Rule} from "../model/rule.model";
import {AlfrescoApiService} from "@alfresco/adf-core";

@Injectable({
  providedIn: 'root'
})

export class FolderRulesService {

  baseUrl = 'https://acadev.envalfresco.com/alfresco/api/-default-/public/alfresco/versions/1'
  nodeId = 'd91aa433-45f0-4c4c-9fb1-89ade91215aa'
  identityHost = ''

  private rulesListingSource = new BehaviorSubject<Partial<Rule>[]>([]);
  rulesListing$: Observable<Partial<Rule>[]> = this.rulesListingSource.asObservable();

  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();

  // private appConfig: AppConfigService second parameter of constructor

  constructor(private apiService: AlfrescoApiService) {

  }

  loadAllRules(nodeId: string = this.nodeId, ruleSetId: string = '-default-'): void {

    from(this.apiService.getInstance().contentClient.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'GET',
      {}, {}, {}, {}, {},
      ['application/json'], ['application/json']))
      .pipe(
        map(res => this.formatRules(res)),
        finalize(() => this.loadingSource.next(false))
      )
      .subscribe(
        res => this.rulesListingSource.next(res),
        err => this.rulesListingSource.error(err)
      )

    this.loadingSource.next(true);


  }

  formatRules(res): Rule[] {
    return res.list.entries.map(entry => this.formatRule(entry.entry));
  }

  formatRule(obj): Rule {
    return {
      id: obj.id,
      name: obj.name ?? '',
      description: obj.description ?? '',
      enabled: obj.enabled ?? true,
      cascade: obj.cascade ?? false,
      asynchronous: obj.asynchronous ?? false,
      errorScript: obj.errorScript ?? '',
      shared: obj.shared ?? false,
      triggers: obj.triggers ?? ['INBOUND'],
      conditions: obj.conditions ?? [],
      actions: obj.actions ?? []
    };
  }

}



