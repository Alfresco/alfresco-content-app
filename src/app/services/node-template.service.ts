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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateFromTemplateDialogComponent } from '../dialogs/node-template/create-from-template.dialog';
import { Subject, from, of } from 'rxjs';
import { Node, MinimalNode, MinimalNodeEntryEntity, ResultNode, PathElement, SearchApi } from '@alfresco/js-api';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { ContentNodeSelectorComponent, ContentNodeSelectorComponentData, ShareDataRow, NodeAction } from '@alfresco/adf-content-services';

export interface TemplateDialogConfig {
  primaryPathName: string;
  selectionType: string;
}

@Injectable({
  providedIn: 'root'
})
export class NodeTemplateService {
  private currentTemplateConfig: TemplateDialogConfig = null;
  private rootNode: ResultNode;

  _searchApi: SearchApi;
  get searchApi(): SearchApi {
    this._searchApi = this._searchApi ?? new SearchApi(this.alfrescoApiService.getInstance());
    return this._searchApi;
  }

  constructor(
    private store: Store<AppStore>,
    private alfrescoApiService: AlfrescoApiService,
    private translation: TranslationService,
    public dialog: MatDialog
  ) {}

  selectTemplateDialog(config: TemplateDialogConfig): Subject<Node[]> {
    this.currentTemplateConfig = config;

    const select = new Subject<Node[]>();
    select.subscribe({
      complete: this.close.bind(this)
    });

    const data: ContentNodeSelectorComponentData = {
      selectionMode: 'single',
      title: this.title(config.selectionType),
      actionName: NodeAction.NEXT,
      dropdownHideMyFiles: true,
      currentFolderId: null,
      dropdownSiteList: null,
      breadcrumbTransform: this.transformNode.bind(this),
      select,
      showSearch: false,
      showDropdownSiteList: false,
      isSelectionValid: this.isSelectionValid.bind(this),
      rowFilter: this.rowFilter.bind(this)
    };

    const query = {
      query: {
        query: `PATH:"//${config.primaryPathName}"`,
        language: 'afts'
      },
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };

    from(this.searchApi.search(query))
      .pipe(
        switchMap((response) => {
          const entry = response.list.entries[0].entry;
          this.rootNode = entry;
          data.currentFolderId = entry.id;

          return this.dialog
            .open(ContentNodeSelectorComponent, {
              data,
              panelClass: ['adf-content-node-selector-dialog', 'aca-template-node-selector-dialog'],
              width: '630px'
            })
            .afterClosed();
        }),
        catchError((error) => {
          this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC'));
          return of(error);
        })
      )
      .subscribe({ next: () => select.complete() });

    return select;
  }

  createTemplateDialog(node: Node): MatDialogRef<CreateFromTemplateDialogComponent> {
    return this.dialog.open(CreateFromTemplateDialogComponent, {
      data: node,
      panelClass: 'aca-create-from-template-dialog',
      width: '630px'
    });
  }

  private transformNode(node: MinimalNode): MinimalNode {
    if (node && node.path && node.path && node.path.elements instanceof Array) {
      node.path.elements = this.getPathElements(node);
    }
    return node;
  }

  private isSelectionValid(node: Node): boolean {
    if (!node.path.elements.length) {
      return false;
    }

    if (this.currentTemplateConfig.selectionType === 'folder') {
      return node.isFolder;
    }

    return node.isFile;
  }

  private close() {
    this.dialog.closeAll();
  }

  private title(selectionType: string) {
    if (selectionType === 'file') {
      return this.translation.instant('NODE_SELECTOR.SELECT_FILE_TEMPLATE_TITLE');
    }

    return this.translation.instant('NODE_SELECTOR.SELECT_FOLDER_TEMPLATE_TITLE');
  }

  private rowFilter(row: ShareDataRow): boolean {
    const node: MinimalNodeEntryEntity = row.node.entry;
    return node.nodeType !== 'app:filelink' && node.nodeType !== 'app:folderlink';
  }

  private getPathElements(node: Node): PathElement[] {
    return node.path.elements.filter((pathElement) => !this.rootNode.path.elements.some((rootPathElement) => pathElement.id === rootPathElement.id));
  }
}
