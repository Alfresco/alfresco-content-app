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

import { AppHookService, AppSettingsService, ContentApiService, NodePermissionService } from '@alfresco/aca-shared';
import {
  AppStore,
  DeletedNodeInfo,
  DeleteStatus,
  getAppSelection,
  NavigateRouteAction,
  NavigateToParentFolder,
  NodeInfo,
  RefreshPreviewAction,
  SetSelectedNodesAction,
  ShowLoaderAction,
  UnlockWriteAction,
  ViewNodeVersionAction
} from '@alfresco/aca-shared/store';
import {
  DocumentListService,
  FolderDialogComponent,
  LibraryDialogComponent,
  NewVersionUploaderDataAction,
  NewVersionUploaderDialogData,
  NewVersionUploaderService,
  NodeAspectService,
  NodesApiService,
  ShareDialogComponent
} from '@alfresco/adf-content-services';
import { ConfirmDialogComponent, DialogComponent, DialogSize, NotificationService, TranslationService } from '@alfresco/adf-core';
import { DeletedNodesPaging, Node, NodeEntry, PathInfo, SiteBodyCreate, SiteEntry } from '@alfresco/js-api';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { NodeActionsService } from './node-actions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeInformationComponent } from '../dialogs/node-details/node-information.component';

interface RestoredNode {
  status: number;
  entry: Node;
  statusCode?: number;
}

