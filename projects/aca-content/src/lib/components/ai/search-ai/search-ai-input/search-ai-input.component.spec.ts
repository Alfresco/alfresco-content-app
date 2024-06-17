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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchAiInputComponent } from './search-ai-input.component';
import { By } from '@angular/platform-browser';
import { AiSearchByTermPayload, SearchByTermAiAction, SnackbarErrorAction, STORE_INITIAL_APP_DATA } from '@alfresco/aca-shared/store';
import { CoreTestingModule, PageTitleService } from '@alfresco/adf-core';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchAiInputComponent', () => {
  let fixture: ComponentFixture<SearchAiInputComponent>;
  let component: SearchAiInputComponent;
  let router: Router;
  let store: Store;

  const getElementByAutomationId = (dataAutomationId: string) =>
    fixture.debugElement.query(By.css(`[data-automation-id=${dataAutomationId}]`))?.nativeElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [/* ContentServicesTestingModule */ SearchAiInputComponent, CoreTestingModule, RouterTestingModule, MatIconTestingModule],
      providers: [
        SearchQueryBuilderService,
        {
          provide: Store,
          useValue: { dispatch: () => null, select: () => of([]) }
        },
        {
          provide: PageTitleService,
          useValue: {}
        },
        {
          provide: STORE_INITIAL_APP_DATA,
          useValue: {}
        }
      ]
    });
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(SearchAiInputComponent);
    component = fixture.componentInstance;
    component.hideAIToggle = false;
    component.searchedWord = 'test-search-word';
    fixture.detectChanges();
  });

  it('should emit searchSubmitted event when generate button is clicked', () => {
    spyOn(component.searchSubmitted, 'emit');
    component.searchedWord = 'test-search-word';
    fixture.detectChanges();
    const generateButton = getElementByAutomationId('generate-ai-response-button');
    generateButton.click();
    fixture.detectChanges();
    expect(component.searchSubmitted.emit).toHaveBeenCalled();
  });

  it('should emit searchSubmitted event when search term is added and enter key is pressed', () => {
    spyOn(component.searchSubmitted, 'emit');
    component.searchedWord = 'test-search-word';
    fixture.detectChanges();
    const aiInputField = getElementByAutomationId('ai-query-field');
    aiInputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(component.searchSubmitted.emit).toHaveBeenCalled();
  });

  it('should dispatch SnackbarErrorAction store action when search term is not added and enter key is pressed', () => {
    spyOn(store, 'dispatch');
    component.searchedWord = '';
    fixture.detectChanges();
    const aiInputField = getElementByAutomationId('ai-query-field');
    aiInputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.BROWSE.SEARCH.EMPTY_SEARCH'));
  });

  it('should dispatch SearchByTermAiAction store action when search term is added and ai search is submitted', () => {
    spyOn(store, 'dispatch');
    component.searchedWord = 'test-search-word';
    fixture.detectChanges();
    const generateButton = getElementByAutomationId('generate-ai-response-button');
    generateButton.click();
    fixture.detectChanges();
    const searchPayload: AiSearchByTermPayload = new AiSearchByTermPayload();
    searchPayload.searchTerm = 'test-search-word';
    searchPayload.hideAiToggle = false;
    searchPayload.restrictionQuery = '';
    expect(store.dispatch).toHaveBeenCalledWith(new SearchByTermAiAction(searchPayload));
  });

  it('should disable generate button when search term is not added', () => {
    component.searchedWord = '';
    fixture.detectChanges();
    const generateButton = getElementByAutomationId('generate-ai-response-button');
    expect(generateButton.disabled).toBeTruthy();
  });

  it('should be able to extract search term from router url on init', () => {
    const navigationEndEvent = new NavigationEnd(1, 'mock-url/search-ai;q=mock-search-term', '');
    spyOn(router.events, 'pipe').and.returnValue(of(navigationEndEvent));
    spyOnProperty(router, 'url', 'get').and.returnValue('/search-ai?q=mock-search-term');
    component.ngOnInit();
    expect(component.searchedWord).toEqual('mock-search-term');
  });

  it('should show example chips if input field is blank, and showExampleChips is set to true and hide them when an input is provided on the input field', () => {
    component.searchedWord = '';
    component.showExampleChips = true;
    fixture.detectChanges();
    let exampleChipsContainer = getElementByAutomationId('example-chips-container');
    expect(exampleChipsContainer).toBeDefined();

    component.searchedWord = 'test-word';
    fixture.detectChanges();
    exampleChipsContainer = getElementByAutomationId('example-chips-container');
    expect(exampleChipsContainer).not.toBeDefined();
  });

  it('should not show example chips showExampleChips is set to false, regardless of if there is an input provided in the input field or not', () => {
    component.searchedWord = '';
    component.showExampleChips = false;
    fixture.detectChanges();
    let exampleChipsContainer = getElementByAutomationId('example-chips-container');
    expect(exampleChipsContainer).not.toBeDefined();

    component.searchedWord = 'test-word';
    fixture.detectChanges();
    exampleChipsContainer = getElementByAutomationId('example-chips-container');
    expect(exampleChipsContainer).not.toBeDefined();
  });
});
