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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchInMenuComponent } from './search-in-menu.component';
import { SearchFilterService } from '../search-filter.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppTestingModule } from '../../../testing/app-testing.module';

describe('SearchInMenuComponent', () => {
  let fixture: ComponentFixture<SearchInMenuComponent>;
  let component: SearchInMenuComponent;
  let filterService: jasmine.SpyObj<SearchFilterService>;

  beforeEach(async () => {
    filterService = jasmine.createSpyObj<SearchFilterService>('SearchFilterService', ['getSearchInLabel'], {
      searchInMode: 'content',
      filesChecked: true,
      foldersChecked: true
    });
    filterService.getSearchInLabel.and.returnValue('SEARCH.INPUT.FILES_AND_FOLDERS');

    await TestBed.configureTestingModule({
      imports: [SearchInMenuComponent, AppTestingModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [{ provide: SearchFilterService, useValue: filterService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize state from filterService on init', () => {
    expect(component.searchInMode).toBe('content');
    expect(component.filesChecked).toBeTrue();
    expect(component.foldersChecked).toBeTrue();
  });

  it('should uncheck files/folders when switching to libraries mode', () => {
    component.searchInMode = 'libraries';
    component.onSearchInModeChange();
    expect(component.filesChecked).toBeFalse();
    expect(component.foldersChecked).toBeFalse();
  });

  it('should check files/folders when switching back to content mode', () => {
    component.searchInMode = 'libraries';
    component.onSearchInModeChange();
    component.searchInMode = 'content';
    component.onSearchInModeChange();
    expect(component.filesChecked).toBeTrue();
    expect(component.foldersChecked).toBeTrue();
  });

  it('should reset both checkboxes to true if both unchecked', () => {
    component.filesChecked = false;
    component.foldersChecked = false;
    component.onContentFilterChange();
    expect(component.filesChecked).toBeTrue();
    expect(component.foldersChecked).toBeTrue();
  });

  it('should commit state to service and emit on apply', () => {
    spyOn(component.filtersApplied, 'emit');
    component.searchInMode = 'libraries';
    component.filesChecked = false;
    component.foldersChecked = false;

    component.apply();

    expect(filterService.searchInMode).toBe('libraries');
    expect(filterService.filesChecked).toBeFalse();
    expect(filterService.foldersChecked).toBeFalse();
    expect(component.filtersApplied.emit).toHaveBeenCalled();
  });

  it('should revert to last applied state on close', () => {
    component.apply();

    component.searchInMode = 'libraries';
    component.filesChecked = false;
    component.foldersChecked = false;
    component.close();

    expect(component.searchInMode).toBe('content');
    expect(component.filesChecked).toBeTrue();
    expect(component.foldersChecked).toBeTrue();
  });

  it('should reset to defaults', () => {
    component.searchInMode = 'libraries';
    component.filesChecked = false;
    component.foldersChecked = false;

    component.reset();

    expect(component.searchInMode).toBe('content');
    expect(component.filesChecked).toBeTrue();
    expect(component.foldersChecked).toBeTrue();
  });
});
