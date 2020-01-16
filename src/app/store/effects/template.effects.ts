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
import {
  map,
  switchMap,
  debounceTime,
  flatMap,
  take,
  catchError
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  FileFromTemplate,
  CreateFileFromTemplate,
  TemplateActionTypes,
  getCurrentFolder,
  AppStore,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { CreateFileFromTemplateService } from '../../services/create-file-from-template.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { from, Observable, of } from 'rxjs';
import { NodeEntry, NodeBodyUpdate, Node } from '@alfresco/js-api';
import { CreateFromTemplateDialogService } from '../../dialogs/node-templates/create-from-template-dialog.service';
@Injectable()
export class TemplateEffects {
  constructor(
    private content: ContentManagementService,
    private store: Store<AppStore>,
    private apiService: AlfrescoApiService,
    private actions$: Actions,
    private createFromTemplateDialogService: CreateFromTemplateDialogService,
    private createFileFromTemplateService: CreateFileFromTemplateService
  ) {}

  @Effect({ dispatch: false })
  fileFromTemplate$ = this.actions$.pipe(
    ofType<FileFromTemplate>(TemplateActionTypes.FileFromTemplate),
    map(() => {
      this.createFileFromTemplateService
        .openTemplatesDialog()
        .pipe(
          debounceTime(300),
          flatMap(([node]) =>
            this.createFileFromTemplateService
              .createTemplateDialog(node)
              .afterClosed()
          )
        )
        .subscribe((node: NodeEntry | null) => {
          if (node) {
            this.content.reload.next(node);
          }
        });
    })
  );

  @Effect({ dispatch: false })
  createFileFromTemplate$ = this.actions$.pipe(
    ofType<CreateFileFromTemplate>(TemplateActionTypes.CreateFileFromTemplate),
    map(action => {
      this.store
        .select(getCurrentFolder)
        .pipe(
          switchMap(folder => {
            return this.copyNode(action.payload, folder.id);
          }),
          take(1)
        )
        .subscribe((node: NodeEntry | null) => {
          if (node) {
            this.createFromTemplateDialogService.success$.next(node.entry);
          }
        });
    })
  );

  private copyNode(source: Node, parentId: string): Observable<NodeEntry> {
    return from(
      this.apiService.getInstance().nodes.copyNode(source.id, {
        targetParentId: parentId,
        name: source.name
      })
    ).pipe(
      switchMap(node =>
        this.updateNode(node, {
          properties: {
            'cm:title': source.properties['cm:title'],
            'cm:description': source.properties['cm:description']
          }
        })
      ),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  private updateNode(
    node: NodeEntry,
    update: NodeBodyUpdate
  ): Observable<NodeEntry> {
    return from(
      this.apiService.getInstance().nodes.updateNode(node.entry.id, update)
    ).pipe(catchError(() => of(node)));
  }

  private handleError(error: Error): Observable<null> {
    let statusCode: number;

    try {
      statusCode = JSON.parse(error.message).error.statusCode;
    } catch (e) {
      statusCode = null;
    }

    if (statusCode !== 409) {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
      );
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CONFLICT')
      );
    }

    return of(null);
  }
}
