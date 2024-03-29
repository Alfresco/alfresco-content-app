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

import { Injectable } from '@angular/core';
import { ActionDefinition, ActionDefinitionEntry, ActionDefinitionList, ActionsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ActionDefinitionTransformed, ActionParameterDefinitionTransformed } from '../model/rule-action.model';
import { ActionParameterConstraint, ConstraintValue } from '../model/action-parameter-constraint.model';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private actionDefinitionsListingSource = new BehaviorSubject<ActionDefinitionTransformed[]>([]);
  actionDefinitionsListing$ = this.actionDefinitionsListingSource.asObservable();
  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();
  private parameterConstraintsSource = new BehaviorSubject<ActionParameterConstraint[]>([]);
  parameterConstraints$: Observable<ActionParameterConstraint[]> = this.parameterConstraintsSource.asObservable();

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

  getParameterConstraints(constraintName): Observable<ConstraintValue[]> {
    return from(
      this.publicApiCall(`/action-parameter-constraints/${constraintName}`, 'GET', [{}, {}, {}, {}, {}, ['application/json'], ['application/json']])
    ).pipe(map((res) => res.entry.constraintValues.map((entry) => this.formatConstraint(entry))));
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
      parameterDefinitions: (obj.parameterDefinitions ?? []).map((paramDef: ActionParameterDefinitionTransformed) =>
        this.transformActionParameterDefinition(paramDef)
      )
    };
  }

  private transformActionParameterDefinition(obj: ActionParameterDefinitionTransformed): ActionParameterDefinitionTransformed {
    return {
      name: obj.name ?? '',
      type: obj.type ?? '',
      multiValued: obj.multiValued ?? false,
      mandatory: obj.mandatory ?? false,
      displayLabel: obj.displayLabel ?? obj.name ?? '',
      parameterConstraintName: obj.parameterConstraintName ?? ''
    };
  }

  private isActionDefinitionEntry(obj): obj is ActionDefinitionEntry {
    return typeof obj.entry !== 'undefined';
  }

  private publicApiCall(path: string, httpMethod: string, params?: any[]): Promise<any> {
    return this.apiService.getInstance().contentClient.callApi(path, httpMethod, ...params);
  }

  private formatConstraint(constraint): ConstraintValue {
    return {
      value: constraint.value ?? '',
      label: constraint.label ?? ''
    };
  }

  loadActionParameterConstraints(actionDefinitions: ActionDefinitionTransformed[]): void {
    of(actionDefinitions)
      .pipe(
        map((actionDefinition) =>
          actionDefinition
            .map((obj) => obj.parameterDefinitions)
            .flat()
            .filter((parameterDefinition) => parameterDefinition.parameterConstraintName.length > 0)
            .map((parameterDefinition) => ({
              name: parameterDefinition.name,
              parameterConstraintName: parameterDefinition.parameterConstraintName,
              constraints: null
            }))
        ),
        switchMap((parameterDefinitions) =>
          forkJoin(
            ...parameterDefinitions.map((parameterDefinition) =>
              this.getParameterConstraints(parameterDefinition.parameterConstraintName).pipe(
                map((constraints) => ({ name: parameterDefinition.name, constraints }))
              )
            )
          )
        )
      )
      .subscribe((res) => this.parameterConstraintsSource.next(res));
  }
}
