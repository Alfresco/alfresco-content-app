/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  CreateFileFromTemplate,
  TemplateActionTypes,
  getCurrentFolder,
  AppStore,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { CreateFileFromTemplateService } from '../../services/create-file-from-template.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { from, of } from 'rxjs';
import { NodeEntry } from '@alfresco/js-api';

@Injectable()
export class TemplateEffects {
  constructor(
    private content: ContentManagementService,
    private store: Store<AppStore>,
    private apiService: AlfrescoApiService,
    private actions$: Actions,
    private createFileFromTemplateService: CreateFileFromTemplateService
  ) {}

  @Effect({ dispatch: false })
  fileFromTemplate$ = this.actions$.pipe(
    ofType<CreateFileFromTemplate>(TemplateActionTypes.CreateFileFromTemplate),
    map(() => {
      this.createFileFromTemplateService
        .openTemplatesDialog()
        .pipe(
          withLatestFrom(this.store.select(getCurrentFolder)),
          switchMap(([[template], parentNode]) => {
            return from(
              this.apiService
                .getInstance()
                .nodes.copyNode(template.id, { targetParentId: parentNode.id })
            );
          }),
          catchError(error => {
            const { statusCode } = JSON.parse(error.message).error;

            if (statusCode !== 409) {
              this.store.dispatch(
                new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
              );
            }

            return of(null);
          })
        )
        .subscribe((node: NodeEntry | null) => {
          if (node) {
            this.content.reload.next();
          }
        });
    })
  );
}
