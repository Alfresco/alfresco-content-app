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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { CustomContextMenuComponent } from './custom-context-menu.component';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContentActionType } from '@alfresco/adf-extensions';
import { CONTEXT_MENU_CUSTOM_ACTIONS } from './custom-context-menu-actions.token';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { initialState } from '@alfresco/aca-shared';

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<CustomContextMenuComponent>;
  let component: CustomContextMenuComponent;

  const contextMenuActionsMock = [
    {
      type: ContentActionType.button,
      id: 'action1',
      title: 'action1',
      actions: {
        click: 'event1'
      },
      icon: 'icon-name'
    },
    {
      type: ContentActionType.button,
      id: 'action2',
      title: 'action2',
      actions: {
        click: 'event2'
      },
      icon: 'icon-name'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        {
          provide: ContextMenuOverlayRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: Store,
          useValue: MockStore
        },
        provideMockStore({ initialState }),
        {
          provide: CONTEXT_MENU_CUSTOM_ACTIONS,
          useValue: contextMenuActionsMock
        }
      ]
    });

    fixture = TestBed.createComponent(CustomContextMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set context menu actions from Injection Token', () => {
    expect(component.actions.length).toBe(2);
  });

  it('should render defined context menu actions items', async () => {
    await fixture.whenStable();

    const contextMenuElements = document.body.querySelector('.aca-context-menu')?.querySelectorAll('button');
    const actionButtonLabel: HTMLElement = contextMenuElements?.[0].querySelector(`[data-automation-id="${contextMenuActionsMock[0].id}-label"]`);

    expect(contextMenuElements?.length).toBe(2);
    expect(actionButtonLabel.innerText).toBe(contextMenuActionsMock[0].title);
  });
});
