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
import { BulkActionsDropdownComponent } from './bulk-actions-dropdown.component';
import { Store } from '@ngrx/store';
import { AppStore } from '@alfresco/aca-shared/store';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';
import { AppTestingModule } from '../../testing/app-testing.module';
import { TranslationService } from '@alfresco/adf-core';
import { AppExtensionService } from '@alfresco/aca-shared';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';

describe('BulkActionsDropdownComponent', () => {
  let component: BulkActionsDropdownComponent;
  let fixture: ComponentFixture<BulkActionsDropdownComponent>;
  let store: Store<AppStore>;
  let translationService: TranslationService;
  let dropdown: HTMLElement;
  let extensionService: AppExtensionService;
  let loader: HarnessLoader;

  const mockItem: ContentActionRef = {
    id: 'mockId',
    title: 'some title',
    tooltip: 'some tooltip',
    icon: 'adf:mock-icon',
    type: ContentActionType.custom,
    actions: {
      click: 'TEST_EVENT'
    },
    rules: {
      visible: 'isItemVisible'
    }
  };

  const totalItemsMock$: BehaviorSubject<number> = new BehaviorSubject(0);

  const getElement = (selector: string): HTMLElement | null => fixture.debugElement.query(By.css(`[data-automation-id="${selector}"]`)).nativeElement;

  const getLabelText = (selector: string): string => getElement(selector).textContent.trim();

  const selectOptionFromDropdown = async (selectionIndex: number) => {
    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.open();
    await selectHarness.clickOptions(await selectHarness.getOptions()[selectionIndex]);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkActionsDropdownComponent, AppTestingModule],
      providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
    }).compileComponents();

    store = TestBed.inject(Store);
    translationService = TestBed.inject(TranslationService);

    spyOn(store, 'select').and.returnValue(totalItemsMock$);
    spyOn(translationService, 'get').and.callFake((key) => of(key));

    fixture = TestBed.createComponent(BulkActionsDropdownComponent);
    component = fixture.componentInstance;

    component.items = [mockItem];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there are no search items', () => {
    beforeEach(() => {
      totalItemsMock$.next(0);
      fixture.detectChanges();
      dropdown = getElement('aca-bulk-actions-dropdown');
      fixture.detectChanges();
    });

    it('should disable dropdown', () => {
      expect(dropdown.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have correct placeholder', () => {
      expect(getLabelText('aca-bulk-actions-dropdown')).toEqual('SEARCH.BULK_ACTIONS_DROPDOWN.BULK_NOT_AVAILABLE');
    });

    it('should call translationService.get with correct arguments', () => {
      expect(translationService.get).toHaveBeenCalledWith('SEARCH.BULK_ACTIONS_DROPDOWN.BULK_NOT_AVAILABLE');
      expect(translationService.get).toHaveBeenCalledWith('SEARCH.BULK_ACTIONS_DROPDOWN.BULK_NOT_AVAILABLE_TOOLTIP');
    });
  });

  describe('when there are search items', () => {
    beforeEach(() => {
      totalItemsMock$.next(10);
      fixture.detectChanges();
      dropdown = getElement('aca-bulk-actions-dropdown');
      dropdown.click();
      fixture.detectChanges();
    });

    it('should enable dropdown', () => {
      expect(dropdown.getAttribute('aria-disabled')).toBe('false');
    });

    it('should have correct placeholder', () => {
      expect(getLabelText('aca-bulk-actions-dropdown')).toEqual('SEARCH.BULK_ACTIONS_DROPDOWN.TITLE');
    });

    it('should have option with correct tooltip', () => {
      const option = getElement('mockId');

      expect(option.getAttribute('title')).toEqual('some tooltip');
    });

    it('should have option with correct label', () => {
      const optionLabel = getLabelText('mockId');

      expect(optionLabel).toEqual('some title');
    });

    it('should have correct icon in an option', () => {
      const icon = getElement('aca-bulk-action-icon-mockId');

      expect(icon.getAttribute('title')).toEqual('some title');
    });

    it('should call translationService.get with correct arguments', () => {
      expect(translationService.get).toHaveBeenCalledWith('SEARCH.BULK_ACTIONS_DROPDOWN.TITLE', { count: 10 });
    });

    describe('when extension service is used', () => {
      beforeEach(() => {
        extensionService = TestBed.inject(AppExtensionService);
        spyOn(extensionService, 'getBulkActions').and.returnValue(of([mockItem]));
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
      });

      it('should run action on selection', async () => {
        spyOn(extensionService, 'runActionById');
        await selectOptionFromDropdown(0);
        fixture.detectChanges();

        expect(extensionService.runActionById).toHaveBeenCalledWith(mockItem.actions.click, {
          focusedElementOnCloseSelector: '.adf-context-menu-source'
        });
      });

      it('should reset selection on bulkActionExecuted', async () => {
        await selectOptionFromDropdown(0);
        fixture.detectChanges();

        expect(component.bulkSelectControl.value).toEqual(mockItem);

        extensionService.bulkActionExecuted();
        fixture.detectChanges();

        expect(component.bulkSelectControl.value).toBeNull();
      });

      it('should run dropdown action on Enter', () => {
        spyOn(component, 'runAction');
        component.bulkSelectControl.setValue(mockItem);
        const selectElement = getElement('aca-bulk-actions-dropdown');
        selectElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(component.runAction).toHaveBeenCalledWith(mockItem);
      });

      it('should NOT run dropdown action on Tab', () => {
        spyOn(component, 'runAction');
        component.bulkSelectControl.setValue(mockItem);
        const selectElement = getElement('aca-bulk-actions-dropdown');
        selectElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

        expect(component.runAction).not.toHaveBeenCalled();
      });
    });
  });
});
