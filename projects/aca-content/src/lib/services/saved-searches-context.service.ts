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

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, switchMap, take } from 'rxjs';
import { NodeEntry } from '@alfresco/js-api';
import { SavedSearch, SavedSearchesLegacyService, SavedSearchesService, SavedSearchStrategy } from '@alfresco/adf-content-services';
import { IsFeatureSupportedInCurrentAcsPipe } from '../pipes/is-feature-supported.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SavedSearchesContextService implements SavedSearchStrategy {
  currentContextSavedSearch: SavedSearch;

  private readonly strategy$ = new ReplaySubject<SavedSearchStrategy>(1);

  constructor(
    private readonly legacyService: SavedSearchesLegacyService,
    private readonly modernService: SavedSearchesService,
    isFeatureSupported: IsFeatureSupportedInCurrentAcsPipe
  ) {
    isFeatureSupported
      .transform('isPreferencesApiAvailable')
      .pipe(takeUntilDestroyed())
      .subscribe((isSupported) => {
        const strategy = isSupported ? this.modernService : this.legacyService;
        this.strategy$.next(strategy);
      });
  }

  get savedSearches$(): Observable<SavedSearch[]> {
    return this.strategy$.pipe(switchMap((strategy) => strategy.savedSearches$));
  }

  init(): void {
    this.executeOnStrategyVoid((strategy) => strategy.init());
  }

  getSavedSearches(): Observable<SavedSearch[]> {
    return this.executeOnStrategy((strategy) => strategy.getSavedSearches());
  }

  saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): Observable<NodeEntry> {
    return this.executeOnStrategy((strategy) => strategy.saveSearch(newSaveSearch));
  }

  editSavedSearch(updatedSavedSearch: SavedSearch): Observable<NodeEntry> {
    return this.executeOnStrategy((strategy) => strategy.editSavedSearch(updatedSavedSearch));
  }

  deleteSavedSearch(deletedSavedSearch: SavedSearch): Observable<NodeEntry> {
    return this.executeOnStrategy((strategy) => strategy.deleteSavedSearch(deletedSavedSearch));
  }

  changeOrder(previousIndex: number, currentIndex: number): void {
    this.executeOnStrategyVoid((strategy) => strategy.changeOrder(previousIndex, currentIndex));
  }

  private executeOnStrategy<T>(action: (strategy: SavedSearchStrategy) => Observable<T>): Observable<T> {
    return this.strategy$.pipe(take(1), switchMap(action));
  }

  private executeOnStrategyVoid(action: (strategy: SavedSearchStrategy) => void): void {
    this.strategy$.pipe(take(1)).subscribe(action);
  }
}
