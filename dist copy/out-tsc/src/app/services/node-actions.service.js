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
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, of, zip, from } from 'rxjs';
import {
  AlfrescoApiService,
  ContentService,
  TranslationService,
  ThumbnailService
} from '@alfresco/adf-core';
import {
  DocumentListService,
  ContentNodeSelectorComponent,
  ContentNodeDialogService
} from '@alfresco/adf-content-services';
import { SitePaging } from '@alfresco/js-api';
import { ContentApiService } from '@alfresco/aca-shared';
import { catchError, map, mergeMap } from 'rxjs/operators';
export var BatchOperationType;
(function(BatchOperationType) {
  BatchOperationType['copy'] = 'copy';
  BatchOperationType['move'] = 'move';
})(BatchOperationType || (BatchOperationType = {}));
var NodeActionsService = /** @class */ (function() {
  function NodeActionsService(
    contentService,
    contentApi,
    dialog,
    documentListService,
    apiService,
    translation,
    thumbnailService
  ) {
    this.contentService = contentService;
    this.contentApi = contentApi;
    this.dialog = dialog;
    this.documentListService = documentListService;
    this.apiService = apiService;
    this.translation = translation;
    this.thumbnailService = thumbnailService;
    this.contentCopied = new Subject();
    this.contentMoved = new Subject();
    this.moveDeletedEntries = [];
    this.isSitesDestinationAvailable = false;
  }
  /**
   * Copy node list
   *
   * @param contentEntities nodes to copy
   * @param permission permission which is needed to apply the action
   */
  NodeActionsService.prototype.copyNodes = function(
    contentEntities,
    permission
  ) {
    return this.doBatchOperation(
      BatchOperationType.copy,
      contentEntities,
      permission
    );
  };
  /**
   * Move node list
   *
   * @param contentEntities nodes to move
   * @param permission permission which is needed to apply the action
   */
  NodeActionsService.prototype.moveNodes = function(
    contentEntities,
    permission
  ) {
    return this.doBatchOperation(
      BatchOperationType.move,
      contentEntities,
      permission
    );
  };
  /**
   * General method for performing the given operation (copy|move) to multiple nodes
   *
   * @param action the action to perform (copy|move)
   * @param contentEntities the contentEntities which have to have the action performed on
   * @param permission permission which is needed to apply the action
   */
  NodeActionsService.prototype.doBatchOperation = function(
    action,
    contentEntities,
    permission
  ) {
    var _this = this;
    var observable = new Subject();
    if (!this.isEntryEntitiesArray(contentEntities)) {
      observable.error(
        new Error(JSON.stringify({ error: { statusCode: 400 } }))
      );
    } else if (this.checkPermission(action, contentEntities, permission)) {
      var destinationSelection = this.getContentNodeSelection(
        action,
        contentEntities
      );
      destinationSelection.subscribe(function(selections) {
        var contentEntry = contentEntities[0].entry;
        // Check if there's nodeId for Shared Files
        var contentEntryId = contentEntry.nodeId || contentEntry.id;
        var type = contentEntry.isFolder ? 'folder' : 'content';
        var batch = [];
        // consider only first item in the selection
        var selection = selections[0];
        var action$;
        if (
          action === BatchOperationType.move &&
          contentEntities.length === 1 &&
          type === 'content'
        ) {
          action$ = _this.documentListService.moveNode(
            contentEntryId,
            selection.id
          );
        } else {
          contentEntities.forEach(function(node) {
            // batch.push(this.copyNodeAction(node.entry, selection.id));
            batch.push(_this[action + 'NodeAction'](node.entry, selection.id));
          });
          action$ = zip.apply(void 0, batch);
        }
        action$.subscribe(function(newContent) {
          observable.next(
            'OPERATION.SUCCES.' +
              type.toUpperCase() +
              '.' +
              action.toUpperCase()
          );
          var processedData = _this.processResponse(newContent);
          if (action === BatchOperationType.copy) {
            _this.contentCopied.next(processedData.succeeded);
          } else if (action === BatchOperationType.move) {
            _this.contentMoved.next(processedData);
          }
        }, observable.error.bind(observable));
      });
    } else {
      observable.error(
        new Error(JSON.stringify({ error: { statusCode: 403 } }))
      );
    }
    return observable;
  };
  NodeActionsService.prototype.isEntryEntitiesArray = function(
    contentEntities
  ) {
    if (contentEntities && contentEntities.length) {
      var nonEntryNode = contentEntities.find(function(node) {
        return !node || !node.entry || !(node.entry.nodeId || node.entry.id);
      });
      return !nonEntryNode;
    }
    return false;
  };
  NodeActionsService.prototype.checkPermission = function(
    action,
    contentEntities,
    permission
  ) {
    var _this = this;
    var notAllowedNode = contentEntities.find(function(node) {
      return !_this.isActionAllowed(action, node.entry, permission);
    });
    return !notAllowedNode;
  };
  NodeActionsService.prototype.getEntryParentId = function(nodeEntry) {
    var entryParentId = '';
    if (nodeEntry.parentId) {
      entryParentId = nodeEntry.parentId;
    } else if (
      nodeEntry.path &&
      nodeEntry.path.elements &&
      nodeEntry.path.elements.length
    ) {
      entryParentId =
        nodeEntry.path.elements[nodeEntry.path.elements.length - 1].id;
    }
    return entryParentId;
  };
  NodeActionsService.prototype.getContentNodeSelection = function(
    action,
    contentEntities
  ) {
    var currentParentFolderId = this.getEntryParentId(contentEntities[0].entry);
    var customDropdown = new SitePaging({
      list: {
        entries: [
          {
            entry: {
              guid: '-my-',
              title: this.translation.instant(
                'APP.BROWSE.PERSONAL.SIDENAV_LINK.LABEL'
              )
            }
          },
          {
            entry: {
              guid: '-mysites-',
              title: this.translation.instant(
                'APP.BROWSE.LIBRARIES.SIDENAV_LINK.LABEL'
              )
            }
          }
        ]
      }
    });
    var title = this.getTitleTranslation(action, contentEntities);
    this.isSitesDestinationAvailable = false;
    var data = {
      title: title,
      currentFolderId: currentParentFolderId,
      actionName: action,
      dropdownHideMyFiles: true,
      dropdownSiteList: customDropdown,
      rowFilter: this.rowFilter.bind(this),
      imageResolver: this.imageResolver.bind(this),
      isSelectionValid: this.canCopyMoveInsideIt.bind(this),
      breadcrumbTransform: this.customizeBreadcrumb.bind(this),
      select: new Subject(),
      excludeSiteContent: ContentNodeDialogService.nonDocumentSiteContent
    };
    this.dialog.open(ContentNodeSelectorComponent, {
      data: data,
      panelClass: 'adf-content-node-selector-dialog',
      width: '630px'
    });
    data.select.subscribe({
      complete: this.close.bind(this)
    });
    return data.select;
  };
  NodeActionsService.prototype.getTitleTranslation = function(action, nodes) {
    if (nodes === void 0) {
      nodes = [];
    }
    var keyPrefix = 'ITEMS';
    var name = '';
    if (nodes.length === 1 && nodes[0].entry.name) {
      name = nodes[0].entry.name;
      keyPrefix = 'ITEM';
    }
    var number = nodes.length;
    return this.translation.instant(
      'NODE_SELECTOR.' + action.toUpperCase() + '_' + keyPrefix,
      { name: name, number: number }
    );
  };
  NodeActionsService.prototype.canCopyMoveInsideIt = function(entry) {
    return this.hasEntityCreatePermission(entry) && !this.isSite(entry);
  };
  NodeActionsService.prototype.hasEntityCreatePermission = function(entry) {
    return this.contentService.hasAllowableOperations(entry, 'create');
  };
  NodeActionsService.prototype.isSite = function(entry) {
    return (
      !!entry.guid ||
      entry.nodeType === 'st:site' ||
      entry.nodeType === 'st:sites'
    );
  };
  NodeActionsService.prototype.close = function() {
    this.dialog.closeAll();
  };
  // todo: review this approach once 5.2.3 is out
  NodeActionsService.prototype.customizeBreadcrumb = function(node) {
    if (node && node.path && node.path.elements) {
      var elements = node.path.elements;
      if (elements.length > 1) {
        if (elements[1].name === 'User Homes') {
          elements.splice(0, 2);
          // make sure first item is 'Personal Files'
          if (elements[0]) {
            elements[0].name = this.translation.instant(
              'APP.BROWSE.PERSONAL.TITLE'
            );
            elements[0].id = '-my-';
          } else {
            node.name = this.translation.instant('APP.BROWSE.PERSONAL.TITLE');
          }
        } else if (elements[1].name === 'Sites') {
          this.normalizeSitePath(node);
        }
      } else if (elements.length === 1) {
        if (node.name === 'Sites') {
          node.name = this.translation.instant('APP.BROWSE.LIBRARIES.TITLE');
          elements.splice(0, 1);
        }
      }
    } else if (node === null && this.isSitesDestinationAvailable) {
      node = {
        name: this.translation.instant('APP.BROWSE.LIBRARIES.TITLE'),
        path: { elements: [] }
      };
    }
    return node;
  };
  // todo: review this approach once 5.2.3 is out
  NodeActionsService.prototype.normalizeSitePath = function(node) {
    var elements = node.path.elements;
    // remove 'Company Home'
    elements.splice(0, 1);
    // replace first item with 'File Libraries'
    elements[0].name = this.translation.instant('APP.BROWSE.LIBRARIES.TITLE');
    elements[0].id = '-mysites-';
    if (this.isSiteContainer(node)) {
      // rename 'documentLibrary' entry to the target site display name
      // clicking on the breadcrumb entry loads the site content
      node.name = elements[1].name;
      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      var docLib = elements.findIndex(function(el) {
        return el.name === 'documentLibrary';
      });
      if (docLib > -1) {
        elements.splice(docLib, 1);
      }
    }
  };
  NodeActionsService.prototype.isSiteContainer = function(node) {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  };
  NodeActionsService.prototype.copyNodeAction = function(
    nodeEntry,
    selectionId
  ) {
    if (nodeEntry.isFolder) {
      return this.copyFolderAction(nodeEntry, selectionId);
    } else {
      // any other type is treated as 'content'
      return this.copyContentAction(nodeEntry, selectionId);
    }
  };
  NodeActionsService.prototype.copyContentAction = function(
    contentEntry,
    selectionId,
    oldName
  ) {
    var _this = this;
    var _oldName = oldName || contentEntry.name;
    // Check if there's nodeId for Shared Files
    var contentEntryId = contentEntry.nodeId || contentEntry.id;
    // use local method until new name parameter is added on ADF copyNode
    return this.copyNode(contentEntryId, selectionId, _oldName).pipe(
      catchError(function(err) {
        var errStatusCode;
        try {
          var statusCode = JSON.parse(err.message).error.statusCode;
          errStatusCode = statusCode;
        } catch (e) {
          //
        }
        if (errStatusCode && errStatusCode === 409) {
          return _this.copyContentAction(
            contentEntry,
            selectionId,
            _this.getNewNameFrom(_oldName, contentEntry.name)
          );
        } else {
          // do not throw error, to be able to show message in case of partial copy of files
          return of(err || 'Server error');
        }
      })
    );
  };
  NodeActionsService.prototype.copyFolderAction = function(
    contentEntry,
    selectionId
  ) {
    var _this = this;
    // Check if there's nodeId for Shared Files
    var contentEntryId = contentEntry.nodeId || contentEntry.id;
    var $destinationFolder;
    var $childrenToCopy;
    var newDestinationFolder;
    return this.copyNode(contentEntryId, selectionId, contentEntry.name).pipe(
      catchError(function(err) {
        var errStatusCode;
        try {
          var statusCode = JSON.parse(err.message).error.statusCode;
          errStatusCode = statusCode;
        } catch (_a) {}
        if (errStatusCode && errStatusCode === 409) {
          $destinationFolder = _this.getChildByName(
            selectionId,
            contentEntry.name
          );
          $childrenToCopy = _this.getNodeChildren(contentEntryId);
          return $destinationFolder.pipe(
            mergeMap(function(destination) {
              newDestinationFolder = destination;
              return $childrenToCopy;
            }),
            mergeMap(function(nodesToCopy) {
              var batch = [];
              nodesToCopy.list.entries.forEach(function(node) {
                if (node.entry.isFolder) {
                  batch.push(
                    _this.copyFolderAction(
                      node.entry,
                      newDestinationFolder.entry.id
                    )
                  );
                } else {
                  batch.push(
                    _this.copyContentAction(
                      node.entry,
                      newDestinationFolder.entry.id
                    )
                  );
                }
              });
              if (!batch.length) {
                return of({});
              }
              return zip.apply(void 0, batch);
            })
          );
        } else {
          // do not throw error, to be able to show message in case of partial copy of files
          return of(err || 'Server error');
        }
      })
    );
  };
  NodeActionsService.prototype.moveNodeAction = function(
    nodeEntry,
    selectionId
  ) {
    var _this = this;
    this.moveDeletedEntries = [];
    if (nodeEntry.isFolder) {
      var initialParentId_1 = nodeEntry.parentId;
      return this.moveFolderAction(nodeEntry, selectionId).pipe(
        mergeMap(function(newContent) {
          // take no extra action, if folder is moved to the same location
          if (initialParentId_1 === selectionId) {
            return of(newContent);
          }
          var flattenResponse = _this.flatten(newContent);
          var processedData = _this.processResponse(flattenResponse);
          // else, check if moving this nodeEntry succeeded for ALL of its nodes
          if (processedData.failed.length === 0) {
            // check if folder still exists on location
            return _this.getChildByName(initialParentId_1, nodeEntry.name).pipe(
              mergeMap(function(folderOnInitialLocation) {
                if (folderOnInitialLocation) {
                  // Check if there's nodeId for Shared Files
                  var nodeEntryId = nodeEntry.nodeId || nodeEntry.id;
                  // delete it from location
                  return _this.contentApi.deleteNode(nodeEntryId).pipe(
                    mergeMap(function() {
                      _this.moveDeletedEntries.push(nodeEntry);
                      return of(newContent);
                    })
                  );
                }
                return of(newContent);
              })
            );
          }
          return of(newContent);
        })
      );
    } else {
      // any other type is treated as 'content'
      return this.moveContentAction(nodeEntry, selectionId);
    }
  };
  NodeActionsService.prototype.moveFolderAction = function(
    contentEntry,
    selectionId
  ) {
    var _this = this;
    // Check if there's nodeId for Shared Files
    var contentEntryId = contentEntry.nodeId || contentEntry.id;
    var initialParentId = this.getEntryParentId(contentEntry);
    var $destinationFolder;
    var $childrenToMove;
    var newDestinationFolder;
    return this.documentListService.moveNode(contentEntryId, selectionId).pipe(
      map(function(itemMoved) {
        return { itemMoved: itemMoved, initialParentId: initialParentId };
      }),
      catchError(function(err) {
        var errStatusCode;
        try {
          var statusCode = JSON.parse(err.message).error.statusCode;
          errStatusCode = statusCode;
        } catch (e) {
          //
        }
        if (errStatusCode && errStatusCode === 409) {
          $destinationFolder = _this.getChildByName(
            selectionId,
            contentEntry.name
          );
          $childrenToMove = _this.getNodeChildren(contentEntryId);
          return $destinationFolder.pipe(
            mergeMap(function(destination) {
              newDestinationFolder = destination;
              return $childrenToMove;
            }),
            mergeMap(function(childrenToMove) {
              var batch = [];
              childrenToMove.list.entries.forEach(function(node) {
                if (node.entry.isFolder) {
                  batch.push(
                    _this.moveFolderAction(
                      node.entry,
                      newDestinationFolder.entry.id
                    )
                  );
                } else {
                  batch.push(
                    _this.moveContentAction(
                      node.entry,
                      newDestinationFolder.entry.id
                    )
                  );
                }
              });
              if (!batch.length) {
                return of(batch);
              }
              return zip.apply(void 0, batch);
            })
          );
        } else {
          // do not throw error, to be able to show message in case of partial move of files
          return of(err);
        }
      })
    );
  };
  NodeActionsService.prototype.moveContentAction = function(
    contentEntry,
    selectionId
  ) {
    // Check if there's nodeId for Shared Files
    var contentEntryId = contentEntry.nodeId || contentEntry.id;
    var initialParentId = this.getEntryParentId(contentEntry);
    return this.documentListService.moveNode(contentEntryId, selectionId).pipe(
      map(function(itemMoved) {
        return { itemMoved: itemMoved, initialParentId: initialParentId };
      }),
      catchError(function(err) {
        // do not throw error, to be able to show message in case of partial move of files
        return of(err);
      })
    );
  };
  NodeActionsService.prototype.getChildByName = function(parentId, name) {
    var matchedNodes = new Subject();
    this.getNodeChildren(parentId).subscribe(
      function(childrenNodes) {
        var result = childrenNodes.list.entries.find(function(node) {
          return node.entry.name === name;
        });
        if (result) {
          matchedNodes.next(result);
        } else {
          matchedNodes.next(null);
        }
      },
      function(err) {
        return of(err || 'Server error');
      }
    );
    return matchedNodes;
  };
  NodeActionsService.prototype.isActionAllowed = function(
    action,
    node,
    permission
  ) {
    if (action === BatchOperationType.copy) {
      return true;
    }
    return this.contentService.hasAllowableOperations(node, permission);
  };
  NodeActionsService.prototype.rowFilter = function(row) {
    var node = row.node.entry;
    this.isSitesDestinationAvailable = !!node['guid'];
    return !node.isFile && node.nodeType !== 'app:folderlink';
  };
  NodeActionsService.prototype.imageResolver = function(row, _) {
    var entry = row.node.entry;
    if (!this.contentService.hasAllowableOperations(entry, 'update')) {
      return this.thumbnailService.getMimeTypeIcon('disable/folder');
    }
    return null;
  };
  NodeActionsService.prototype.getNewNameFrom = function(name, baseName) {
    var extensionMatch = name.match(/\.[^/.]+$/);
    // remove extension in case there is one
    var fileExtension = extensionMatch ? extensionMatch[0] : '';
    var extensionFree = extensionMatch
      ? name.slice(0, extensionMatch.index)
      : name;
    var prefixNumber = 1;
    var baseExtensionFree;
    if (baseName) {
      var baseExtensionMatch = baseName.match(/\.[^/.]+$/);
      // remove extension in case there is one
      baseExtensionFree = baseExtensionMatch
        ? baseName.slice(0, baseExtensionMatch.index)
        : baseName;
    }
    if (!baseExtensionFree || baseExtensionFree !== extensionFree) {
      // check if name already has integer appended on end:
      var oldPrefix = extensionFree.match('-[0-9]+$');
      if (oldPrefix) {
        // if so, try to get the number at the end
        var oldPrefixNumber = parseInt(oldPrefix[0].slice(1), 10);
        if (oldPrefixNumber.toString() === oldPrefix[0].slice(1)) {
          extensionFree = extensionFree.slice(0, oldPrefix.index);
          prefixNumber = oldPrefixNumber + 1;
        }
      }
    }
    return extensionFree + '-' + prefixNumber + fileExtension;
  };
  /**
   * Get children nodes of given parent node
   *
   * @param nodeId The id of the parent node
   * @param params optional parameters
   */
  NodeActionsService.prototype.getNodeChildren = function(nodeId, params) {
    return from(
      this.apiService.getInstance().nodes.getNodeChildren(nodeId, params)
    );
  };
  // Copied from ADF document-list.service, and added the name parameter
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  NodeActionsService.prototype.copyNode = function(
    nodeId,
    targetParentId,
    name
  ) {
    return from(
      this.apiService
        .getInstance()
        .nodes.copyNode(nodeId, { targetParentId: targetParentId, name: name })
    );
  };
  NodeActionsService.prototype.flatten = function(nDimArray) {
    if (!Array.isArray(nDimArray)) {
      return nDimArray;
    }
    var nodeQueue = nDimArray.slice(0);
    var resultingArray = [];
    do {
      nodeQueue.forEach(function(node) {
        if (Array.isArray(node)) {
          nodeQueue.push.apply(nodeQueue, node);
        } else {
          resultingArray.push(node);
        }
        var nodeIndex = nodeQueue.indexOf(node);
        nodeQueue.splice(nodeIndex, 1);
      });
    } while (nodeQueue.length);
    return resultingArray;
  };
  NodeActionsService.prototype.processResponse = function(data) {
    var _this = this;
    var moveStatus = {
      succeeded: [],
      failed: [],
      partiallySucceeded: []
    };
    if (Array.isArray(data)) {
      return data.reduce(function(acc, next) {
        if (next instanceof Error) {
          acc.failed.push(next);
        } else if (Array.isArray(next)) {
          // if content of a folder was moved
          var folderMoveResponseData = _this.flatten(next);
          var foundError = folderMoveResponseData.find(function(node) {
            return node instanceof Error;
          });
          // data might contain also items of form: { itemMoved, initialParentId }
          var foundEntry = folderMoveResponseData.find(function(node) {
            return (
              (node.itemMoved && node.itemMoved.entry) || (node && node.entry)
            );
          });
          if (!foundError) {
            // consider success if NONE of the items from the folder move response is an error
            acc.succeeded.push(next);
          } else if (!foundEntry) {
            // consider failed if NONE of the items has an entry
            acc.failed.push(next);
          } else {
            // partially move folder
            acc.partiallySucceeded.push(next);
          }
        } else {
          acc.succeeded.push(next);
        }
        return acc;
      }, moveStatus);
    } else {
      if ((data.itemMoved && data.itemMoved.entry) || (data && data.entry)) {
        moveStatus.succeeded.push(data);
      } else {
        moveStatus.failed.push(data);
      }
      return moveStatus;
    }
  };
  NodeActionsService.SNACK_MESSAGE_DURATION_WITH_UNDO = 10000;
  NodeActionsService.SNACK_MESSAGE_DURATION = 3000;
  NodeActionsService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        ContentService,
        ContentApiService,
        MatDialog,
        DocumentListService,
        AlfrescoApiService,
        TranslationService,
        ThumbnailService
      ])
    ],
    NodeActionsService
  );
  return NodeActionsService;
})();
export { NodeActionsService };
//# sourceMappingURL=node-actions.service.js.map
