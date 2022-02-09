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
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, of, zip, from } from 'rxjs';
import { AlfrescoApiService, ContentService, DataColumn, TranslationService, ThumbnailService } from '@alfresco/adf-core';
import {
  DocumentListService,
  ContentNodeSelectorComponent,
  ContentNodeSelectorComponentData,
  ContentNodeDialogService,
  ShareDataRow,
  NodeAction
} from '@alfresco/adf-content-services';
import {
  MinimalNodeEntity,
  MinimalNodeEntryEntity,
  SitePaging,
  NodeChildAssociationPaging,
  NodeChildAssociationEntry,
  NodesApi
} from '@alfresco/js-api';
import { ContentApiService } from '@alfresco/aca-shared';
import { catchError, map, mergeMap } from 'rxjs/operators';

type BatchOperationType = Extract<NodeAction, NodeAction.COPY | NodeAction.MOVE>;

@Injectable({
  providedIn: 'root'
})
export class NodeActionsService {
  contentCopied: Subject<MinimalNodeEntity[]> = new Subject<MinimalNodeEntity[]>();
  contentMoved: Subject<any> = new Subject<any>();
  moveDeletedEntries: any[] = [];
  isSitesDestinationAvailable = false;

  _nodesApi: NodesApi;
  get nodesApi(): NodesApi {
    this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
    return this._nodesApi;
  }

  constructor(
    private contentService: ContentService,
    private contentApi: ContentApiService,
    private dialog: MatDialog,
    private documentListService: DocumentListService,
    private apiService: AlfrescoApiService,
    private translation: TranslationService,
    private thumbnailService: ThumbnailService
  ) {}

  /**
   * Copy node list
   *
   * @param contentEntities nodes to copy
   * @param permission permission which is needed to apply the action
   */
  copyNodes(contentEntities: any[], permission?: string): Subject<string> {
    return this.doBatchOperation(NodeAction.COPY, contentEntities, permission);
  }

  /**
   * Move node list
   *
   * @param contentEntities nodes to move
   * @param permission permission which is needed to apply the action
   */
  moveNodes(contentEntities: any[], permission?: string): Subject<string> {
    return this.doBatchOperation(NodeAction.MOVE, contentEntities, permission);
  }

  /**
   * General method for performing the given operation (copy|move) to multiple nodes
   *
   * @param action the action to perform (copy|move)
   * @param contentEntities the contentEntities which have to have the action performed on
   * @param permission permission which is needed to apply the action
   */
  doBatchOperation(action: BatchOperationType, contentEntities: any[], permission?: string): Subject<string> {
    const observable: Subject<string> = new Subject<string>();

    if (!this.isEntryEntitiesArray(contentEntities)) {
      observable.error(new Error(JSON.stringify({ error: { statusCode: 400 } })));
    } else if (this.checkPermission(action, contentEntities, permission)) {
      const destinationSelection = this.getContentNodeSelection(action, contentEntities);
      destinationSelection.subscribe((selections: MinimalNodeEntryEntity[]) => {
        const contentEntry = contentEntities[0].entry;
        // Check if there's nodeId for Shared Files
        const contentEntryId = contentEntry.nodeId || contentEntry.id;
        const type = contentEntry.isFolder ? 'folder' : 'content';
        const batch: any[] = [];

        // consider only first item in the selection
        const selection = selections[0];
        let action$: Observable<any>;

        if (action === NodeAction.MOVE && contentEntities.length === 1 && type === 'content') {
          action$ = this.documentListService.moveNode(contentEntryId, selection.id);
        } else {
          contentEntities.forEach((node) => {
            // batch.push(this.copyNodeAction(node.entry, selection.id));
            batch.push(this[`${action.toLowerCase()}NodeAction`](node.entry, selection.id));
          });
          action$ = zip(...batch);
        }

        action$.subscribe((newContent) => {
          observable.next(`OPERATION.SUCCESS.${type.toUpperCase()}.${action.toUpperCase()}`);

          const processedData = this.processResponse(newContent);
          if (action === NodeAction.COPY) {
            this.contentCopied.next(processedData.succeeded);
          } else if (action === NodeAction.MOVE) {
            this.contentMoved.next(processedData);
          }
        }, observable.error.bind(observable));
      });
    } else {
      observable.error(new Error(JSON.stringify({ error: { statusCode: 403 } })));
    }

    return observable;
  }

