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

import { TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { DocumentListService } from '@alfresco/adf-content-services';
import { NodeActionsService } from './node-actions.service';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '../services/content-api.service';

class TestNode {
  entry?: MinimalNodeEntryEntity;

  constructor(
    id?: string,
    isFile?: boolean,
    name?: string,
    permission?: string[],
    nodeType?: string,
    properties?: any
  ) {
    this.entry = <any>{};
    this.entry.id = id || 'node-id';
    this.entry.isFile = isFile;
    this.entry.isFolder = !isFile;
    this.entry.nodeType = nodeType ? nodeType : isFile ? 'content' : 'folder';
    this.entry.name = name;
    if (permission) {
      this.entry['allowableOperations'] = permission;
    }
    if (properties) {
      this.entry.properties = properties;
    }
  }
}

describe('NodeActionsService', () => {
  const actionIsForbidden = true;
  const isFile = true;
  const folderDestinationId = 'folder-destination-id';
  const fileId = 'file-to-be-copied-id';
  const conflictError = new Error(
    JSON.stringify({ error: { statusCode: 409 } })
  );
  const permissionError = new Error(
    JSON.stringify({ error: { statusCode: 403 } })
  );
  const badRequestError = new Error(
    JSON.stringify({ error: { statusCode: 400 } })
  );
  const emptyChildrenList = { list: { entries: [] } };
  let service: NodeActionsService;
  let apiService: AlfrescoApiService;
  let nodesApi;
  const spyOnSuccess = jasmine.createSpy('spyOnSuccess');
  const spyOnError = jasmine.createSpy('spyOnError');
  let contentApi: ContentApiService;

  const helper = {
    fakeCopyNode: (
      isForbidden: boolean = false,
      nameExistingOnDestination?: string
    ) => {
      return (entryId, options) => {
        return new Promise((resolve, reject) => {
          if (isForbidden) {
            reject(permissionError);
          } else if (
            nameExistingOnDestination &&
            options &&
            options.name === nameExistingOnDestination
          ) {
            reject(conflictError);
          } else {
            resolve();
          }
        });
      };
    },
    fakeGetNodeChildren: (
      familyNodes: { parentNodeId: string; nodeChildren: any[] }[],
      isForbidden: boolean = false
    ) => {
      return (parentId, options) => {
        return new Promise((resolve, reject) => {
          if (isForbidden) {
            reject(permissionError);
          } else {
            const node = familyNodes.filter(
              familyNode => familyNode.parentNodeId === parentId
            );
            resolve(
              { list: { entries: node[0].nodeChildren } } || emptyChildrenList
            );
          }
        });
      };
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });

    contentApi = TestBed.get(ContentApiService);

    service = TestBed.get(NodeActionsService);
    apiService = TestBed.get(AlfrescoApiService);
    apiService.reset();

    nodesApi = apiService.getInstance().nodes;
  });

  describe('doBatchOperation', () => {
    beforeEach(() => {
      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
    });

    it("should throw error if 'contentEntities' required parameter is missing", async(() => {
      const contentEntities = undefined;
      const doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();

      doCopyBatchOperation
        .toPromise()
        .then(
          () => {
            spyOnSuccess();
          },
          error => {
            spyOnError(error);
          }
        )
        .then(() => {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalled();
        });
    }));

    it("should throw error if 'contentEntities' is not an array of entry entities", async(() => {
      const contentEntities = [new TestNode(), {}];
      const doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();

      doCopyBatchOperation
        .toPromise()
        .then(
          () => {
            spyOnSuccess();
          },
          error => {
            spyOnError(error);
          }
        )
        .then(() => {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalledWith(badRequestError);
        });
    }));

    it("should throw error if an entry in 'contentEntities' does not have id nor nodeId property", async(() => {
      const contentEntities = [new TestNode(), { entry: {} }];
      const doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();

      doCopyBatchOperation
        .toPromise()
        .then(
          () => {
            spyOnSuccess();
          },
          error => {
            spyOnError(error);
          }
        )
        .then(() => {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalledWith(badRequestError);
        });
    }));

    it("should not throw error if entry in 'contentEntities' does not have id, but has nodeId property", async(() => {
      const contentEntities = [new TestNode(), { entry: { nodeId: '1234' } }];

      spyOn(service, 'getContentNodeSelection').and.returnValue(
        of([new TestNode().entry])
      );
      spyOn(service, 'copyNodeAction').and.returnValue(of({}));

      const doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();

      doCopyBatchOperation
        .toPromise()
        .then(
          () => {
            spyOnSuccess();
          },
          error => {
            spyOnError(error);
          }
        )
        .then(() => {
          expect(spyOnSuccess).toHaveBeenCalled();
          expect(spyOnError).not.toHaveBeenCalledWith(badRequestError);
        });
    }));
  });

  describe('getEntryParentId', () => {
    it('should return the parentId, if that exists on the node entry', () => {
      const parentID = 'parent-id';
      const entry = <any>{ nodeId: '1234', parentId: parentID };

      expect(service.getEntryParentId(entry)).toBe(parentID);
    });

    it('should give the last element in path property, if parentId is missing and path exists on the node entry', () => {
      const firstParentId = 'parent-0-id';
      const entry = <any>{
        nodeId: '1234',
        path: { elements: [{ id: 'parent-1-id' }, { id: firstParentId }] }
      };

      expect(service.getEntryParentId(entry)).toBe(firstParentId);
    });
  });

  describe('rowFilter', () => {
    let fileToCopy;
    let folderToCopy;
    let testContentNodeSelectorComponentData;

    beforeEach(() => {
      fileToCopy = new TestNode(fileId, isFile, 'file-name');
      folderToCopy = new TestNode();

      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');

      const dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(
        (contentNodeSelectorComponent: any, data: any) => {
          testContentNodeSelectorComponentData = data;
          return { componentInstance: {} };
        }
      );

      service.copyNodes([fileToCopy, folderToCopy]);
    });

    it('should filter destination nodes and not show files', () => {
      const file = new TestNode('a-file', isFile);
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({ node: file })
      ).toBe(false);
    });

    it('should filter destination nodes and not show the symlinks', () => {
      const symlinkDestinationFolder = new TestNode(
        'symlink-id',
        !isFile,
        'symlink-name',
        [],
        'app:folderlink'
      );
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({
          node: symlinkDestinationFolder
        })
      ).toBe(false);
    });

    it('should filter destination nodes and show folders', () => {
      const destinationFolder = new TestNode(folderDestinationId);
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({
          node: destinationFolder
        })
      ).toBe(true);
    });
  });

  describe('copyNodes', () => {
    let fileToCopy;
    let folderToCopy;
    let destinationFolder;
    let translationService: TranslationService;

    beforeEach(() => {
      fileToCopy = new TestNode(fileId, isFile, 'file-name');
      folderToCopy = new TestNode();
      destinationFolder = new TestNode(folderDestinationId);
      translationService = TestBed.get(TranslationService);

      spyOn(translationService, 'instant').and.callFake(key => {
        return key;
      });
    });

    it('should be called', () => {
      const spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      spyOn(service, 'getContentNodeSelection').and.returnValue(
        of([destinationFolder.entry])
      );
      spyOn(service, 'copyNodeAction').and.returnValue(of({}));

      service.copyNodes([fileToCopy, folderToCopy]);
      expect(spyOnBatchOperation.calls.count()).toEqual(1);
      expect(spyOnBatchOperation).toHaveBeenCalledWith(
        'copy',
        [fileToCopy, folderToCopy],
        undefined
      );
    });

    it('should use the custom data object with custom rowFilter & imageResolver & title with destination picker', () => {
      const spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      const spyOnDestinationPicker = spyOn(
        service,
        'getContentNodeSelection'
      ).and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');

      let testContentNodeSelectorComponentData;
      const dialog = TestBed.get(MatDialog);
      const spyOnDialog = spyOn(dialog, 'open').and.callFake(
        (contentNodeSelectorComponent: any, data: any) => {
          testContentNodeSelectorComponentData = data;
          return { componentInstance: {} };
        }
      );

      service.copyNodes([fileToCopy, folderToCopy]);

      expect(spyOnBatchOperation).toHaveBeenCalledWith(
        'copy',
        [fileToCopy, folderToCopy],
        undefined
      );
      expect(spyOnDestinationPicker.calls.count()).toEqual(1);
      expect(spyOnDialog.calls.count()).toEqual(1);

      expect(testContentNodeSelectorComponentData).toBeDefined();
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({
          node: destinationFolder
        })
      ).toBeDefined();
      expect(
        testContentNodeSelectorComponentData.data.imageResolver({
          node: destinationFolder
        })
      ).toBeDefined();
      expect(testContentNodeSelectorComponentData.data.title).toBe(
        'NODE_SELECTOR.COPY_ITEMS'
      );
      expect(translationService.instant).toHaveBeenCalledWith(
        'NODE_SELECTOR.COPY_ITEMS',
        { name: '', number: 2 }
      );

      destinationFolder.entry['allowableOperations'] = ['update'];
      expect(
        testContentNodeSelectorComponentData.data.imageResolver({
          node: destinationFolder
        })
      ).toBeDefined();
    });

    it('should use the ContentNodeSelectorComponentData object with file name in title', () => {
      const spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      spyOn(service, 'getContentNodeSelection').and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');

      let testContentNodeSelectorComponentData;
      const dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(
        (contentNodeSelectorComponent: any, data: any) => {
          testContentNodeSelectorComponentData = data;
          return { componentInstance: {} };
        }
      );

      service.copyNodes([{ entry: { id: 'entry-id', name: 'entry-name' } }]);

      expect(spyOnBatchOperation).toHaveBeenCalled();
      expect(testContentNodeSelectorComponentData).toBeDefined();
      expect(testContentNodeSelectorComponentData.data.title).toBe(
        'NODE_SELECTOR.COPY_ITEM'
      );
      expect(translationService.instant).toHaveBeenCalledWith(
        'NODE_SELECTOR.COPY_ITEM',
        { name: 'entry-name', number: 1 }
      );
    });

    it('should use the ContentNodeSelectorComponentData object without file name in title, if no name exists', () => {
      const spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      spyOn(service, 'getContentNodeSelection').and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');

      let testContentNodeSelectorComponentData;
      const dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(
        (contentNodeSelectorComponent: any, data: any) => {
          testContentNodeSelectorComponentData = data;
          return { componentInstance: {} };
        }
      );

      service.copyNodes([{ entry: { id: 'entry-id' } }]);

      expect(spyOnBatchOperation).toHaveBeenCalled();
      expect(testContentNodeSelectorComponentData).toBeDefined();
      expect(testContentNodeSelectorComponentData.data.title).toBe(
        'NODE_SELECTOR.COPY_ITEMS'
      );
      expect(translationService.instant).toHaveBeenCalledWith(
        'NODE_SELECTOR.COPY_ITEMS',
        { name: '', number: 1 }
      );
    });
  });

  describe('copyNodeAction', () => {
    it('should copy one folder node to destination', () => {
      spyOn(nodesApi, 'copyNode').and.callFake(helper.fakeCopyNode());

      const folderToCopy = new TestNode();
      const folderDestination = new TestNode(folderDestinationId);
      service.copyNodeAction(folderToCopy.entry, folderDestination.entry.id);

      expect(nodesApi.copyNode).toHaveBeenCalledWith(folderToCopy.entry.id, {
        targetParentId: folderDestination.entry.id,
        name: undefined
      });
    });

    it('should copy one file node to destination', () => {
      spyOn(nodesApi, 'copyNode').and.callFake(helper.fakeCopyNode());

      const fileToCopy = new TestNode(fileId, isFile, 'file-name');
      const folderDestination = new TestNode(folderDestinationId);
      service.copyNodeAction(fileToCopy.entry, folderDestination.entry.id);

      expect(nodesApi.copyNode).toHaveBeenCalledWith(fileToCopy.entry.id, {
        targetParentId: folderDestination.entry.id,
        name: 'file-name'
      });
    });

    it('should fail to copy folder node if action is forbidden', async(() => {
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(actionIsForbidden)
      );

      const folderToCopy = new TestNode();
      const folderDestination = new TestNode(folderDestinationId);

      const spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();
      const spyFolderAction = spyOn(
        service,
        'copyFolderAction'
      ).and.callThrough();
      const copyObservable = service.copyNodeAction(
        folderToCopy.entry,
        folderDestination.entry.id
      );

      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          response => {
            spyOnSuccess(response);
          },
          () => {
            spyOnError();

            expect(spyContentAction.calls.count()).toEqual(0);
            expect(spyFolderAction.calls.count()).toEqual(1);
            expect(nodesApi.copyNode).toHaveBeenCalledWith(
              folderToCopy.entry.id,
              { targetParentId: folderDestination.entry.id, name: undefined }
            );
          }
        )
        .then(() => {
          expect(spyOnSuccess.calls.count()).toEqual(1);
          expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
          expect(spyOnError.calls.count()).toEqual(0);
        });
    }));

    it('should fail to copy file node if action is forbidden', async(() => {
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(actionIsForbidden)
      );

      const spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();
      const spyFolderAction = spyOn(
        service,
        'copyFolderAction'
      ).and.callThrough();

      const fileToCopy = new TestNode(fileId, isFile, 'test-name');
      const folderDestination = new TestNode(folderDestinationId);
      const copyObservable = service.copyNodeAction(
        fileToCopy.entry,
        folderDestination.entry.id
      );

      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          response => {
            spyOnSuccess(response);
          },
          () => {
            spyOnError();
          }
        )
        .then(() => {
          expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
          expect(spyOnError).not.toHaveBeenCalled();

          expect(spyContentAction).toHaveBeenCalled();
          expect(spyFolderAction).not.toHaveBeenCalled();
          expect(nodesApi.copyNode).toHaveBeenCalledWith(fileToCopy.entry.id, {
            targetParentId: folderDestination.entry.id,
            name: 'test-name'
          });
        });
    }));

    it('should copy one file node to same destination and autoRename it', async(() => {
      const alreadyExistingName = 'file-name';
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(!actionIsForbidden, alreadyExistingName)
      );

      const spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();

      const fileToCopy = new TestNode(fileId, isFile, 'file-name');
      const folderDestination = new TestNode(folderDestinationId);
      const copyObservable = service.copyNodeAction(
        fileToCopy.entry,
        folderDestination.entry.id
      );

      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          () => {
            spyOnSuccess();
          },
          () => {
            spyOnError();
          }
        )
        .then(() => {
          expect(spyOnSuccess).toHaveBeenCalled();
          expect(spyOnError).not.toHaveBeenCalled();

          expect(spyContentAction.calls.count()).toEqual(2);
          expect(nodesApi.copyNode).toHaveBeenCalledWith(fileToCopy.entry.id, {
            targetParentId: folderDestination.entry.id,
            name: 'file-name-1'
          });
        });
    }));

    describe('should copy content of folder-to-copy to folder with same name from destination folder', () => {
      let folderToCopy;
      let fileChildOfFolderToCopy;
      let folderParentAndDestination;
      let existingFolder;
      let spy;
      let spyOnContentAction;
      let spyOnFolderAction;
      let copyObservable;

      beforeEach(() => {
        folderToCopy = new TestNode(
          'folder-to-copy-id',
          !isFile,
          'conflicting-name'
        );
        fileChildOfFolderToCopy = new TestNode(fileId, isFile, 'file-name');

        folderParentAndDestination = new TestNode(folderDestinationId);
        existingFolder = new TestNode(
          'existing-folder-id',
          !isFile,
          'conflicting-name'
        );

        spy = spyOn(nodesApi, 'copyNode').and.callFake(
          helper.fakeCopyNode(!actionIsForbidden, 'conflicting-name')
        );

        spyOnContentAction = spyOn(
          service,
          'copyContentAction'
        ).and.callThrough();
        spyOnFolderAction = spyOn(
          service,
          'copyFolderAction'
        ).and.callThrough();

        copyObservable = service.copyNodeAction(
          folderToCopy.entry,
          folderParentAndDestination.entry.id
        );
        spyOnSuccess.calls.reset();
        spyOnError.calls.reset();
      });

      it('when folder to copy has a file as content', async(() => {
        const testFamilyNodes = [
          {
            parentNodeId: folderToCopy.entry.id,
            nodeChildren: [fileChildOfFolderToCopy]
          },
          {
            parentNodeId: folderParentAndDestination.entry.id,
            nodeChildren: [existingFolder]
          }
        ];
        spyOn(nodesApi, 'getNodeChildren').and.callFake(
          helper.fakeGetNodeChildren(testFamilyNodes)
        );
        spyOn(service, 'getChildByName').and.returnValue(of(existingFolder));

        copyObservable
          .toPromise()
          .then(
            () => {
              spyOnSuccess();
            },
            () => {
              spyOnError();
            }
          )
          .then(() => {
            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalled();

            expect(spyOnContentAction).toHaveBeenCalled();
            expect(spyOnFolderAction).toHaveBeenCalled();
            expect(spy.calls.allArgs()).toEqual([
              [
                folderToCopy.entry.id,
                {
                  targetParentId: folderParentAndDestination.entry.id,
                  name: 'conflicting-name'
                }
              ],
              [
                fileChildOfFolderToCopy.entry.id,
                {
                  targetParentId: existingFolder.entry.id,
                  name: 'file-name'
                }
              ]
            ]);
          });
      }));

      it('when folder to copy is empty', async(() => {
        const testFamilyNodes = [
          {
            parentNodeId: folderToCopy.entry.id,
            nodeChildren: []
          },
          {
            parentNodeId: folderParentAndDestination.entry.id,
            nodeChildren: [existingFolder]
          }
        ];
        spyOn(nodesApi, 'getNodeChildren').and.callFake(
          helper.fakeGetNodeChildren(testFamilyNodes)
        );
        spyOn(service, 'getChildByName').and.returnValue(of(existingFolder));

        copyObservable
          .toPromise()
          .then(
            () => {
              spyOnSuccess();
            },
            () => {
              spyOnError();
            }
          )
          .then(() => {
            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalled();

            expect(spyOnContentAction).not.toHaveBeenCalled();
            expect(spyOnFolderAction).toHaveBeenCalled();
            expect(spy.calls.allArgs()).toEqual([
              [
                folderToCopy.entry.id,
                {
                  targetParentId: folderParentAndDestination.entry.id,
                  name: 'conflicting-name'
                }
              ]
            ]);
          });
      }));

      it('when folder to copy has another folder as child', async(() => {
        const folderChild = new TestNode('folder-child-id');
        const testFamilyNodes = [
          {
            parentNodeId: folderToCopy.entry.id,
            nodeChildren: [folderChild]
          },
          {
            parentNodeId: folderParentAndDestination.entry.id,
            nodeChildren: [existingFolder]
          }
        ];
        spyOn(nodesApi, 'getNodeChildren').and.callFake(
          helper.fakeGetNodeChildren(testFamilyNodes)
        );
        spyOn(service, 'getChildByName').and.returnValue(of(existingFolder));

        copyObservable
          .toPromise()
          .then(
            () => {
              spyOnSuccess();
            },
            () => {
              spyOnError();
            }
          )
          .then(() => {
            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalled();

            expect(spyOnContentAction).not.toHaveBeenCalled();
            expect(spyOnFolderAction.calls.count()).toEqual(2);
            expect(spy.calls.allArgs()).toEqual([
              [
                folderToCopy.entry.id,
                {
                  targetParentId: folderParentAndDestination.entry.id,
                  name: 'conflicting-name'
                }
              ],
              [
                folderChild.entry.id,
                {
                  targetParentId: existingFolder.entry.id,
                  name: undefined
                }
              ]
            ]);
          });
      }));
    });
  });

  describe('moveNodes', () => {
    const permissionToMove = 'delete';
    let fileToMove;
    let folderToMove;
    let destinationFolder;
    let spyOnBatchOperation;
    let spyOnDocumentListServiceAction;
    let documentListService;

    beforeEach(() => {
      fileToMove = new TestNode('file-to-be-moved', isFile, 'file-name');
      folderToMove = new TestNode('fid', !isFile, 'folder-name');
      destinationFolder = new TestNode(folderDestinationId);

      documentListService = TestBed.get(DocumentListService);
      spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
    });

    it('should allow to select destination for nodes that have permission to be moved', () => {
      const spyOnDestinationPicker = spyOn(
        service,
        'getContentNodeSelection'
      ).and.returnValue(of([destinationFolder.entry]));
      spyOn(service, 'moveContentAction').and.returnValue(of({}));
      spyOn(service, 'moveFolderAction').and.returnValue(of({}));

      fileToMove.entry['allowableOperations'] = [permissionToMove];
      folderToMove.entry['allowableOperations'] = [permissionToMove];

      service.moveNodes([fileToMove, folderToMove], permissionToMove);
      expect(spyOnBatchOperation).toHaveBeenCalledWith(
        'move',
        [fileToMove, folderToMove],
        permissionToMove
      );
      expect(spyOnDestinationPicker).toHaveBeenCalled();
    });

    it('should not allow to select destination for nodes that do not have permission to be moved', () => {
      const spyOnDestinationPicker = spyOn(
        service,
        'getContentNodeSelection'
      ).and.returnValue(of([destinationFolder.entry]));

      fileToMove.entry['allowableOperations'] = [];
      folderToMove.entry['allowableOperations'] = [];

      service.moveNodes([fileToMove, folderToMove], permissionToMove);
      expect(spyOnBatchOperation).toHaveBeenCalledWith(
        'move',
        [fileToMove, folderToMove],
        permissionToMove
      );
      expect(spyOnDestinationPicker).not.toHaveBeenCalled();
    });

    it('should call the documentListService moveNode directly for moving a file that has permission to be moved', () => {
      spyOn(service, 'getContentNodeSelection').and.returnValue(
        of([destinationFolder.entry])
      );
      fileToMove.entry['allowableOperations'] = [permissionToMove];
      spyOnDocumentListServiceAction = spyOn(
        documentListService,
        'moveNode'
      ).and.returnValue(of([fileToMove]));
      spyOn(service, 'moveNodeAction');

      service.moveNodes([fileToMove], permissionToMove);
      expect(service.moveNodeAction).not.toHaveBeenCalled();
      expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
    });

    describe('moveContentAction', () => {
      beforeEach(() => {
        spyOnSuccess.calls.reset();
        spyOnError.calls.reset();
      });

      it('should not throw error on conflict, to be able to show message in case of partial move of files', async(() => {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(conflictError));

        const moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            value => {
              spyOnSuccess(value);
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalledWith(conflictError);
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));

      it('should not throw permission error, to be able to show message in case of partial move of files', async(() => {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(permissionError));

        const moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            value => {
              spyOnSuccess(value);
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
            expect(spyOnError).not.toHaveBeenCalledWith(permissionError);
          });
      }));

      it('in case of success, should return also the initial parent id of the moved node', async(() => {
        const parentID = 'parent-id';
        fileToMove.entry['parentId'] = parentID;
        fileToMove.entry['allowableOperations'] = [permissionToMove];
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(of(fileToMove));

        const moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            value => {
              spyOnSuccess(value);
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalledWith({
              itemMoved: fileToMove,
              initialParentId: parentID
            });
            expect(spyOnError).not.toHaveBeenCalledWith(permissionError);
          });
      }));
    });

    describe('moveFolderAction', () => {
      beforeEach(() => {
        spyOnSuccess.calls.reset();
        spyOnError.calls.reset();
      });

      it('should not throw permission error in case it occurs on folder move', async(() => {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(permissionError));

        const moveFolderActionObservable = service.moveFolderAction(
          folderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            value => {
              spyOnSuccess(value);
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
            expect(spyOnError).not.toHaveBeenCalled();
          });
      }));

      it('should not throw error on conflict in case it occurs on folder move', async(() => {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(conflictError));

        const newDestination = new TestNode(
          'new-destination',
          !isFile,
          folderToMove.entry.name
        );
        spyOn(service, 'getChildByName').and.returnValue(of(newDestination));
        spyOn(service, 'getNodeChildren').and.returnValue(
          of(emptyChildrenList)
        );

        const moveFolderActionObservable = service.moveFolderAction(
          folderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            () => {
              spyOnSuccess();
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));

      it('should try to move children nodes of a folder to already existing folder with same name', async(() => {
        const parentFolderToMove = new TestNode(
          'parent-folder',
          !isFile,
          'conflicting-name'
        );
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.callFake((contentEntryId, selectionId) => {
          if (contentEntryId === parentFolderToMove.entry.id) {
            return throwError(conflictError);
          }
          return of({});
        });
        spyOn(service, 'moveContentAction').and.returnValue(of({}));

        const newDestination = new TestNode(
          'new-destination',
          !isFile,
          'conflicting-name'
        );
        spyOn(service, 'getChildByName').and.returnValue(of(newDestination));
        const childrenNodes = [fileToMove, folderToMove];
        spyOn(service, 'getNodeChildren').and.returnValue(
          of({ list: { entries: childrenNodes } })
        );

        const moveFolderActionObservable = service.moveFolderAction(
          parentFolderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            () => {
              spyOnSuccess();
            },
            error => {
              spyOnError(error);
            }
          )
          .then(() => {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();

            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));
    });

    describe('moveNodeAction', () => {
      describe('on moving folder to a destination where a folder with the same name exists', () => {
        let parentFolderToMove;
        let moveNodeActionPromise;
        let spyOnDelete;

        beforeEach(() => {
          parentFolderToMove = new TestNode(
            'parent-folder',
            !isFile,
            'conflicting-name'
          );
          spyOnDelete = spyOn(contentApi, 'deleteNode').and.returnValue(
            of(null)
          );
        });

        afterEach(() => {
          spyOnDelete.calls.reset();
          spyOnSuccess.calls.reset();
          spyOnError.calls.reset();
        });

        it('should take no extra delete action, if folder was moved to the same location', async(() => {
          spyOn(service, 'moveFolderAction').and.returnValue(of(null));

          parentFolderToMove.entry.parentId = folderDestinationId;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              () => {
                spyOnSuccess();
              },
              error => {
                spyOnError(error);
              }
            )
            .then(() => {
              expect(spyOnDelete).not.toHaveBeenCalled();

              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));

        it('should take no extra delete action, if its children were partially moved', async(() => {
          const movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [fileToMove],
            failed: [folderToMove],
            partiallySucceeded: []
          });

          parentFolderToMove.entry.parentId = `not-${folderDestinationId}`;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              () => {
                spyOnSuccess();
              },
              error => {
                spyOnError(error);
              }
            )
            .then(() => {
              expect(spyOnDelete).not.toHaveBeenCalled();

              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));

        it('should take extra delete action, if children successfully moved and folder is still on location', async(() => {
          const movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [movedChildrenNodes],
            failed: [],
            partiallySucceeded: []
          });
          const folderOnLocation = parentFolderToMove;
          spyOn(service, 'getChildByName').and.returnValue(
            of(folderOnLocation)
          );

          parentFolderToMove.entry.parentId = `not-${folderDestinationId}`;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              () => {
                spyOnSuccess();
              },
              error => {
                spyOnError(error);
              }
            )
            .then(() => {
              expect(spyOnDelete).toHaveBeenCalled();

              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));

        it('should take no extra delete action, if folder is no longer on location', async(() => {
          const movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [movedChildrenNodes],
            failed: [],
            partiallySucceeded: []
          });
          spyOn(service, 'getChildByName').and.returnValue(of(null));

          parentFolderToMove.entry.parentId = `not-${folderDestinationId}`;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              () => {
                spyOnSuccess();
              },
              error => {
                spyOnError(error);
              }
            )
            .then(() => {
              expect(spyOnDelete).not.toHaveBeenCalled();

              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));
      });
    });
  });

  describe('getChildByName', () => {
    let testFamilyNodes;
    let notChildNode;
    let childNode;

    beforeEach(() => {
      childNode = new TestNode(fileId, isFile, 'child-name');
      const parentNode = new TestNode();

      notChildNode = new TestNode('not-child-id', !isFile, 'not-child-name');
      testFamilyNodes = [
        {
          parentNodeId: parentNode.entry.id,
          nodeChildren: [childNode]
        },
        {
          parentNodeId: notChildNode.entry.id,
          nodeChildren: []
        }
      ];
    });

    it('emits child node with specified name, when it exists in folder', () => {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes)
      );

      service
        .getChildByName(testFamilyNodes[0].parentNodeId, childNode.entry.name)
        .subscribe(value => {
          expect(value).toEqual(childNode);
        });
    });

    it('emits null value when child with specified name is not found in folder', async(() => {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes)
      );

      service
        .getChildByName(
          testFamilyNodes[0].parentNodeId,
          notChildNode.entry.name
        )
        .subscribe(value => {
          expect(value).toEqual(null);
        });
    }));

    it('emits error when permission error occurs', async(() => {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes, actionIsForbidden)
      );

      service
        .getChildByName(
          testFamilyNodes[0].parentNodeId,
          notChildNode.entry.name
        )
        .subscribe(value => {
          expect(value).toEqual(null);
        });
    }));
  });

  describe('getNewNameFrom', () => {
    const testData = [
      {
        name: 'noExtension',
        baseName: 'noExtension',
        expected: 'noExtension-1'
      },
      {
        name: 'withExtension.txt',
        baseName: 'withExtension.txt',
        expected: 'withExtension-1.txt'
      },
      {
        name: 'with-lineStringSuffix.txt',
        baseName: 'with-lineStringSuffix.txt',
        expected: 'with-lineStringSuffix-1.txt'
      },
      {
        name: 'noExtension-1',
        baseName: 'noExtension-1',
        expected: 'noExtension-1-1'
      },
      {
        name: 'with-lineNumberSuffix-1.txt',
        baseName: 'with-lineNumberSuffix-1.txt',
        expected: 'with-lineNumberSuffix-1-1.txt'
      },
      {
        name: 'with-lineNumberSuffix.txt',
        baseName: undefined,
        expected: 'with-lineNumberSuffix-1.txt'
      },
      {
        name: 'noExtension-1',
        baseName: 'noExtension',
        expected: 'noExtension-2'
      },
      {
        name: 'noExtension-7',
        baseName: undefined,
        expected: 'noExtension-8'
      },
      {
        name: 'noExtension-007',
        baseName: undefined,
        expected: 'noExtension-007-1'
      }
    ];
    testData.forEach(data => {
      it(`new name should be \'${data.expected}\' for given name: \'${
        data.name
      }\', and baseName: \'${data.baseName}\'`, () => {
        const result = service.getNewNameFrom(data.name, data.baseName);
        expect(result).toBe(data.expected);
      });
    });
  });

  describe('flatten', () => {
    const testNode1 = new TestNode('node1-id', isFile, 'node1-name');
    const testNode2 = new TestNode('node2-id', !isFile, 'node2-name');

    const testData = [
      {
        nDimArray: [testNode1],
        expected: [testNode1]
      },
      {
        nDimArray: [[testNode1], [testNode2]],
        expected: [testNode1, testNode2]
      },
      {
        nDimArray: [[[[testNode1]], testNode2]],
        expected: [testNode2, testNode1]
      }
    ];

    testData.forEach(data => {
      it(`flattened array should be \'${data.expected}\' for given data: \'${
        data.nDimArray
      }\'`, () => {
        const result = service.flatten(data.nDimArray);

        expect(result.length).toBe(data.expected.length);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(data.expected));
      });
    });
  });

  describe('processResponse', () => {
    const testNode1 = new TestNode('node1-id', isFile, 'node1-name');
    const testNode2 = new TestNode('node2-id', !isFile, 'node2-name');

    const parentID = 'patent-1-id';
    testNode1.entry['parentId'] = parentID;

    const testData = [
      {
        data: [testNode1],
        expected: {
          succeeded: [testNode1],
          failed: [],
          partiallySucceeded: []
        }
      },
      {
        data: [[{ itemMoved: testNode1, initialParentId: parentID }]],
        expected: {
          succeeded: [[{ itemMoved: testNode1, initialParentId: parentID }]],
          failed: [],
          partiallySucceeded: []
        }
      },
      {
        data: [conflictError],
        expected: {
          succeeded: [],
          failed: [conflictError],
          partiallySucceeded: []
        }
      },
      {
        data: [conflictError, testNode2],
        expected: {
          succeeded: [testNode2],
          failed: [conflictError],
          partiallySucceeded: []
        }
      },
      {
        data: [conflictError, [testNode2, conflictError]],
        expected: {
          succeeded: [],
          failed: [conflictError],
          partiallySucceeded: [[testNode2, conflictError]]
        }
      },
      {
        data: [conflictError, [{}, conflictError]],
        expected: {
          succeeded: [],
          failed: [conflictError, [{}, conflictError]],
          partiallySucceeded: []
        }
      },
      {
        data: {},
        expected: {
          succeeded: [],
          failed: [{}],
          partiallySucceeded: []
        }
      },
      {
        data: testNode1,
        expected: {
          succeeded: [testNode1],
          failed: [],
          partiallySucceeded: []
        }
      },
      {
        data: { itemMoved: testNode1, initialParentId: parentID },
        expected: {
          succeeded: [{ itemMoved: testNode1, initialParentId: parentID }],
          failed: [],
          partiallySucceeded: []
        }
      }
    ];

    testData.forEach(response => {
      it(`processed response should be \'${
        response.expected
      }\' for given input: \'${response.data}\'`, () => {
        const result = service.processResponse(response.data);

        expect(JSON.stringify(result)).toEqual(
          JSON.stringify(response.expected)
        );
      });
    });
  });
});
