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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, debounceTime, take, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  FileFromTemplate,
  FolderFromTemplate,
  CreateFromTemplate,
  CreateFromTemplateSuccess,
  TemplateActionTypes,
  getCurrentFolder,
  AppStore,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { NodeTemplateService, TemplateDialogConfig } from '../../services/node-template.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { AppHookService } from '@alfresco/aca-shared';
import { from, Observable, of } from 'rxjs';
import { NodeEntry, NodeBodyUpdate, Node, NodesApi } from '@alfresco/js-api';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class TemplateEffects {
  _nodesApi: NodesApi;
  get nodesApi(): NodesApi {
    this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
    return this._nodesApi;
  }

  constructor(
    private matDialog: MatDialog,
    private appHookService: AppHookService,
    private store: Store<AppStore>,
    private apiService: AlfrescoApiService,
    private actions$: Actions,
    private nodeTemplateService: NodeTemplateService
  ) {}

  @Effect({ dispatch: false })
  fileFromTemplate$ = this.actions$.pipe(
    ofType<FileFromTemplate>(TemplateActionTypes.FileFromTemplate),
    map(() => {
      this.openDialog({
        primaryPathName: 'app:node_templates',
        selectionType: 'file'
      });
    })
  );

  @Effect({ dispatch: false })
  folderFromTemplate$ = this.actions$.pipe(
    ofType<FolderFromTemplate>(TemplateActionTypes.FolderFromTemplate),
    map(() =>
      this.openDialog({
        primaryPathName: 'app:space_templates',
        selectionType: 'folder'
      })
    )
  );

  @Effect({ dispatch: false })
  createFromTemplate$ = this.actions$.pipe(
    ofType<CreateFromTemplate>(TemplateActionTypes.CreateFromTemplate),
    map((action) => {
      this.store
        .select(getCurrentFolder)
        .pipe(
          switchMap((folder) => this.copyNode(action.payload, folder.id)),
          take(1)
        )
        .subscribe((node: NodeEntry | null) => {
          if (node) {
            this.store.dispatch(new CreateFromTemplateSuccess(node.entry));
          }
        });
    })
  );

  @Effect({ dispatch: false })
  createFromTemplateSuccess$ = this.actions$.pipe(
    ofType<CreateFromTemplateSuccess>(TemplateActionTypes.CreateFromTemplateSuccess),
    map((payload) => {
      this.matDialog.closeAll();
      this.appHookService.reload.next(payload.node);
    })
  );

  private openDialog(config: TemplateDialogConfig) {
    this.nodeTemplateService
      .selectTemplateDialog(config)
      .pipe(debounceTime(300))
      .subscribe(([node]) => this.nodeTemplateService.createTemplateDialog(node));
  }

  private copyNode(source: Node, parentId: string): Observable<NodeEntry> {
    return from(
      this.nodesApi.copyNode(source.id, {
        targetParentId: parentId,
        name: source.name
      })
    ).pipe(
      switchMap((node) =>
        this.updateNode(node, {
          properties: {
            'cm:title': source.properties['cm:title'],
            'cm:description': source.properties['cm:description']
          }
        })
      ),
      catchError((error) => this.handleError(error))
    );
  }

  private updateNode(node: NodeEntry, update: NodeBodyUpdate): Observable<NodeEntry> {
    return from(this.nodesApi.updateNode(node.entry.id, update)).pipe(catchError(() => of(node)));
  }

  private handleError(error: Error): Observable<null> {
    let statusCode: number;

    try {
      statusCode = JSON.parse(error.message).error.statusCode;
    } catch (e) {
      statusCode = null;
    }

    if (statusCode !== 409) {
      this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC'));
    } else {
      this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.CONFLICT'));
    }

    return of(null);
  }
}
