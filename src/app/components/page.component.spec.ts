/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { TestBed } from '@angular/core/testing';

import { PageComponent } from './page.component';

class TestClass extends PageComponent {
    node: any;

    constructor() {
        super(null);
    }

    fetchNodes(parentNodeId?: string, options?: any) {
        // abstract
    }
}

describe('PageComponent', () => {
    let component;

    beforeEach(() => {
        component = new TestClass();
    });

    describe('getParentNodeId()', () => {
        it('returns parent node id when node is set', () => {
            component.node = { id: 'node-id' };

            expect(component.getParentNodeId()).toBe('node-id');
        });

        it('returns null when node is not set', () => {
            component.node = null;

            expect(component.getParentNodeId()).toBe(null);
        });
    });

    describe('onFetchError()', () => {
        it('sets isLoading state to false', () => {
            component.isLoading = true;

            component.onFetchError();

            expect(component.isLoading).toBe(false);
        });
    });

    describe('onPaginationChange()', () => {
        it('fetch children nodes for current node id', () => {
            component.node = { id: 'node-id' };
            spyOn(component, 'fetchNodes').and.stub();

            component.onPaginationChange({pagination: 'pagination-data'});

            expect(component.fetchNodes).toHaveBeenCalledWith('node-id', { pagination: 'pagination-data' });
        });
    });

    describe('onPageLoaded()', () => {
        let page;

        beforeEach(() => {
            page = {
                list: {
                    entries: ['a', 'b', 'c'],
                    pagination: {}
                }
            };

            component.isLoading = true;
            component.isEmpty = true;
            component.onPageLoaded(page);
        });

        it('sets isLoading state to false', () => {
            expect(component.isLoading).toBe(false);
        });

        it('sets component paging data', () => {
            expect(component.paging).toBe(page);
        });

        it('sets component pagination data', () => {
            expect(component.pagination).toBe(page.list.pagination);
        });

        it('sets component isEmpty state', () => {
            expect(component.isEmpty).toBe(false);
        });
    });

    describe('hasSelection()', () => {
        it('returns true when it has nodes selected', () => {
            const hasSelection = component.hasSelection([ {}, {} ]);
            expect(hasSelection).toBe(true);
        });

        it('returns false when it has no selections', () => {
            const hasSelection = component.hasSelection([]);
            expect(hasSelection).toBe(false);
        });
    });

    describe('filesOnlySelected()', () => {
        it('return true if only files are selected', () => {
            const selected = [ { entry: { isFile: true } }, { entry: { isFile: true } } ];
            expect(component.filesOnlySelected(selected)).toBe(true);
        });

        it('return false if selection contains others types', () => {
            const selected = [ { entry: { isFile: true } }, { entry: { isFolder: true } } ];
            expect(component.filesOnlySelected(selected)).toBe(false);
        });

        it('return false if selection contains no files', () => {
            const selected = [ { entry: { isFolder: true } } ];
            expect(component.filesOnlySelected(selected)).toBe(false);
        });

        it('return false no selection', () => {
            const selected = [];
            expect(component.filesOnlySelected(selected)).toBe(false);
        });
    });

    describe('foldersOnlySelected()', () => {
        it('return true if only folders are selected', () => {
            const selected = [ { entry: { isFolder: true } }, { entry: { isFolder: true } } ];
            expect(component.foldersOnlySelected(selected)).toBe(true);
        });

        it('return false if selection contains others types', () => {
            const selected = [ { entry: { isFile: true } }, { entry: { isFolder: true } } ];
            expect(component.foldersOnlySelected(selected)).toBe(false);
        });

        it('return false if selection contains no files', () => {
            const selected = [ { entry: { isFile: true } } ];
            expect(component.foldersOnlySelected(selected)).toBe(false);
        });

        it('return false no selection', () => {
            const selected = [];
            expect(component.foldersOnlySelected(selected)).toBe(false);
        });
    });

    describe('isFileSelected()', () => {
        it('returns true if selected node is file', () => {
            const selection = [ { entry: { isFile: true } } ];
            expect(component.isFileSelected(selection)).toBe(true);
        });

        it('returns false if selected node is folder', () => {
            const selection = [ { entry: { isFolder: true } } ];
            expect(component.isFileSelected(selection)).toBe(false);
        });

        it('returns false if there are more than one selections', () => {
            const selection = [ { entry: { isFile: true } }, { entry: { isFile: true } } ];
            expect(component.isFileSelected(selection)).toBe(false);
        });
    });

    describe('canEditFolder()', () => {
        it('returns true if selected node is folder', () => {
            const selection = [ { entry: { isFolder: true } } ];
            spyOn(component, 'nodeHasPermission').and.returnValue(true);

            expect(component.canEditFolder(selection)).toBe(true);
        });

        it('returns false if selected node is file', () => {
            const selection = [ { entry: { isFile: true } } ];
            expect(component.canEditFolder(selection)).toBe(false);
        });

        it('returns false if there are more than one selections', () => {
            const selection = [ { entry: { isFolder: true } }, { entry: { isFolder: true } } ];
            expect(component.canEditFolder(selection)).toBe(false);
        });

        it('returns false folder dows not have edit permission', () => {
            spyOn(component, 'nodeHasPermission').and.returnValue(false);
            const selection = [ { entry: { isFolder: true } } ];

            expect(component.canEditFolder(selection)).toBe(false);
        });
    });

    describe('canDelete()', () => {
        it('returns false if node has no delete permission', () => {
            const selection = [ { entry: { } } ];
            spyOn(component, 'nodeHasPermission').and.returnValue(false);

            expect(component.canDelete(selection)).toBe(false);
        });

        it('returns true if node has delete permission', () => {
            const selection = [ { entry: { } } ];
            spyOn(component, 'nodeHasPermission').and.returnValue(true);

            expect(component.canDelete(selection)).toBe(true);
        });
    });

    describe('canMove()', () => {
        it('returns true if node can be deleted', () => {
            const selection = [ { entry: { } } ];
            spyOn(component, 'canDelete').and.returnValue(true);

            expect(component.canMove(selection)).toBe(true);
        });

        it('returns false if node can not be deleted', () => {
            const selection = [ { entry: { } } ];
            spyOn(component, 'canDelete').and.returnValue(false);

            expect(component.canMove(selection)).toBe(false);
        });
    });

    describe('canPreviewFile()', () => {
        it('it returns true if node is file', () => {
            const selection = [{ entry: { isFile: true }  }];

            expect(component.canPreviewFile(selection)).toBe(true);
        });

        it('it returns false if node is folder', () => {
            const selection = [{ entry: { isFolder: true }  }];

            expect(component.canPreviewFile(selection)).toBe(false);
        });
    });

    describe('canShareFile()', () => {
        it('it returns true if node is file', () => {
            const selection = [{ entry: { isFile: true }  }];

            expect(component.canShareFile(selection)).toBe(true);
        });

        it('it returns false if node is folder', () => {
            const selection = [{ entry: { isFolder: true }  }];

            expect(component.canShareFile(selection)).toBe(false);
        });
    });

    describe('canDownloadFile()', () => {
        it('it returns true if node is file', () => {
            const selection = [{ entry: { isFile: true }  }];

            expect(component.canDownloadFile(selection)).toBe(true);
        });

        it('it returns false if node is folder', () => {
            const selection = [{ entry: { isFolder: true }  }];

            expect(component.canDownloadFile(selection)).toBe(false);
        });
    });

    describe('nodeHasPermission()', () => {
        it('returns true is has permission', () => {
            const node = { allowableOperations: ['some-operation'] };

            expect(component.nodeHasPermission(node, 'some-operation')).toBe(true);
        });

        it('returns true is has permission', () => {
            const node = { allowableOperations: ['other-operation'] };

            expect(component.nodeHasPermission(node, 'some-operation')).toBe(false);
        });
    });
});
