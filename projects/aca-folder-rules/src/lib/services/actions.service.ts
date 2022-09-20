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
import { ActionDefinition, ActionParameterDefinition, ActionsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from } from 'rxjs';
import { ActionDefinitionTransformed, ActionParameterDefinitionTransformed } from '../model/rule-action.model';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private actionDefinitionsListingSource = new BehaviorSubject<ActionDefinitionTransformed[]>([]);
  actionDefinitionsListing$ = this.actionDefinitionsListingSource.asObservable();

  private _actionsApi: ActionsApi;
  get actionsApi(): ActionsApi {
    if (!this._actionsApi) {
      this._actionsApi = new ActionsApi(this.apiService.getInstance());
    }
    return this._actionsApi;
  }

  constructor(private apiService: AlfrescoApiService) {}

  loadActionDefinitions() {
    from(this.actionsApi.listActions()).pipe().subscribe(() => {

    });
  }

  transformActionDefinition(obj: ActionDefinition): ActionDefinitionTransformed {
    return {
      id: obj.id,
      name: obj.name ?? '',
      titleKey: '',
      applicableTypes: obj.applicableTypes ?? [],
      trackStatus: obj.trackStatus ?? false,
      parameterDefinitions: (obj.parameterDefinitions ?? []).map((paramDef: ActionParameterDefinition) => this.transformActionParameterDefinition(paramDef))
    }
  }

  transformActionParameterDefinition(obj: ActionParameterDefinition): ActionParameterDefinitionTransformed {
    return {
      name: obj.name ?? '',
      type: obj.type ?? '',
      multiValued: obj.multiValued ?? false,
      mandatory: obj.mandatory ?? false,
      displayLabelKey: ''
    }
  }
}
