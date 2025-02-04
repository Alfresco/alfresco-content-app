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

import { ActionDirective } from './action.directive';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { AppStore } from '@alfresco/aca-shared/store';

describe('ActionDirective', () => {
  let directive: ActionDirective;
  let router: Router;
  let store: Store<AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionDirective],
      providers: [provideRouter([]), provideMockStore()]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    directive = new ActionDirective(router, store);
  });

  it('should navigate if action is route', () => {
    spyOn(router, 'navigate');
    directive.action = { url: 'dummy' };
    directive.onClick();
    expect(router.navigate).toHaveBeenCalledWith(['dummy', {}], { queryParams: {} });
  });

  it('should get query params correctly from URL', () => {
    spyOn(router, 'navigate');
    directive.action = { url: 'dummy?q=12345' };
    directive.onClick();
    expect(router.navigate).toHaveBeenCalledWith(['dummy', {}], { queryParams: { q: '12345' } });
  });

  it('should dispatch store action', () => {
    spyOn(store, 'dispatch');
    directive.action = { click: {} };
    directive.onClick();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
