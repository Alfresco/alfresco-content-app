/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { PageComponent } from './page.component';

class TestClass extends PageComponent {
    node: any;

    constructor() {
        super(null, null, null, null);
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

    describe('isFolderSelected()', () => {
        it('returns true if selected node is folder', () => {
            const selection = [ { entry: { isFolder: true } } ];
            expect(component.isFolderSelected(selection)).toBe(true);
        });

        it('returns false if selected node is file', () => {
            const selection = [ { entry: { isFile: true } } ];
            expect(component.isFolderSelected(selection)).toBe(false);
        });

        it('returns false if there are more than one selections', () => {
            const selection = [ { entry: { isFolder: true } }, { entry: { isFolder: true } } ];
            expect(component.isFolderSelected(selection)).toBe(false);
        });
    });
});
