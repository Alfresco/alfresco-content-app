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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SidenavHeaderComponent } from './sidenav-header.component';
import { NoopAuthModule, NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { AppService } from '@alfresco/aca-shared';
import { Subject } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';

describe('SidenavHeaderComponent', () => {
  let fixture: ComponentFixture<SidenavHeaderComponent>;
  let unitTestingUtils: UnitTestingUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidenavHeaderComponent, NoopAuthModule, NoopTranslateModule],
      providers: [
        {
          provide: AppService,
          useValue: {
            toggleAppNavBar$: new Subject()
          }
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: {
            app: {
              selection: {}
            }
          }
        })
      ]
    });
    fixture = TestBed.createComponent(SidenavHeaderComponent);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  describe('Toggle navbar button', () => {
    let toggleSidenavButton: Element;

    beforeEach(() => {
      document.body.focus();
      fixture.detectChanges();
      toggleSidenavButton = unitTestingUtils.getByCSS('.aca-sidenav-header-title-logo').nativeElement;
    });

    it('should be focused when toggleAppNavBar$ emits on AppService', fakeAsync(() => {
      TestBed.inject(AppService).toggleAppNavBar$.next();
      tick();

      expect(toggleSidenavButton).toBe(document.activeElement);
    }));

    it('should not be focused when toggleAppNavBar$ does not emit on AppService', () => {
      expect(toggleSidenavButton).not.toBe(document.activeElement);
    });
  });
});
