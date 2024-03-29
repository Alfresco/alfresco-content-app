/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ContextActionsDirective } from './contextmenu.directive';
import { ContextMenu } from '@alfresco/aca-shared/store';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ContextActionsDirective', () => {
  let directive: ContextActionsDirective;

  const storeMock: any = {
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    directive = new ContextActionsDirective(storeMock);
  });

  it('should not render context menu when `enabled` property is false', () => {
    spyOn(directive, 'execute').and.stub();
    directive.enabled = false;
    directive.onContextMenuEvent(new MouseEvent('contextmenu'));

    expect(directive.execute).not.toHaveBeenCalled();
  });

  it('should call service to render context menu', fakeAsync(() => {
    const el = document.createElement('div');
    el.className = 'adf-datatable-cell adf-datatable-cell--text adf-datatable-row';

    const fragment = document.createDocumentFragment();
    fragment.appendChild(el);
    const target = fragment.querySelector('div');
    const mouseEventMock: any = { preventDefault: () => {}, target };

    directive.ngOnInit();

    directive.onContextMenuEvent(mouseEventMock);

    tick(500);

    expect(storeMock.dispatch).toHaveBeenCalledWith(new ContextMenu(mouseEventMock));
  }));

  it('should not call service to render context menu if the datatable is empty', fakeAsync(() => {
    storeMock.dispatch.calls.reset();
    const el = document.createElement('div');
    el.className = 'adf-no-content-container';

    const fragment = document.createDocumentFragment();
    fragment.appendChild(el);

    const target = fragment.querySelector('div');
    const mouseEventMock: any = { preventDefault: () => {}, target };

    directive.ngOnInit();

    directive.onContextMenuEvent(mouseEventMock);

    tick(500);

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  }));
});
