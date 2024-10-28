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

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContentActionType } from '@alfresco/adf-extensions';
import { AppExtensionService } from '@alfresco/aca-shared';
import { BaseContextMenuDirective } from './base-context-menu.directive';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('BaseContextMenuComponent', () => {
  let contextMenuOverlayRef: ContextMenuOverlayRef;
  let extensionsService: AppExtensionService;
  let baseContextMenuDirective: BaseContextMenuDirective;

  const contextItem = {
    type: ContentActionType.button,
    id: 'action-button',
    title: 'Test Button',
    actions: {
      click: 'TEST_EVENT'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        {
          provide: ContextMenuOverlayRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ]
    });

    contextMenuOverlayRef = TestBed.inject(ContextMenuOverlayRef);
    extensionsService = TestBed.inject(AppExtensionService);

    baseContextMenuDirective = new BaseContextMenuDirective(contextMenuOverlayRef, extensionsService, null);
  });

  it('should close context menu on Escape event', () => {
    baseContextMenuDirective.handleKeydownEscape(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(contextMenuOverlayRef.close).toHaveBeenCalled();
  });

  it('should close context menu on click outside event', () => {
    baseContextMenuDirective.onClickOutsideEvent();
    expect(contextMenuOverlayRef.close).toHaveBeenCalled();
  });

  it('should run action with provided action id and correct payload', () => {
    spyOn(extensionsService, 'runActionById');

    baseContextMenuDirective.runAction(contextItem);

    expect(extensionsService.runActionById).toHaveBeenCalledWith(contextItem.actions.click, {
      focusedElementOnCloseSelector: '.adf-context-menu-source'
    });
  });

  it('should return action id on trackByActionId', () => {
    const actionId = baseContextMenuDirective.trackByActionId(0, contextItem);
    expect(actionId).toBe(contextItem.id);
  });
});
