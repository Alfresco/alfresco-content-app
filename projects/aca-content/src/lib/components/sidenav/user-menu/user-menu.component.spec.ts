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
import { MatMenuTrigger } from '@angular/material/menu';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { UserMenuComponent } from './user-menu.component';
import { AppExtensionService } from '@alfresco/aca-shared';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let testingUtils: UnitTestingUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, UserMenuComponent],
      providers: [{ provide: AppExtensionService, useValue: { runActionById() {} } }]
    });
    fixture = TestBed.createComponent(UserMenuComponent);
    testingUtils = new UnitTestingUtils(fixture.debugElement);

    component = fixture.componentInstance;
    component.data = {
      items: [
        { id: 'id-1', icon: 'icon-name' },
        { id: 'id-2', icon: 'icon-name' }
      ]
    };
    fixture.detectChanges();
  });

  it('should merge nested menu items to MatMenu in ngAfterViewInit', () => {
    spyOn(component.menu, 'ngAfterContentInit').and.callThrough();
    testingUtils.getByDirective(MatMenuTrigger).nativeElement.click();
    fixture.detectChanges();
    component.ngAfterViewInit();

    expect(component.menu._allItems.length).toBe(2);
    expect(component.menu.ngAfterContentInit).toHaveBeenCalled();
  });
});
