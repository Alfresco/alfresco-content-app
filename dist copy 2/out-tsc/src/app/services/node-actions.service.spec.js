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
import { TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { DocumentListService } from '@alfresco/adf-content-services';
import { NodeActionsService } from './node-actions.service';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
var TestNode = /** @class */ (function() {
  function TestNode(id, isFile, name, permission, nodeType, properties) {
    this.entry = {};
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
  return TestNode;
})();
describe('NodeActionsService', function() {
  var actionIsForbidden = true;
  var isFile = true;
  var folderDestinationId = 'folder-destination-id';
  var fileId = 'file-to-be-copied-id';
  var conflictError = new Error(JSON.stringify({ error: { statusCode: 409 } }));
  var permissionError = new Error(
    JSON.stringify({ error: { statusCode: 403 } })
  );
  var badRequestError = new Error(
    JSON.stringify({ error: { statusCode: 400 } })
  );
  var emptyChildrenList = { list: { entries: [] } };
  var service;
  var apiService;
  var nodesApi;
  var spyOnSuccess = jasmine.createSpy('spyOnSuccess');
  var spyOnError = jasmine.createSpy('spyOnError');
  var contentApi;
  var helper = {
    fakeCopyNode: function(isForbidden, nameExistingOnDestination) {
      if (isForbidden === void 0) {
        isForbidden = false;
      }
      return function(entryId, options) {
        return new Promise(function(resolve, reject) {
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
    fakeGetNodeChildren: function(familyNodes, isForbidden) {
      if (isForbidden === void 0) {
        isForbidden = false;
      }
      return function(parentId, options) {
        return new Promise(function(resolve, reject) {
          if (isForbidden) {
            reject(permissionError);
          } else {
            var node = familyNodes.filter(function(familyNode) {
              return familyNode.parentNodeId === parentId;
            });
            resolve(
              { list: { entries: node[0].nodeChildren } } || emptyChildrenList
            );
          }
        });
      };
    }
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });
    contentApi = TestBed.get(ContentApiService);
    service = TestBed.get(NodeActionsService);
    apiService = TestBed.get(AlfrescoApiService);
    apiService.reset();
    nodesApi = apiService.getInstance().nodes;
  });
  describe('doBatchOperation', function() {
    beforeEach(function() {
      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
    });
    it("should throw error if 'contentEntities' required parameter is missing", async(function() {
      var contentEntities = undefined;
      var doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();
      doCopyBatchOperation
        .toPromise()
        .then(
          function() {
            spyOnSuccess();
          },
          function(error) {
            spyOnError(error);
          }
        )
        .then(function() {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalled();
        });
    }));
    it("should throw error if 'contentEntities' is not an array of entry entities", async(function() {
      var contentEntities = [new TestNode(), {}];
      var doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();
      doCopyBatchOperation
        .toPromise()
        .then(
          function() {
            spyOnSuccess();
          },
          function(error) {
            spyOnError(error);
          }
        )
        .then(function() {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalledWith(badRequestError);
        });
    }));
    it("should throw error if an entry in 'contentEntities' does not have id nor nodeId property", async(function() {
      var contentEntities = [new TestNode(), { entry: {} }];
      var doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();
      doCopyBatchOperation
        .toPromise()
        .then(
          function() {
            spyOnSuccess();
          },
          function(error) {
            spyOnError(error);
          }
        )
        .then(function() {
          expect(spyOnSuccess).not.toHaveBeenCalled();
          expect(spyOnError).toHaveBeenCalledWith(badRequestError);
        });
    }));
    it("should not throw error if entry in 'contentEntities' does not have id, but has nodeId property", async(function() {
      var contentEntities = [new TestNode(), { entry: { nodeId: '1234' } }];
      spyOn(service, 'getContentNodeSelection').and.returnValue(
        of([new TestNode().entry])
      );
      spyOn(service, 'copyNodeAction').and.returnValue(of({}));
      var doCopyBatchOperation = service
        .copyNodes(contentEntities)
        .asObservable();
      doCopyBatchOperation
        .toPromise()
        .then(
          function() {
            spyOnSuccess();
          },
          function(error) {
            spyOnError(error);
          }
        )
        .then(function() {
          expect(spyOnSuccess).toHaveBeenCalled();
          expect(spyOnError).not.toHaveBeenCalledWith(badRequestError);
        });
    }));
  });
  describe('getEntryParentId', function() {
    it('should return the parentId, if that exists on the node entry', function() {
      var parentID = 'parent-id';
      var entry = { nodeId: '1234', parentId: parentID };
      expect(service.getEntryParentId(entry)).toBe(parentID);
    });
    it('should give the last element in path property, if parentId is missing and path exists on the node entry', function() {
      var firstParentId = 'parent-0-id';
      var entry = {
        nodeId: '1234',
        path: { elements: [{ id: 'parent-1-id' }, { id: firstParentId }] }
      };
      expect(service.getEntryParentId(entry)).toBe(firstParentId);
    });
  });
  describe('rowFilter', function() {
    var fileToCopy;
    var folderToCopy;
    var testContentNodeSelectorComponentData;
    beforeEach(function() {
      fileToCopy = new TestNode(fileId, isFile, 'file-name');
      folderToCopy = new TestNode();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');
      var dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(function(
        contentNodeSelectorComponent,
        data
      ) {
        testContentNodeSelectorComponentData = data;
        return { componentInstance: {} };
      });
      service.copyNodes([fileToCopy, folderToCopy]);
    });
    it('should filter destination nodes and not show files', function() {
      var file = new TestNode('a-file', isFile);
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({ node: file })
      ).toBe(false);
    });
    it('should filter destination nodes and not show the symlinks', function() {
      var symlinkDestinationFolder = new TestNode(
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
    it('should filter destination nodes and show folders', function() {
      var destinationFolder = new TestNode(folderDestinationId);
      expect(
        testContentNodeSelectorComponentData.data.rowFilter({
          node: destinationFolder
        })
      ).toBe(true);
    });
  });
  describe('copyNodes', function() {
    var fileToCopy;
    var folderToCopy;
    var destinationFolder;
    var translationService;
    beforeEach(function() {
      fileToCopy = new TestNode(fileId, isFile, 'file-name');
      folderToCopy = new TestNode();
      destinationFolder = new TestNode(folderDestinationId);
      translationService = TestBed.get(TranslationService);
      spyOn(translationService, 'instant').and.callFake(function(key) {
        return key;
      });
    });
    it('should be called', function() {
      var spyOnBatchOperation = spyOn(
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
    it('should use the custom data object with custom rowFilter & imageResolver & title with destination picker', function() {
      var spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      var spyOnDestinationPicker = spyOn(
        service,
        'getContentNodeSelection'
      ).and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');
      var testContentNodeSelectorComponentData;
      var dialog = TestBed.get(MatDialog);
      var spyOnDialog = spyOn(dialog, 'open').and.callFake(function(
        contentNodeSelectorComponent,
        data
      ) {
        testContentNodeSelectorComponentData = data;
        return { componentInstance: {} };
      });
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
    it('should use the ContentNodeSelectorComponentData object with file name in title', function() {
      var spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      spyOn(service, 'getContentNodeSelection').and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');
      var testContentNodeSelectorComponentData;
      var dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(function(
        contentNodeSelectorComponent,
        data
      ) {
        testContentNodeSelectorComponentData = data;
        return { componentInstance: {} };
      });
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
    it('should use the ContentNodeSelectorComponentData object without file name in title, if no name exists', function() {
      var spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
      spyOn(service, 'getContentNodeSelection').and.callThrough();
      spyOn(service, 'getEntryParentId').and.returnValue('parent-id');
      var testContentNodeSelectorComponentData;
      var dialog = TestBed.get(MatDialog);
      spyOn(dialog, 'open').and.callFake(function(
        contentNodeSelectorComponent,
        data
      ) {
        testContentNodeSelectorComponentData = data;
        return { componentInstance: {} };
      });
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
  describe('copyNodeAction', function() {
    it('should copy one folder node to destination', function() {
      spyOn(nodesApi, 'copyNode').and.callFake(helper.fakeCopyNode());
      var folderToCopy = new TestNode();
      var folderDestination = new TestNode(folderDestinationId);
      service.copyNodeAction(folderToCopy.entry, folderDestination.entry.id);
      expect(nodesApi.copyNode).toHaveBeenCalledWith(folderToCopy.entry.id, {
        targetParentId: folderDestination.entry.id,
        name: undefined
      });
    });
    it('should copy one file node to destination', function() {
      spyOn(nodesApi, 'copyNode').and.callFake(helper.fakeCopyNode());
      var fileToCopy = new TestNode(fileId, isFile, 'file-name');
      var folderDestination = new TestNode(folderDestinationId);
      service.copyNodeAction(fileToCopy.entry, folderDestination.entry.id);
      expect(nodesApi.copyNode).toHaveBeenCalledWith(fileToCopy.entry.id, {
        targetParentId: folderDestination.entry.id,
        name: 'file-name'
      });
    });
    it('should fail to copy folder node if action is forbidden', async(function() {
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(actionIsForbidden)
      );
      var folderToCopy = new TestNode();
      var folderDestination = new TestNode(folderDestinationId);
      var spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();
      var spyFolderAction = spyOn(
        service,
        'copyFolderAction'
      ).and.callThrough();
      var copyObservable = service.copyNodeAction(
        folderToCopy.entry,
        folderDestination.entry.id
      );
      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          function(response) {
            spyOnSuccess(response);
          },
          function() {
            spyOnError();
            expect(spyContentAction.calls.count()).toEqual(0);
            expect(spyFolderAction.calls.count()).toEqual(1);
            expect(nodesApi.copyNode).toHaveBeenCalledWith(
              folderToCopy.entry.id,
              { targetParentId: folderDestination.entry.id, name: undefined }
            );
          }
        )
        .then(function() {
          expect(spyOnSuccess.calls.count()).toEqual(1);
          expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
          expect(spyOnError.calls.count()).toEqual(0);
        });
    }));
    it('should fail to copy file node if action is forbidden', async(function() {
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(actionIsForbidden)
      );
      var spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();
      var spyFolderAction = spyOn(
        service,
        'copyFolderAction'
      ).and.callThrough();
      var fileToCopy = new TestNode(fileId, isFile, 'test-name');
      var folderDestination = new TestNode(folderDestinationId);
      var copyObservable = service.copyNodeAction(
        fileToCopy.entry,
        folderDestination.entry.id
      );
      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          function(response) {
            spyOnSuccess(response);
          },
          function() {
            spyOnError();
          }
        )
        .then(function() {
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
    it('should copy one file node to same destination and autoRename it', async(function() {
      var alreadyExistingName = 'file-name';
      spyOn(nodesApi, 'copyNode').and.callFake(
        helper.fakeCopyNode(!actionIsForbidden, alreadyExistingName)
      );
      var spyContentAction = spyOn(
        service,
        'copyContentAction'
      ).and.callThrough();
      var fileToCopy = new TestNode(fileId, isFile, 'file-name');
      var folderDestination = new TestNode(folderDestinationId);
      var copyObservable = service.copyNodeAction(
        fileToCopy.entry,
        folderDestination.entry.id
      );
      spyOnSuccess.calls.reset();
      spyOnError.calls.reset();
      copyObservable
        .toPromise()
        .then(
          function() {
            spyOnSuccess();
          },
          function() {
            spyOnError();
          }
        )
        .then(function() {
          expect(spyOnSuccess).toHaveBeenCalled();
          expect(spyOnError).not.toHaveBeenCalled();
          expect(spyContentAction.calls.count()).toEqual(2);
          expect(nodesApi.copyNode).toHaveBeenCalledWith(fileToCopy.entry.id, {
            targetParentId: folderDestination.entry.id,
            name: 'file-name-1'
          });
        });
    }));
    describe('should copy content of folder-to-copy to folder with same name from destination folder', function() {
      var folderToCopy;
      var fileChildOfFolderToCopy;
      var folderParentAndDestination;
      var existingFolder;
      var spy;
      var spyOnContentAction;
      var spyOnFolderAction;
      var copyObservable;
      beforeEach(function() {
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
      it('when folder to copy has a file as content', async(function() {
        var testFamilyNodes = [
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
            function() {
              spyOnSuccess();
            },
            function() {
              spyOnError();
            }
          )
          .then(function() {
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
      it('when folder to copy is empty', async(function() {
        var testFamilyNodes = [
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
            function() {
              spyOnSuccess();
            },
            function() {
              spyOnError();
            }
          )
          .then(function() {
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
      it('when folder to copy has another folder as child', async(function() {
        var folderChild = new TestNode('folder-child-id');
        var testFamilyNodes = [
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
            function() {
              spyOnSuccess();
            },
            function() {
              spyOnError();
            }
          )
          .then(function() {
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
  describe('moveNodes', function() {
    var permissionToMove = 'delete';
    var fileToMove;
    var folderToMove;
    var destinationFolder;
    var spyOnBatchOperation;
    var spyOnDocumentListServiceAction;
    var documentListService;
    beforeEach(function() {
      fileToMove = new TestNode('file-to-be-moved', isFile, 'file-name');
      folderToMove = new TestNode('fid', !isFile, 'folder-name');
      destinationFolder = new TestNode(folderDestinationId);
      documentListService = TestBed.get(DocumentListService);
      spyOnBatchOperation = spyOn(
        service,
        'doBatchOperation'
      ).and.callThrough();
    });
    it('should allow to select destination for nodes that have permission to be moved', function() {
      var spyOnDestinationPicker = spyOn(
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
    it('should not allow to select destination for nodes that do not have permission to be moved', function() {
      var spyOnDestinationPicker = spyOn(
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
    it('should call the documentListService moveNode directly for moving a file that has permission to be moved', function() {
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
    describe('moveContentAction', function() {
      beforeEach(function() {
        spyOnSuccess.calls.reset();
        spyOnError.calls.reset();
      });
      it('should not throw error on conflict, to be able to show message in case of partial move of files', async(function() {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(conflictError));
        var moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            function(value) {
              spyOnSuccess(value);
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalledWith(conflictError);
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));
      it('should not throw permission error, to be able to show message in case of partial move of files', async(function() {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(permissionError));
        var moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            function(value) {
              spyOnSuccess(value);
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
            expect(spyOnError).not.toHaveBeenCalledWith(permissionError);
          });
      }));
      it('in case of success, should return also the initial parent id of the moved node', async(function() {
        var parentID = 'parent-id';
        fileToMove.entry['parentId'] = parentID;
        fileToMove.entry['allowableOperations'] = [permissionToMove];
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(of(fileToMove));
        var moveContentActionObservable = service.moveContentAction(
          fileToMove.entry,
          folderDestinationId
        );
        moveContentActionObservable
          .toPromise()
          .then(
            function(value) {
              spyOnSuccess(value);
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalledWith({
              itemMoved: fileToMove,
              initialParentId: parentID
            });
            expect(spyOnError).not.toHaveBeenCalledWith(permissionError);
          });
      }));
    });
    describe('moveFolderAction', function() {
      beforeEach(function() {
        spyOnSuccess.calls.reset();
        spyOnError.calls.reset();
      });
      it('should not throw permission error in case it occurs on folder move', async(function() {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(permissionError));
        var moveFolderActionObservable = service.moveFolderAction(
          folderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            function(value) {
              spyOnSuccess(value);
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalledWith(permissionError);
            expect(spyOnError).not.toHaveBeenCalled();
          });
      }));
      it('should not throw error on conflict in case it occurs on folder move', async(function() {
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.returnValue(throwError(conflictError));
        var newDestination = new TestNode(
          'new-destination',
          !isFile,
          folderToMove.entry.name
        );
        spyOn(service, 'getChildByName').and.returnValue(of(newDestination));
        spyOn(service, 'getNodeChildren').and.returnValue(
          of(emptyChildrenList)
        );
        var moveFolderActionObservable = service.moveFolderAction(
          folderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            function() {
              spyOnSuccess();
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));
      it('should try to move children nodes of a folder to already existing folder with same name', async(function() {
        var parentFolderToMove = new TestNode(
          'parent-folder',
          !isFile,
          'conflicting-name'
        );
        spyOnDocumentListServiceAction = spyOn(
          documentListService,
          'moveNode'
        ).and.callFake(function(contentEntryId, selectionId) {
          if (contentEntryId === parentFolderToMove.entry.id) {
            return throwError(conflictError);
          }
          return of({});
        });
        spyOn(service, 'moveContentAction').and.returnValue(of({}));
        var newDestination = new TestNode(
          'new-destination',
          !isFile,
          'conflicting-name'
        );
        spyOn(service, 'getChildByName').and.returnValue(of(newDestination));
        var childrenNodes = [fileToMove, folderToMove];
        spyOn(service, 'getNodeChildren').and.returnValue(
          of({ list: { entries: childrenNodes } })
        );
        var moveFolderActionObservable = service.moveFolderAction(
          parentFolderToMove.entry,
          folderDestinationId
        );
        moveFolderActionObservable
          .toPromise()
          .then(
            function() {
              spyOnSuccess();
            },
            function(error) {
              spyOnError(error);
            }
          )
          .then(function() {
            expect(spyOnDocumentListServiceAction).toHaveBeenCalled();
            expect(spyOnSuccess).toHaveBeenCalled();
            expect(spyOnError).not.toHaveBeenCalledWith(conflictError);
          });
      }));
    });
    describe('moveNodeAction', function() {
      describe('on moving folder to a destination where a folder with the same name exists', function() {
        var parentFolderToMove;
        var moveNodeActionPromise;
        var spyOnDelete;
        beforeEach(function() {
          parentFolderToMove = new TestNode(
            'parent-folder',
            !isFile,
            'conflicting-name'
          );
          spyOnDelete = spyOn(contentApi, 'deleteNode').and.returnValue(
            of(null)
          );
        });
        afterEach(function() {
          spyOnDelete.calls.reset();
          spyOnSuccess.calls.reset();
          spyOnError.calls.reset();
        });
        it('should take no extra delete action, if folder was moved to the same location', async(function() {
          spyOn(service, 'moveFolderAction').and.returnValue(of(null));
          parentFolderToMove.entry.parentId = folderDestinationId;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              function() {
                spyOnSuccess();
              },
              function(error) {
                spyOnError(error);
              }
            )
            .then(function() {
              expect(spyOnDelete).not.toHaveBeenCalled();
              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));
        it('should take no extra delete action, if its children were partially moved', async(function() {
          var movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [fileToMove],
            failed: [folderToMove],
            partiallySucceeded: []
          });
          parentFolderToMove.entry.parentId = 'not-' + folderDestinationId;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              function() {
                spyOnSuccess();
              },
              function(error) {
                spyOnError(error);
              }
            )
            .then(function() {
              expect(spyOnDelete).not.toHaveBeenCalled();
              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));
        it('should take extra delete action, if children successfully moved and folder is still on location', async(function() {
          var movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [movedChildrenNodes],
            failed: [],
            partiallySucceeded: []
          });
          var folderOnLocation = parentFolderToMove;
          spyOn(service, 'getChildByName').and.returnValue(
            of(folderOnLocation)
          );
          parentFolderToMove.entry.parentId = 'not-' + folderDestinationId;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              function() {
                spyOnSuccess();
              },
              function(error) {
                spyOnError(error);
              }
            )
            .then(function() {
              expect(spyOnDelete).toHaveBeenCalled();
              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));
        it('should take no extra delete action, if folder is no longer on location', async(function() {
          var movedChildrenNodes = [fileToMove, folderToMove];
          spyOn(service, 'moveFolderAction').and.returnValue(
            of(movedChildrenNodes)
          );
          spyOn(service, 'processResponse').and.returnValue({
            succeeded: [movedChildrenNodes],
            failed: [],
            partiallySucceeded: []
          });
          spyOn(service, 'getChildByName').and.returnValue(of(null));
          parentFolderToMove.entry.parentId = 'not-' + folderDestinationId;
          moveNodeActionPromise = service
            .moveNodeAction(parentFolderToMove.entry, folderDestinationId)
            .toPromise();
          moveNodeActionPromise
            .then(
              function() {
                spyOnSuccess();
              },
              function(error) {
                spyOnError(error);
              }
            )
            .then(function() {
              expect(spyOnDelete).not.toHaveBeenCalled();
              expect(spyOnSuccess).toHaveBeenCalled();
              expect(spyOnError).not.toHaveBeenCalled();
            });
        }));
      });
    });
  });
  describe('getChildByName', function() {
    var testFamilyNodes;
    var notChildNode;
    var childNode;
    beforeEach(function() {
      childNode = new TestNode(fileId, isFile, 'child-name');
      var parentNode = new TestNode();
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
    it('emits child node with specified name, when it exists in folder', function() {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes)
      );
      service
        .getChildByName(testFamilyNodes[0].parentNodeId, childNode.entry.name)
        .subscribe(function(value) {
          expect(value).toEqual(childNode);
        });
    });
    it('emits null value when child with specified name is not found in folder', async(function() {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes)
      );
      service
        .getChildByName(
          testFamilyNodes[0].parentNodeId,
          notChildNode.entry.name
        )
        .subscribe(function(value) {
          expect(value).toEqual(null);
        });
    }));
    it('emits error when permission error occurs', async(function() {
      spyOn(nodesApi, 'getNodeChildren').and.callFake(
        helper.fakeGetNodeChildren(testFamilyNodes, actionIsForbidden)
      );
      service
        .getChildByName(
          testFamilyNodes[0].parentNodeId,
          notChildNode.entry.name
        )
        .subscribe(function(value) {
          expect(value).toEqual(null);
        });
    }));
  });
  describe('getNewNameFrom', function() {
    var testData = [
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
    testData.forEach(function(data) {
      it(
        "new name should be '" +
          data.expected +
          "' for given name: '" +
          data.name +
          "', and baseName: '" +
          data.baseName +
          "'",
        function() {
          var result = service.getNewNameFrom(data.name, data.baseName);
          expect(result).toBe(data.expected);
        }
      );
    });
  });
  describe('flatten', function() {
    var testNode1 = new TestNode('node1-id', isFile, 'node1-name');
    var testNode2 = new TestNode('node2-id', !isFile, 'node2-name');
    var testData = [
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
    testData.forEach(function(data) {
      it(
        "flattened array should be '" +
          data.expected +
          "' for given data: '" +
          data.nDimArray +
          "'",
        function() {
          var result = service.flatten(data.nDimArray);
          expect(result.length).toBe(data.expected.length);
          expect(JSON.stringify(result)).toEqual(JSON.stringify(data.expected));
        }
      );
    });
  });
  describe('processResponse', function() {
    var testNode1 = new TestNode('node1-id', isFile, 'node1-name');
    var testNode2 = new TestNode('node2-id', !isFile, 'node2-name');
    var parentID = 'patent-1-id';
    testNode1.entry['parentId'] = parentID;
    var testData = [
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
    testData.forEach(function(response) {
      it(
        "processed response should be '" +
          response.expected +
          "' for given input: '" +
          response.data +
          "'",
        function() {
          var result = service.processResponse(response.data);
          expect(JSON.stringify(result)).toEqual(
            JSON.stringify(response.expected)
          );
        }
      );
    });
  });
});
//# sourceMappingURL=node-actions.service.spec.js.map