interface SnackbarMessageData {
  key: string;
  params: { [key: string]: any };
  userActionLabel?: string;
  type: 'info' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ContentManagementService {
  private readonly notificationService = inject(NotificationService);
  private readonly nodesApiService = inject(NodesApiService);
  private readonly store = inject(Store<AppStore>);
  private readonly contentApi = inject(ContentApiService);
  private readonly permission = inject(NodePermissionService);
  private readonly dialogRef = inject(MatDialog);
  private readonly nodeActionsService = inject(NodeActionsService);
  private readonly translation = inject(TranslationService);
  private readonly nodeAspectService = inject(NodeAspectService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly appHookService = inject(AppHookService);
  private readonly newVersionUploaderService = inject(NewVersionUploaderService);
  private readonly router = inject(Router);
  private readonly appSettingsService = inject(AppSettingsService);
  private readonly documentListService = inject(DocumentListService);
  private readonly createMenuButtonSelector = 'app-toolbar-menu button[id="app.toolbar.create"]';

  addFavorite(nodes: Array<NodeEntry>, focusedElementOnCloseSelector?: string) {
    this.focusAfterClose(focusedElementOnCloseSelector);
    if (nodes && nodes.length > 0) {
      this.contentApi.addFavorite(nodes).subscribe(() => {
        const favoriteNodes = nodes.map((node) => {
          const newNode = JSON.parse(JSON.stringify(node));
          newNode.entry.isFavorite = true;
          return newNode;
        });

        if (nodes.length > 1) {
          this.notificationService.showInfo('APP.MESSAGES.INFO.FAVORITE_NODES_ADDED', null, { number: nodes.length });
        } else {
          this.notificationService.showInfo('APP.MESSAGES.INFO.FAVORITE_NODE_ADDED', null, { name: nodes[0].entry.name });
        }
        this.store.dispatch(new SetSelectedNodesAction(favoriteNodes));
      });
    }
  }

  removeFavorite(nodes: Array<NodeEntry>, focusedElementOnCloseSelector?: string) {
    this.focusAfterClose(focusedElementOnCloseSelector);
    if (nodes && nodes.length > 0) {
      this.contentApi.removeFavorite(nodes).subscribe({
        next: () => {
          const favoriteNodes = nodes.map((node) => {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.entry.isFavorite = false;
            return newNode;
          });

          if (nodes.length > 1) {
            this.notificationService.showInfo('APP.MESSAGES.INFO.FAVORITE_NODES_REMOVED', null, { number: nodes.length });
          } else {
            this.notificationService.showInfo('APP.MESSAGES.INFO.FAVORITE_NODE_REMOVED', null, { name: nodes[0].entry.name });
          }
          this.store.dispatch(new SetSelectedNodesAction(favoriteNodes));
        },
        error: (error) => {
          if (JSON.parse(error.message).error.statusCode === 404) {
            const nodeId = JSON.parse(error.message).error.briefSummary.split('relationship id of ')[1];
            const nodeName = nodes.find((node) => node.entry.id === nodeId)?.entry.name;
            this.notificationService.showError('APP.MESSAGES.ERRORS.FAVORITE_NODE_NOT_FOUND', null, { name: nodeName });
          }
        }
      });
    }
  }

  manageVersions(node: any, focusedElementOnCloseSelector?: string) {
    if (node?.entry) {
      // shared and favorite
      const id = node.entry.nodeId || (node as any).entry.guid;

      if (id) {
        this.contentApi.getNodeInfo(id).subscribe((entry) => {
          this.openVersionManagerDialog(entry, focusedElementOnCloseSelector);
        });
      } else {
        this.openVersionManagerDialog(node.entry, focusedElementOnCloseSelector);
      }
    }
  }

  manageAspects(node: any, focusedElementOnCloseSelector?: string) {
    if (node?.entry) {
      // shared and favorite
      const id = node.entry.nodeId || (node as any).entry.guid;

      if (id) {
        this.contentApi.getNodeInfo(id).subscribe((entry) => {
          this.openAspectListDialog(entry, focusedElementOnCloseSelector);
        });
      } else {
        this.openAspectListDialog(node.entry, focusedElementOnCloseSelector);
      }
    }
  }

  versionUpdateDialog(node: Node, file: File) {
    this.contentApi.getNodeVersions(node.id).subscribe(({ list }) => {
      const newVersionUploaderDialogData = {
        node,
        file,
        currentVersion: list.entries[0].entry,
        title: 'VERSION.DIALOG.TITLE',
        showComments: this.appSettingsService.uploadAllowComments,
        allowDownload: this.appSettingsService.uploadAllowDownload
      } as NewVersionUploaderDialogData;
      const dialogConfig: MatDialogConfig = { width: '600px' };

      this.newVersionUploaderService.openUploadNewVersionDialog(newVersionUploaderDialogData, dialogConfig).subscribe(
        (data) => {
          if (data.action === NewVersionUploaderDataAction.upload) {
            if (data.newVersion.value.entry.properties['cm:lockType'] === 'WRITE_LOCK') {
              this.store.dispatch(new UnlockWriteAction(data.newVersion.value));
            }
          }
        },
        (error) => this.notificationService.showError(error)
      );
    });
  }

  shareNode(node: any, focusedElementOnCloseSelector?: string): void {
    if (node?.entry) {
      // shared and favorite
      const id = node.entry.nodeId || (node as any).entry.guid;

      if (id) {
        this.contentApi.getNodeInfo(id).subscribe((entry) => {
          this.openShareLinkDialog({ entry }, focusedElementOnCloseSelector);
        });
      } else {
        this.openShareLinkDialog(node, focusedElementOnCloseSelector);
      }
    }
  }

  openShareLinkDialog(node: any, focusedElementOnCloseSelector?: string) {
    const baseShareUrl = this.appSettingsService.baseShareUrl;

    this.dialogRef
      .open(ShareDialogComponent, {
        restoreFocus: true,
        width: '600px',
        panelClass: 'adf-share-link-dialog',
        data: {
          node,
          baseShareUrl
        }
      })
      .afterClosed()
      .subscribe(() => {
        this.store.dispatch(new SetSelectedNodesAction([node]));
        this.appHookService.linksUnshared.next();
        this.focusAfterClose(focusedElementOnCloseSelector);
      });
  }

  createFolder(parentNodeId: string) {
    const dialogInstance = this.dialogRef.open(FolderDialogComponent, {
      data: {
        parentNodeId,
        createTitle: undefined,
        nodeType: 'cm:folder'
      },
      width: '400px',
      role: 'dialog'
    });

    dialogInstance.componentInstance.error.subscribe((message: string) => {
      this.notificationService.showError(message);
    });

    dialogInstance.afterClosed().subscribe((node) => {
      if (node) {
        this.documentListService.reload();
      }
      this.focusAfterClose(this.createMenuButtonSelector);
    });
  }

  editFolder(folder: NodeEntry, focusedElementOnCloseSelector?: string) {
    if (!folder) {
      return;
    }

    const dialog = this.dialogRef.open(FolderDialogComponent, {
      data: {
        folder: folder.entry
      },
      width: '400px'
    });

    dialog.componentInstance.error.subscribe((message: string) => {
      this.notificationService.showError(message);
    });

    dialog.afterClosed().subscribe((node) => {
      if (node) {
        this.store.dispatch(new SetSelectedNodesAction([{ entry: node }]));
        this.nodesApiService.nodeUpdated.next(node);
      }
      this.focusAfterClose(focusedElementOnCloseSelector);
    });
  }

  createLibrary(): Observable<string> {
    const dialogInstance = this.dialogRef.open(LibraryDialogComponent, {
      autoFocus: false,
      width: '400px'
    });

    dialogInstance.componentInstance.error.subscribe((message: string) => {
      this.notificationService.showError(message);
    });

    return dialogInstance.afterClosed().pipe(
      tap((node) => {
        if (node) {
          this.appHookService.libraryCreated.next(node);
        }
        this.focusAfterClose(this.createMenuButtonSelector);
      }),
      map((node: SiteEntry) => {
        if (node?.entry?.guid) {
          return node.entry.guid;
        }
        return null;
      })
    );
  }

  deleteLibrary(id: string): void {
    this.contentApi.deleteSite(id).subscribe(
      () => {
        this.appHookService.libraryDeleted.next(id);
        this.notificationService.showInfo('APP.MESSAGES.INFO.LIBRARY_DELETED');
        this.store.dispatch(new NavigateRouteAction(['/libraries']));
      },
      () => {
        this.notificationService.showError('APP.MESSAGES.ERRORS.DELETE_LIBRARY_FAILED');
      }
    );
  }

  leaveLibrary(siteId: string, focusedElementOnCloseSelector?: string): void {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      data: {
        title: 'APP.DIALOGS.CONFIRM_LEAVE.TITLE',
        message: 'APP.DIALOGS.CONFIRM_LEAVE.MESSAGE',
        yesLabel: 'APP.DIALOGS.CONFIRM_LEAVE.YES_LABEL',
        noLabel: 'APP.DIALOGS.CONFIRM_LEAVE.NO_LABEL'
      },
      minWidth: '250px',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.contentApi.leaveSite(siteId).subscribe(
          () => {
            this.appHookService.libraryLeft.next(siteId);
            this.notificationService.showInfo('APP.MESSAGES.INFO.LEFT_LIBRARY');
          },
          () => {
            this.notificationService.showError('APP.MESSAGES.ERRORS.LEAVE_LIBRARY_FAILED');
          }
        );
      }
      this.focusAfterClose(focusedElementOnCloseSelector);
    });
  }

  updateLibrary(siteId: string, siteBody: SiteBodyCreate) {
    this.contentApi.updateLibrary(siteId, siteBody).subscribe(
      (siteEntry: SiteEntry) => {
        this.appHookService.libraryUpdated.next(siteEntry);
        this.notificationService.showInfo('LIBRARY.SUCCESS.LIBRARY_UPDATED');
      },
      () => {
        this.appHookService.libraryUpdateFailed.next();
        this.notificationService.showError('LIBRARY.ERRORS.LIBRARY_UPDATE_ERROR');
      }
    );
  }

  async unshareNodes(links: Array<NodeEntry>) {
    const promises = links.map((link) => this.contentApi.deleteSharedLink(link.entry.id).toPromise());
    await Promise.all(promises);
    this.appHookService.linksUnshared.next();
  }

  canUpdateNode(node: NodeEntry | Node): boolean {
    return this.permission.check(node, ['update']);
  }

  canUploadContent(folderNode: NodeEntry | Node): boolean {
    return this.permission.check(folderNode, ['create']);
  }

  purgeDeletedNodes(nodes: NodeEntry[], focusedElementOnCloseSelector?: string) {
    if (!nodes || nodes.length === 0) {
      return;
    }

    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      data: {
        title: 'APP.DIALOGS.CONFIRM_PURGE.TITLE',
        message: 'APP.DIALOGS.CONFIRM_PURGE.MESSAGE',
        yesLabel: 'APP.DIALOGS.CONFIRM_PURGE.YES_LABEL',
        noLabel: 'APP.DIALOGS.CONFIRM_PURGE.NO_LABEL'
      },
      minWidth: '250px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.focusAfterClose(focusedElementOnCloseSelector);
      if (result === true) {
        const nodesToDelete: NodeInfo[] = nodes.map((node) => {
          const { name } = node.entry;
          const id = (node as any).entry.nodeId || node.entry.id;

          return {
            id,
            name
          };
        });
        this.purgeNodes(nodesToDelete);
      }
    });
  }

  restoreDeletedNodes(selection: NodeEntry[] = [], focusedElementOnCloseSelector?: string) {
    if (!selection.length) {
      return;
    }

    const nodesWithPath = selection.filter((node) => node.entry.path);

    if (selection.length && !nodesWithPath.length) {
      const failedStatus = this.processStatus([]);
      failedStatus.fail.push(...selection);
      this.showRestoreNotification(failedStatus);
      this.documentListService.reload();
      return;
    }

    let status: DeleteStatus;

    forkJoin(nodesWithPath.map((node) => this.restoreNode(node)))
      .pipe(
        tap((restoredNodes) => {
          status = this.processStatus(restoredNodes);
        }),
        mergeMap(() => this.contentApi.getDeletedNodes())
      )
      .subscribe((nodes: DeletedNodesPaging) => {
        const selectedNodes = this.diff(status.fail, selection, false);
        const remainingNodes = this.diff(selectedNodes, nodes.list.entries);

        if (!remainingNodes.length) {
          this.focusAfterClose(focusedElementOnCloseSelector);
          this.showRestoreNotification(status);
          setTimeout(() => {
            this.documentListService.reload();
          }, 50);
        } else {
          this.restoreDeletedNodes(remainingNodes);
        }
      });
  }

  copyNodes(nodes: Array<NodeEntry>, focusedElementOnCloseSelector?: string) {
    zip(this.nodeActionsService.copyNodes(nodes, undefined, focusedElementOnCloseSelector), this.nodeActionsService.contentCopied).subscribe(
      (result) => {
        const [operationResult, newItems] = result;
        this.showCopyMessage(operationResult, nodes, newItems);
      },
      (error) => {
        this.showCopyMessage(error, nodes);
      }
    );
  }

  moveNodes(nodes: Array<NodeEntry>, focusedElementOnCloseSelector?: string) {
    const permissionForMove = '!';

    zip(this.nodeActionsService.moveNodes(nodes, permissionForMove, focusedElementOnCloseSelector), this.nodeActionsService.contentMoved).subscribe(
      (result) => {
        const [operationResult, moveResponse] = result;
        this.showMoveMessage(nodes, operationResult, moveResponse);

        this.documentListService.reload();
      },
      (error) => {
        this.showMoveMessage(nodes, error);
      }
    );
  }

  getErrorMessage(errorObject: { message: any }): string {
    let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

    try {
      const {
        error: { statusCode }
      } = JSON.parse(errorObject.message);

      if (statusCode === 409) {
        i18nMessageString = 'APP.MESSAGES.ERRORS.NODE_MOVE';
      } else if (statusCode === 403) {
        i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
      }
    } catch (err) {
      /* Do nothing, keep the original message */
    }

    return i18nMessageString;
  }

  getNodeInfo(): Observable<Node> {
    return this.store.select(getAppSelection).pipe(
      take(1),
      mergeMap(({ file }) => {
        const id = (file as any).entry.nodeId || (file as any).entry.guid;
        if (!id) {
          return of(file.entry);
        } else {
          return this.contentApi.getNodeInfo(id);
        }
      })
    );
  }

  unlockNode(node: NodeEntry): Promise<void | NodeEntry> {
    return this.contentApi.unlockNode(node.entry.id).catch(() => {
      this.notificationService.showError('APP.MESSAGES.ERRORS.UNLOCK_NODE', null, { fileName: node.entry.name });
    });
  }

  private showCopyMessage(info: any, nodes: Array<NodeEntry>, newItems?: Array<NodeEntry>) {
    const numberOfCopiedItems = newItems ? newItems.length : 0;
    const failedItems = nodes.length - numberOfCopiedItems;

    let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

    if (typeof info === 'string') {
      if (info.toLowerCase().indexOf('succes') !== -1) {
        let i18MessageSuffix;

        if (failedItems) {
          if (numberOfCopiedItems) {
            i18MessageSuffix = numberOfCopiedItems === 1 ? 'PARTIAL_SINGULAR' : 'PARTIAL_PLURAL';
          } else {
            i18MessageSuffix = failedItems === 1 ? 'FAIL_SINGULAR' : 'FAIL_PLURAL';
          }
        } else {
          i18MessageSuffix = numberOfCopiedItems === 1 ? 'SINGULAR' : 'PLURAL';
        }

        i18nMessageString = `APP.MESSAGES.INFO.NODE_COPY.${i18MessageSuffix}`;
      }
    } else {
      try {
        const {
          error: { statusCode }
        } = JSON.parse(info.message);

        if (statusCode === 403) {
          i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
        }
      } catch {}
    }

    const undo = numberOfCopiedItems > 0 ? this.translation.instant('APP.ACTIONS.UNDO') : '';

    const message = this.translation.instant(i18nMessageString, {
      success: numberOfCopiedItems,
      failed: failedItems
    });

    let messageType: string;
    if (numberOfCopiedItems === 0) {
      messageType = 'adf-error-snackbar';
    } else if (failedItems > 0) {
      messageType = 'adf-warning-snackbar';
    } else {
      messageType = 'adf-info-snackbar';
    }

    this.notificationService
      .openSnackMessageAction(message, undo, {
        panelClass: messageType
      })
      .onAction()
      .subscribe(() => this.undoCopyNodes(newItems));
  }

  private undoCopyNodes(nodes: NodeEntry[]) {
    const batch = this.nodeActionsService
      .flatten(nodes)
      .filter((item) => item.entry)
      .map((item) => this.contentApi.deleteNode(item.entry.id, { permanent: true }));

    forkJoin(...batch).subscribe(
      () => {
        this.appHookService.nodesDeleted.next(null);
        this.documentListService.reload();
      },
      (error) => {
        let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

        let errorJson = null;
        try {
          errorJson = JSON.parse(error.message);
        } catch {}

        if (errorJson?.error?.statusCode === 403) {
          i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
        }

        this.notificationService.showError(i18nMessageString);
      }
    );
  }

  private openVersionManagerDialog(node: any, focusedElementOnCloseSelector?: string) {
    // workaround Shared
    if (node.isFile || node.nodeId) {
      const newVersionUploaderDialogData: NewVersionUploaderDialogData = {
        node,
        showVersionsOnly: true,
        title: 'VERSION.DIALOG.TITLE',
        allowDownload: this.appSettingsService.uploadAllowDownload,
        showComments: this.appSettingsService.uploadAllowComments,
        showActions: this.appSettingsService.versionManagerShowActions,
        allowViewVersions: this.appSettingsService.versionManagerAllowViewVersions,
        allowVersionDelete: this.appSettingsService.versionManagerAllowVersionDelete
      };
      this.newVersionUploaderService
        .openUploadNewVersionDialog(newVersionUploaderDialogData, { width: '630px', role: 'dialog' }, focusedElementOnCloseSelector)
        .subscribe({
          next: (newVersionUploaderData) => {
            switch (newVersionUploaderData.action) {
              case NewVersionUploaderDataAction.refresh:
                this.documentListService.reload();
                this.store.dispatch(new RefreshPreviewAction(newVersionUploaderData.node));
                break;
              case NewVersionUploaderDataAction.view: {
                const location = this.activatedRoute.snapshot.queryParams['location'] || this.router.url;
                this.store.dispatch(new ViewNodeVersionAction(node.id, newVersionUploaderData.versionId, { location }));
                break;
              }
              default:
                break;
            }
          }
        });
    } else {
      this.notificationService.showError('APP.MESSAGES.ERRORS.PERMISSION');
    }
  }

  private openAspectListDialog(node: any, focusedElementOnCloseSelector?: string) {
    // workaround Shared
    if (node.isFile || node.id) {
      this.nodeAspectService.updateNodeAspects(node.id, focusedElementOnCloseSelector);
    } else {
      this.notificationService.showError('APP.MESSAGES.ERRORS.PERMISSION');
    }
  }

  private undoMoveNodes(moveResponse, selectionParentId: string) {
    const movedNodes = moveResponse?.['succeeded'] ?? [];
    const partiallyMovedNodes = moveResponse?.['partiallySucceeded'] ?? [];

    const restoreDeletedNodesBatch = this.nodeActionsService.moveDeletedEntries.map((folderEntry) =>
      this.contentApi.restoreNode(folderEntry.nodeId || folderEntry.id).pipe(map((node) => node.entry))
    );

    zip(...restoreDeletedNodesBatch, of(null))
      .pipe(
        mergeMap(() => {
          const nodesToBeMovedBack = [...partiallyMovedNodes, ...movedNodes];

          const revertMoveBatch = this.nodeActionsService
            .flatten(nodesToBeMovedBack)
            .filter((node) => node.entry || node.itemMoved?.entry)
            .map((node) => {
              if (node.itemMoved) {
                return this.nodeActionsService.moveNodeAction(node.itemMoved.entry, node.initialParentId);
              } else {
                return this.nodeActionsService.moveNodeAction(node.entry, selectionParentId);
              }
            });

          return zip(...revertMoveBatch, of(null));
        })
      )
      .subscribe(
        () => {
          this.documentListService.reload();
        },
        (error) => {
          let message = 'APP.MESSAGES.ERRORS.GENERIC';

          let errorJson = null;
          try {
            errorJson = JSON.parse(error.message);
          } catch {}

          if (errorJson?.error?.statusCode === 403) {
            message = 'APP.MESSAGES.ERRORS.PERMISSION';
          }

          this.notificationService.showError(message);
        }
      );
  }

  deleteNodes(items: NodeEntry[], allowUndo = true, focusedElementOnCloseSelector?: string): void {
    this.focusAfterClose(focusedElementOnCloseSelector);
    const batch: Observable<DeletedNodeInfo>[] = [];

    items.forEach((node) => {
      batch.push(this.deleteNode(node));
    });

    forkJoin(...batch).subscribe((data: DeletedNodeInfo[]) => {
      const status = this.processStatus(data);
      const messageData = this.getDeleteMessageData(status);

      if (messageData && status.someSucceeded) {
        const translatedMessage: string = this.translation.instant(messageData.key, messageData.params);
        const action: string | null = allowUndo ? this.translation.instant('APP.ACTIONS.UNDO') : null;

        const snackBarRef = this.notificationService.openSnackMessageAction(
          translatedMessage,
          action,
          { panelClass: `adf-${messageData.type}-snackbar` },
          messageData.params
        );

        if (action) {
          snackBarRef.onAction().subscribe(() => {
            this.undoDeleteNodes([...status.success]);
          });
        }
      } else if (messageData) {
        this.notificationService.showError(this.translation.instant(messageData.key, messageData.params));
      }

      if (status.someSucceeded) {
        this.appHookService.nodesDeleted.next();
        this.documentListService.reload();
      }
      this.store.dispatch(new ShowLoaderAction(false));
    });
  }

  undoDeleteNodes(items: DeletedNodeInfo[]): void {
    const batch: Observable<DeletedNodeInfo>[] = [];

    items.forEach((item) => {
      batch.push(this.undoDeleteNode(item));
    });

    forkJoin(...batch).subscribe((data) => {
      const processedData = this.processStatus(data);

      if (processedData.fail.length) {
        this.showUndoDeleteMessage(processedData);
      }

      if (processedData.someSucceeded) {
        this.documentListService.reload();
      }
    });
  }

  private undoDeleteNode(item: DeletedNodeInfo): Observable<DeletedNodeInfo> {
    const { id, name } = item;

    return this.contentApi.restoreNode(id).pipe(
      map(() => ({
        id,
        name,
        status: 1
      })),
      catchError(() =>
        of({
          id,
          name,
          status: 0
        })
      )
    );
  }

  private showUndoDeleteMessage(status: DeleteStatus): void {
    if (status.someFailed && !status.oneFailed) {
      this.notificationService.showError('APP.MESSAGES.ERRORS.NODE_RESTORE.PLURAL', null, { number: status.fail.length });
    }

    if (status.oneFailed) {
      this.notificationService.showError('APP.MESSAGES.ERRORS.NODE_RESTORE', null, { name: status.fail[0].name });
    }
  }

  private restoreNode(node: NodeEntry): Observable<RestoredNode> {
    const { entry } = node;

    return this.contentApi.restoreNode(entry.id).pipe(
      map(() => ({
        status: 1,
        entry
      })),
      catchError((error) => {
        const { statusCode } = JSON.parse(error.message).error;

        return of({
          status: 0,
          statusCode,
          entry
        });
      })
    );
  }

  private purgeNodes(selection: NodeInfo[] = []) {
    if (!selection.length) {
      return;
    }

    const batch = selection.map((node) => this.purgeDeletedNode(node));

    forkJoin(batch).subscribe((purgedNodes) => {
      const status = this.processStatus(purgedNodes);

      if (status.success.length) {
        this.documentListService.reload();
      }

      this.sendPurgeMessage(status);
    });
  }

  private purgeDeletedNode(node: NodeInfo): Observable<DeletedNodeInfo> {
    const { id, name } = node;

    return this.contentApi.purgeDeletedNode(id).pipe(
      map(() => ({
        status: 1,
        id,
        name
      })),
      catchError(() =>
        of({
          status: 0,
          id,
          name
        })
      )
    );
  }

  private processStatus(data: Array<{ status: number }> = []): DeleteStatus {
    const status = {
      fail: [],
      success: [],
      get someFailed() {
        return !!this.fail.length;
      },
      get someSucceeded() {
        return !!this.success.length;
      },
      get oneFailed() {
        return this.fail.length === 1;
      },
      get oneSucceeded() {
        return this.success.length === 1;
      },
      get allSucceeded() {
        return this.someSucceeded && !this.someFailed;
      },
      get allFailed() {
        return this.someFailed && !this.someSucceeded;
      },
      reset() {
        this.fail = [];
        this.success = [];
      }
    };

    return data.reduce((acc, node) => {
      if (node.status) {
        acc.success.push(node);
      } else {
        acc.fail.push(node);
      }

      return acc;
    }, status);
  }

  private sendPurgeMessage(status: DeleteStatus): void {
    if (status.oneSucceeded && status.someFailed && !status.oneFailed) {
      this.notificationService.showWarning('APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_SINGULAR', null, {
        name: status.success[0].name,
        failed: status.fail.length
      });
      return;
    }

    if (status.someSucceeded && !status.oneSucceeded && status.someFailed) {
      this.notificationService.showWarning('APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_PLURAL', null, {
        number: status.success.length,
        failed: status.fail.length
      });
      return;
    }

    if (status.oneSucceeded) {
      this.notificationService.showInfo('APP.MESSAGES.INFO.TRASH.NODES_PURGE.SINGULAR', null, { name: status.success[0].name });
      return;
    }

    if (status.oneFailed) {
      this.notificationService.showError('APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.SINGULAR', null, { name: status.fail[0].name });
      return;
    }

    if (status.allSucceeded) {
      this.notificationService.showInfo('APP.MESSAGES.INFO.TRASH.NODES_PURGE.PLURAL', null, { number: status.success.length });
      return;
    }

    if (status.allFailed) {
      this.notificationService.showError('APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.PLURAL', null, { number: status.fail.length });
      return;
    }
  }

  private showRestoreNotification(status: DeleteStatus): void {
    const messageData = this.getRestoreMessageData(status);

    if (messageData) {
      const translatedMessage: string = this.translation.instant(messageData.key, messageData.params);
      const action: string = messageData.userActionLabel ? this.translation.instant(messageData.userActionLabel) : '';
      const panelClass = messageData.type === 'error' ? 'adf-error-snackbar' : 'adf-info-snackbar';

      const snackBarRef = this.notificationService.openSnackMessageAction(translatedMessage, action, { panelClass }, messageData.params);

      if (messageData.userActionLabel && status.oneSucceeded && !status.someFailed) {
        snackBarRef.onAction().subscribe(() => {
          const isSite = this.isSite(status.success[0].entry);
          const path: PathInfo = status.success[0].entry.path;
          const parent = path.elements[path.elements.length - 1];
          const route = isSite ? ['/libraries', parent.id] : ['/personal-files', parent.id];

          if (this.isLibraryContent(path)) {
            this.store.dispatch(new NavigateToParentFolder(status.success[0]));
          } else {
            this.store.dispatch(new NavigateRouteAction(route));
          }
        });
      }
    }
  }

  private isSite(entry: Node): boolean {
    return entry.nodeType === 'st:site';
  }

  private isLibraryContent(path: PathInfo): boolean {
    return path && path.elements.length >= 2 && path.elements[1].name === 'Sites';
  }

  private getRestoreMessageData(status: DeleteStatus): SnackbarMessageData | null {
    if (status.someFailed && !status.oneFailed) {
      return {
        key: 'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.PARTIAL_PLURAL',
        params: { number: status.fail.length },
        type: 'error'
      };
    }

    if (status.oneFailed && status.fail[0].statusCode) {
      return {
        key:
          status.fail[0].statusCode === 409
            ? 'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.NODE_EXISTS'
            : 'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.GENERIC',
        params: { name: status.fail[0].entry.name },
        type: 'error'
      };
    }

    if (status.oneFailed && !status.fail[0].statusCode) {
      return {
        key: 'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.LOCATION_MISSING',
        params: { name: status.fail[0].entry.name },
        type: 'error'
      };
    }

    if (status.allSucceeded && !status.oneSucceeded) {
      return {
        key: 'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.PLURAL',
        params: {},
        type: 'info'
      };
    }

    if (status.allSucceeded && status.oneSucceeded) {
      return {
        key: 'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.SINGULAR',
        params: { name: status.success[0].entry.name },
        userActionLabel: 'APP.ACTIONS.VIEW',
        type: 'info'
      };
    }

    return null;
  }

  private diff(selection: any[], list: any[], fromList = true): any {
    const ids = selection.map((item) => item.entry.id);

    return list.filter((item) => {
      if (fromList) {
        return ids.includes(item.entry.id) ? item : null;
      } else {
        return !ids.includes(item.entry.id) ? item : null;
      }
    });
  }

  private deleteNode(node: any): Observable<DeletedNodeInfo> {
    const { name } = node.entry;
    const id = node.entry.nodeId || node.entry.id;

    return this.contentApi.deleteNode(id).pipe(
      map(() => ({
        id,
        name,
        status: 1
      })),
      catchError(() =>
        of({
          id,
          name,
          status: 0
        })
      )
    );
  }

  private getDeleteMessageData(status: DeleteStatus): SnackbarMessageData | null {
    if (status.allFailed && !status.oneFailed) {
      return {
        key: 'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL',
        params: { number: status.fail.length },
        type: 'error'
      };
    }

    if (status.allSucceeded && !status.oneSucceeded) {
      return {
        key: 'APP.MESSAGES.INFO.NODE_DELETION.PLURAL',
        params: { number: status.success.length },
        type: 'info'
      };
    }

    if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
      return {
        key: 'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL',
        params: { success: status.success.length, failed: status.fail.length },
        type: 'warning'
      };
    }

    if (status.someFailed && status.oneSucceeded) {
      return {
        key: 'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR',
        params: { success: status.success.length, failed: status.fail.length },
        type: 'warning'
      };
    }

    if (status.oneFailed && !status.someSucceeded) {
      return {
        key: 'APP.MESSAGES.ERRORS.NODE_DELETION',
        params: { name: status.fail[0].name },
        type: 'error'
      };
    }

    if (status.oneSucceeded && !status.someFailed) {
      return {
        key: 'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR',
        params: { name: status.success[0].name },
        type: 'info'
      };
    }

    return null;
  }

  private showMoveMessage(nodes: Array<NodeEntry>, info: any, moveResponse?: any) {
    const succeeded = moveResponse?.['succeeded'].length ?? 0;
    const partiallySucceeded = moveResponse?.['partiallySucceeded'].length ?? 0;
    const failures = moveResponse?.['failed'].length ?? 0;

    let successMessage = '';
    let partialSuccessMessage = '';
    let failedMessage = '';
    let errorMessage = '';

    if (typeof info === 'string') {
      // in case of success
      if (info.toLowerCase().indexOf('succes') !== -1) {
        const i18nMessageString = 'APP.MESSAGES.INFO.NODE_MOVE.';
        let i18MessageSuffix = '';

        if (succeeded) {
          i18MessageSuffix = succeeded === 1 ? 'SINGULAR' : 'PLURAL';
          successMessage = `${i18nMessageString}${i18MessageSuffix}`;
        }

        if (partiallySucceeded) {
          i18MessageSuffix = partiallySucceeded === 1 ? 'PARTIAL.SINGULAR' : 'PARTIAL.PLURAL';
          partialSuccessMessage = `${i18nMessageString}${i18MessageSuffix}`;
        }

        if (failures) {
          // if moving failed for ALL nodes, emit error
          if (failures === nodes.length) {
            const errors = this.nodeActionsService.flatten(moveResponse['failed']);
            errorMessage = this.getErrorMessage(errors[0]);
          } else {
            i18MessageSuffix = 'PARTIAL.FAIL';
            failedMessage = `${i18nMessageString}${i18MessageSuffix}`;
          }
        }
      } else {
        errorMessage = 'APP.MESSAGES.ERRORS.GENERIC';
      }
    } else {
      errorMessage = this.getErrorMessage(info);
    }

    const undo = succeeded + partiallySucceeded > 0 ? this.translation.instant('APP.ACTIONS.UNDO') : '';
    failedMessage = errorMessage ? errorMessage : failedMessage;

    const beforePartialSuccessMessage = successMessage && partialSuccessMessage ? ' ' : '';
    const beforeFailedMessage = (successMessage || partialSuccessMessage) && failedMessage ? ' ' : '';

    const initialParentId = this.nodeActionsService.getEntryParentId(nodes[0].entry);

    const messages = this.translation.instant([successMessage, partialSuccessMessage, failedMessage], {
      success: succeeded,
      failed: failures,
      partially: partiallySucceeded
    });

    let notificationType = 'adf-warning-snackbar';
    if (partiallySucceeded === 0 && succeeded === 0) {
      notificationType = 'adf-error-snackbar';
    } else if (failures === 0 && partiallySucceeded === 0) {
      notificationType = 'adf-info-snackbar';
    }

    // TODO: review in terms of i18n
    this.notificationService
      .openSnackMessageAction(
        messages[successMessage] + beforePartialSuccessMessage + messages[partialSuccessMessage] + beforeFailedMessage + messages[failedMessage],
        undo,
        {
          panelClass: notificationType
        }
      )
      .onAction()
      .subscribe(() => this.undoMoveNodes(moveResponse, initialParentId));
  }

  private focusAfterClose(focusedElementSelector: string): void {
    if (focusedElementSelector) {
      document.querySelector<HTMLElement>(focusedElementSelector)?.focus();
    }
  }

  showNodeInformation(node: NodeEntry) {
    this.dialogRef.open(DialogComponent, {
      data: {
        title: 'APP.NODE_INFO.TITLE',
        confirmButtonTitle: 'APP.NODE_INFO.DONE',
        isCancelButtonHidden: true,
        isCloseButtonHidden: false,
        dialogSize: DialogSize.Large,
        contentComponent: NodeInformationComponent,
        componentData: node.entry
      },
      width: '700px'
    });
  }
}
