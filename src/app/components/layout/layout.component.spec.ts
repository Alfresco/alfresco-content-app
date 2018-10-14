/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { LayoutComponent } from './layout.component';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;
  let appConfig: AppConfigService;
  let userPreference: UserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LayoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    appConfig = TestBed.get(AppConfigService);
    userPreference = TestBed.get(UserPreferencesService);
  });

  describe('sidenav state', () => {
    it('should get state from configuration', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: false
        }
      };

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });

    it('should resolve state to true is no configuration', () => {
      appConfig.config = {};

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as true', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: true
        }
      };

      spyOn(userPreference, 'get').and.callFake(key => {
        if (key === 'expandedSidenav') {
          return 'true';
        }
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as false', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: true
        }
      };

      spyOn(userPreference, 'get').and.callFake(key => {
        if (key === 'expandedSidenav') {
          return 'false';
        }
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });
  });
});
