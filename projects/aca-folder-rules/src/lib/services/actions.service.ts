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

import { Injectable } from '@angular/core';
import { ActionDefinition, ActionDefinitionEntry, ActionDefinitionList, ActionParameterDefinition, ActionsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ActionDefinitionTransformed, ActionParameterDefinitionTransformed } from '../model/rule-action.model';
import { finalize, map } from 'rxjs/operators';
import { Aspect } from '../model/aspect.model';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private actionDefinitionsListingSource = new BehaviorSubject<ActionDefinitionTransformed[]>([]);
  actionDefinitionsListing$ = this.actionDefinitionsListingSource.asObservable();
  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();
  private aspectsSource = new BehaviorSubject<Aspect[]>([]);
  aspects$: Observable<Aspect[]> = this.aspectsSource.asObservable();

  private _actionsApi: ActionsApi;
  get actionsApi(): ActionsApi {
    if (!this._actionsApi) {
      this._actionsApi = new ActionsApi(this.apiService.getInstance());
    }
    return this._actionsApi;
  }

  constructor(private apiService: AlfrescoApiService) {}

  loadActionDefinitions() {
    this.loadingSource.next(true);
    from(this.actionsApi.listActions())
      .pipe(
        map((list: ActionDefinitionList) => list.list.entries.map((entry) => this.transformActionDefinition(entry))),
        finalize(() => this.loadingSource.next(false))
      )
      .subscribe((obj: ActionDefinitionTransformed[]) => {
        this.actionDefinitionsListingSource.next(obj);
      });
  }

  loadAspects(): void {
    from(this.publicApiCall('/action-parameter-constraints/ac-aspects', 'GET', [{}, {}, {}, {}, {}, ['application/json'], ['application/json']]))
      .pipe(map((res) => res.entry.constraintValues.map((entry) => this.formatAspect(entry))))
      .subscribe((res) => {
        this.aspectsSource.next(res);
      });
  }

  private transformActionDefinition(obj: ActionDefinition | ActionDefinitionEntry): ActionDefinitionTransformed {
    if (this.isActionDefinitionEntry(obj)) {
      obj = obj.entry;
    }
    return {
      id: obj.id,
      name: obj.name ?? '',
      description: obj.description ?? '',
      title: obj.title ?? obj.name ?? '',
      applicableTypes: obj.applicableTypes ?? [],
      trackStatus: obj.trackStatus ?? false,
      parameterDefinitions: (obj.parameterDefinitions ?? []).map((paramDef: ActionParameterDefinition) =>
        this.transformActionParameterDefinition(paramDef)
      )
    };
  }

  private transformActionParameterDefinition(obj: ActionParameterDefinition): ActionParameterDefinitionTransformed {
    return {
      name: obj.name ?? '',
      type: obj.type ?? '',
      multiValued: obj.multiValued ?? false,
      mandatory: obj.mandatory ?? false,
      displayLabel: obj.displayLabel ?? obj.name ?? ''
    };
  }

  private isActionDefinitionEntry(obj): obj is ActionDefinitionEntry {
    return typeof obj.entry !== 'undefined';
  }

  private publicApiCall(path: string, httpMethod: string, params?: any[]): Promise<any> {
    return this.apiService.getInstance().contentClient.callApi(path, httpMethod, ...params);
  }

  private formatAspect(aspect): Aspect {
    return {
      value: aspect.value ?? '',
      label: aspect.label ?? ''
    };
  }
}
