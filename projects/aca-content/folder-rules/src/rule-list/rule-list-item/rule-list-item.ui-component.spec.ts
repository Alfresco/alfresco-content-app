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
import { RuleListItemUiComponent } from './rule-list-item.ui-component';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { Rule } from '../../model/rule.model';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';

describe('RuleListItemUiComponent', () => {
  let component: RuleListItemUiComponent;
  let fixture: ComponentFixture<RuleListItemUiComponent>;
  let loader: HarnessLoader;
  let unitTestingUtils: UnitTestingUtils;

  const mockRule = {
    id: 'test-rule-id',
    name: 'Test Rule',
    description: 'Test rule description',
    isEnabled: true
  } as Rule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleListItemUiComponent]
    });

    fixture = TestBed.createComponent(RuleListItemUiComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    component.rule = mockRule;
  });

  it('should display rule name and description', () => {
    fixture.detectChanges();

    const nameElement = unitTestingUtils.getByCSS('.aca-rule-list-item__header__name');
    const descriptionElement = unitTestingUtils.getByCSS('.aca-rule-list-item__description');

    expect(nameElement.nativeElement.textContent.trim()).toBe(mockRule.name);
    expect(descriptionElement.nativeElement.textContent.trim()).toBe(mockRule.description);
  });

  it('should show slide toggle when showEnabledToggle is true', async () => {
    component.showEnabledToggle = true;
    fixture.detectChanges();

    const toggleHarness = await loader.getHarnessOrNull(MatSlideToggleHarness);
    expect(toggleHarness).toBeTruthy();
  });

  it('should hide slide toggle when showEnabledToggle is false', async () => {
    component.showEnabledToggle = false;
    fixture.detectChanges();

    const toggleHarness = await loader.getHarnessOrNull(MatSlideToggleHarness);
    expect(toggleHarness).toBeFalsy();
  });

  it('should set toggle checked state based on rule.isEnabled', async () => {
    component.showEnabledToggle = true;
    component.rule.isEnabled = true;
    fixture.detectChanges();

    const toggleHarness = await loader.getHarness(MatSlideToggleHarness);
    expect(await toggleHarness.isChecked()).toBe(true);
  });

  describe('onToggleClick', () => {
    it('should stop event propagation and emit enabledChanged with isEnabled value', () => {
      spyOn(component.enabledChanged, 'emit');
      const mockEvent = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);
      const isEnabled = true;

      component.onToggleClick(isEnabled, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.enabledChanged.emit).toHaveBeenCalledWith(isEnabled);
    });

    it('should stop event propagation and emit enabledChanged with false value', () => {
      spyOn(component.enabledChanged, 'emit');
      const mockEvent = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);
      const isEnabled = false;

      component.onToggleClick(isEnabled, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.enabledChanged.emit).toHaveBeenCalledWith(isEnabled);
    });
  });
});
