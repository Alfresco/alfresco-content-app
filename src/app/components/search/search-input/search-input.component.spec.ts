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
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { NAVIGATE_FOLDER, NavigateToFolder, VIEW_FILE, ViewFileAction } from '../../../store/actions';
import { map } from 'rxjs/operators';

describe('SearchInputComponent', () => {
    let fixture: ComponentFixture<SearchInputComponent>;
    let component: SearchInputComponent;
    let actions$: Actions;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule
            ],
            declarations: [
                SearchInputComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents()
        .then(() => {
            actions$ = TestBed.get(Actions);
            fixture = TestBed.createComponent(SearchInputComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    describe('onItemClicked()', () => {
        it('opens preview if node is file', fakeAsync(done => {
            actions$.pipe(
                ofType<ViewFileAction>(VIEW_FILE),
                map(action => {
                    expect(action.payload.entry.id).toBe('node-id');
                    done();
                })
            );

            const node = { entry: { isFile: true, id: 'node-id', parentId: 'parent-id' } };

            component.onItemClicked(node);
            tick();
        }));

        it('navigates if node is folder', fakeAsync(done => {
            actions$.pipe(
                ofType<NavigateToFolder>(NAVIGATE_FOLDER),
                map(action => {
                    expect(action.payload.entry.id).toBe('folder-id');
                    done();
                })
            );
            const node = { entry: { id: 'folder-id', isFolder: true } };
            component.onItemClicked(node);
            tick();
        }));
    });
});
