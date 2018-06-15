import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DownloadNodesAction, DOWNLOAD_NODES } from '../actions';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { DownloadZipDialogComponent } from '@alfresco/adf-content-services';
import { NodeInfo } from '../models';

@Injectable()
export class DownloadEffects {
    constructor(
        private actions$: Actions,
        private apiService: AlfrescoApiService,
        private dialog: MatDialog
    ) {}

    @Effect({ dispatch: false })
    downloadNode$ = this.actions$.pipe(
      ofType<DownloadNodesAction>(DOWNLOAD_NODES),
      map(action => {
          if (action.payload && action.payload.length > 0) {
            this.downloadNodes(action.payload);
          }
      })
    );

    private downloadNodes(nodes: Array<NodeInfo>) {
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
        if (node) {
            this.download(
                this.apiService.contentApi.getContentUrl(node.id, true),
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
}
