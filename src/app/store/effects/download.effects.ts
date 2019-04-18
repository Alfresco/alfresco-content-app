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

import {
  AppStore,
  DownloadNodesAction,
  NodeActionTypes,
  NodeInfo,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { DownloadZipDialogComponent } from '@alfresco/adf-core';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ContentApiService } from '../../services/content-api.service';

@Injectable()
export class DownloadEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private contentApi: ContentApiService,
    private dialog: MatDialog
  ) {}

  @Effect({ dispatch: false })
  downloadNode$ = this.actions$.pipe(
    ofType<DownloadNodesAction>(NodeActionTypes.Download),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.downloadNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.downloadNodes(selection.nodes);
            }
          });
      }
    })
  );

  private downloadNodes(toDownload: Array<MinimalNodeEntity>) {
    const nodes = toDownload.map(node => {
      const { id, nodeId, name, isFile, isFolder } = <any>node.entry;

      return {
        id: this.isSharedLinkPreview ? id : nodeId || id,
        name,
        isFile,
        isFolder
      };
    });

    if (!nodes || nodes.length === 0) {
      return;
    }

    if (nodes.length === 1) {
      this.downloadNode(nodes[0]);
    } else {
      this.downloadZip(nodes);
    }
  }

  private downloadNode(node: NodeInfo) {
    if (node) {
      if (node.isFolder) {
        this.downloadZip([node]);
      } else {
        this.downloadFile(node);
      }
    }
  }

  private downloadFile(node: NodeInfo) {
    if (node && !this.isSharedLinkPreview) {
      this.download(this.contentApi.getContentUrl(node.id, true), node.name);
    }

    if (node && this.isSharedLinkPreview) {
      this.download(
        this.contentApi.getSharedLinkContent(node.id, false),
        node.name
      );
    }
  }

  private downloadZip(nodes: Array<NodeInfo>) {
    if (nodes && nodes.length > 0) {
      const nodeIds = nodes.map(node => node.id);

      this.dialog.open(DownloadZipDialogComponent, {
        width: '600px',
        disableClose: true,
        data: {
          nodeIds
        }
      });
    }
  }

  private download(url: string, fileName: string) {
    if (url && fileName) {
      const link = document.createElement('a');

      link.style.display = 'none';
      link.download = fileName;
      link.href = url;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private get isSharedLinkPreview() {
    return location.href.includes('/preview/s/');
  }
}
