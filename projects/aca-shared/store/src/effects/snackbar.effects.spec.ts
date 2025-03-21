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
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreTestingModule, SnackbarContentComponent } from '@alfresco/adf-core';
import { SnackbarEffects } from './snackbar.effects';
import { SnackbarErrorAction, SnackbarInfoAction, SnackbarWarningAction } from '../actions/snackbar.actions';
import { AppStore } from '@alfresco/aca-shared/store';

describe('NodeEffects', () => {
  let store: Store<AppStore>;
  let matSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, StoreModule.forRoot({}), EffectsModule.forRoot([SnackbarEffects])]
    });

    store = TestBed.inject(Store);
    matSnackBar = TestBed.inject(MatSnackBar);
    spyOn(matSnackBar, 'openFromComponent');
  });

  describe('infoEffect', () => {
    it('should open snackbar with adf-info-snackbar panel class', () => {
      store.dispatch(new SnackbarInfoAction('test-snackbar-message'));
      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(SnackbarContentComponent, {
        panelClass: 'adf-info-snackbar',
        data: {
          message: 'test-snackbar-message',
          actionLabel: null,
          actionIcon: 'close',
          actionIconAriaLabel: 'CLOSE',
          showAction: true,
          callActionOnIconClick: false
        }
      });
    });
  });

  describe('warningEffect', () => {
    it('should open snackbar with adf-info-snackbar panel class', () => {
      store.dispatch(new SnackbarWarningAction('test-snackbar-message'));
      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(SnackbarContentComponent, {
        panelClass: 'adf-warning-snackbar',
        data: {
          message: 'test-snackbar-message',
          actionLabel: null,
          actionIcon: 'close',
          actionIconAriaLabel: 'CLOSE',
          showAction: true,
          callActionOnIconClick: false
        }
      });
    });
  });

  describe('errorEffect', () => {
    it('should open snackbar with adf-info-snackbar panel class', () => {
      store.dispatch(new SnackbarErrorAction('test-snackbar-message'));
      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(SnackbarContentComponent, {
        panelClass: 'adf-error-snackbar',
        data: {
          message: 'test-snackbar-message',
          actionLabel: null,
          actionIcon: 'close',
          actionIconAriaLabel: 'CLOSE',
          showAction: true,
          callActionOnIconClick: false
        }
      });
    });
  });
});
