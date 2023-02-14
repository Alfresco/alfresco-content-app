/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { SearchNavigationService } from './search-navigation.service';
import { Router } from '@angular/router';

describe('SearchNavigationService', () => {
  let service: SearchNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule.forRoot()]
    });
    service = TestBed.inject(SearchNavigationService);
    router = TestBed.inject(Router);
  });

  it('should not navigate to saved route when exitSearch function is called if saved route is null', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.saveRoute('');
    service.navigateBack();

    expect(routerNavigate).not.toHaveBeenCalledWith([service.previousRoute]);
  });

  it('should navigate to saved route when exitSearch function is called', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.saveRoute('/personal-files');
    service.navigateBack();

    expect(routerNavigate).toHaveBeenCalledWith([service.previousRoute]);
  });

  it('should navigate to Search when navigateToSearch function is called', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.navigateToSearch();

    expect(routerNavigate).toHaveBeenCalledWith(['/search']);
  });
});
