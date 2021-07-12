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

import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchSortingDefinition } from '@alfresco/adf-content-services/lib/search/models/search-sorting-definition.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchActionMenuComponent } from './search-action-menu.component';

const mockSortingData: SearchSortingDefinition[] = [
  {
    ascending: false,
    field: 'fieldA',
    key: 'keyA',
    label: 'LabelA',
    type: 'A'
  },
  {
    ascending: true,
    field: 'fieldB',
    key: 'keyB',
    label: 'Zorro',
    type: 'Z'
  }
];

describe('SearchActionMenuComponent', () => {
  let fixture: ComponentFixture<SearchActionMenuComponent>;
  let component: SearchActionMenuComponent;
  let queryService: SearchQueryBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SearchActionMenuComponent],
      providers: [SearchQueryBuilderService]
    });

    fixture = TestBed.createComponent(SearchActionMenuComponent);
    queryService = TestBed.inject(SearchQueryBuilderService);
    component = fixture.componentInstance;
  });

  it('should emit sortingSelected event when asc sorting option is selected', async () => {
    spyOn(queryService, 'getSortingOptions').and.returnValue(mockSortingData);
    const expectedOption: SearchSortingDefinition = {
      ascending: true,
      field: 'fieldA',
      key: 'keyA',
      label: 'LabelA',
      type: 'A'
    };
    spyOn(component.sortingSelected, 'emit').and.callThrough();
    fixture.detectChanges();
    await fixture.whenStable();

    const actionMenuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#aca-button-action-menu');
    actionMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const sortingMenuButton: HTMLButtonElement = document.querySelector('#aca-button-sorting-menu');
    sortingMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const fieldAMenuButton: HTMLButtonElement = document.querySelector('#keyA-sorting-option');
    fieldAMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const directionButton: HTMLButtonElement = document.querySelector('#keyA-sorting-option-asc');
    directionButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sortingSelected.emit).toHaveBeenCalledWith(expectedOption);
  });

  it('should emit sortingSelected event when desc sorting option is selected', async () => {
    spyOn(queryService, 'getSortingOptions').and.returnValue(mockSortingData);
    const expectedOption: SearchSortingDefinition = {
      ascending: false,
      field: 'fieldB',
      key: 'keyB',
      label: 'Zorro',
      type: 'Z'
    };
    spyOn(component.sortingSelected, 'emit').and.callThrough();
    fixture.detectChanges();
    await fixture.whenStable();

    const actionMenuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#aca-button-action-menu');
    actionMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const sortingMenuButton: HTMLButtonElement = document.querySelector('#aca-button-sorting-menu');
    sortingMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const fieldAMenuButton: HTMLButtonElement = document.querySelector('#keyB-sorting-option');
    fieldAMenuButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    const directionButton: HTMLButtonElement = document.querySelector('#keyB-sorting-option-desc');
    directionButton.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sortingSelected.emit).toHaveBeenCalledWith(expectedOption);
  });
});