  isEntryEntitiesArray(contentEntities: any[]): boolean {
    if (contentEntities && contentEntities.length) {
      const nonEntryNode = contentEntities.find((node) => !node || !node.entry || !(node.entry.nodeId || node.entry.id));
      return !nonEntryNode;
    }
    return false;
  }

  checkPermission(action: BatchOperationType, contentEntities: any[], permission?: string) {
    const notAllowedNode = contentEntities.find((node) => !this.isActionAllowed(action, node.entry, permission));
    return !notAllowedNode;
  }

  getEntryParentId(nodeEntry: MinimalNodeEntryEntity) {
    let entryParentId = '';

    if (nodeEntry.parentId) {
      entryParentId = nodeEntry.parentId;
    } else if (nodeEntry.path && nodeEntry.path.elements && nodeEntry.path.elements.length) {
      entryParentId = nodeEntry.path.elements[nodeEntry.path.elements.length - 1].id;
    }

    return entryParentId;
  }

  getContentNodeSelection(action: NodeAction, contentEntities: MinimalNodeEntity[]): Subject<MinimalNodeEntryEntity[]> {
    const currentParentFolderId = this.getEntryParentId(contentEntities[0].entry);

    const customDropdown = new SitePaging({
      list: {
        entries: [
          {
            entry: {
              guid: '-my-',
              title: this.translation.instant('APP.BROWSE.PERSONAL.SIDENAV_LINK.LABEL')
            }
          },
          {
            entry: {
              guid: '-mysites-',
              title: this.translation.instant('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.SIDENAV_LINK.LABEL')
            }
          }
        ]
      }
    });

    const title = this.getTitleTranslation(action, contentEntities);

    this.isSitesDestinationAvailable = false;
    const data: ContentNodeSelectorComponentData = {
      selectionMode: 'single',
      title,
      currentFolderId: currentParentFolderId,
      actionName: action,
      dropdownHideMyFiles: true,
      dropdownSiteList: customDropdown,
      rowFilter: this.rowFilter.bind(this),
      imageResolver: this.imageResolver.bind(this),
      isSelectionValid: this.canCopyMoveInsideIt.bind(this),
      breadcrumbTransform: this.customizeBreadcrumb.bind(this),
      select: new Subject<MinimalNodeEntryEntity[]>(),
      excludeSiteContent: ContentNodeDialogService.nonDocumentSiteContent
    };

    this.dialog.open(ContentNodeSelectorComponent, {
      data,
      panelClass: 'adf-content-node-selector-dialog',
      width: '630px'
    });

    data.select.subscribe({
      complete: this.close.bind(this)
    });

    return data.select;
  }

  getTitleTranslation(action: string, nodes: MinimalNodeEntity[] = []): string {
    let keyPrefix = 'ITEMS';
    let name = '';

    if (nodes.length === 1 && nodes[0].entry.name) {
      name = nodes[0].entry.name;
      keyPrefix = 'ITEM';
    }

    const number = nodes.length;
    return this.translation.instant(`NODE_SELECTOR.${action.toUpperCase()}_${keyPrefix}`, { name, number });
  }

  private canCopyMoveInsideIt(entry: MinimalNodeEntryEntity): boolean {
    return this.hasEntityCreatePermission(entry) && !this.isSite(entry);
  }

  private hasEntityCreatePermission(entry: MinimalNodeEntryEntity): boolean {
    return this.contentService.hasAllowableOperations(entry, 'create');
  }

  private isSite(entry) {
    return !!entry.guid || entry.nodeType === 'st:site' || entry.nodeType === 'st:sites';
  }

  close() {
    this.dialog.closeAll();
  }

