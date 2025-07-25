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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { NoopTranslateModule, SnackbarContentComponent } from '@alfresco/adf-core';
import { RouterEffects } from './router.effects';
import {
  AppStore,
  NavigateRouteAction,
  NavigateToFolder,
  NavigateToParentFolder,
  NavigateToPreviousPage,
  NavigateUrlAction
} from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Node } from '@alfresco/js-api';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NodeEffects', () => {
  let store: Store<AppStore>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule],
      providers: [provideStore(), provideEffects([RouterEffects])]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('navigateUrl$', () => {
    it('should call navigateByUrl on payload', () => {
      spyOn(router, 'navigateByUrl');
      store.dispatch(new NavigateUrlAction('mock-route'));
      expect(router.navigateByUrl).toHaveBeenCalledWith('mock-route');
    });
  });

  describe('navigateRoute$', () => {
    it('should call navigate on payload', () => {
      spyOn(router, 'navigate');
      store.dispatch(new NavigateRouteAction(['mock-route']));
      expect(router.navigate).toHaveBeenCalledWith(['mock-route']);
    });
  });

  describe('navigateToFolder$', () => {
    it('should navigate to folder in personal files root when path elements are not present', fakeAsync(() => {
      const node = {
        id: 'mock-id'
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/personal-files', 'mock-id']);
    }));

    it('should navigate to folder inside personal files when path elements are found', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-2',
              name: 'mock-name-2',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-3',
              name: 'mock-name-3',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/personal-files', 'mock-id']);
    }));

    it('should navigate to folder nested libraries when path elements are found and are inside libraries', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-sites-id-2',
              name: 'Sites',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-3',
              name: 'mock-name-3',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/libraries', 'mock-id']);
    }));

    it('should navigate to libraries root when parent.name is Site', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-sites-id-2',
              name: 'Sites',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/libraries', {}]);
    }));
  });

  describe('navigateToParentFolder$', () => {
    it('should show error message when path elements are not found', fakeAsync(() => {
      const matSnackBar = TestBed.inject(MatSnackBar);
      const node = {
        id: 'mock-id'
      } as Node;
      spyOn(matSnackBar, 'openFromComponent');
      store.dispatch(new NavigateToParentFolder({ entry: node }));
      tick(10);
      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(SnackbarContentComponent, {
        panelClass: 'adf-error-snackbar',
        data: {
          actionLabel: undefined,
          actionIcon: 'close',
          actionIconAriaLabel: 'CLOSE',
          message: 'APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION',
          showAction: true,
          callActionOnIconClick: false
        }
      });
    }));

    it('should navigate to folder inside personal files when path elements are found', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-2',
              name: 'mock-name-2',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-3',
              name: 'mock-name-3',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToParentFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/personal-files', 'mock-id-3']);
    }));

    it('should navigate to folder nested libraries when path elements are found and are inside libraries', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-sites-id-2',
              name: 'Sites',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-id-3',
              name: 'mock-name-3',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToParentFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/libraries', 'mock-id-3']);
    }));

    it('should navigate to libraries root when parent.name is Site', fakeAsync(() => {
      const node = {
        id: 'mock-id',
        path: {
          name: 'mock-path-name',
          elements: [
            {
              id: 'mock-id-1',
              name: 'mock-name-1',
              nodeType: 'mock-node-type'
            },
            {
              id: 'mock-sites-id-2',
              name: 'Sites',
              nodeType: 'mock-node-type'
            }
          ]
        }
      } as Node;
      spyOn(router, 'navigate');
      store.dispatch(new NavigateToFolder({ entry: node }));
      tick(10);
      expect(router.navigate).toHaveBeenCalledWith(['/libraries', {}]);
    }));
  });

  describe('navigateToPreviousPage$', () => {
    it('should navigate to previous page via location.back', () => {
      const location = TestBed.inject(Location);
      spyOn(location, 'back');
      store.dispatch(new NavigateToPreviousPage());
      expect(location.back).toHaveBeenCalledWith();
    });
  });
});
