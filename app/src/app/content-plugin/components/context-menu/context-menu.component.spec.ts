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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuModule } from './context-menu.module';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContentActionType } from '@alfresco/adf-extensions';

import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextMenuComponent>;
  let component: ContextMenuComponent;
  let contextMenuOverlayRef: ContextMenuOverlayRef;
  let extensionsService: AppExtensionService;

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
      imports: [ContextMenuModule, AppTestingModule],
      providers: [
        {
          provide: ContextMenuOverlayRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of({ count: 1 })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;

    contextMenuOverlayRef = TestBed.inject(ContextMenuOverlayRef);
    extensionsService = TestBed.inject(AppExtensionService);

    spyOn(extensionsService, 'getAllowedContextMenuActions').and.returnValue(of([contextItem]));

    fixture.detectChanges();
  });

  it('should close context menu on Escape event', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(contextMenuOverlayRef.close).toHaveBeenCalled();
  });

  it('should render defined context menu actions items', async () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const contextMenuElements = document.body.querySelector('.aca-context-menu').querySelectorAll('button');

    expect(contextMenuElements.length).toBe(1);
    expect(contextMenuElements[0].querySelector('span').innerText).toBe(contextItem.title);
  });

  it('should run action with provided action id', () => {
    spyOn(extensionsService, 'runActionById');

    component.runAction(contextItem.actions.click);

    expect(extensionsService.runActionById).toHaveBeenCalledWith(contextItem.actions.click);
  });
});
