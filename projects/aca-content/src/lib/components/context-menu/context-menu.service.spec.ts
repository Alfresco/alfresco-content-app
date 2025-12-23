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
import { Overlay } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { NoopTranslateModule, UserPreferencesService, provideCoreAuthTesting } from '@alfresco/adf-core';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';
import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';

describe('ContextMenuService', () => {
  let contextMenuService: ContextMenuService;
  let overlay: Overlay;
  let injector: Injector;
  let userPreferencesService: UserPreferencesService;

  const customActionMock: ContentActionRef[] = [
    {
      type: ContentActionType.default,
      id: 'action',
      title: 'action',
      actions: {
        click: 'event'
      },
      icon: 'icon-name'
    }
  ];

  const overlayConfig: ContextmenuOverlayConfig = {
    hasBackdrop: false,
    backdropClass: '',
    panelClass: 'test-panel',
    source: {
      x: 1,
      y: 1
    } as any
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, ContextMenuComponent],
      providers: [provideCoreAuthTesting(), Overlay, { provide: Store, useValue: { select: () => of() } }, UserPreferencesService]
    });

    injector = TestBed.inject(Injector);
    overlay = TestBed.inject(Overlay);
    userPreferencesService = TestBed.inject(UserPreferencesService);
  });

  it('should create a custom overlay', () => {
    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig);

    expect(document.querySelector('.test-panel')).not.toBe(null);
  });

  it('should render component', () => {
    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig);

    expect(document.querySelector('aca-context-menu')).not.toBe(null);
  });

  it('should have default LTR direction value', () => {
    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig);

    expect(document.body.querySelector('div[dir="ltr"]')).not.toEqual(null);
  });

  it('should change direction on textOrientation event', () => {
    spyOn(userPreferencesService, 'select').and.returnValue(of('rtl'));

    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig);

    expect(document.body.querySelector('div[dir="rtl"]')).not.toBe(null);
  });

  it('should render custom context menu component', () => {
    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig, customActionMock);

    expect(document.querySelector('aca-custom-context-menu')).not.toBe(null);
  });

  it('should not render custom context menu when no custom actions are provided', () => {
    contextMenuService = new ContextMenuService(injector, overlay, userPreferencesService);

    contextMenuService.open(overlayConfig, []);

    expect(document.querySelector('aca-custom-context-menu')).toBe(null);
  });
});
