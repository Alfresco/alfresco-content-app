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

import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AuthenticationService, UserPreferencesService, LoginModule } from '@alfresco/adf-core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {

    class TestConfig {
        private testBed;
        private componentInstance;
        private fixture;

        constructor(config: any = {}) {
            const routerProvider = {
                provide: Router,
                useValue: {
                    navigateByUrl: jasmine.createSpy('navigateByUrl'),
                    navigate: jasmine.createSpy('navigate')
                }
            };

            const authProvider = {
                provide: AuthenticationService,
                useValue: {
                    isEcmLoggedIn: jasmine.createSpy('navigateByUrl')
                        .and.returnValue(config.isEcmLoggedIn || false)
                }
            };

            this.testBed = TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    CoreModule,
                    LoginModule
                ],
                declarations: [
                    LoginComponent
                ],
                providers: [
                    routerProvider,
                    authProvider,
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            params: Observable.of({ redirect: config.redirect })
                        }
                    }
                ]
            });

            this.fixture = TestBed.createComponent(LoginComponent);
            this.componentInstance = this.fixture.componentInstance;
            this.fixture.detectChanges();
        }

        get userPrefService() {
            return TestBed.get(UserPreferencesService);
        }

        get authService() {
            return TestBed.get(AuthenticationService);
        }

        get routerService() {
            return TestBed.get(Router);
        }

        get component() {
            return this.componentInstance;
        }
    }

    it('load app when user is already logged in', () => {
        const testConfig = new TestConfig({
            isEcmLoggedIn: true
        });

        expect(testConfig.routerService.navigateByUrl).toHaveBeenCalled();
    });

    it('requires user to be logged in', () => {
        const testConfig = new TestConfig({
            isEcmLoggedIn: false,
            redirect: '/personal-files'
        });

        expect(testConfig.routerService.navigate).toHaveBeenCalledWith(['/login', {}]);
    });

    describe('onLoginSuccess()', () => {
        let testConfig;

        beforeEach(() => {
            testConfig = new TestConfig({
                isEcmLoggedIn: false,
                redirect: 'somewhere-over-the-rainbow'
            });
        });

        it('redirects on success', () => {
            testConfig.component.onLoginSuccess();

            expect(testConfig.routerService.navigateByUrl).toHaveBeenCalledWith('somewhere-over-the-rainbow');
        });

        it('sets user preference store prefix', () => {
            const service = testConfig.userPrefService;
            spyOn(service, 'setStoragePrefix').and.stub();

            testConfig.component.onLoginSuccess({ username: 'bogus' });

            expect(service.setStoragePrefix).toHaveBeenCalledWith('bogus');
        });
    });
});
