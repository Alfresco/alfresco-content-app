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

import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSettingsService } from '@alfresco/aca-shared';

describe('HomeComponent', () => {
  let appSettings: AppSettingsService;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, HomeComponent]
    });
    appSettings = TestBed.inject(AppSettingsService);
    spyOnProperty(appSettings, 'landingPage', 'get').and.returnValue('/my-mock-landing-page');

    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
  });

  it('should navigate to the landing page from the app config', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/my-mock-landing-page');
  });
});
