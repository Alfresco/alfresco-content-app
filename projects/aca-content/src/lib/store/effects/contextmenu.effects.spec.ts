/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContextMenuEffects } from './contextmenu.effects';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContextMenu, CustomContextMenu } from '@alfresco/aca-shared/store';
import { ContextMenuService } from '../../components/context-menu/context-menu.service';
import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ContextMenuOverlayRef } from '../../components/context-menu/context-menu-overlay';
import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';

const actionPayloadMock: ContentActionRef[] = [
  {
    type: ContentActionType.default,
    id: 'action',
    title: 'action',
    actions: {
      click: 'event'
    }
  }
];

describe('ContextMenuEffects', () => {
  let store: Store<any>;
  let contextMenuService: ContextMenuService;
  const overlayRefMock = new ContextMenuOverlayRef({} as OverlayRef);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, OverlayModule],
      providers: [ContextMenuService, provideEffects([ContextMenuEffects])]
    });

    store = TestBed.inject(Store);
    contextMenuService = TestBed.inject(ContextMenuService);

    spyOn(overlayRefMock, 'close').and.callFake(() => {});
    spyOn(contextMenuService, 'open').and.returnValue(overlayRefMock);
  });

  it('should open dialog', () => {
    store.dispatch(new ContextMenu(new MouseEvent('click')));
    expect(contextMenuService.open).toHaveBeenCalled();
  });

  it('should close dialog reference if previously was opened', () => {
    store.dispatch(new ContextMenu(new MouseEvent('click')));
    expect(contextMenuService.open).toHaveBeenCalled();

    store.dispatch(new ContextMenu(new MouseEvent('click')));
    expect(overlayRefMock.close).toHaveBeenCalled();
  });

  it('should open custom context menu on customContextMenu$ action', () => {
    store.dispatch(new CustomContextMenu(new MouseEvent('click'), actionPayloadMock));
    expect(contextMenuService.open).toHaveBeenCalled();
  });

  it('should not open custom context menu on customContextMenu$ action if no action provided', () => {
    store.dispatch(new CustomContextMenu(new MouseEvent('click'), []));
    expect(contextMenuService.open).not.toHaveBeenCalled();
  });

  it('should close custom context menu if a new one is opened', () => {
    store.dispatch(new CustomContextMenu(new MouseEvent('click'), actionPayloadMock));
    expect(contextMenuService.open).toHaveBeenCalled();

    store.dispatch(new CustomContextMenu(new MouseEvent('click'), actionPayloadMock));
    expect(overlayRefMock.close).toHaveBeenCalled();
  });
});
