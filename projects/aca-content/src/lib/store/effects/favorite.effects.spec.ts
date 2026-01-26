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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FavoriteEffects } from './favorite.effects';
import { ContentManagementService } from '../../services/content-management.service';
import { AddFavoriteAction, AppStore, RemoveFavoriteAction, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppTestingModule } from '../../testing/app-testing.module';
import { NodeEntry } from '@alfresco/js-api';

describe('FavoriteEffects', () => {
  let contentService: ContentManagementService;
  let store: Store<AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [provideEffects([FavoriteEffects])]
    });

    store = TestBed.inject(Store);
    contentService = TestBed.inject(ContentManagementService);
  });

  it('should call addFavorite with payload when AddFavoriteAction is dispatched', () => {
    spyOn(contentService, 'addFavorite').and.stub();
    const payload = [{ entry: { id: 'node1' } }] as NodeEntry[];
    store.dispatch(new AddFavoriteAction(payload, { focusedElementOnCloseSelector: 'test-selector' }));

    expect(contentService.addFavorite).toHaveBeenCalledWith(payload, 'test-selector');
  });

  it('should call addFavorite with selection when AddFavoriteAction is dispatched without payload', fakeAsync(() => {
    spyOn(contentService, 'addFavorite').and.stub();

    const selection = [{ entry: { isFile: true } }] as NodeEntry[];
    store.dispatch(new SetSelectedNodesAction(selection));

    tick(100);

    store.dispatch(new AddFavoriteAction(null, { focusedElementOnCloseSelector: 'test-selector' }));

    expect(contentService.addFavorite).toHaveBeenCalledWith(selection, 'test-selector');
  }));

  it('should call removeFavorite with payload when RemoveFavoriteAction is dispatched', () => {
    spyOn(contentService, 'removeFavorite').and.stub();
    const payload = [{ entry: { id: 'node1' } }] as NodeEntry[];

    store.dispatch(new RemoveFavoriteAction(payload, { focusedElementOnCloseSelector: 'test-selector' }));
    expect(contentService.removeFavorite).toHaveBeenCalledWith(payload, 'test-selector');
  });

  it('should call removeFavorite with selection when RemoveFavoriteAction is dispatched without payload', fakeAsync(() => {
    spyOn(contentService, 'removeFavorite').and.stub();

    const selection: any = [{ entry: { isFile: true } }] as NodeEntry[];
    store.dispatch(new SetSelectedNodesAction(selection));

    tick(100);

    store.dispatch(new RemoveFavoriteAction(null, { focusedElementOnCloseSelector: 'test-selector' }));
    expect(contentService.removeFavorite).toHaveBeenCalledWith(selection, 'test-selector');
  }));
});
