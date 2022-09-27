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

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContextMenuEffects } from './contextmenu.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContextMenu } from '@alfresco/aca-shared/store';
import { ContextMenuService } from '../../components/context-menu/context-menu.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { ContextMenuOverlayRef } from '../../components/context-menu/context-menu-overlay';

describe('ContextMenuEffects', () => {
  let store: Store<any>;
  let contextMenuService: ContextMenuService;
  const overlayRefMock = new ContextMenuOverlayRef({} as OverlayRef);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([ContextMenuEffects])],
      providers: [ContextMenuService]
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
});
