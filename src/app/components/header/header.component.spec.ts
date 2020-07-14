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

import { AppHeaderComponent } from './header.component';
import { AppState } from '@alfresco/aca-shared/store';
import { of } from 'rxjs';
import { async } from '@angular/core/testing';
import { ContentActionRef } from '@alfresco/adf-extensions';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;

  const actions = [
    { id: 'action-1', type: 'button' },
    { id: 'action-2', type: 'button' }
  ] as Array<ContentActionRef>;

  const store = {
    select: jasmine.createSpy('select')
  } as any;

  const appExtensionService = {
    getHeaderActions: () => actions
  } as any;

  const app = {
    headerColor: 'some-color',
    appName: 'name',
    logoPath: 'some/path'
  } as AppState;

  beforeEach(() => {
    store.select.and.callFake((memoizeFn) => {
      return of(memoizeFn({ app }));
    });

    component = new AppHeaderComponent(store, appExtensionService);
  });

  it('should set header color, name and logo', async(() => {
    component.appName$.subscribe((val) => expect(val).toBe(app.appName));
    component.logo$.subscribe((val) => expect(val).toBe(app.logoPath));
    component.headerColor$.subscribe((val) => expect(val).toBe(app.headerColor));
  }));

  it('should get header actions', () => {
    component.ngOnInit();
    expect(component.actions).toEqual(actions);
  });
});
