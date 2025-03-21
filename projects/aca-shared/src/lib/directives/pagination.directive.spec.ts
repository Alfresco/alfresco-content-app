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

import { PaginationDirective } from './pagination.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService, PaginationComponent, PaginationModel, UserPreferencesService } from '@alfresco/adf-core';
import { initialState, LibTestingModule } from '../testing/lib-testing-module';
import { provideMockStore } from '@ngrx/store/testing';
import { Injector, runInInjectionContext } from '@angular/core';

describe('PaginationDirective', () => {
  let preferences: UserPreferencesService;
  let config: AppConfigService;
  let pagination: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let directive: PaginationDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, PaginationDirective],
      providers: [provideMockStore({ initialState })]
    });

    preferences = TestBed.inject(UserPreferencesService);
    config = TestBed.inject(AppConfigService);
    fixture = TestBed.createComponent(PaginationComponent);
    pagination = fixture.componentInstance;
    runInInjectionContext(TestBed.inject(Injector), () => {
      directive = new PaginationDirective(pagination, preferences, config);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should setup supported page sizes from app config', () => {
    spyOn(config, 'get').and.returnValue([21, 31, 41]);

    directive.ngOnInit();

    expect(pagination.supportedPageSizes).toEqual([21, 31, 41]);
  });

  it('should update preferences on page size change', () => {
    directive.ngOnInit();

    pagination.changePageSize.emit(
      new PaginationModel({
        maxItems: 100
      })
    );
    expect(preferences.paginationSize).toBe(100);
  });
});
