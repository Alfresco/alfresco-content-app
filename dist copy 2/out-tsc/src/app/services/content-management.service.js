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
import * as tslib_1 from 'tslib';
import { ContentApiService, NodePermissionService } from '@alfresco/aca-shared';
import {
  getAppSelection,
  getSharedUrl,
  NavigateRouteAction,
  NavigateToParentFolder,
  ReloadDocumentListAction,
  SetSelectedNodesAction,
  SnackbarErrorAction,
  SnackbarInfoAction,
  SnackbarUserAction,
  SnackbarWarningAction,
  UndoDeleteNodesAction
} from '@alfresco/aca-shared/store';
import {
  ConfirmDialogComponent,
  FolderDialogComponent,
  LibraryDialogComponent,
  ShareDialogComponent
} from '@alfresco/adf-content-services';
import { TranslationService, AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { forkJoin, of, Subject, zip } from 'rxjs';
import { catchError, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { NodePermissionsDialogComponent } from '../components/permissions/permission-dialog/node-permissions.dialog';
import { NodeVersionUploadDialogComponent } from '../dialogs/node-version-upload/node-version-upload.dialog';
import { NodeVersionsDialogComponent } from '../dialogs/node-versions/node-versions.dialog';
import { NodeActionsService } from './node-actions.service';
var ContentManagementService = /** @class */ (function() {
  function ContentManagementService(
    alfrescoApiService,
    store,
    contentApi,
    permission,
    dialogRef,
    nodeActionsService,
    translation,
    snackBar
  ) {
    this.alfrescoApiService = alfrescoApiService;
    this.store = store;
    this.contentApi = contentApi;
    this.permission = permission;
    this.dialogRef = dialogRef;
    this.nodeActionsService = nodeActionsService;
    this.translation = translation;
    this.snackBar = snackBar;
    this.reload = new Subject();
    this.reset = new Subject();
    this.nodesDeleted = new Subject();
    this.libraryDeleted = new Subject();
    this.libraryCreated = new Subject();
    this.libraryUpdated = new Subject();
    this.libraryJoined = new Subject();
    this.libraryLeft = new Subject();
    this.library400Error = new Subject();
    this.joinLibraryToggle = new Subject();
    this.linksUnshared = new Subject();
    this.favoriteLibraryToggle = new Subject();
  }
  ContentManagementService.prototype.addFavorite = function(nodes) {
    var _this = this;
    if (nodes && nodes.length > 0) {
      this.contentApi.addFavorite(nodes).subscribe(function() {
        nodes.forEach(function(node) {
          node.entry.isFavorite = true;
        });
        _this.store.dispatch(new SetSelectedNodesAction(nodes));
      });
    }
  };
  ContentManagementService.prototype.removeFavorite = function(nodes) {
    var _this = this;
    if (nodes && nodes.length > 0) {
      this.contentApi.removeFavorite(nodes).subscribe(function() {
        nodes.forEach(function(node) {
          node.entry.isFavorite = false;
        });
        _this.store.dispatch(new SetSelectedNodesAction(nodes));
      });
    }
  };
  ContentManagementService.prototype.managePermissions = function(node) {
    if (node && node.entry) {
      var _a = node.entry,
        nodeId = _a.nodeId,
        id = _a.id;
      var siteId = node.entry['guid'];
      var targetId = siteId || nodeId || id;
      if (targetId) {
        this.dialogRef.open(NodePermissionsDialogComponent, {
          data: { nodeId: targetId },
          panelClass: 'aca-permissions-dialog-panel',
          width: '730px'
        });
      } else {
        this.store.dispatch(
          new SnackbarErrorAction('APP.MESSAGES.ERRORS.PERMISSION')
        );
      }
    }
  };
  ContentManagementService.prototype.manageVersions = function(node) {
    var _this = this;
    if (node && node.entry) {
      // shared and favorite
      var id = node.entry.nodeId || node.entry.guid;
      if (id) {
        this.contentApi.getNodeInfo(id).subscribe(function(entry) {
          _this.openVersionManagerDialog(entry);
        });
      } else {
        this.openVersionManagerDialog(node.entry);
      }
    }
  };
  ContentManagementService.prototype.openVersionManagerDialog = function(node) {
    // workaround Shared
    if (node.isFile || node.nodeId) {
      this.dialogRef.open(NodeVersionsDialogComponent, {
        data: { node: node },
        panelClass: 'adf-version-manager-dialog-panel',
        width: '630px'
      });
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.PERMISSION')
      );
    }
  };
  ContentManagementService.prototype.versionUploadDialog = function() {
    return this.dialogRef.open(NodeVersionUploadDialogComponent, {
      panelClass: 'aca-node-version-dialog'
    });
  };
  ContentManagementService.prototype.shareNode = function(node) {
    var _this = this;
    if (node && node.entry) {
      // shared and favorite
      var id = node.entry.nodeId || node.entry.guid;
      if (id) {
        this.contentApi.getNodeInfo(id).subscribe(function(entry) {
          _this.openShareLinkDialog({ entry: entry });
        });
      } else {
        this.openShareLinkDialog(node);
      }
    }
  };
  ContentManagementService.prototype.openShareLinkDialog = function(node) {
    var _this = this;
    this.store
      .select(getSharedUrl)
      .pipe(take(1))
      .subscribe(function(baseShareUrl) {
        _this.dialogRef
          .open(ShareDialogComponent, {
            restoreFocus: true,
            width: '600px',
            panelClass: 'adf-share-link-dialog',
            data: {
              node: node,
              baseShareUrl: baseShareUrl
            }
          })
          .afterClosed()
          .subscribe(function(deletedSharedLink) {
            _this.store.dispatch(new SetSelectedNodesAction([node]));
            if (deletedSharedLink) {
              _this.linksUnshared.next(deletedSharedLink);
            }
          });
      });
  };
  ContentManagementService.prototype.createFolder = function(parentNodeId) {
    var _this = this;
    var dialogInstance = this.dialogRef.open(FolderDialogComponent, {
      data: {
        parentNodeId: parentNodeId,
        createTitle: undefined,
        nodeType: 'cm:folder'
      },
      width: '400px'
    });
    dialogInstance.componentInstance.error.subscribe(function(message) {
      _this.store.dispatch(new SnackbarErrorAction(message));
    });
    dialogInstance.afterClosed().subscribe(function(node) {
      if (node) {
        _this.store.dispatch(new ReloadDocumentListAction());
      }
    });
  };
  ContentManagementService.prototype.editFolder = function(folder) {
    var _this = this;
    if (!folder) {
      return;
    }
    var dialog = this.dialogRef.open(FolderDialogComponent, {
      data: {
        folder: folder.entry
      },
      width: '400px'
    });
    dialog.componentInstance.error.subscribe(function(message) {
      _this.store.dispatch(new SnackbarErrorAction(message));
    });
    dialog.afterClosed().subscribe(function(node) {
      if (node) {
        _this.alfrescoApiService.nodeUpdated.next(node);
      }
    });
  };
  ContentManagementService.prototype.createLibrary = function() {
    var _this = this;
    var dialogInstance = this.dialogRef.open(LibraryDialogComponent, {
      width: '400px'
    });
    dialogInstance.componentInstance.error.subscribe(function(message) {
      _this.store.dispatch(new SnackbarErrorAction(message));
    });
    return dialogInstance.afterClosed().pipe(
      tap(function(node) {
        if (node) {
          _this.libraryCreated.next(node);
        }
      }),
      map(function(node) {
        if (node && node.entry && node.entry.guid) {
          return node.entry.guid;
        }
        return null;
      })
    );
  };
  ContentManagementService.prototype.deleteLibrary = function(id) {
    var _this = this;
    this.contentApi.deleteSite(id).subscribe(
      function() {
        _this.libraryDeleted.next(id);
        _this.store.dispatch(
          new SnackbarInfoAction('APP.MESSAGES.INFO.LIBRARY_DELETED')
        );
      },
      function() {
        _this.store.dispatch(
          new SnackbarErrorAction('APP.MESSAGES.ERRORS.DELETE_LIBRARY_FAILED')
        );
      }
    );
  };
  ContentManagementService.prototype.leaveLibrary = function(siteId) {
    var _this = this;
    var dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      data: {
        title: 'APP.DIALOGS.CONFIRM_LEAVE.TITLE',
        message: 'APP.DIALOGS.CONFIRM_LEAVE.MESSAGE',
        yesLabel: 'APP.DIALOGS.CONFIRM_LEAVE.YES_LABEL',
        noLabel: 'APP.DIALOGS.CONFIRM_LEAVE.NO_LABEL'
      },
      minWidth: '250px'
    });
    dialogRef.afterClosed().subscribe(function(result) {
      if (result === true) {
        _this.contentApi.leaveSite(siteId).subscribe(
          function() {
            _this.libraryLeft.next(siteId);
            _this.store.dispatch(
              new SnackbarInfoAction('APP.MESSAGES.INFO.LEFT_LIBRARY')
            );
          },
          function() {
            _this.store.dispatch(
              new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.LEAVE_LIBRARY_FAILED'
              )
            );
          }
        );
      }
    });
  };
  ContentManagementService.prototype.updateLibrary = function(
    siteId,
    siteBody
  ) {
    var _this = this;
    this.contentApi.updateLibrary(siteId, siteBody).subscribe(
      function(siteEntry) {
        _this.libraryUpdated.next(siteEntry);
        _this.store.dispatch(
          new SnackbarInfoAction('LIBRARY.SUCCESS.LIBRARY_UPDATED')
        );
      },
      function() {
        _this.store.dispatch(
          new SnackbarErrorAction('LIBRARY.ERRORS.LIBRARY_UPDATE_ERROR')
        );
      }
    );
  };
  ContentManagementService.prototype.unshareNodes = function(links) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var promises;
      var _this = this;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            promises = links.map(function(link) {
              return _this.contentApi
                .deleteSharedLink(link.entry.id)
                .toPromise();
            });
            return [4 /*yield*/, Promise.all(promises)];
          case 1:
            _a.sent();
            this.linksUnshared.next();
            return [2 /*return*/];
        }
      });
    });
  };
  ContentManagementService.prototype.canUpdateNode = function(node) {
    return this.permission.check(node, ['update']);
  };
  ContentManagementService.prototype.canUploadContent = function(folderNode) {
    return this.permission.check(folderNode, ['create']);
  };
  ContentManagementService.prototype.purgeDeletedNodes = function(nodes) {
    var _this = this;
    if (!nodes || nodes.length === 0) {
      return;
    }
    var dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      data: {
        title: 'APP.DIALOGS.CONFIRM_PURGE.TITLE',
        message: 'APP.DIALOGS.CONFIRM_PURGE.MESSAGE',
        yesLabel: 'APP.DIALOGS.CONFIRM_PURGE.YES_LABEL',
        noLabel: 'APP.DIALOGS.CONFIRM_PURGE.NO_LABEL'
      },
      minWidth: '250px'
    });
    dialogRef.afterClosed().subscribe(function(result) {
      if (result === true) {
        var nodesToDelete = nodes.map(function(node) {
          var name = node.entry.name;
          var id = node.entry.nodeId || node.entry.id;
          return {
            id: id,
            name: name
          };
        });
        _this.purgeNodes(nodesToDelete);
      }
    });
  };
  ContentManagementService.prototype.restoreDeletedNodes = function(selection) {
    var _this = this;
    if (selection === void 0) {
      selection = [];
    }
    var _a;
    if (!selection.length) {
      return;
    }
    var nodesWithPath = selection.filter(function(node) {
      return node.entry.path;
    });
    if (selection.length && !nodesWithPath.length) {
      var failedStatus = this.processStatus([]);
      (_a = failedStatus.fail).push.apply(_a, selection);
      this.showRestoreNotification(failedStatus);
      this.store.dispatch(new ReloadDocumentListAction());
      return;
    }
    var status;
    forkJoin(
      nodesWithPath.map(function(node) {
        return _this.restoreNode(node);
      })
    )
      .pipe(
        tap(function(restoredNodes) {
          status = _this.processStatus(restoredNodes);
        }),
        mergeMap(function() {
          return _this.contentApi.getDeletedNodes();
        })
      )
      .subscribe(function(nodes) {
        var selectedNodes = _this.diff(status.fail, selection, false);
        var remainingNodes = _this.diff(selectedNodes, nodes.list.entries);
        if (!remainingNodes.length) {
          _this.showRestoreNotification(status);
          _this.store.dispatch(new ReloadDocumentListAction());
        } else {
          _this.restoreDeletedNodes(remainingNodes);
        }
      });
  };
  ContentManagementService.prototype.copyNodes = function(nodes) {
    var _this = this;
    zip(
      this.nodeActionsService.copyNodes(nodes),
      this.nodeActionsService.contentCopied
    ).subscribe(
      function(result) {
        var operationResult = result[0],
          newItems = result[1];
        _this.showCopyMessage(operationResult, nodes, newItems);
      },
      function(error) {
        _this.showCopyMessage(error, nodes);
      }
    );
  };
  ContentManagementService.prototype.showCopyMessage = function(
    info,
    nodes,
    newItems
  ) {
    var _this = this;
    var numberOfCopiedItems = newItems ? newItems.length : 0;
    var failedItems = nodes.length - numberOfCopiedItems;
    var i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';
    if (typeof info === 'string') {
      if (info.toLowerCase().indexOf('succes') !== -1) {
        var i18MessageSuffix = void 0;
        if (failedItems) {
          if (numberOfCopiedItems) {
            i18MessageSuffix =
              numberOfCopiedItems === 1 ? 'PARTIAL_SINGULAR' : 'PARTIAL_PLURAL';
          } else {
            i18MessageSuffix =
              failedItems === 1 ? 'FAIL_SINGULAR' : 'FAIL_PLURAL';
          }
        } else {
          i18MessageSuffix = numberOfCopiedItems === 1 ? 'SINGULAR' : 'PLURAL';
        }
        i18nMessageString = 'APP.MESSAGES.INFO.NODE_COPY.' + i18MessageSuffix;
      }
    } else {
      try {
        var statusCode = JSON.parse(info.message).error.statusCode;
        if (statusCode === 403) {
          i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
        }
      } catch (_a) {}
    }
    var undo =
      numberOfCopiedItems > 0
        ? this.translation.instant('APP.ACTIONS.UNDO')
        : '';
    var message = this.translation.instant(i18nMessageString, {
      success: numberOfCopiedItems,
      failed: failedItems
    });
    this.snackBar
      .open(message, undo, {
        panelClass: 'info-snackbar',
        duration: 3000
      })
      .onAction()
      .subscribe(function() {
        return _this.undoCopyNodes(newItems);
      });
  };
  ContentManagementService.prototype.undoCopyNodes = function(nodes) {
    var _this = this;
    var batch = this.nodeActionsService
      .flatten(nodes)
      .filter(function(item) {
        return item.entry;
      })
      .map(function(item) {
        return _this.contentApi.deleteNode(item.entry.id, { permanent: true });
      });
    forkJoin.apply(void 0, batch).subscribe(
      function() {
        _this.nodesDeleted.next(null);
        _this.store.dispatch(new ReloadDocumentListAction());
      },
      function(error) {
        var i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';
        var errorJson = null;
        try {
          errorJson = JSON.parse(error.message);
        } catch (_a) {}
        if (
          errorJson &&
          errorJson.error &&
          errorJson.error.statusCode === 403
        ) {
          i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
        }
        _this.store.dispatch(new SnackbarErrorAction(i18nMessageString));
      }
    );
  };
  ContentManagementService.prototype.moveNodes = function(nodes) {
    var _this = this;
    var permissionForMove = '!';
    zip(
      this.nodeActionsService.moveNodes(nodes, permissionForMove),
      this.nodeActionsService.contentMoved
    ).subscribe(
      function(result) {
        var operationResult = result[0],
          moveResponse = result[1];
        _this.showMoveMessage(nodes, operationResult, moveResponse);
        _this.store.dispatch(new ReloadDocumentListAction());
      },
      function(error) {
        _this.showMoveMessage(nodes, error);
      }
    );
  };
  ContentManagementService.prototype.undoMoveNodes = function(
    moveResponse,
    selectionParentId
  ) {
    var _this = this;
    var movedNodes =
      moveResponse && moveResponse['succeeded']
        ? moveResponse['succeeded']
        : [];
    var partiallyMovedNodes =
      moveResponse && moveResponse['partiallySucceeded']
        ? moveResponse['partiallySucceeded']
        : [];
    var restoreDeletedNodesBatch = this.nodeActionsService.moveDeletedEntries.map(
      function(folderEntry) {
        return _this.contentApi
          .restoreNode(folderEntry.nodeId || folderEntry.id)
          .pipe(
            map(function(node) {
              return node.entry;
            })
          );
      }
    );
    zip
      .apply(void 0, restoreDeletedNodesBatch.concat([of(null)]))
      .pipe(
        mergeMap(function() {
          var nodesToBeMovedBack = partiallyMovedNodes.concat(movedNodes);
          var revertMoveBatch = _this.nodeActionsService
            .flatten(nodesToBeMovedBack)
            .filter(function(node) {
              return node.entry || (node.itemMoved && node.itemMoved.entry);
            })
            .map(function(node) {
              if (node.itemMoved) {
                return _this.nodeActionsService.moveNodeAction(
                  node.itemMoved.entry,
                  node.initialParentId
                );
              } else {
                return _this.nodeActionsService.moveNodeAction(
                  node.entry,
                  selectionParentId
                );
              }
            });
          return zip.apply(void 0, revertMoveBatch.concat([of(null)]));
        })
      )
      .subscribe(
        function() {
          _this.store.dispatch(new ReloadDocumentListAction());
        },
        function(error) {
          var message = 'APP.MESSAGES.ERRORS.GENERIC';
          var errorJson = null;
          try {
            errorJson = JSON.parse(error.message);
          } catch (_a) {}
          if (
            errorJson &&
            errorJson.error &&
            errorJson.error.statusCode === 403
          ) {
            message = 'APP.MESSAGES.ERRORS.PERMISSION';
          }
          _this.store.dispatch(new SnackbarErrorAction(message));
        }
      );
  };
  ContentManagementService.prototype.deleteNodes = function(items) {
    var _this = this;
    var batch = [];
    items.forEach(function(node) {
      batch.push(_this.deleteNode(node));
    });
    forkJoin.apply(void 0, batch).subscribe(function(data) {
      var status = _this.processStatus(data);
      var message = _this.getDeleteMessage(status);
      if (message && status.someSucceeded) {
        message.duration = 10000;
        message.userAction = new SnackbarUserAction(
          'APP.ACTIONS.UNDO',
          new UndoDeleteNodesAction(status.success.slice())
        );
      }
      _this.store.dispatch(message);
      if (status.someSucceeded) {
        _this.nodesDeleted.next();
        _this.store.dispatch(new ReloadDocumentListAction());
      }
    });
  };
  ContentManagementService.prototype.undoDeleteNodes = function(items) {
    var _this = this;
    var batch = [];
    items.forEach(function(item) {
      batch.push(_this.undoDeleteNode(item));
    });
    forkJoin.apply(void 0, batch).subscribe(function(data) {
      var processedData = _this.processStatus(data);
      if (processedData.fail.length) {
        var message = _this.getUndoDeleteMessage(processedData);
        _this.store.dispatch(message);
      }
      if (processedData.someSucceeded) {
        _this.store.dispatch(new ReloadDocumentListAction());
      }
    });
  };
  ContentManagementService.prototype.undoDeleteNode = function(item) {
    var id = item.id,
      name = item.name;
    return this.contentApi.restoreNode(id).pipe(
      map(function() {
        return {
          id: id,
          name: name,
          status: 1
        };
      }),
      catchError(function() {
        return of({
          id: id,
          name: name,
          status: 0
        });
      })
    );
  };
  ContentManagementService.prototype.getUndoDeleteMessage = function(status) {
    if (status.someFailed && !status.oneFailed) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.NODE_RESTORE_PLURAL',
        { number: status.fail.length }
      );
    }
    if (status.oneFailed) {
      return new SnackbarErrorAction('APP.MESSAGES.ERRORS.NODE_RESTORE', {
        name: status.fail[0].name
      });
    }
    return null;
  };
  ContentManagementService.prototype.restoreNode = function(node) {
    var entry = node.entry;
    return this.contentApi.restoreNode(entry.id).pipe(
      map(function() {
        return {
          status: 1,
          entry: entry
        };
      }),
      catchError(function(error) {
        var statusCode = JSON.parse(error.message).error.statusCode;
        return of({
          status: 0,
          statusCode: statusCode,
          entry: entry
        });
      })
    );
  };
  ContentManagementService.prototype.purgeNodes = function(selection) {
    var _this = this;
    if (selection === void 0) {
      selection = [];
    }
    if (!selection.length) {
      return;
    }
    var batch = selection.map(function(node) {
      return _this.purgeDeletedNode(node);
    });
    forkJoin(batch).subscribe(function(purgedNodes) {
      var status = _this.processStatus(purgedNodes);
      if (status.success.length) {
        _this.store.dispatch(new ReloadDocumentListAction());
      }
      var message = _this.getPurgeMessage(status);
      if (message) {
        _this.store.dispatch(message);
      }
    });
  };
  ContentManagementService.prototype.purgeDeletedNode = function(node) {
    var id = node.id,
      name = node.name;
    return this.contentApi.purgeDeletedNode(id).pipe(
      map(function() {
        return {
          status: 1,
          id: id,
          name: name
        };
      }),
      catchError(function() {
        return of({
          status: 0,
          id: id,
          name: name
        });
      })
    );
  };
  ContentManagementService.prototype.processStatus = function(data) {
    if (data === void 0) {
      data = [];
    }
    var status = {
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
      reset: function() {
        this.fail = [];
        this.success = [];
      }
    };
    return data.reduce(function(acc, node) {
      if (node.status) {
        acc.success.push(node);
      } else {
        acc.fail.push(node);
      }
      return acc;
    }, status);
  };
  ContentManagementService.prototype.getPurgeMessage = function(status) {
    if (status.oneSucceeded && status.someFailed && !status.oneFailed) {
      return new SnackbarWarningAction(
        'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_SINGULAR',
        {
          name: status.success[0].name,
          failed: status.fail.length
        }
      );
    }
    if (status.someSucceeded && !status.oneSucceeded && status.someFailed) {
      return new SnackbarWarningAction(
        'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_PLURAL',
        {
          number: status.success.length,
          failed: status.fail.length
        }
      );
    }
    if (status.oneSucceeded) {
      return new SnackbarInfoAction(
        'APP.MESSAGES.INFO.TRASH.NODES_PURGE.SINGULAR',
        { name: status.success[0].name }
      );
    }
    if (status.oneFailed) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.SINGULAR',
        { name: status.fail[0].name }
      );
    }
    if (status.allSucceeded) {
      return new SnackbarInfoAction(
        'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PLURAL',
        { number: status.success.length }
      );
    }
    if (status.allFailed) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.PLURAL',
        { number: status.fail.length }
      );
    }
    return null;
  };
  ContentManagementService.prototype.showRestoreNotification = function(
    status
  ) {
    var message = this.getRestoreMessage(status);
    if (message) {
      if (status.oneSucceeded && !status.someFailed) {
        var isSite = this.isSite(status.success[0].entry);
        var path = status.success[0].entry.path;
        var parent_1 = path.elements[path.elements.length - 1];
        var route = isSite
          ? ['/libraries', parent_1.id]
          : ['/personal-files', parent_1.id];
        var navigate = void 0;
        if (this.isLibraryContent(path)) {
          navigate = new NavigateToParentFolder(status.success[0]);
        } else {
          navigate = new NavigateRouteAction(route);
        }
        message.userAction = new SnackbarUserAction(
          'APP.ACTIONS.VIEW',
          navigate
        );
      }
      this.store.dispatch(message);
    }
  };
  ContentManagementService.prototype.isSite = function(entry) {
    return entry.nodeType === 'st:site';
  };
  ContentManagementService.prototype.isLibraryContent = function(path) {
    if (
      path &&
      path.elements.length >= 2 &&
      path.elements[1].name === 'Sites'
    ) {
      return true;
    }
    return false;
  };
  ContentManagementService.prototype.getRestoreMessage = function(status) {
    if (status.someFailed && !status.oneFailed) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.PARTIAL_PLURAL',
        { number: status.fail.length }
      );
    }
    if (status.oneFailed && status.fail[0].statusCode) {
      if (status.fail[0].statusCode === 409) {
        return new SnackbarErrorAction(
          'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.NODE_EXISTS',
          { name: status.fail[0].entry.name }
        );
      } else {
        return new SnackbarErrorAction(
          'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.GENERIC',
          { name: status.fail[0].entry.name }
        );
      }
    }
    if (status.oneFailed && !status.fail[0].statusCode) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.LOCATION_MISSING',
        { name: status.fail[0].entry.name }
      );
    }
    if (status.allSucceeded && !status.oneSucceeded) {
      return new SnackbarInfoAction(
        'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.PLURAL'
      );
    }
    if (status.allSucceeded && status.oneSucceeded) {
      return new SnackbarInfoAction(
        'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.SINGULAR',
        { name: status.success[0].entry.name }
      );
    }
    return null;
  };
  ContentManagementService.prototype.diff = function(
    selection,
    list,
    fromList
  ) {
    if (fromList === void 0) {
      fromList = true;
    }
    var ids = selection.map(function(item) {
      return item.entry.id;
    });
    return list.filter(function(item) {
      if (fromList) {
        return ids.includes(item.entry.id) ? item : null;
      } else {
        return !ids.includes(item.entry.id) ? item : null;
      }
    });
  };
  ContentManagementService.prototype.deleteNode = function(node) {
    var name = node.entry.name;
    var id = node.entry.nodeId || node.entry.id;
    return this.contentApi.deleteNode(id).pipe(
      map(function() {
        return {
          id: id,
          name: name,
          status: 1
        };
      }),
      catchError(function() {
        return of({
          id: id,
          name: name,
          status: 0
        });
      })
    );
  };
  ContentManagementService.prototype.getDeleteMessage = function(status) {
    if (status.allFailed && !status.oneFailed) {
      return new SnackbarErrorAction(
        'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL',
        { number: status.fail.length }
      );
    }
    if (status.allSucceeded && !status.oneSucceeded) {
      return new SnackbarInfoAction('APP.MESSAGES.INFO.NODE_DELETION.PLURAL', {
        number: status.success.length
      });
    }
    if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
      return new SnackbarWarningAction(
        'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL',
        {
          success: status.success.length,
          failed: status.fail.length
        }
      );
    }
    if (status.someFailed && status.oneSucceeded) {
      return new SnackbarWarningAction(
        'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR',
        {
          success: status.success.length,
          failed: status.fail.length
        }
      );
    }
    if (status.oneFailed && !status.someSucceeded) {
      return new SnackbarErrorAction('APP.MESSAGES.ERRORS.NODE_DELETION', {
        name: status.fail[0].name
      });
    }
    if (status.oneSucceeded && !status.someFailed) {
      return new SnackbarInfoAction(
        'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR',
        { name: status.success[0].name }
      );
    }
    return null;
  };
  ContentManagementService.prototype.showMoveMessage = function(
    nodes,
    info,
    moveResponse
  ) {
    var _this = this;
    var succeeded =
      moveResponse && moveResponse['succeeded']
        ? moveResponse['succeeded'].length
        : 0;
    var partiallySucceeded =
      moveResponse && moveResponse['partiallySucceeded']
        ? moveResponse['partiallySucceeded'].length
        : 0;
    var failures =
      moveResponse && moveResponse['failed']
        ? moveResponse['failed'].length
        : 0;
    var successMessage = '';
    var partialSuccessMessage = '';
    var failedMessage = '';
    var errorMessage = '';
    if (typeof info === 'string') {
      // in case of success
      if (info.toLowerCase().indexOf('succes') !== -1) {
        var i18nMessageString = 'APP.MESSAGES.INFO.NODE_MOVE.';
        var i18MessageSuffix = '';
        if (succeeded) {
          i18MessageSuffix = succeeded === 1 ? 'SINGULAR' : 'PLURAL';
          successMessage = '' + i18nMessageString + i18MessageSuffix;
        }
        if (partiallySucceeded) {
          i18MessageSuffix =
            partiallySucceeded === 1 ? 'PARTIAL.SINGULAR' : 'PARTIAL.PLURAL';
          partialSuccessMessage = '' + i18nMessageString + i18MessageSuffix;
        }
        if (failures) {
          // if moving failed for ALL nodes, emit error
          if (failures === nodes.length) {
            var errors = this.nodeActionsService.flatten(
              moveResponse['failed']
            );
            errorMessage = this.getErrorMessage(errors[0]);
          } else {
            i18MessageSuffix = 'PARTIAL.FAIL';
            failedMessage = '' + i18nMessageString + i18MessageSuffix;
          }
        }
      } else {
        errorMessage = 'APP.MESSAGES.ERRORS.GENERIC';
      }
    } else {
      errorMessage = this.getErrorMessage(info);
    }
    var undo =
      succeeded + partiallySucceeded > 0
        ? this.translation.instant('APP.ACTIONS.UNDO')
        : '';
    failedMessage = errorMessage ? errorMessage : failedMessage;
    var beforePartialSuccessMessage =
      successMessage && partialSuccessMessage ? ' ' : '';
    var beforeFailedMessage =
      (successMessage || partialSuccessMessage) && failedMessage ? ' ' : '';
    var initialParentId = this.nodeActionsService.getEntryParentId(
      nodes[0].entry
    );
    var messages = this.translation.instant(
      [successMessage, partialSuccessMessage, failedMessage],
      { success: succeeded, failed: failures, partially: partiallySucceeded }
    );
    // TODO: review in terms of i18n
    this.snackBar
      .open(
        messages[successMessage] +
          beforePartialSuccessMessage +
          messages[partialSuccessMessage] +
          beforeFailedMessage +
          messages[failedMessage],
        undo,
        {
          panelClass: 'info-snackbar',
          duration: 3000
        }
      )
      .onAction()
      .subscribe(function() {
        return _this.undoMoveNodes(moveResponse, initialParentId);
      });
  };
  ContentManagementService.prototype.getErrorMessage = function(errorObject) {
    var i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';
    try {
      var statusCode = JSON.parse(errorObject.message).error.statusCode;
      if (statusCode === 409) {
        i18nMessageString = 'APP.MESSAGES.ERRORS.NODE_MOVE';
      } else if (statusCode === 403) {
        i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
      }
    } catch (err) {
      /* Do nothing, keep the original message */
    }
    return i18nMessageString;
  };
  ContentManagementService.prototype.getNodeInfo = function() {
    var _this = this;
    return this.store.select(getAppSelection).pipe(
      take(1),
      flatMap(function(_a) {
        var file = _a.file;
        var id = file.entry.nodeId || file.entry.guid;
        if (!id) {
          return of(file.entry);
        } else {
          return _this.contentApi.getNodeInfo(id);
        }
      })
    );
  };
  ContentManagementService.prototype.unlockNode = function(node) {
    var _this = this;
    this.contentApi.unlockNode(node.entry.id).catch(function() {
      _this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
          fileName: node.entry.name
        })
      );
    });
  };
  ContentManagementService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        AlfrescoApiService,
        Store,
        ContentApiService,
        NodePermissionService,
        MatDialog,
        NodeActionsService,
        TranslationService,
        MatSnackBar
      ])
    ],
    ContentManagementService
  );
  return ContentManagementService;
})();
export { ContentManagementService };
//# sourceMappingURL=content-management.service.js.map
