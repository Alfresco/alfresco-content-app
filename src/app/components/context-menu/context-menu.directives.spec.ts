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

import { ContextActionsDirective } from './context-menu.directive';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ContextActionsDirective', () => {
  let directive;
  const contextMenuServiceMock = <any>{
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    directive = new ContextActionsDirective(contextMenuServiceMock);
  });

  it('should not render context menu when `enabled` property is false', () => {
    directive.enabled = false;
    directive.onContextMenuEvent(new MouseEvent('contextmenu'));

    expect(contextMenuServiceMock.open).not.toHaveBeenCalled();
  });

  it('should call service to render context menu', fakeAsync(() => {
    const el = document.createElement('div');
    el.className =
      'adf-datatable-cell adf-datatable-cell--text adf-datatable-row';

    const fragment = document.createDocumentFragment();
    fragment.appendChild(el);
    const target = fragment.querySelector('div');

    directive.ngOnInit();

    directive.onContextMenuEvent(<any>{ preventDefault: () => {}, target });

    tick(500);

    expect(contextMenuServiceMock.open).toHaveBeenCalled();
  }));
});
