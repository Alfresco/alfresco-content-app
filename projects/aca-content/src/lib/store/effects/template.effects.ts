/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { catchError, debounceTime, map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  AppStore,
  CreateFromTemplate,
  CreateFromTemplateSuccess,
  FileFromTemplate,
  FolderFromTemplate,
  getCurrentFolder,
  TemplateActionTypes
} from '@alfresco/aca-shared/store';
import { NodeTemplateService, TemplateDialogConfig } from '../../services/node-template.service';
import { NotificationService } from '@alfresco/adf-core';
import { from, Observable, of } from 'rxjs';
import { Node, NodeBodyUpdate, NodeEntry, NodesApi } from '@alfresco/js-api';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService, DocumentListService } from '@alfresco/adf-content-services';

@Injectable()
export class TemplateEffects {
  private notificationService = inject(NotificationService);
  private documentListService = inject(DocumentListService);

  private _nodesApi: NodesApi;
  get nodesApi(): NodesApi {
    this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
    return this._nodesApi;
  }

  matDialog = inject(MatDialog);
  store = inject(Store<AppStore>);
  apiService = inject(AlfrescoApiService);
  actions$ = inject(Actions);
  nodeTemplateService = inject(NodeTemplateService);

  fileFromTemplate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<FileFromTemplate>(TemplateActionTypes.FileFromTemplate),
        map(() => {
          this.openDialog({
            primaryPathName: 'app:node_templates',
            selectionType: 'file'
          });
        })
      ),
    { dispatch: false }
  );

  folderFromTemplate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<FolderFromTemplate>(TemplateActionTypes.FolderFromTemplate),
        map(() =>
          this.openDialog({
            primaryPathName: 'app:space_templates',
            selectionType: 'folder'
          })
        )
      ),
    { dispatch: false }
  );

  createFromTemplate$ = createEffect(
    () =>
      this.actions$.pipe(
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
      ),
    { dispatch: false }
  );

  createFromTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<CreateFromTemplateSuccess>(TemplateActionTypes.CreateFromTemplateSuccess),
        map((action) => {
          const node = action.node;
          const messageKey = node.isFolder
            ? 'APP.MESSAGES.INFO.NODE_CREATE.FOLDER_FROM_TEMPLATE_SUCCESS'
            : 'APP.MESSAGES.INFO.NODE_CREATE.FILE_FROM_TEMPLATE_SUCCESS';
          this.notificationService.showInfo(messageKey, null, { name: node.name });
          this.matDialog.closeAll();
          this.documentListService.reload();
        })
      ),
    { dispatch: false }
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
      this.notificationService.showError('APP.MESSAGES.ERRORS.GENERIC');
    } else {
      this.notificationService.showError('APP.MESSAGES.ERRORS.CONFLICT');
    }

    return of(null);
  }
}
