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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { MatMenuModule } from '@angular/material/menu';
import { UnitTestingUtils } from '@alfresco/adf-core';

@Component({
  standalone: true,
  imports: [OutsideEventDirective, MatMenuModule],
  template: `
    <div class="custom-selector">
      <button #menuTrigger="matMenuTrigger" [matMenuTriggerFor]="menu" data-automation-id="trigger-button">Open Menu</button>
      <mat-menu #menu="matMenu" class="aca-context-menu" acaContextMenuOutsideEvent>
        <button mat-menu-item data-automation-id="menu-item">Item 1</button>
      </mat-menu>
      <button data-automation-id="outside-button">Outside Button</button>
    </div>
  `
})
class TestComponent {}

describe('OutsideEventDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: DebugElement;
  let unitTestingUtils: UnitTestingUtils;
  let directiveInstance: OutsideEventDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, OutsideEventDirective, MatMenuModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    directive = unitTestingUtils.getByDirective(OutsideEventDirective);
    directiveInstance = directive.injector.get(OutsideEventDirective);
    fixture.detectChanges();
  });

  it('should emit clickOutside when clicking outside the context menu', () => {
    spyOn(directiveInstance.clickOutside, 'next');

    unitTestingUtils.clickByDataAutomationId('outside-button');
    fixture.detectChanges();

    expect(directiveInstance.clickOutside.next).toHaveBeenCalled();
  });

  it('should not emit clickOutside when clicking inside the context menu', () => {
    unitTestingUtils.clickByDataAutomationId('trigger-button');
    fixture.detectChanges();

    spyOn(directiveInstance.clickOutside, 'next');

    unitTestingUtils.clickByDataAutomationId('menu-item');
    fixture.detectChanges();

    expect(directiveInstance.clickOutside.next).not.toHaveBeenCalled();
  });

  it('should focus focusTargetSelector element on escape key', () => {
    expect(directiveInstance.focusTargetSelector).toBe('.adf-context-menu-source');

    directiveInstance.focusTargetSelector = '.custom-selector';
    unitTestingUtils.clickByDataAutomationId('trigger-button');
    fixture.detectChanges();

    const contextMenuSource: HTMLElement = unitTestingUtils.getByCSS(directiveInstance.focusTargetSelector).nativeElement;
    spyOn(contextMenuSource, 'focus');

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true
      })
    );

    expect(contextMenuSource.focus).toHaveBeenCalled();
  });
});