  // todo: review this approach once 5.2.3 is out
  private customizeBreadcrumb(node: MinimalNodeEntryEntity) {
    if (node && node.path && node.path.elements) {
      const elements = node.path.elements;

      if (elements.length > 1) {
        if (elements[1].name === 'User Homes') {
          elements.splice(0, 2);

          // make sure first item is 'Personal Files'
          if (elements[0]) {
            elements[0].name = this.translation.instant('APP.BROWSE.PERSONAL.TITLE');
            elements[0].id = '-my-';
          } else {
            node.name = this.translation.instant('APP.BROWSE.PERSONAL.TITLE');
          }
        } else if (elements[1].name === 'Sites') {
          this.normalizeSitePath(node);
        }
      } else if (elements.length === 1) {
        if (node.name === 'Sites') {
          node.name = this.translation.instant('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');
          elements.splice(0, 1);
        }
      }
    } else if (node === null && this.isSitesDestinationAvailable) {
      node = {
        name: this.translation.instant('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE'),
        path: { elements: [] }
      } as any;
    }

    return node;
  }

  // todo: review this approach once 5.2.3 is out
  private normalizeSitePath(node: MinimalNodeEntryEntity) {
    const elements = node.path.elements;

    // remove 'Company Home'
    elements.splice(0, 1);

    // replace first item with 'File Libraries'
    elements[0].name = this.translation.instant('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');
    elements[0].id = '-mysites-';

    if (this.isSiteContainer(node)) {
      // rename 'documentLibrary' entry to the target site display name
      // clicking on the breadcrumb entry loads the site content
      node.name = elements[1].name;

      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      const docLib = elements.findIndex((el) => el.name === 'documentLibrary');
      if (docLib > -1) {
        elements.splice(docLib, 1);
      }
    }
  }

  isSiteContainer(node: MinimalNodeEntryEntity): boolean {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  }

  copyNodeAction(nodeEntry: any, selectionId: string): Observable<any> {
    if (nodeEntry.isFolder) {
      return this.copyFolderAction(nodeEntry, selectionId);
    } else {
      // any other type is treated as 'content'
      return this.copyContentAction(nodeEntry, selectionId);
    }
  }

  copyContentAction(contentEntry: any, selectionId: string, oldName?: string): Observable<any> {
    const _oldName = oldName || contentEntry.name;
    // Check if there's nodeId for Shared Files
    const contentEntryId = contentEntry.nodeId || contentEntry.id;

    // use local method until new name parameter is added on ADF copyNode
    return this.copyNode(contentEntryId, selectionId, _oldName).pipe(
      catchError((err) => {
        let errStatusCode;
        try {
          const {
            error: { statusCode }
          } = JSON.parse(err.message);
          errStatusCode = statusCode;
        } catch (e) {
          //
        }

        if (errStatusCode && errStatusCode === 409) {
          return this.copyContentAction(contentEntry, selectionId, this.getNewNameFrom(_oldName, contentEntry.name));
        } else {
          // do not throw error, to be able to show message in case of partial copy of files
          return of(err || 'Server error');
        }
      })
    );
  }

  copyFolderAction(contentEntry: any, selectionId: string): Observable<any> {
    // Check if there's nodeId for Shared Files
    const contentEntryId = contentEntry.nodeId || contentEntry.id;
    let $destinationFolder: Observable<any>;
    let $childrenToCopy: Observable<any>;
    let newDestinationFolder;

    return this.copyNode(contentEntryId, selectionId, contentEntry.name).pipe(
      catchError((err) => {
        let errStatusCode;
        try {
          const {
            error: { statusCode }
          } = JSON.parse(err.message);
          errStatusCode = statusCode;
        } catch {}

        if (errStatusCode && errStatusCode === 409) {
          $destinationFolder = this.getChildByName(selectionId, contentEntry.name);
          $childrenToCopy = this.getNodeChildren(contentEntryId);

          return $destinationFolder.pipe(
            mergeMap((destination) => {
              newDestinationFolder = destination;
              return $childrenToCopy;
            }),
            mergeMap((nodesToCopy) => {
              const batch = [];
              nodesToCopy.list.entries.forEach((node) => {
                if (node.entry.isFolder) {
                  batch.push(this.copyFolderAction(node.entry, newDestinationFolder.entry.id));
                } else {
                  batch.push(this.copyContentAction(node.entry, newDestinationFolder.entry.id));
                }
              });

              if (!batch.length) {
                return of({});
              }
              return zip(...batch);
            })
          );
        } else {
          // do not throw error, to be able to show message in case of partial copy of files
          return of(err || 'Server error');
        }
      })
    );
  }

