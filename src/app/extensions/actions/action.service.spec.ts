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

import { AppConfigService } from '@alfresco/adf-core';
import { ActionService } from './action.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('ActionService', () => {
    let config: AppConfigService;
    let actions: ActionService;
    let store: Store<AppStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppTestingModule]
        });

        actions = TestBed.get(ActionService);
        store = TestBed.get(Store);

        config = TestBed.get(AppConfigService);
        config.config['extensions'] = {};
    });

    describe('actions', () => {
        beforeEach(() => {
            config.config.extensions = {
                core: {
                    actions: [
                        {
                            id: 'aca:actions/create-folder',
                            type: 'CREATE_FOLDER',
                            payload: 'folder-name'
                        }
                    ]
                }
            };
        });

        it('should load actions from the config', () => {
            actions.init();
            expect(actions.actions.length).toBe(1);
        });

        it('should have an empty action list if config provides nothing', () => {
            config.config.extensions = {};
            actions.init();

            expect(actions.actions).toEqual([]);
        });

        it('should find action by id', () => {
            actions.init();

            const action = actions.getActionById(
                'aca:actions/create-folder'
            );
            expect(action).toBeTruthy();
            expect(action.type).toBe('CREATE_FOLDER');
            expect(action.payload).toBe('folder-name');
        });

        it('should not find action by id', () => {
            actions.init();

            const action = actions.getActionById('missing');
            expect(action).toBeFalsy();
        });

        it('should run the action via store', () => {
            actions.init();
            spyOn(store, 'dispatch').and.stub();

            actions.runActionById('aca:actions/create-folder');
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'CREATE_FOLDER',
                payload: 'folder-name'
            });
        });

        it('should not use store if action is missing', () => {
            actions.init();
            spyOn(store, 'dispatch').and.stub();

            actions.runActionById('missing');
            expect(store.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('expressions', () => {
        it('should eval static value', () => {
            const value = actions.runExpression('hello world');
            expect(value).toBe('hello world');
        });

        it('should eval string as an expression', () => {
            const value = actions.runExpression('$( "hello world" )');
            expect(value).toBe('hello world');
        });

        it('should eval expression with no context', () => {
            const value = actions.runExpression('$( 1 + 1 )');
            expect(value).toBe(2);
        });

        it('should eval expression with context', () => {
            const context = {
                a: 'hey',
                b: 'there'
            };
            const expression = '$( context.a + " " + context.b + "!" )';
            const value = actions.runExpression(expression, context);
            expect(value).toBe('hey there!');
        });
    });
});
