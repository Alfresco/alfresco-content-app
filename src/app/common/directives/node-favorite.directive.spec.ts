/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoApiService, CoreModule, TranslationService, NodesApiService } from '@alfresco/adf-core';
import { Component, DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ContentManagementService } from '../services/content-management.service';
import { NodeFavoriteDirective } from './node-favorite.directive';

@Component({
    template: '<div [app-favorite-node]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeFavoriteDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let directiveInstance;
    let apiService;
    let contentService;
    let favoritesApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent,
                NodeFavoriteDirective
            ],
            providers: [
                ContentManagementService,
                AlfrescoApiService
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeFavoriteDirective));
        directiveInstance = element.injector.get(NodeFavoriteDirective);

        contentService = TestBed.get(ContentManagementService);
        apiService = TestBed.get(AlfrescoApiService);
        favoritesApi = apiService.getInstance().core.favoritesApi;
    });

    describe('selection input change event', () => {
        it('does not call markFavoritesNodes() if input list is empty', () => {
            spyOn(directiveInstance, 'markFavoritesNodes');

            component.selection = [];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).not.toHaveBeenCalledWith();
        });

        it('calls markFavoritesNodes() on input change', () => {
            spyOn(directiveInstance, 'markFavoritesNodes');

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).toHaveBeenCalledWith(component.selection);

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).toHaveBeenCalledWith(component.selection);
        });
    });

    describe('markFavoritesNodes()', () => {
        let favoritesApiSpy;

        beforeEach(() => {
            favoritesApiSpy = spyOn(favoritesApi, 'getFavorite');
        });

        it('check each selected node if it is a favorite', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(favoritesApiSpy.calls.count()).toBe(2);
        }));

        it('it does not check processed node when another is unselected', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            component.selection = [
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(1);
            expect(favoritesApiSpy).not.toHaveBeenCalled();
        }));

        it('it does not check processed nodes when another is selected', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(3);
            expect(favoritesApiSpy.calls.count()).toBe(1);
        }));
    });

    describe('toggleFavorite()', () => {
        let removeFavoriteSpy;
        let addFavoriteSpy;

        beforeEach(() => {
            removeFavoriteSpy = spyOn(favoritesApi, 'removeFavoriteSite');
            addFavoriteSpy = spyOn(favoritesApi, 'addFavorite');
        });

        it('does not perform action if favorites collection is empty', () => {
            component.selection = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(removeFavoriteSpy).not.toHaveBeenCalled();
            expect(addFavoriteSpy).not.toHaveBeenCalled();
        });

        it('calls addFavorite() if none is a favorite', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(addFavoriteSpy.calls.argsFor(0)[1].length).toBe(2);
        }));

        it('calls addFavorite() on the node that is not a favorite in selection', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFile: true, isFolder: false, isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFile: true, isFolder: false, isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            const callArgs = addFavoriteSpy.calls.argsFor(0)[1];
            const callParameter = callArgs[0];

            expect(callArgs.length).toBe(1);
            expect(callParameter.target.file.guid).toBe('1');
        }));

        it('calls removeFavoriteSite() if all are favorites', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(removeFavoriteSpy.calls.count()).toBe(2);
        }));
    });

    describe('getFavorite()', () => {
        it('process node as favorite', fakeAsync(() => {
            spyOn(favoritesApi, 'getFavorite').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites[0].entry.isFavorite).toBe(true);
        }));

        it('process node as not a favorite', fakeAsync(() => {
            spyOn(favoritesApi, 'getFavorite').and.returnValue(Promise.reject(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites[0].entry.isFavorite).toBe(false);
        }));
    });

    describe('reset()', () => {
        beforeEach(() => {
            spyOn(favoritesApi, 'removeFavoriteSite').and.returnValue(Promise.resolve());
            spyOn(favoritesApi, 'addFavorite').and.returnValue(Promise.resolve());
        });

        it('reset favorite collection after addFavorite()', fakeAsync(() => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.favorites.length).toBe(0);
        }));

        it('reset favorite collection after removeFavoriteSite()', fakeAsync(() => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.favorites.length).toBe(0);
        }));
    });

    describe('hasFavorites()', () => {
        it('returns false if favorites collection is empty', () => {
            directiveInstance.favorites = [];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('returns false if some are not favorite', () => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('returns true if all are favorite', () => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(true);
        });
    });
});