  moveNodeAction(nodeEntry, selectionId: string): Observable<any> {
    this.moveDeletedEntries = [];

    if (nodeEntry.isFolder) {
      const initialParentId = nodeEntry.parentId;

      return this.moveFolderAction(nodeEntry, selectionId).pipe(
        mergeMap((newContent) => {
          // take no extra action, if folder is moved to the same location
          if (initialParentId === selectionId) {
            return of(newContent);
          }

          const flattenResponse = this.flatten(newContent);
          const processedData = this.processResponse(flattenResponse);

          // else, check if moving this nodeEntry succeeded for ALL of its nodes
          if (processedData.failed.length === 0) {
            // check if folder still exists on location
            return this.getChildByName(initialParentId, nodeEntry.name).pipe(
              mergeMap((folderOnInitialLocation) => {
                if (folderOnInitialLocation) {
                  // Check if there's nodeId for Shared Files
                  const nodeEntryId = nodeEntry.nodeId || nodeEntry.id;
                  // delete it from location
                  return this.contentApi.deleteNode(nodeEntryId).pipe(
                    mergeMap(() => {
                      this.moveDeletedEntries.push(nodeEntry);
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
  }

  moveFolderAction(contentEntry, selectionId: string): Observable<any> {
    // Check if there's nodeId for Shared Files
    const contentEntryId = contentEntry.nodeId || contentEntry.id;
    const initialParentId = this.getEntryParentId(contentEntry);
    let $destinationFolder: Observable<any>;
    let $childrenToMove: Observable<any>;
    let newDestinationFolder;

    return this.documentListService.moveNode(contentEntryId, selectionId).pipe(
      map((itemMoved) => ({ itemMoved, initialParentId })),
      catchError((err) => {
        let errStatusCode;
        try {
          const {
            error: { statusCode }
          } = JSON.parse(err.message);
          errStatusCode = statusCode;
        } catch (e) {
          //
        }

        if (errStatusCode && errStatusCode === 409) {
          $destinationFolder = this.getChildByName(selectionId, contentEntry.name);
          $childrenToMove = this.getNodeChildren(contentEntryId);

          return $destinationFolder.pipe(
            mergeMap((destination) => {
              newDestinationFolder = destination;
              return $childrenToMove;
            }),
            mergeMap((childrenToMove) => {
              const batch: any[] = [];
              childrenToMove.list.entries.forEach((node) => {
                if (node.entry.isFolder) {
                  batch.push(this.moveFolderAction(node.entry, newDestinationFolder.entry.id));
                } else {
                  batch.push(this.moveContentAction(node.entry, newDestinationFolder.entry.id));
                }
              });

              if (!batch.length) {
                return of(batch);
              }
              return zip(...batch);
            })
          );
        } else {
          // do not throw error, to be able to show message in case of partial move of files
          return of(err);
        }
      })
    );
  }

  moveContentAction(contentEntry: any, selectionId: string) {
    // Check if there's nodeId for Shared Files
    const contentEntryId = contentEntry.nodeId || contentEntry.id;
    const initialParentId = this.getEntryParentId(contentEntry);

    return this.documentListService.moveNode(contentEntryId, selectionId).pipe(
      map((itemMoved) => ({ itemMoved, initialParentId })),
      catchError((err) =>
        // do not throw error, to be able to show message in case of partial move of files
        of(err)
      )
    );
  }

  getChildByName(parentId: string, name: string): Subject<NodeChildAssociationEntry> {
    const matchedNodes = new Subject<any>();

    this.getNodeChildren(parentId).subscribe(
      (childrenNodes: NodeChildAssociationPaging) => {
        const result = childrenNodes.list.entries.find((node) => node.entry.name === name);

        if (result) {
          matchedNodes.next(result);
        } else {
          matchedNodes.next(null);
        }
      },
      (err) => matchedNodes.error(err)
    );
    return matchedNodes;
  }

  private isActionAllowed(action: BatchOperationType, node: MinimalNodeEntryEntity, permission?: string): boolean {
    if (action === NodeAction.COPY) {
      return true;
    }
    return this.contentService.hasAllowableOperations(node, permission);
  }

  private rowFilter(row: ShareDataRow): boolean {
    const node: MinimalNodeEntryEntity = row.node.entry;

    this.isSitesDestinationAvailable = !!node['guid'];
    return !node.isFile && node.nodeType !== 'app:folderlink';
  }

  private imageResolver(row: ShareDataRow, _: DataColumn): string | null {
    const entry: MinimalNodeEntryEntity = row.node.entry;
    if (!this.contentService.hasAllowableOperations(entry, 'update')) {
      return this.thumbnailService.getMimeTypeIcon('disable/folder');
    }

    return null;
  }

  public getNewNameFrom(name: string, baseName?: string) {
    const extensionMatch = name.match(/\.[^/.]+$/);

    // remove extension in case there is one
    const fileExtension = extensionMatch ? extensionMatch[0] : '';
    let extensionFree = extensionMatch ? name.slice(0, extensionMatch.index) : name;

    let prefixNumber = 1;
    let baseExtensionFree;

    if (baseName) {
      const baseExtensionMatch = baseName.match(/\.[^/.]+$/);

      // remove extension in case there is one
      baseExtensionFree = baseExtensionMatch ? baseName.slice(0, baseExtensionMatch.index) : baseName;
    }

    if (!baseExtensionFree || baseExtensionFree !== extensionFree) {
      // check if name already has integer appended on end:
      const oldPrefix = extensionFree.match('-[0-9]+$');
      if (oldPrefix) {
        // if so, try to get the number at the end
        const oldPrefixNumber = parseInt(oldPrefix[0].slice(1), 10);
        if (oldPrefixNumber.toString() === oldPrefix[0].slice(1)) {
          extensionFree = extensionFree.slice(0, oldPrefix.index);
          prefixNumber = oldPrefixNumber + 1;
        }
      }
    }
    return extensionFree + '-' + prefixNumber + fileExtension;
  }

  /**
   * Get children nodes of given parent node
   *
   * @param nodeId The id of the parent node
   * @param params optional parameters
   */
  getNodeChildren(nodeId: string, params?: any): Observable<NodeChildAssociationPaging> {
    return from(this.nodesApi.listNodeChildren(nodeId, params));
  }

  // Copied from ADF document-list.service, and added the name parameter
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  copyNode(nodeId: string, targetParentId: string, name?: string) {
    return from(this.nodesApi.copyNode(nodeId, { targetParentId, name }));
  }

  public flatten(nDimArray: any[]) {
    if (!Array.isArray(nDimArray)) {
      return nDimArray;
    }

    const nodeQueue = nDimArray.slice(0);
    const resultingArray: any[] = [];

    do {
      nodeQueue.forEach((node) => {
        if (Array.isArray(node)) {
          nodeQueue.push(...node);
        } else {
          resultingArray.push(node);
        }

        const nodeIndex = nodeQueue.indexOf(node);
        nodeQueue.splice(nodeIndex, 1);
      });
    } while (nodeQueue.length);

    return resultingArray;
  }

  processResponse(data: any): any {
    const moveStatus = {
      succeeded: [],
      failed: [],
      partiallySucceeded: []
    };

    if (Array.isArray(data)) {
      return data.reduce((acc, next) => {
        if (next instanceof Error) {
          acc.failed.push(next);
        } else if (Array.isArray(next)) {
          // if content of a folder was moved

          const folderMoveResponseData = this.flatten(next);
          const foundError = folderMoveResponseData.find((node) => node instanceof Error);
          // data might contain also items of form: { itemMoved, initialParentId }
          const foundEntry = folderMoveResponseData.find((node) => (node.itemMoved && node.itemMoved.entry) || (node && node.entry));

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
  }
}
