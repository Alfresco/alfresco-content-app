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

/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActionsDropdownComponent } from './bulk-actions-dropdown.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../../../aca-shared/store/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ContentActionType } from '@alfresco/adf-extensions';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('BulkActionsDropdownComponent', () => {
  let component: BulkActionsDropdownComponent;
  let fixture: ComponentFixture<BulkActionsDropdownComponent>;
  let store: Store<AppStore>;

  const totalItemsMock$: BehaviorSubject<number> = new BehaviorSubject(0);

  const getElement = (selector: string): HTMLElement | null => fixture.debugElement.query(By.css(`[data-automation-id="${selector}"]`)).nativeElement;

  const getLabelText = (selector: string): string => getElement(selector).textContent.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkActionsDropdownComponent, AppTestingModule]
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'select').and.returnValue(totalItemsMock$);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionsDropdownComponent);
    component = fixture.componentInstance;
    component.items = [
      {
        id: 'app.bulk.actions.legalHold',
        component: 'app.bulk-actions-dropdown',
        title: 'GOVERNANCE.MANAGE_HOLDS.TITLE',
        description: 'GOVERNANCE.MANAGE_HOLDS.TITLE',
        icon: 'adf:manage_hold',
        type: ContentActionType.custom,
        rules: {
          visible: 'app.manage.holds.isLegalHoldPluginEnabled'
        }
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there are no search items', () => {
    let disabledDropdown: HTMLElement;

    beforeEach(() => {
      totalItemsMock$.next(0);
      fixture.detectChanges();
      disabledDropdown = getElement('aca-bulk-dropdown-disabled');
      fixture.detectChanges();
    });

    it('should disable dropdown', () => {
      expect(disabledDropdown.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have correct tooltip', () => {
      expect(disabledDropdown.getAttribute('title')).toBe('GOVERNANCE.MANAGE_HOLDS.BULK_NOT_AVAILABLE_TOOLTIP');
    });

    it('should have correct placeholder', () => {
      expect(getLabelText('aca-bulk-dropdown-disabled')).toEqual('BULK_NOT_AVAILABLE');
    });
  });

  describe('when there are search elements', () => {
    let dropdown: HTMLElement;

    beforeEach(() => {
      totalItemsMock$.next(10);
      fixture.detectChanges();
      dropdown = getElement('aca-bulk-dropdown');
      dropdown.click();
      fixture.detectChanges();
    });

    it('should enable dropdown', () => {
      expect(dropdown.getAttribute('aria-disabled')).toBe('false');
    });

    it('should have correct tooltip', () => {
      expect(dropdown.getAttribute('title')).toBe('SEARCH.BULK_ACTIONS_DROPDOWN');
    });

    it('should have correct placeholder', () => {
      expect(getLabelText('aca-bulk-dropdown')).toEqual('SEARCH.BULK_ACTIONS_DROPDOWN');
    });

    it('should have option with correct tooltip', () => {
      const option = getElement('app.bulk.actions.legalHold');

      expect(option.getAttribute('title')).toEqual('GOVERNANCE.MANAGE_HOLDS.TITLE');
    });

    it('should have option with correct label', () => {
      const optionLabel = getLabelText('app.bulk.actions.legalHold');

      expect(optionLabel).toEqual('GOVERNANCE.MANAGE_HOLDS.TITLE');
    });

    it('should have correct icon in an option', () => {
      const icon = getElement('aca-option-icon-app.bulk.actions.legalHold');

      expect(icon.getAttribute('title')).toEqual('GOVERNANCE.MANAGE_HOLDS.TITLE');
    });
  });
});
