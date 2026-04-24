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
import { PageLayoutComponent } from './page-layout.component';
import { AppService } from '../../services/app.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { AutoFocusDirective } from '@alfresco/adf-content-services';
import { DebugElement } from '@angular/core';

describe('PageLayoutComponent', () => {
  let fixture: ComponentFixture<PageLayoutComponent>;
  let unitTestingUtils: UnitTestingUtils;

  const appServiceMock = {
    toggleAppNavBar$: new Subject(),
    appNavNarMode$: new BehaviorSubject<'collapsed' | 'expanded'>('expanded')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageLayoutComponent, NoopTranslateModule],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock
        }
      ]
    });
    fixture = TestBed.createComponent(PageLayoutComponent);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  describe('Expand button', () => {
    let expandButton: DebugElement;

    beforeEach(() => {
      appServiceMock.appNavNarMode$.next('collapsed');
      fixture.detectChanges();
      expandButton = unitTestingUtils.getByCSS('.aca-content-header-button');
    });

    it('should toggle the appService toggleAppNavBar$ Subject', () => {
      spyOn(appServiceMock.toggleAppNavBar$, 'next');

      expandButton.nativeElement.click();
      expect(appServiceMock.toggleAppNavBar$.next).toHaveBeenCalled();
    });

    it('should have AutoFocusDirective', () => {
      fixture.detectChanges();
      expect(expandButton.injector.get(AutoFocusDirective, null)).not.toBeNull();
    });
  });
});
