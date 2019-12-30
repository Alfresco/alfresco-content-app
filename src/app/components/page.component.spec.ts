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

import { PageComponent } from './page.component';
import {
  ReloadDocumentListAction,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { MinimalNodeEntity } from '@alfresco/js-api';

class TestClass extends PageComponent {
  node: any;

  constructor(store) {
    super(store, null, null);
  }
}

describe('PageComponent', () => {
  let component: TestClass;
  const store = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select')
  };

  beforeEach(() => {
    component = new TestClass(store);
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

  describe('Reload', () => {
    const locationHref = location.href;

    afterEach(() => {
      window.history.pushState({}, null, locationHref);
    });

    it('should not reload if url contains viewer outlet', () => {
      window.history.pushState({}, null, `${locationHref}#test(viewer:view)`);
      component.reload();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should reload if url does not contain viewer outlet', () => {
      component.reload();
      expect(store.dispatch).toHaveBeenCalledWith(
        new ReloadDocumentListAction()
      );
    });

    it('should set selection after reload if node is passed', () => {
      const node = {
        entry: {
          id: 'node-id'
        }
      } as MinimalNodeEntity;

      component.reload(node);
      expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(
        new SetSelectedNodesAction([node])
      );
    });
  });
});
